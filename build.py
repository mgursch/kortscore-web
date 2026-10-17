#!/usr/bin/env python3
"""Baut kortscore.com aus Vorlagen und Texten nach _site/.

    python3 build.py

Quelle:
  site.yaml          Sprachen, Seitenregister, sprachabhängige Assets
  templates/         eine Jinja-Vorlage pro Seite plus base.html
  i18n/<code>/       Texte je Sprache: common.yaml und <seite>.yaml
  static/            wird 1:1 kopiert (Assets, Rechtstexte, CSS, JS, ...)

Ergebnis in _site/: jede Seite in jeder aktiven Sprache, sitemap.xml und
llms.txt. Fehlt ein Text, eine Seite oder ein Asset, bricht der Build mit
einer Meldung ab, statt still eine Lücke auszuliefern.
"""

import datetime
import hashlib
import html
import json
import posixpath
import re
import shutil
import sys
import urllib.parse
from pathlib import Path

import yaml
from jinja2 import Environment, FileSystemLoader, StrictUndefined
from jinja2.exceptions import TemplateError

ROOT = Path(__file__).resolve().parent
STATIC = ROOT / "static"
OUT = ROOT / "_site"
URL_PLACEHOLDER = re.compile(r"\{url:([A-Za-z0-9_-]+)\}")


class BuildError(Exception):
    pass


# ── Laden und prüfen ────────────────────────────────────────────────────────

def load_yaml(path):
    if not path.is_file():
        raise BuildError(f"Datei fehlt: {path.relative_to(ROOT)}")
    with path.open(encoding="utf-8") as fh:
        return dates_to_str(yaml.safe_load(fh) or {})


