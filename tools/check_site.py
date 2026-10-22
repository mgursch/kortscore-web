#!/usr/bin/env python3
"""Prüft die gebaute Seite in _site/, bevor sie live geht.

    python3 build.py && python3 tools/check_site.py

Geprüft wird:
  - jeder interne Link und jede Asset-Referenz (href, src, srcset,
    meta refresh, eigene absolute URLs) zeigt auf eine vorhandene Datei,
    Anker (#...) auf eine vorhandene id
  - hreflang ist wechselseitig: jede Fassung einer Seite nennt dieselben
    Sprachen mit denselben Adressen, sich selbst eingeschlossen, plus x-default.
    Eine Seite in nur einer Sprache (site.yaml: languages) nennt nur sich
    selbst, ohne x-default
  - Sitemap und Seiten stimmen überein, in beide Richtungen, samt Alternates;
    eine Seite in nur einer Sprache steht dort ohne Alternates
  - eine Seite in nur einer Sprache wird nur aus Seiten derselben Sprache
    verlinkt (der ITN-Rechner also nicht aus EN, FR, IT oder ES)
  - jedes JSON-LD ist gültiges JSON

Liegt in tools/, damit es nicht mit veröffentlicht wird. Exit-Code 1 bei
einem Fehler.
"""

import json
import sys
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urldefrag, urlsplit, unquote

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / "_site"
BASE = "https://kortscore.com/"


