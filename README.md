# Kortscore – Landingpage

Statische Landingpage für die Kortscore-App (Wear OS + Android Companion).
Keine Build-Tools, kein Framework – reines HTML/CSS/JS.

## Struktur

```
index.html     Seiteninhalt (Hero + 3 Feature-Sektionen + Download + Footer)
styles.css     Design-System und Layout
script.js      Scroll-Reveal, Nav-Zustand, Footer-Jahr
assets/
  icon.png     App-Icon (aus tenniswatch/playstore/ic_launcher_playstore.png)
  icon.svg     App-Icon als Vektor
  watch.png    Screenshot: laufendes Match auf der Uhr
  phone.png    Screenshot: Matchauswertung am Handy
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

## Design

Palette und Bildsprache sind aus `tenniswatch/playstore/feature_graphic.svg`
übernommen, damit Store-Auftritt und Website zusammenpassen:

| Token | Wert | Verwendung |
|-------|------|------------|
| `--ink` | `#0B0D09` | Grundfläche („Night Session") |
| `--ink-raised` | `#14170F` | abgesetzte Sektionen, Icon-Ground |
| `--lime` | `#D9F764` | Akzent, Buttons, Zahlen |
| `--paper` | `#ECEFE4` | Fließtext, Headlines |
| `--sage` | `#9AA08C` | Sekundärtext |
| `--mine` / `--theirs` | `#A5E06B` / `#F98A7B` | Punktefarben wie in der App |

Der Hero greift den Aufbau des Play-Store-Feature-Graphics auf: Icon,
Wortmarke, Lime-Linie, zweizeiliger Claim „Du spielst. / Die Uhr zählt."

## Tester-Anmeldung

Die App ist noch nicht veröffentlicht; die Seite endet daher mit der Sektion
`#tester` statt mit einem Play-Store-Button. Interessenten schicken per
`mailto:`-Link ihre Google-Konto-Adresse an `swordistudios@gmail.com` – nur mit
dieser Adresse kann Google jemanden für die geschlossene Testphase freischalten.

Der Link enthält eine vorbereitete Textvorlage (Play-Store-E-Mail als Pflicht,
Watch-/Handy-Modell und Spielhäufigkeit optional). Bewusst **kein Formular**:
GitHub Pages ist statisch und kann Formulare weder annehmen noch Mails
versenden – dafür wäre ein Fremddienst nötig.

Beim Release: Sektion `#tester` durch einen Play-Store-Button ersetzen und die
Anker in Nav und Hero (`href="#tester"`) sowie den Hinweis `.hero__note`
anpassen.

## Inhalt anpassen

- **Weitere Screenshots:** in `assets/` legen und im gewünschten
  `.feature__visual` einbinden. Für Handy-Screenshots `.phone__bezel`
  verwenden, für Uhr-Screenshots `.watch__bezel` (rund maskiert).
- **Play-Store-Link:** in `index.html` im Abschnitt `#download`; zeigt auf
  `com.swordistudios.kortscore`.
- **Sektionen:** jede Feature-Sektion ist ein `<section class="feature">`.
  `feature--alt` setzt den Hintergrund ab, `feature__inner--rev` dreht
  Text/Bild auf dem Desktop (mobil immer Text zuerst).

## Barrierefreiheit / Verhalten

- Scroll-Reveal via `IntersectionObserver`; ohne Support ist alles direkt sichtbar.
- `prefers-reduced-motion: reduce` schaltet Animationen und Smooth-Scroll ab.
- Screenshots haben beschreibende `alt`-Texte, rein dekorative Elemente
  sind mit `aria-hidden` ausgezeichnet.
- Getestet ohne horizontales Scrollen bei 390 px und 1440 px Breite.