def dates_to_str(obj):
    """YAML liest 2026-09-21 als Datum, Vorlagen und JSON brauchen Text."""
    if isinstance(obj, dict):
        return {k: dates_to_str(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [dates_to_str(v) for v in obj]
    if isinstance(obj, datetime.date):
        return obj.isoformat()
    return obj


# In Jinja gewinnt t.items die Methode dict.items gegen den Schlüssel "items".
# Solche Namen sind in den Texten deshalb verboten.
RESERVED_KEYS = {"items", "keys", "values", "get", "update", "pop", "copy",
                 "clear", "setdefault", "popitem", "fromkeys"}


def check_keys(obj, where):
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k in RESERVED_KEYS:
                raise BuildError(f"{where}: Schlüssel {k!r} ist reserviert, bitte umbenennen")
            check_keys(v, f"{where}.{k}")
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            check_keys(v, f"{where}[{i}]")


def same_shape(ref, other, where):
    """Jede Sprache muss dieselben Schlüssel und Listenlängen haben wie die
    x-default-Sprache. So fällt ein vergessener Text sofort auf, nicht erst,
    wenn eine Vorlage ihn zufällig abfragt."""
    if isinstance(ref, dict):
        if not isinstance(other, dict):
            raise BuildError(f"{where}: Abschnitt erwartet")
        missing = [k for k in ref if k not in other]
        extra = [k for k in other if k not in ref]
        if missing or extra:
            raise BuildError(f"{where}: fehlt {missing or '-'}, überzählig {extra or '-'}")
        for k in ref:
            same_shape(ref[k], other[k], f"{where}.{k}")
    elif isinstance(ref, list):
        if not isinstance(other, list) or len(ref) != len(other):
            raise BuildError(f"{where}: Liste mit {len(ref)} Einträgen erwartet")
        for i, (a, b) in enumerate(zip(ref, other)):
            same_shape(a, b, f"{where}[{i}]")
    elif other is None or isinstance(other, (dict, list)):
        raise BuildError(f"{where}: Text erwartet")


def load_site():
    site = load_yaml(ROOT / "site.yaml")
    langs = [l for l in site["languages"] if l.get("enabled")]
    codes = [l["code"] for l in langs]
    if site["x_default"] not in codes:
        raise BuildError(f"x_default {site['x_default']!r} ist keine aktive Sprache")
    seen = {}
    for pid, page in site["pages"].items():
        for code in codes:
            if code not in page["slugs"]:
                raise BuildError(f"Seite {pid!r}: kein Slug für {code!r}")
            key = (code, page["slugs"][code])
            if key in seen:
                raise BuildError(f"Seiten {seen[key]!r} und {pid!r}: gleicher Slug {key[1]!r} für {code!r}")
            seen[key] = pid
        if not (ROOT / "templates" / f"{pid}.html").is_file():
            raise BuildError(f"Seite {pid!r}: templates/{pid}.html fehlt")
    for base, files in site["localized_assets"].items():
        for code in codes:
            if code not in files:
                raise BuildError(f"localized_assets.{base}: kein Eintrag für {code!r}")
            if not (STATIC / "assets" / files[code]).is_file():
                raise BuildError(f"localized_assets.{base}.{code}: static/assets/{files[code]} fehlt")
    for code in codes:
        if not (ROOT / "templates" / "badges" / f"appstore-{code}.svg").is_file():
            raise BuildError(f"templates/badges/appstore-{code}.svg fehlt")
    return site, langs


def load_strings(site, langs):
    names = ["common"] + list(site["pages"])
    strings = {l["code"]: {n: load_yaml(ROOT / "i18n" / l["code"] / f"{n}.yaml") for n in names}
               for l in langs}
    ref = strings[site["x_default"]]
    for code, tree in strings.items():
        for n in names:
            check_keys(tree[n], f"i18n/{code}/{n}.yaml")
            if code != site["x_default"]:
                same_shape(ref[n], tree[n], f"i18n/{code}/{n}.yaml")
    return strings


# ── Pfade ───────────────────────────────────────────────────────────────────

class Paths:
    def __init__(self, site, langs):
        self.site = site
        self.langs = {l["code"]: l for l in langs}

    def out_path(self, pid, code):
        """Datei in _site/, z. B. de/uhren.html oder index.html."""
        if pid not in self.site["pages"]:
            raise BuildError(f"Unbekannte Seiten-ID {pid!r}")
        if code not in self.langs:
            raise BuildError(f"Unbekannte oder inaktive Sprache {code!r}")
        return self.langs[code]["prefix"] + self.site["pages"][pid]["slugs"][code]

    def public_path(self, pid, code):
        """Pfad in der URL: index.html fällt weg, damit / und /de/ bleiben."""
        path = self.out_path(pid, code)
        return path[: -len("index.html")] if path.endswith("index.html") else path

    def abs_url(self, pid, code):
        return self.site["base_url"] + self.public_path(pid, code)

    @staticmethod
    def relative(target, from_file):
        """Relativer Link von from_file (Datei in _site/) auf target (Pfad ab
        Root, Ordner enden auf /). Ergibt dieselbe Schreibweise wie bisher von
        Hand: watches.html, ./, ../, ../assets/icon.png."""
        tdir, tname = posixpath.split(target)
        rel = posixpath.relpath(tdir or ".", posixpath.dirname(from_file) or ".")
        if tname:
            return tname if rel == "." else f"{rel}/{tname}"
        return "./" if rel == "." else f"{rel}/"


def file_hash(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()[:10]


# ── Hilfen für die Vorlagen ─────────────────────────────────────────────────

def plain(value):
    """HTML-Text zu reinem Text, für JSON-LD und Attribute."""
    text = re.sub(r"<[^>]+>", "", str(value))
    return " ".join(html.unescape(text).split())


def jsonld(obj):
    """Ein <script type="application/ld+json">-Block. json.dumps übernimmt das
    Escaping; "</" wird zusätzlich entschärft, damit kein Text das Skript
    vorzeitig beendet."""
    if "@context" not in obj:
        obj = {"@context": "https://schema.org", **obj}
    text = json.dumps(obj, ensure_ascii=False, indent=2).replace("</", "<\\/")
    return f'<script type="application/ld+json">\n{text}\n</script>'


def resolve_urls(obj, url):
    """Ersetzt {url:<seite>} in allen Texten durch den relativen Link."""
    if isinstance(obj, dict):
        return {k: resolve_urls(v, url) for k, v in obj.items()}
    if isinstance(obj, list):
        return [resolve_urls(v, url) for v in obj]
    if isinstance(obj, str):
        return URL_PLACEHOLDER.sub(lambda m: url(m.group(1)), obj)
    return obj


def make_env():
    env = Environment(
        loader=FileSystemLoader(str(ROOT / "templates")),
        undefined=StrictUndefined,
        autoescape=False,  # Texte dürfen Inline-HTML enthalten
        trim_blocks=True,
        lstrip_blocks=True,
        keep_trailing_newline=True,
    )
    env.filters["plain"] = plain
    env.filters["inattr"] = lambda s: str(s).replace('"', "&quot;")
    env.filters["mailenc"] = lambda s: urllib.parse.quote(str(s), safe="")
    env.globals["jsonld"] = jsonld
    return env


def page_context(site, langs, strings, paths, versions, pid, code):
    out = paths.out_path(pid, code)
    lang = paths.langs[code]
    page = site["pages"][pid]

    def url(target, lang_code=None):
        return paths.relative(paths.public_path(target, lang_code or code), out)

    def abs_url(target, lang_code=None):
        return paths.abs_url(target, lang_code or code)

    def home(anchor):
        return f"#{anchor}" if pid == "index" else f"{url('index')}#{anchor}"

    def asset(name):
        if not (STATIC / "assets" / name.split("?")[0]).is_file():
            raise BuildError(f"Asset fehlt: assets/{name}")
        return paths.relative(f"assets/{name}", out)

    def lasset(base):
        files = site["localized_assets"].get(base)
        if not files:
            raise BuildError(f"Unbekanntes Sprach-Asset {base!r}")
        return files[code]

    def abs_asset(name):
        return f"{site['base_url']}assets/{name}"

    def static(name):
        return f"{paths.relative(name, out)}?v={versions[name]}"

    def legal(doc):
        anchor = "" if code == site["legal_first_language"] else f"#{code}"
        return paths.relative(f"legal/{doc}.html", out) + anchor

    def breadcrumbs():
        return {"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Kortscore", "item": abs_url("index")},
            {"@type": "ListItem", "position": 2, "name": plain(t["breadcrumb"]), "item": abs_url(pid)},
        ]}

    def faq_page(items):
        return {"@type": "FAQPage", "inLanguage": code, "mainEntity": [
            {"@type": "Question", "name": plain(i["q"]),
             "acceptedAnswer": {"@type": "Answer", "text": plain(i["a"])}}
            for i in items
        ]}

    t = resolve_urls(strings[code][pid], url)
    c = resolve_urls(strings[code]["common"], url)
    others = [dict(l, strings=strings[l["code"]]["common"]) for l in langs if l["code"] != code]
    return dict(
        site=site, page=pid, P=page, lang=code, L=lang, languages=langs,
        other_languages=others, t=t, c=c, url=url, abs_url=abs_url, home=home,
        asset=asset, lasset=lasset, abs_asset=abs_asset, static=static, legal=legal,
        breadcrumbs=breadcrumbs, faq_page=faq_page,
    )


# ── Bauen ───────────────────────────────────────────────────────────────────

def build():
    site, langs = load_site()
    strings = load_strings(site, langs)
    paths = Paths(site, langs)
    env = make_env()
    versions = {name: file_hash(STATIC / name) for name in ("styles.css", "script.js")}

    if OUT.exists():
        shutil.rmtree(OUT)
    shutil.copytree(STATIC, OUT, ignore=shutil.ignore_patterns(".DS_Store"))

    def write(rel, text):
        target = OUT / rel
        if target.exists():
            raise BuildError(f"{rel} gibt es schon in static/, der Build würde es überschreiben")
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(text, encoding="utf-8")

    pages = []
    for pid in site["pages"]:
        for lang in langs:
            ctx = page_context(site, langs, strings, paths, versions, pid, lang["code"])
            write(paths.out_path(pid, lang["code"]), env.get_template(f"{pid}.html").render(ctx))
            pages.append(paths.out_path(pid, lang["code"]))

    # Sitemap und llms.txt sehen alle Seiten in allen Sprachen.
    entries = [
        {"id": pid, "page": page,
         "urls": {l["code"]: paths.abs_url(pid, l["code"]) for l in langs},
         "labels": {l["code"]: strings[l["code"]][pid]["llms"] for l in langs}}
        for pid, page in site["pages"].items()
    ]
    shared = dict(site=site, languages=langs, entries=entries, abs_url=paths.abs_url)
    write("sitemap.xml", env.get_template("sitemap.xml").render(shared))
    write("llms.txt", env.get_template("llms.txt").render(shared))
    return pages


def main():
    try:
        pages = build()
    except (BuildError, TemplateError) as exc:
        print(f"Build abgebrochen: {exc}", file=sys.stderr)
        return 1
    print(f"{len(pages)} Seiten, sitemap.xml und llms.txt nach {OUT.relative_to(ROOT)}/ gebaut")
    return 0


if __name__ == "__main__":
    sys.exit(main())
