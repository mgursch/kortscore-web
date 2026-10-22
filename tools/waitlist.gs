/**
 * ============================================================================
 * Kortscore: Wartelisten von kortscore.com
 * ============================================================================
 * Nimmt die Anmeldungen der Formulare auf kortscore.com entgegen, haengt sie
 * an ein Google Sheet an und schickt eine kurze Notiz an NOTIFY. An den
 * Interessenten selbst geht nichts: keine Bestaetigungsmail, keine
 * Weitergabe. Angeschrieben wird spaeter von Hand, einmal, wenn es soweit ist.
 *
 * Welche Liste gemeint ist, sagt der Parameter `list`. Derzeit gibt es eine:
 *   itn-app  "Bald als App" auf kortscore.com/itn-rechner/: Benachrichtigung,
 *            sobald es den ITN-Rechner als App gibt.
 * Eine weitere Liste braucht nur einen Eintrag in LISTS und ein Formular,
 * das ihren Namen schickt. Alle Listen landen im selben Tabellenblatt, die
 * Spalte "Liste" trennt sie.
 *
 * Einrichtung steht in tools/waitlist-setup.md.
 * ========================================================================= */

/* Tabellenblatt, in das geschrieben wird. Der Name muss mit dem Reiter unten
   im Sheet uebereinstimmen. */
var SHEET_NAME = 'Anmeldungen';

/* Kennung des Codestands. Sie erscheint in der GET-Antwort und macht damit
   von aussen pruefbar, ob eine Bereitstellung wirklich den neuen Code
   ausliefert: Apps Script laesst die alte Version sonst still weiterlaufen. */
var VERSION = 'v1';

/* Adresse, die bei jedem neuen Eintrag eine kurze Notiz bekommt. Leer lassen
   schaltet die Benachrichtigung ab, die Tabelle wird trotzdem gefuellt. */
var NOTIFY = 'swordistudios@gmail.com';

/* Listen, die angenommen werden. Ein unbekannter oder fehlender Wert wird
   abgewiesen statt in eine falsche Liste einsortiert: lieber ein verlorener
   Eintrag als eine Adresse, die spaeter zur falschen Ankuendigung
   angeschrieben wird. Der Klartext dahinter steht nur in der Benachrichtigung. */
var LISTS = {
  'itn-app': 'ITN-App'
};

/* Kopfzeile des Tabellenblatts. Legt das Skript beim ersten Eintrag selbst an. */
var HEADER = ['Zeitpunkt', 'E-Mail', 'Liste', 'Sprache', 'Quelle', 'Mail'];

/* ── Eintrag annehmen ───────────────────────────────────────────────────────
   Das Formular schickt einen POST als form-urlencoded. Bewusst nicht als
   JSON: fuer JSON verlangt der Browser einen Preflight, und Apps Script
   beantwortet den nicht. So bleibt die Anfrage "einfach" im Sinne von CORS
   und geht ohne Umweg durch. Die Antwort kann die Seite wegen mode: no-cors
   nicht lesen, sie dient nur dem Test mit curl.

   Woher eine Anfrage kommt, laesst sich hier nicht pruefen: Apps Script
   reicht den Origin-Header nicht an doPost weiter. Die URL ist oeffentlich,
   Schutz gegen Bots geben nur Honeypot, Adresspruefung und Liste.
   ───────────────────────────────────────────────────────────────────────── */
function doPost(e) {
  try {
    var params = (e && e.parameter) || {};

    /* Honeypot: ein im Formular verstecktes Feld, das nur ein Bot ausfuellt.
       Wir antworten trotzdem freundlich, damit er es nicht erneut versucht. */
    if (params.website) {
      return json({ ok: true });
    }

    var email = String(params.email || '').trim();
    if (!isEmail(email)) {
      return json({ ok: false, error: 'invalid-email' });
    }

    var list = String(params.list || '').trim().toLowerCase();
    if (!LISTS.hasOwnProperty(list)) {
      return json({ ok: false, error: 'invalid-list' });
    }

    /* Sperre, damit zwei gleichzeitige Anmeldungen nicht in dieselbe Zeile
       schreiben. Wer laenger als zehn Sekunden warten muesste, bekommt einen
       Fehler und kann es erneut versuchen. */
    var lock = LockService.getScriptLock();
    if (!lock.tryLock(10000)) {
      return json({ ok: false, error: 'busy' });
    }

    try {
      var sheet = getSheet();

      /* Doppelte Adressen sollen die Liste nicht aufblaehen. Fuer den Nutzer
         sieht ein zweiter Versuch trotzdem wie ein Erfolg aus, sonst wuerde
         das Formular verraten, wer schon eingetragen ist. Gezaehlt wird je
         Liste. */
      if (!hasEmail(sheet, email, list)) {
        var mailStatus = notify(email, list);
        sheet.appendRow([
          new Date(),
          email,
          list,
          String(params.lang || '').slice(0, 5),
          String(params.source || '').slice(0, 60),
          mailStatus
        ]);
      }
      return json({ ok: true });
    } finally {
      lock.releaseLock();
    }
  } catch (err) {
    /* Der Nutzer bekommt keine Interna zu sehen, das Log schon. */
    console.error(err);
    return json({ ok: false, error: 'server' });
  }
}