class Page(HTMLParser):
    """Sammelt aus einer HTML-Datei alles, was die Prüfungen brauchen."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.refs = []          # (Attribut, Wert)
        self.ids = set()
        self.alternates = {}    # hreflang -> URL
        self.canonical = None
        self.lang = None
        self.jsonld = []
        self.noindex = False
        self._in_jsonld = False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "html":
            self.lang = a.get("lang")
        if "id" in a:
            self.ids.add(a["id"])
        if tag == "a" and "name" in a:
            self.ids.add(a["name"])
        for key in ("href", "src"):
            if a.get(key):
                self.refs.append((f"{tag}[{key}]", a[key]))
        if a.get("srcset"):
            for part in a["srcset"].split(","):
                self.refs.append((f"{tag}[srcset]", part.strip().split()[0]))
        if tag == "link" and a.get("rel") == "alternate" and a.get("hreflang"):
            self.alternates[a["hreflang"]] = a["href"]
        if tag == "link" and a.get("rel") == "canonical":
            self.canonical = a["href"]
        if tag == "meta":
            if a.get("http-equiv", "").lower() == "refresh" and "url=" in a.get("content", ""):
                self.refs.append(("meta[refresh]", a["content"].split("url=", 1)[1].strip()))
            if a.get("property") in ("og:url", "og:image") or a.get("name") == "twitter:image":
                self.refs.append((f"meta[{a.get('property') or a.get('name')}]", a["content"]))
            if a.get("name") == "robots" and "noindex" in a.get("content", ""):
                self.noindex = True
        if tag == "script" and a.get("type") == "application/ld+json":
            self._in_jsonld = True
            self.jsonld.append("")

    def handle_endtag(self, tag):
        if tag == "script":
            self._in_jsonld = False

    def handle_data(self, data):
        if self._in_jsonld:
            self.jsonld[-1] += data


def parse(path):
    p = Page()
    p.feed(path.read_text(encoding="utf-8"))
    return p


def url_to_file(url):
    """Eigene absolute URL -> Datei in _site/ (None, wenn fremd)."""
    if not url.startswith(BASE):
        return None
    path = unquote(urlsplit(url).path).lstrip("/")
    return SITE / (path + "index.html" if path == "" or path.endswith("/") else path)


def resolve(page_file, ref):
    """Verweis -> (Datei oder None, Anker). None heißt: nicht prüfen (extern)."""
    ref, anchor = urldefrag(ref)
    if ref.startswith(("mailto:", "tel:", "javascript:", "data:")):
        return None, None
    if ref.startswith(("http://", "https://", "//")):
        return url_to_file(ref), anchor
    if ref == "":
        return page_file, anchor
    path = unquote(urlsplit(ref).path)
    target = (SITE / path.lstrip("/")) if path.startswith("/") else (page_file.parent / path)
    if path.endswith("/") or target.is_dir():
        target = target / "index.html"
    return target.resolve(), anchor


def main():
    errors = []
    files = sorted(SITE.rglob("*.html"))
    if not files:
        print(f"Keine HTML-Dateien in {SITE}. Erst python3 build.py ausführen.")
        return 1
    pages = {f.resolve(): parse(f) for f in files}

    def rel(f):
        return f.relative_to(SITE.resolve()) if f.is_absolute() else f

    def single(p):
        """Seite in nur einer Sprache: hreflang nennt nur sie selbst."""
        return len(p.alternates) == 1 and p.lang in p.alternates

    # 1. Links, Assets, Anker
    for f, p in pages.items():
        for kind, ref in p.refs:
            target, anchor = resolve(f, ref)
            if target is None:
                continue
            if not target.is_file():
                errors.append(f"{rel(f)}: {kind} {ref!r} zeigt ins Leere")
                continue
            other = pages.get(target.resolve())
            if anchor and other is not None and anchor not in other.ids:
                errors.append(f"{rel(f)}: {kind} {ref!r}, Anker #{anchor} fehlt")
            if (kind == "a[href]" and other is not None and single(other)
                    and p.lang != other.lang and target.resolve() != f):
                errors.append(f"{rel(f)}: verlinkt {ref!r}, die es nur auf {other.lang} gibt "
                              f"(Seite ist {p.lang})")

    # 2. hreflang wechselseitig
    with_alts = {f: p for f, p in pages.items() if p.alternates}
    for f, p in with_alts.items():
        if "x-default" not in p.alternates and not single(p):
            errors.append(f"{rel(f)}: hreflang x-default fehlt")
        own = p.alternates.get(p.lang)
        if own != p.canonical:
            errors.append(f"{rel(f)}: hreflang {p.lang} ({own}) ist nicht die canonical ({p.canonical})")
        for lang, url in p.alternates.items():
            target = url_to_file(url)
            if target is None or target.resolve() not in pages:
                errors.append(f"{rel(f)}: hreflang {lang} -> {url} gibt es nicht")
                continue
            other = pages[target.resolve()]
            if other.alternates != p.alternates:
                errors.append(f"{rel(f)}: hreflang {lang} -> {url} verweist nicht identisch zurück")
            if lang != "x-default" and other.lang != lang:
                errors.append(f"{rel(f)}: hreflang {lang} -> {url} hat lang={other.lang}")

    # 3. Sitemap <-> Seiten
    ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9", "x": "http://www.w3.org/1999/xhtml"}
    sitemap = ET.parse(SITE / "sitemap.xml").getroot()
    in_sitemap = set()
    for u in sitemap.findall("s:url", ns):
        loc = u.findtext("s:loc", namespaces=ns)
        target = url_to_file(loc)
        if target is None or target.resolve() not in pages:
            errors.append(f"sitemap.xml: {loc} gibt es nicht")
            continue
        in_sitemap.add(target.resolve())
        alts = {l.get("hreflang"): l.get("href") for l in u.findall("x:link", ns)}
        page = pages[target.resolve()]
        if alts != ({} if single(page) else page.alternates):
            errors.append(f"sitemap.xml: Alternates von {loc} weichen von der Seite ab")
    for f, p in with_alts.items():
        if f not in in_sitemap and not p.noindex:
            errors.append(f"{rel(f)}: fehlt in sitemap.xml")

    # 4. JSON-LD
    for f, p in pages.items():
        for i, block in enumerate(p.jsonld):
            try:
                json.loads(block)
            except ValueError as exc:
                errors.append(f"{rel(f)}: JSON-LD #{i + 1} ungültig: {exc}")

    refs = sum(len(p.refs) for p in pages.values())
    blocks = sum(len(p.jsonld) for p in pages.values())
    singles = sum(1 for p in with_alts.values() if single(p))
    print(f"{len(pages)} HTML-Dateien, {refs} Verweise, {len(with_alts)} Seiten mit hreflang "
          f"(davon {singles} in nur einer Sprache), {len(in_sitemap)} Sitemap-Einträge, "
          f"{blocks} JSON-LD-Blöcke geprüft")
    for e in errors:
        print("FEHLER", e)
    print("OK" if not errors else f"{len(errors)} Fehler")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
