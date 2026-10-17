# Kortscore, Landingpage

Statische Website für die Kortscore-App (iPhone + Apple Watch, Android +
Wear OS). Kein Framework: ein kleiner Python-Generator (`build.py`, Jinja2 +
PyYAML) baut aus Vorlagen und Texten reines HTML/CSS/JS nach `_site/`.

## Struktur

```
site.yaml           Sprachen, Seitenregister (Seiten-ID -> Slug je Sprache),
                    sprachabhängige Assets, Store-Links
build.py            der Generator, schreibt nach _site/ (nicht im Repo)
templates/
  base.html         <head>, Analytics, hreflang, OG, Sprachhinweis, Nav, Footer
  index.html        Startseite (Hero, Warum, So funktioniert's, Padel, Vereine,
                    Uhren-Teaser, iOS, FAQ, CTA)
  watches.html      vier empfohlene Uhren (Amazon-Affiliate)
  compatible.html   Kompatibilitätsliste aller Uhren
  tennis.html       Regelseite Tennis  } beide auf Basis von
  padel.html        Regelseite Padel   } partials/rules.html
  clubs.html        Angebot für Vereine (Flyer, Rabattcode)
  partials/         FAQ-Liste, Gerüst der Regelseiten
  badges/           App-Store-Badge als Inline-SVG, je Sprache eine Datei
  sitemap.xml       Vorlage der Sitemap
  llms.txt          Vorlage des Kurzbriefings für KI-Crawler
i18n/
  en/, de/          je Sprache common.yaml (Nav, Footer, Sprachhinweis) und
                    eine Datei pro Seite (index.yaml, watches.yaml, ...)
static/             wird 1:1 nach _site/ kopiert
  styles.css        Design-System, Layout, @font-face, alles in einer Datei
  script.js         Sprachweiche, Sprachhinweis, Umschalter, Store-Klicks
  legal/            Impressum, Datenschutz, AGB (eigenständig, 5 Sprachen)
  assets/           Icons, Screenshots, Badges, OG-Bilder, Flyer, Fonts
  favicon.ico       Kopie von assets/favicon.ico: Browser und Google fragen den Root-Pfad ab
  robots.txt        alles erlaubt, verweist auf Sitemap und llms.txt
  legal.html        Weiterleitung auf legal/impressum.html (Altlink)
  rechtliches.html  dito
  de/rechtliches.html dito
  CNAME, .nojekyll, .well-known/assetlinks.json
tools/              nicht veröffentlicht: check_site.py, Apps Script der alten
                    iOS-Warteliste
```

Die Seiten und ihre Adressen:

| Seiten-ID | Englisch | Deutsch |
|---|---|---|
| `index` | `/` | `/de/` |
| `watches` | `/watches.html` | `/de/uhren.html` |
| `compatible` | `/compatible-watches.html` | `/de/kompatible-uhren.html` |
| `tennis` | `/how-tennis-scoring-works.html` | `/de/tennis-zaehlweise.html` |
| `padel` | `/how-padel-scoring-works.html` | `/de/padel-zaehlweise.html` |
| `clubs` | `/clubs.html` | `/de/vereine.html` |

## Sprachen & Build

Englisch ist die Voreinstellung (x-default) und liegt im Root, jede weitere
Sprache in einem eigenen Ordner (`/de/`). Jede Seite gibt es in jeder aktiven
Sprache als fertige HTML-Datei, übersetzt wird nichts zur Laufzeit.

**Lokal bauen und ansehen:**

```bash
pip3 install jinja2 pyyaml        # einmalig
python3 build.py && python3 -m http.server -d _site 8765
```

Dann `http://localhost:8765` öffnen. Über `file://` funktionieren die
Ordner-Links (`./`, `../`) nicht sauber, deshalb per `http://`. Vor dem Push
prüft `python3 tools/check_site.py` interne Links, Anker, hreflang, Sitemap und
JSON-LD; das Deployment führt dieselbe Prüfung aus.

