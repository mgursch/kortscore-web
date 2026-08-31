# iOS-Interesse: Sheet und Endpunkt einrichten

Die Sektion "Willst du das auf iOS?" auf der Startseite schickt die
E-Mail-Adresse an ein Google Apps Script, das sie an eine Tabelle anhängt und
dich per Mail benachrichtigt. Kein Newsletter-Dienst, keine laufenden Kosten.

Benachrichtigt wird die Adresse in `NOTIFY` oben im Skript, aktuell
`swordistudios@gmail.com`. Der Interessent selbst bekommt nichts.

Solange in `index.html` und `de/index.html` der Platzhalter
`IOS_INTEREST_ENDPOINT` steht, blendet `script.js` die ganze Sektion aus. Die
Seite kann also live gehen, bevor die Schritte unten erledigt sind.

## 1. Tabelle anlegen

1. Auf <https://sheets.new> eine neue Tabelle anlegen, Name z. B.
   "Kortscore iOS-Interesse".
2. Den Reiter unten von "Tabellenblatt1" auf **`Anmeldungen`** umbenennen.
   Der Name muss mit `SHEET_NAME` in `ios-interest.gs` übereinstimmen.

Die Kopfzeile legt das Skript beim ersten Eintrag selbst an.

## 2. Skript hinterlegen

1. In der Tabelle: **Erweiterungen › Apps Script**.
2. Den Inhalt von `ios-interest.gs` in den Editor kopieren, den
   Beispielcode dabei ersetzen.
3. Speichern.

## 3. Als Web-App veröffentlichen

1. Oben rechts **Bereitstellen › Neue Bereitstellung**.
2. Als Typ **Web-App** wählen.
3. Einstellungen:
   - *Ausführen als*: **Ich** (sonst darf das Skript nicht in die Tabelle schreiben)
   - *Zugriff*: **Jeder** (das Formular ist öffentlich und meldet sich nicht an)
4. Bereitstellen, die Berechtigung bestätigen. Google fragt dabei auch nach
   dem Recht, "E-Mails als du zu senden": das ist die Benachrichtigung an
   `NOTIFY`.
5. Die angezeigte **Web-App-URL** kopieren. Sie endet auf `/exec`.

> Der Warnhinweis "Google hat diese App nicht überprüft" ist bei eigenen
> Skripten normal: über *Erweitert › Weiter zu …* bestätigen.

## 4. URL in die Seite eintragen

In `index.html` und `de/index.html` jeweils `IOS_INTEREST_ENDPOINT` durch die
kopierte URL ersetzen:

```bash
URL='https://script.google.com/macros/s/AKfy…/exec'
sed -i '' "s|IOS_INTEREST_ENDPOINT|$URL|" index.html de/index.html
```

Danach den Cache-Buster von `script.js` in beiden Dateien hochzählen, sonst
liefern Besucher mit altem Cache das Formular ohne den passenden Code aus.

## 5. Prüfen

Seite öffnen, Adresse eintragen, absenden. Die Zeile muss binnen Sekunden in
der Tabelle stehen. Eine zweite Anmeldung mit derselben Adresse legt bewusst
keine neue Zeile an, meldet dem Nutzer aber trotzdem Erfolg.

## Nach einer Änderung am Skript

Änderungen wirken erst nach **Bereitstellen › Bereitstellungen verwalten ›
Bearbeiten › Version: Neu**. Die URL bleibt dabei gleich.

## Was das Skript bewusst nicht kann

- **Keine Rückmeldung, ob der Eintrag geklappt hat.** Apps Script leitet auf
  eine andere Domain um, deshalb sendet der Browser die Anfrage als `no-cors`
  und darf die Antwort nicht lesen. Das Formular meldet Erfolg, sobald die
  Anfrage draußen ist. Ob eine Zeile ankam, steht nur in der Tabelle.
- **Keine Bestätigungsmail an den Interessenten.** Nur du wirst
  benachrichtigt; angeschrieben wird später von Hand.
- **Rund 100 Benachrichtigungen pro Tag.** Das ist das Mail-Kontingent von
  Apps Script für Gratis-Konten. Darüber schlägt nur der Versand fehl, der
  Eintrag in der Tabelle bleibt.
- **Kein Schutz gegen gezielten Missbrauch.** Die URL ist öffentlich; Honeypot
  und Herkunftsliste halten nur Gelegenheits-Bots heraus. Bei Spam in der
  Tabelle hilft eine neue Bereitstellung mit neuer URL.

## Datenschutz

Die Adressen liegen in deinem Google-Konto. Der Absatz dazu steht in
`legal/privacy.html` (Abschnitt "Interesse an einer iOS-Version"). Wenn du die
Liste löschst, sollte auch der Absatz weg.
