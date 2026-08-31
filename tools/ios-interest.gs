/**
 * ============================================================================
 * Kortscore — Interesse an einer iOS-Version einsammeln
 * ============================================================================
 * Nimmt die Anmeldungen des Formulars auf kortscore.com entgegen, haengt sie
 * an ein Google Sheet an und schickt eine kurze Notiz an NOTIFY. An den
 * Interessenten selbst geht nichts: keine Bestaetigungsmail, keine
 * Weitergabe. Angeschrieben wird spaeter von Hand.
 *
 * Einrichtung steht in tools/ios-interest-setup.md.
 * ========================================================================= */

/* Tabellenblatt, in das geschrieben wird. Der Name muss mit dem Reiter unten
   im Sheet uebereinstimmen. */
var SHEET_NAME = 'Anmeldungen';

/* Kennung des Codestands. Sie erscheint in der GET-Antwort und macht damit
   von aussen pruefbar, ob eine Bereitstellung wirklich den neuen Code
   ausliefert: Apps Script laesst die alte Version sonst still weiterlaufen. */
var VERSION = 'v2-mailstatus';

/* Adresse, die bei jedem neuen Eintrag eine kurze Notiz bekommt. Leer lassen
   schaltet die Benachrichtigung ab, die Tabelle wird trotzdem gefuellt. */
var NOTIFY = 'swordistudios@gmail.com';

/* Nur Anfragen von diesen Seiten werden angenommen. Ein fremdes Formular, das
   auf dieselbe URL postet, laeuft damit ins Leere. Das ist kein Schutz gegen
   einen entschlossenen Angreifer (die URL ist oeffentlich), aber es haelt
   versehentliche und billige Fremdnutzung heraus. */
var ALLOWED_ORIGINS = [
  'https://kortscore.com',
  'https://www.kortscore.com'
];

/* ── Eintrag annehmen ───────────────────────────────────────────────────────
   Das Formular schickt einen POST als form-urlencoded. Bewusst nicht als
   JSON: fuer JSON verlangt der Browser einen Preflight, und Apps Script
   beantwortet den nicht. So bleibt die Anfrage "einfach" im Sinne von CORS
   und geht ohne Umweg durch.
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
         das Formular verraten, wer schon eingetragen ist. */
      if (!hasEmail(sheet, email)) {
        var mailStatus = notify(email);
        sheet.appendRow([
          new Date(),
          email,
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
    service: 'kortscore-ios-interest',
    version: VERSION,
    /* Zeigt, ob die laufende Bereitstellung das Recht zum Mailversand hat.
       Wirft der Aufruf, fehlt die Autorisierung. */
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
   Eine kurze Notiz pro neuer Adresse. Sie steht ausdruecklich in einem
   eigenen try/catch: ein Fehler beim Versand darf den Eintrag nicht
   umstossen, der steht zu diesem Zeitpunkt schon in der Tabelle. Lieber eine
   verpasste Mail als eine verlorene Adresse.

   Das Kontingent von Apps Script liegt bei rund 100 Mails pro Tag fuer
   Gratis-Konten. Wird es ueberschritten, wirft send() und wir landen im
   catch, ohne dass der Nutzer davon etwas merkt.
   ───────────────────────────────────────────────────────────────────────── */
function notify(email) {
  if (!NOTIFY) { return 'aus'; }
  try {
    MailApp.sendEmail({
      to: NOTIFY,
      subject: 'Neuer Kortscore iOS Interessent',
      body: email + ' hat sich in die Interessenten Liste eingetragen'
    });
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
   fragt Google nach der Berechtigung zum Mailversand: genau die fehlt, wenn
   Eintraege ankommen, aber keine Benachrichtigung.

   Das Ergebnis steht im Ausfuehrungsprotokoll. Anders als notify() faengt
   diese Funktion nichts ab, ein Fehler soll hier sichtbar werden.
   ───────────────────────────────────────────────────────────────────────── */
function testeBenachrichtigung() {
  console.log('Empfaenger: ' + NOTIFY);
  console.log('Verbleibendes Tageskontingent: ' + MailApp.getRemainingDailyQuota());

  MailApp.sendEmail({
    to: NOTIFY,
    subject: 'Neuer Kortscore iOS Interessent',
    body: 'selbsttest@example.com hat sich in die Interessenten Liste eingetragen'
  });

  console.log('Versand ausgeloest, ohne Fehler.');
}

/* ── Helfer ─────────────────────────────────────────────────────────────── */

function getSheet() {
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = doc.getSheetByName(SHEET_NAME);

  /* Beim allerersten Eintrag gibt es das Blatt eventuell noch nicht. */
  if (!sheet) {
    sheet = doc.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Zeitpunkt', 'E-Mail', 'Sprache', 'Quelle', 'Mail']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function hasEmail(sheet, email) {
  var last = sheet.getLastRow();
  if (last < 2) { return false; }

  var values = sheet.getRange(2, 2, last - 1, 1).getValues();
  var needle = email.toLowerCase();
  for (var i = 0; i < values.length; i++) {
    if (String(values[i][0]).trim().toLowerCase() === needle) { return true; }
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