**Text ändern:** in `i18n/<sprache>/<seite>.yaml` (Texte auf jeder Seite in
`common.yaml`), und zwar in jeder Sprache. Werte dürfen Inline-HTML enthalten
(`<em>`, `<strong>`, `<br>`, Links) und landen unverändert im HTML, ein `&`
also als `&amp;`. Links auf andere Seiten der Website schreibt man als
`{url:watches}` (Seiten-ID aus `site.yaml`), der Build setzt den passenden
relativen Pfad der jeweiligen Sprache ein. Sichtbares FAQ und das
FAQPage-JSON-LD kommen aus derselben Liste `faq.questions`, im JSON-LD ohne
HTML. Struktur, Klassen und sprachunabhängige Daten (Uhrenmodelle,
Kompatibilitätstabellen, Amazon-Links) stehen in `templates/`.

Der Build bricht ab, statt Lücken auszuliefern: wenn einer Sprache ein
Schlüssel fehlt, den die englische Datei hat (oder umgekehrt), wenn eine
Vorlage einen Text abfragt, den es nicht gibt, oder bei einer unbekannten
Seiten-ID in `{url:...}`.

**Sprachabhängige Bilder** (Screenshots, Play-Badge, OG-Bild) heißen in jeder
Sprache gleich: englischer Basisname plus Sprachcode, `<basis>-<code>.<ext>`,
auch für Englisch und Deutsch. Beispiele: `shot-play-de.webp`,
`shot-ios-live-fr.webp`, `google-play-it.png`, `og-es.png`. Die Basisnamen
sind `og`, `google-play`, `shot-play`, `shot-live`, `shot-stats`,
`shot-ios-play`, `shot-ios-live`, `shot-ios-stats`. Die Vorlagen fragen nur den
Basisnamen ab (`lasset('shot-live')`), welche Datei dazugehört, steht unter
`localized_assets` in `site.yaml`. Apples Badge ist kein Bild, sondern
Inline-SVG in `templates/badges/appstore-<code>.svg` (für Französisch,
Italienisch und Spanisch Apples Originalgrafik aus dem Marketing-Toolkit, nur
mit eigener Klasse, `role="img"` und dem Badge-Text als `aria-label`).
Sprachunabhängige Bilder (Uhrenfotos, Icons, Flyer) haben kein Sprachkürzel.

**Neue Sprache hinzufügen:** Für Französisch, Italienisch und Spanisch stehen
Slugs, Bilder und Badges schon bereit, dort fehlen nur die Texte und
`enabled: true`. Für eine weitere Sprache (Beispiel `xx`):

1. In `site.yaml` unter `languages` einen Eintrag mit Code, Name,
   `og:locale` und Ordner anlegen, `enabled: true`.
2. Unter `pages` jeder Seite einen Slug geben, z. B. `xx: montres.html`
   (Startseite: `xx: index.html`).
3. `i18n/en/` nach `i18n/xx/` kopieren und übersetzen, alle Schlüssel behalten.
4. Die Bilder als `<basis>-xx.<ext>` nach `static/assets/` legen und unter
   `localized_assets` bei jedem Basisnamen `xx: <datei>` eintragen.
5. `templates/badges/appstore-xx.svg` aus Apples Badge in der Sprache anlegen
   (Kopf wie bei den vorhandenen Dateien).
6. `python3 build.py && python3 tools/check_site.py`.

Fehlt einer aktiven Sprache ein Slug, ein Eintrag unter `localized_assets`,
die Bilddatei dazu oder die Badge-Datei, bricht der Build mit einer Meldung
ab. hreflang, `og:locale:alternate`, Sprachumschalter, Sprachhinweis, Sitemap
und `llms.txt` erweitern sich von selbst.

**Sprachwahl im Browser** (`static/script.js`): Die verfügbaren Sprachen liest
das Skript aus den `<link rel="alternate" hreflang>` im Kopf. Es nimmt die
erste Sprache aus `navigator.languages`, die es auf der Seite gibt. Ist das die
Sprache der Seite, passiert nichts. Sonst:

