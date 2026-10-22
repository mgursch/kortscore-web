# Warteliste einrichten (Google Apps Script)

Das Skript `tools/waitlist.gs` nimmt die E-Mail-Adressen aus dem Block
„Bald als App“ auf `kortscore.com/itn-rechner/` entgegen, hängt sie an eine
Google-Tabelle an und schickt dir pro neuem Eintrag eine kurze Mail. Kein
Newsletter-Dienst, keine laufenden Kosten, keine Mail an den Interessenten.

Solange in `site.yaml` der Platzhalter `ITN_WAITLIST_ENDPOINT` steht, baut die
Seite den Block gar nicht ein. Sie kann also live gehen, bevor das Skript
läuft.

Dauer: etwa 10 Minuten.

## 1. Tabelle anlegen

1. <https://sheets.new> öffnen, die Tabelle z. B. **Kortscore Wartelisten**
   nennen.
2. Den Reiter unten von „Tabellenblatt1“ in **`Anmeldungen`** umbenennen.
   Der Name muss mit `SHEET_NAME` im Skript übereinstimmen.

Die Kopfzeile (`Zeitpunkt`, `E-Mail`, `Liste`, `Sprache`, `Quelle`, `Mail`)
legt das Skript beim ersten Eintrag selbst an.

## 2. Skript hinterlegen

1. In der Tabelle **Erweiterungen › Apps Script** öffnen.
2. Den Beispielcode im Editor komplett durch den Inhalt von `tools/waitlist.gs`
   ersetzen. Speichern.
3. Oben in der Funktionsauswahl **`testeBenachrichtigung`** wählen und auf
   **Ausführen** klicken. Google fragt nach den Berechtigungen für Tabelle und
   Mailversand: erlauben. Der Hinweis „Google hat diese App nicht überprüft“
   ist bei eigenen Skripten normal, über *Erweitert › Weiter zu …* bestätigen.
4. Bei `swordistudios@gmail.com` (Wert von `NOTIFY` oben im Skript) kommt eine
   Testmail mit „selbsttest@example.com“ an.

## 3. Als Web-App veröffentlichen

1. Oben rechts **Bereitstellen › Neue Bereitstellung**.
2. Beim Zahnrad als Typ **Web-App** wählen.
3. Einstellungen:
   - *Beschreibung*: z. B. „Warteliste v1“
   - *Ausführen als*: **Ich** (sonst darf das Skript nicht in die Tabelle schreiben)
   - *Zugriff*: **Jeder** (das Formular ist öffentlich, Besucher melden sich nicht an)
4. **Bereitstellen** und die **Web-App-URL** kopieren. Sie endet auf `/exec`.

## 4. Prüfen

1. Die `/exec`-URL im Browser öffnen. Die Antwort enthält
   `"service":"kortscore-waitlist"`, `"version":"v1"`, `"lists":["itn-app"]`
   und bei `mailQuota` eine Zahl.
2. Im Terminal einen Testeintrag schicken:

   ```bash
   URL='https://script.google.com/macros/s/…/exec'
   curl -sL "$URL" --data-urlencode 'email=test@example.com' -d 'list=itn-app' -d 'lang=de'
   ```

   Antwort `{"ok":true}`, in der Tabelle eine neue Zeile, bei dir eine Mail
   „Kortscore Warteliste ITN-App: neuer Eintrag“. Mit `-d 'list=foo'` kommt
   `{"ok":false,"error":"invalid-list"}` und keine Zeile.
3. Die Testzeile wieder löschen.

## 5. URL eintragen

Schick mir die `/exec`-URL, oder trag sie selbst in `site.yaml` ein:

```yaml
itn_waitlist_endpoint: 'https://script.google.com/macros/s/…/exec'
```

Nach Commit und Push baut der Deploy die Seite mit dem Block neu. Danach auf
`kortscore.com/itn-rechner/` einmal eine echte Anmeldung testen und die Zeile
wieder löschen.

## Altes iOS-Skript

Die frühere iOS-Warteliste ist abgeschafft. Falls die alte Tabelle mit dem
alten Skript noch existiert:

- In deren Apps Script unter **Bereitstellen › Bereitstellungen verwalten**
  die Web-App **archivieren**, damit die alte URL nichts mehr annimmt.
- Die Tabelle mit den iOS-Adressen **löschen**. Die Datenschutzerklärung hat
  zugesagt, die Liste nach der Benachrichtigung zum iOS-Start zu löschen, und
  erwähnt sie nicht mehr.

## Nach einer Änderung am Skript

Speichern allein reicht nicht, Apps Script liefert sonst still die alte
Version aus. Im Skript `VERSION` hochzählen, dann **Bereitstellen ›
Bereitstellungen verwalten › Bearbeiten (Stift) › Version: Neue Version ›
Bereitstellen**. Die URL bleibt gleich; der GET-Aufruf zeigt die neue Version.

Eine weitere Liste braucht einen Eintrag in `LISTS` im Skript, ein Formular,
das ihren Namen im Feld `list` schickt, und einen Absatz in der
Datenschutzerklärung.

## Was das Skript bewusst nicht kann

- **Keine Rückmeldung an die Seite.** Der Browser sendet die Anfrage als
  `no-cors` und darf die Antwort nicht lesen. Das Formular meldet Erfolg,
  sobald die Anfrage draußen ist; ob eine Zeile ankam, steht nur in der
  Tabelle.
- **Keine Bestätigungsmail an den Interessenten.** Angeschrieben wird einmal
  von Hand, wenn die App erscheint.
- **Rund 100 Benachrichtigungen pro Tag** (Mail-Kontingent für Gratis-Konten).
  Darüber fällt nur deine Mail aus, der Eintrag bleibt.
- **Kein Schutz gegen gezielten Missbrauch.** Die URL ist öffentlich, der
  Honeypot hält nur einfache Bots ab. Bei Spam hilft eine neue Bereitstellung
  mit neuer URL.

## Datenschutz

Beschrieben in `static/legal/privacy.html`, Abschnitt 11 „Wartelisten
(Website)“, in allen fünf Sprachen, dazu die Zeile „Google Sheets
(Wartelisten)“ in Abschnitt 13. Zugesagt ist dort: Die Adressen dienen nur der
einen Benachrichtigung zum App-Start und werden danach gelöscht, spätestens
12 Monate nach der Eintragung.
