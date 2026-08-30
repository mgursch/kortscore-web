# Kortscore, Landingpage

Statische Website für die Kortscore-App (Wear OS + Android Companion).
Keine Build-Tools, kein Framework, reines HTML/CSS/JS.

## Struktur

```
index.html          Startseite, Englisch (Hero, Warum, So funktioniert's,
                    Vereine, Uhren-Teaser, CTA, Footer)
de/index.html       Startseite, Deutsch, gleiche Struktur
watches.html        Unterseite: drei empfohlene Uhren (Amazon-Affiliate)
de/uhren.html       dieselbe Unterseite auf Deutsch
styles.css          Design-System, Layout, @font-face, alles in einer Datei
script.js           nur der Sprachhinweis, sonst nichts
legal/              Impressum, Datenschutz, AGB (eigenständige Seiten)
legal.html          Weiterleitung auf legal/impressum.html (Altlink)
rechtliches.html    dito
de/rechtliches.html dito
assets/
  icon.png/.svg     App-Icon
  shot-*.png        Screenshots, je Sprache (-en für Englisch)
  watch-*.webp      Produktfotos der empfohlenen Uhren, 480 und 960 breit
  google-play-*.png offizielle Play-Badges, je Sprache
  fonts/            Barlow Condensed, IBM Plex Sans, IBM Plex Mono
```

## Lokal ansehen

```bash
python3 -m http.server 8000
```

Dann `http://localhost:8000` öffnen. Über `file://` funktionieren die
Sprachwechsel-Links nicht sauber, deshalb besser per `http://`.

## Zweisprachigkeit

Englisch ist die Voreinstellung und liegt im Root, Deutsch unter `/de/`. Beide
Fassungen sind vollständige Dateien, es gibt keine Übersetzung zur Laufzeit.

Die Zuordnung:

| Englisch | Deutsch |
|---|---|
| `/` | `/de/` |
| `/watches.html` | `/de/uhren.html` |

Jede Seite verlinkt ihr Gegenstück über `hreflang` im Kopf und über den
Umschalter in der Navigation.

**Sprachwahl:** Es wird niemand automatisch umgeleitet. Wer mit einem
deutschsprachigen Browser auf einer englischen Seite landet, sieht oben einen
schmalen Hinweisbalken mit dem Angebot, zu wechseln. Die Entscheidung landet in
`localStorage` (`ks-lang`), danach erscheint der Balken nicht mehr, egal ob per
"Nein danke" abgelehnt oder per Wechsel angenommen. Ohne JavaScript bleibt der
Balken unsichtbar und die Seite funktioniert unverändert.

Die Prüfung sieht `navigator.languages` der Reihe nach durch: Steht die andere
Sprache vor der aktuellen, kommt der Hinweis. Bei `en, de` also nicht, bei
`fr, de` auf der englischen Seite schon.

Beim Ändern von Texten immer beide Sprachfassungen anfassen.

## Deployment

Die Seite läuft auf GitHub Pages und wird bei jedem Push auf `main` automatisch
veröffentlicht, siehe [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).
Es gibt keinen Build-Schritt: das Repo-Root wird 1:1 als Artefakt hochgeladen.

```bash
git push            # löst das Deployment aus
gh run watch        # Fortschritt verfolgen
```

`.nojekyll` schaltet die Jekyll-Verarbeitung ab (sonst würden Dateien mit
`_`-Präfix ignoriert). Einmalig muss in den Repo-Settings unter *Pages* als
Source **GitHub Actions** gewählt sein.

Nach Änderungen an `styles.css` oder `script.js` den `?v=`-Parameter in allen
vier Seiten hochzählen, sonst liefern Caches die alte Datei aus.

## Statistik (Umami)

Die Seite nutzt [Umami](https://umami.is) statt Google Analytics. Umami setzt
keine Cookies und speichert keine personenbezogenen Daten, deshalb ist **kein
Consent-Banner** nötig. Google Analytics wäre in Österreich
einwilligungspflichtig, weil Daten in die USA übertragen werden (Entscheidung
der Datenschutzbehörde).

Die Website-ID steht im Umami-Block jeder Seite. Ein Guard prüft sie gegen das
UUID-Format und lädt das Skript nur bei gültiger ID, ein Platzhalter erzeugt so
keine fehlschlagenden Requests.

Erfasst werden Seitenaufrufe, Referrer, Land, Gerätetyp und Browser, aggregiert,
ohne Cookies, ohne Fingerprinting, ohne IP-Speicherung.

## Google Ads (Conversion ohne Cookies)

Zusätzlich läuft `gtag.js` für die Conversion-Messung von Anzeigen
(`AW-18314402307`). Der Consent Mode steht auf `denied`, **bevor** das Skript
lädt: Google setzt dann keine Werbe-Cookies und speichert nichts auf dem Gerät,
sondern liefert nur modellierte, aggregierte Conversions. Dazu gehören
`url_passthrough` (Klick-Kennung in der URL statt im Cookie) und
`ads_data_redaction`.

Deshalb bleibt die Seite ohne Consent-Banner. Wer volle Messung will, braucht
ein echtes Einwilligungsbanner und darf erst nach dem Klick auf `granted`
schalten.

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
- **Screenshots austauschen:** in `assets/` legen, je Sprache eine Datei
  (`-en` für Englisch). Der Uhren-Slot im Hero ist rund und erwartet einen
  quadratischen Screenshot, kein Gerätefoto: `object-fit: cover` würde ein
  Foto mit Armband beschneiden.
- **Uhren-Empfehlungen:** stehen in `watches.html` und `de/uhren.html`, der
  Teaser auf der Startseite verlinkt nur dorthin. Die Affiliate-Offenlegung ist
  Pflicht und muss am Ende der Kartenliste stehen bleiben.
- **Play-Badge:** liegt unverändert als PNG vor. Googles Richtlinien verbieten
  Umfärben, Zuschneiden und zusätzlichen Text, das PNG bringt seine eigene
  Schutzzone mit.

## Barrierefreiheit / Verhalten

- Die Seite funktioniert vollständig ohne JavaScript, das Skript blendet nur
  den Sprachhinweis ein.
- `prefers-reduced-motion: reduce` schaltet Animationen ab (betrifft den
  pulsierenden Live-Punkt).
- Screenshots haben beschreibende `alt`-Texte, die Ticker-Attrappe ist
  `aria-hidden`, weil der Text daneben dasselbe schon sagt.
- Getestet ohne horizontales Scrollen bei 375px und 1280px Breite.
- Unter 900px löst sich der Screenshot-Fächer in eine Reihe auf, unter 640px
  entfällt das dritte Telefon.