- Auf einer englischen Seite (x-default) wird einmalig auf dieselbe Seite in
  der bevorzugten Sprache umgeleitet, solange unter `localStorage` (`ks-lang`)
  noch keine Wahl gespeichert ist. Die Umleitung speichert die Wahl gleich mit.
- Auf allen anderen Seiten wird nie umgeleitet, damit sich zwei Sprachen nicht
  gegenseitig weiterschicken. Stattdessen erscheint oben ein schmaler Hinweis
  in der angebotenen Sprache (der Build legt je andere Sprache einen
  versteckten an). Wechseln oder "Nein danke" speichern die Wahl, danach
  erscheint er nicht mehr.

Bei `en, de` bleibt ein Besucher also auf Englisch, bei `de, en` landet er auf
Deutsch, bei `fr, de` auf der englischen Seite ebenfalls auf Deutsch. Der
Umschalter in der Navigation ist ein `<details>` mit allen Sprachen, geht ohne
JavaScript auf und speichert die Wahl beim Klick. Ohne JavaScript gibt es
weder Umleitung noch Hinweis, die Seite funktioniert unverändert.

Die Rechtstexte unter `legal/` sind eine Seite pro Dokument mit allen fünf
Sprachen, Deutsch zuerst. Der Footer verlinkt auf Deutsch ohne Anker, sonst auf
den Abschnitt der Sprache (`legal/privacy.html#en`).

## Deployment

Die Seite läuft auf GitHub Pages und wird bei jedem Push auf `main` automatisch
veröffentlicht, siehe [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):
Python einrichten, `jinja2` und `pyyaml` installieren, `python build.py`,
`python tools/check_site.py`, dann wird nur `_site/` hochgeladen.

```bash
git push            # löst das Deployment aus
gh run watch        # Fortschritt verfolgen
```

`.nojekyll` schaltet die Jekyll-Verarbeitung ab (sonst würden Dateien mit
`_`-Präfix ignoriert). Einmalig muss in den Repo-Settings unter *Pages* als
Source **GitHub Actions** gewählt sein.

Den `?v=`-Parameter an `styles.css` und `script.js` setzt der Build selbst,
aus einem Hash des Dateiinhalts. Ändert sich eine Datei, ändert sich der Link,
und Caches holen die neue Fassung.

## Statistik (Umami)