/* Ein GET beantwortet nur, dass der Endpunkt lebt. Die Liste gibt er nicht
   heraus, sie ist im Sheet und bleibt dort. */
function doGet() {
  return json({
    ok: true,
    service: 'kortscore-waitlist',
    version: VERSION,
    lists: Object.keys(LISTS),
    /* Zeigt, ob die laufende Bereitstellung das Recht zum Mailversand hat. */
    mailQuota: mailQuota()
  });
}

function mailQuota() {
  try {
    return MailApp.getRemainingDailyQuota();
  } catch (err) {
    return 'keine Berechtigung: ' + err;
  }
}

/* ── Benachrichtigung ───────────────────────────────────────────────────────
   Eine kurze Notiz pro neuer Adresse, in einem eigenen try/catch: ein Fehler
   beim Versand darf den Eintrag nicht umstossen. Lieber eine verpasste Mail
   als eine verlorene Adresse.

   Das Kontingent von Apps Script liegt bei rund 100 Mails pro Tag fuer
   Gratis-Konten. Wird es ueberschritten, wirft send() und wir landen im
   catch, ohne dass der Nutzer davon etwas merkt.
   ───────────────────────────────────────────────────────────────────────── */
function notify(email, list) {
  if (!NOTIFY) { return 'aus'; }
  try {
    MailApp.sendEmail(mail(email, list));
    return 'gesendet';
  } catch (err) {
    /* Der Grund gehoert ins Log und in die Tabelle: ohne ihn sieht man nur,
       dass keine Mail ankam, aber nicht warum. */
    console.error('Benachrichtigung fehlgeschlagen: ' + err);
    return 'Fehler: ' + err;
  }
}

/* ── Selbsttest ─────────────────────────────────────────────────────────────
   Im Editor oben auswaehlen und auf "Ausfuehren" klicken. Beim ersten Mal
   fragt Google nach der Berechtigung fuer Tabelle und Mailversand.

   Das Ergebnis steht im Ausfuehrungsprotokoll. Anders als notify() faengt
   diese Funktion nichts ab, ein Fehler soll hier sichtbar werden. In die
   Tabelle schreibt sie nichts.
   ───────────────────────────────────────────────────────────────────────── */
function testeBenachrichtigung() {
  console.log('Empfaenger: ' + NOTIFY);
  console.log('Verbleibendes Tageskontingent: ' + MailApp.getRemainingDailyQuota());
  console.log('Tabellenblatt: ' + getSheet().getName());

  MailApp.sendEmail(mail('selbsttest@example.com', 'itn-app'));

  console.log('Versand ausgeloest, ohne Fehler.');
}

/* ── Helfer ─────────────────────────────────────────────────────────────── */

/* Die Notiz an NOTIFY. Betreff und Text nennen die Liste, damit man im
   Posteingang ohne Blick ins Sheet sieht, wofuer sich jemand eingetragen hat. */
function mail(email, list) {
  return {
    to: NOTIFY,
    subject: 'Kortscore Warteliste ' + LISTS[list] + ': neuer Eintrag',
    body: email + ' hat sich in die Warteliste "' + LISTS[list] + '" (' + list +
      ') eingetragen.'
  };
}

function getSheet() {
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = doc.getSheetByName(SHEET_NAME);

  /* Beim allerersten Eintrag gibt es das Blatt eventuell noch nicht. */
  if (!sheet) {
    sheet = doc.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADER);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/* Spalte B ist die Adresse, Spalte C die Liste. */
function hasEmail(sheet, email, list) {
  var last = sheet.getLastRow();
  if (last < 2) { return false; }

  var values = sheet.getRange(2, 2, last - 1, 2).getValues();
  var needle = email.toLowerCase();
  for (var i = 0; i < values.length; i++) {
    if (String(values[i][1]).trim() === list &&
        String(values[i][0]).trim().toLowerCase() === needle) { return true; }
  }
  return false;
}

/* Bewusst grosszuegig: die Adresse wird ohnehin nie automatisch angeschrieben,
   und ein zu strenger Ausdruck sperrt gueltige Adressen aus. */
function isEmail(value) {
  return value.length <= 254 && /^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(value);
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
