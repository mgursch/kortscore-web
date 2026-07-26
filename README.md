# Kortscore – Landingpage

Statische Landingpage für die Kortscore-App (Wear OS + Android Companion).
Keine Build-Tools, kein Framework – reines HTML/CSS/JS.

## Struktur

```
index.html     Seiteninhalt (Hero, Bühne, gepinnte Szene, Live, Auswertung,
               Datenschutz, Tester, Footer)
styles.css     Design-System, Layout, @font-face
script.js      Reveals, Parallax, Nav-Zustand, gepinnte Szene, Count-ups
assets/
  icon.png     App-Icon (aus tenniswatch/playstore/)
  icon.svg     App-Icon als Vektor
  watch.png    Screenshot: laufendes Match auf der Uhr
  live.png     Screenshot: Live-Match am Handy
  phone.png    Screenshot: Matchauswertung am Handy
  fonts/       Archivo, Archivo Black, JetBrains Mono (woff2-Subsets)
```

## Lokal ansehen

```bash
python3 -m http.server 8000
```

Dann `http://localhost:8000` öffnen. (Ein direktes Öffnen der Datei per
`file://` funktioniert ebenfalls, `http://` entspricht aber dem späteren Hosting.)

## Deployment

Die Seite läuft auf GitHub Pages und wird bei jedem Push auf `main` automatisch
veröffentlicht – siehe [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).
Es gibt keinen Build-Schritt: das Repo-Root wird 1:1 als Artefakt hochgeladen.

```bash
git push            # löst das Deployment aus
gh run watch        # Fortschritt verfolgen
```

`.nojekyll` schaltet die Jekyll-Verarbeitung ab (sonst würden Dateien mit
`_`-Präfix ignoriert). Einmalig muss in den Repo-Settings unter *Pages* als
Source **GitHub Actions** gewählt sein.

## Statistik (Umami)

Die Seite nutzt [Umami](https://umami.is) statt Google Analytics. Umami setzt
keine Cookies und speichert keine personenbezogenen Daten, deshalb ist **kein
Consent-Banner** nötig. Google Analytics wäre in Österreich
einwilligungspflichtig, weil Daten in die USA übertragen werden (Entscheidung
der Datenschutzbehörde).

### Einrichten

1. Auf [cloud.umami.is](https://cloud.umami.is) einen Account anlegen
   (kostenlos bis 100.000 Ereignisse/Monat) und die Website `kortscore.com`
   hinzufügen.
2. Die angezeigte **Website-ID** kopieren (Format `8-4-4-4-12` Hex).
3. In [`index.html`](index.html) im Umami-Block `UMAMI_ID` ersetzen.
4. Committen und pushen, danach die Cache-Version erhöhen (siehe unten).

Solange der Platzhalter drinsteht, wird das Skript bewusst **nicht** geladen –
so gibt es auf der Live-Seite keine fehlschlagenden Requests. Der Guard prüft
die ID gegen das UUID-Format.

Selbst gehostet: zusätzlich `UMAMI_SRC` auf die eigene Instanz zeigen lassen.

### Was erfasst wird

Seitenaufrufe, Referrer, Land, Gerätetyp und Browser – aggregiert, ohne
Cookies, ohne Fingerprinting, ohne IP-Speicherung.

## Design

Direction **B "Court Paper"** aus dem Redesign: die Cream/Ink-Palette der App
wird zur Website, Display-Schrift ist Archivo Black, Labels in JetBrains Mono.

| Token | Wert | Verwendung |
|-------|------|------------|
| `--paper` | `#F2F4E4` | Grundfläche (Cream aus der App) |
| `--ink` | `#14170F` | Text und dunkle Panels |
| `--lime` | `#D9F764` | Akzent auf dunklem Grund |
| `--moss` | `#4C6B2F` | Akzent auf Cream (kontraststark) |
| `--clay` | `#C0272D` | Ziffern, Live-Punkt |
| `--sage` | `#6E7358` | Mono-Labels |
| `--body` | `#3B402E` | Fließtext |

Die Fonts liegen als woff2-Subsets (latin + latin-ext) in `assets/fonts/` und
werden lokal geladen – kein Google-Fonts-Aufruf, also kein Drittanbieter-Request.

### Gepinnte Zähl-Szene

Die Sektion `#zaehlen` pinnt ihren Inhalt via `position: sticky`. `script.js`
rechnet den Scroll-Fortschritt in vier Schritte um und schaltet Caption,
Tap-Karten und Punktestand mit. Die Punktefolge ist bewusst mitten im Game:
`15:30 → (1×) 30:30 → (2×) 30:40 → (3× Undo) 30:30`. Ab 40:30 wäre das Game
nach einem eigenen Punkt gewonnen, die Uhr würde das Sieger-Banner zeigen.

Höhen: 520vh am Desktop, 300vh mobil. Gepinnt wird mobil nur ab
`min-height: 820px` – der gestapelte Inhalt braucht rund 810px, auf kürzeren
Displays (iPhone SE, viele 16:9-Androids) würde er sonst aus dem Sticky-Bereich
ragen und in Block 02 laufen. Dort fließt die Sektion normal, die Schritte
laufen über die Viewport-Position.

Das Uhr-Display ist **in HTML/CSS nachgebaut** (`.face`), nicht als Bild oder
Video: nur so kann der Stand beim Scrollen echt mitzählen. Es skaliert über
Container-Queries (`cqw`/`cqh`) mit dem Gehäuse, die Geometrie ist am
App-Screenshot ausgerichtet. Das Video aus der Design-Session ist bewusst nicht
enthalten.

Bei `prefers-reduced-motion: reduce` wird die Szene entpinnt und zeigt den
ersten Schritt statisch.

## Inhalt anpassen

- **Sektionen** sind `<section class="feature">` (Text/Bild-Paar),
  `.stage` (dunkles Panel), `.privacy`, `.tester`. Sprungziele sitzen auf
  eigenen `<span class="anchor" id="...">` direkt am Sektionsanfang – ein
  Anker auf `<section>` selbst würde den Kopf hinter die fixierte Nav schieben.
- **Weitere Screenshots:** in `assets/` legen. Für Handy `.phone`
  (`.phone--crop` schneidet lange Screenshots oben zu), für Uhr `.watch`.
- **Schritte der Zähl-Szene:** Array `STEPS` in `script.js` – `cap` ist der
  Text, `mine`/`theirs` der Stand auf dem Uhr-Display, `tap` die hervorgehobene
  Karte. Mehr Schritte brauchen keine weitere Änderung.
- **Statistik-Kacheln** zählen via `data-count` + `data-count-suffix` hoch.
- **Beim Release:** Sektion `#tester` durch einen Play-Store-Button ersetzen
  und die CTAs in Nav und Hero (`href="#tester"`) anpassen.

## Barrierefreiheit / Verhalten

- Scroll-Reveal via `IntersectionObserver`; ohne Support ist alles direkt sichtbar.
- `prefers-reduced-motion: reduce` schaltet Animationen und Smooth-Scroll ab.
- Screenshots haben beschreibende `alt`-Texte, rein dekorative Elemente
  sind mit `aria-hidden` ausgezeichnet.
- Getestet ohne horizontales Scrollen bei 390 px und 1440 px Breite.
- Bei `#hash`-Aufruf springt `script.js` nach dem Layout erneut zum Ziel: die
  520vh-Szene und die Reveals verändern die Höhen, wodurch der ursprüngliche
  Sprung des Browsers sonst ins Leere zeigt.