Die Seite nutzt [Umami](https://umami.is) statt Google Analytics. Umami setzt
keine Cookies und speichert keine personenbezogenen Daten, deshalb ist **kein
Consent-Banner** nötig. Google Analytics wäre in Österreich
einwilligungspflichtig, weil Daten in die USA übertragen werden (Entscheidung
der Datenschutzbehörde).

Die Website-ID steht im Umami-Block in `templates/base.html`. Ein Guard prüft
sie gegen das UUID-Format und lädt das Skript nur bei gültiger ID, ein
Platzhalter erzeugt so keine fehlschlagenden Requests.

Erfasst werden Seitenaufrufe, Referrer, Land, Gerätetyp und Browser, aggregiert,
ohne Cookies, ohne Fingerprinting, ohne IP-Speicherung.

## Google Ads (Conversion ohne Cookies)

Zusätzlich läuft `gtag.js` für die Conversion-Messung von Anzeigen
(`AW-18314402307`). Der Consent Mode steht auf `denied`, **bevor** das Skript
lädt: Google setzt dann keine Werbe-Cookies und speichert nichts auf dem Gerät,
sondern liefert nur modellierte, aggregierte Conversions. Dazu gehören
`url_passthrough` (Klick-Kennung in der URL statt im Cookie) und
`ads_data_redaction`.

Deshalb bleibt die Seite ohne Consent-Banner. Geladen wird `gtag.js` nur auf
den Seiten mit `google_ads: true` in `site.yaml` (Startseite und Uhren). Wer
volle Messung will, braucht ein echtes Einwilligungsbanner und darf erst nach
dem Klick auf `granted` schalten.

## Design

Umgesetzt nach dem Claude-Design-File *Kortscore Website*, die Tokens stammen
aus dem Handoff-Bundle des App-Redesigns, damit App und Website dieselbe
Sprache sprechen.

| Token | Wert | Verwendung |
|-------|------|------------|
| `--bg` | `#faf9f5` | Grundfläche |
| `--bg-alt` | `#f1efe4` | abgesetzte Sektion (Vereine) |
| `--bg-dark` | `#16150f` | dunkle Sektion (Warum Kortscore) |
| `--surface-dark` | `#26251d` | Karten auf dunklem Grund |
| `--text` | `#16150f` | Primärtext |
| `--text-secondary` | `#4a4842` | Fließtext |
| `--text-muted` | `#66635b` | Mono-Labels, Captions |
| `--accent` | `#3ea56b` | **nur Flächen** |
| `--accent-text` | `#1f5c34` | **nur Text auf hellem Grund** |

**Wichtig zu den zwei Grüntönen:** `#3ea56b` erreicht auf `#faf9f5` nur rund
2,3:1 und ist als Text unlesbar. Es ist im Handoff der Dark-Mode-Akzent und
dient hier ausschließlich als Fläche (Buttons, CTA-Block, Live-Punkt), immer mit
dunkler Schrift darauf. Grüner **Text** auf hellem Grund nimmt `--accent-text`.

Schriften: Barlow Condensed 700 für Überschriften und Buttons (Versalien),
IBM Plex Sans für Fließtext, IBM Plex Mono für Labels und alle Zahlen. Sie
liegen als woff2-Subsets (latin + latin-ext) in `assets/fonts/` und werden lokal
geladen, kein Google-Fonts-Aufruf, also kein Drittanbieter-Request. IBM Plex
Sans ist eine Variable Font und deckt 400 bis 600 mit einer Datei ab.

Zahlen stehen durchgehend auf `font-variant-numeric: tabular-nums`, damit
Scores in Spalten untereinander stehen und beim Zählen nicht springen.

## Inhalt anpassen

- **Sektionen** der Startseite: `.hero`, `.benefits` (dunkel), `.steps`,
  `.clubs` (abgesetzt, mit Ticker-Attrappe), `.teaser` (Uhren), `.cta`.
  Der Container `.shell` zentriert auf 1060px, farbige Flächen liegen außen
  herum, damit der Grund über die volle Breite läuft.
- **Screenshots austauschen:** in `static/assets/` legen, je Sprache eine
  Datei nach dem Schema `<basis>-<code>.webp` (540 px breit), und unter
  `localized_assets` in `site.yaml` eintragen. Der
  Uhren-Slot im Hero ist rund und erwartet einen quadratischen Screenshot,
  kein Gerätefoto: `object-fit: cover` würde ein Foto mit Armband beschneiden.
- **Uhren-Empfehlungen:** Modelle, Fotos und Amazon-Links stehen in
  `templates/watches.html`, die Texte dazu in `i18n/<sprache>/watches.yaml`.
  Der Teaser auf der Startseite verlinkt nur dorthin. Die
  Affiliate-Offenlegung ist Pflicht und muss am Ende der Kartenliste stehen
  bleiben.
- **Play-Badge:** liegt unverändert als PNG vor. Googles Richtlinien verbieten
  Umfärben, Zuschneiden und zusätzlichen Text, das PNG bringt seine eigene
  Schutzzone mit.

## Barrierefreiheit / Verhalten

- Die Seite funktioniert vollständig ohne JavaScript. Das Skript ergänzt nur
  Sprachweiche, Sprachhinweis und die Messung der Store-Klicks.
- `prefers-reduced-motion: reduce` schaltet Animationen ab (betrifft den
  pulsierenden Live-Punkt).
- Screenshots haben beschreibende `alt`-Texte, die Ticker-Attrappe ist
  `aria-hidden`, weil der Text daneben dasselbe schon sagt.
- Getestet ohne horizontales Scrollen bei 375px und 1280px Breite.
- Unter 900px löst sich der Screenshot-Fächer in eine Reihe auf, unter 640px
  entfällt das dritte Telefon.
