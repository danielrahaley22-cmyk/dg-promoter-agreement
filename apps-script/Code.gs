/**
 * DG Promoter Agreement – receives form submissions, adds a row to this sheet,
 * and emails the sheet owner a copy.
 *
 * Setup (once): Extensions > Apps Script, paste this file over everything,
 * Save, then Deploy > New deployment > Web app:
 *   Execute as: Me
 *   Who has access: Anyone
 * Copy the Web app URL (ends in /exec) into SCRIPT_URL in index.html.
 */

var SHEET_NAME = 'Sheet1';
// Leave blank to email the account that deployed the script.
var NOTIFY_EMAIL = '';

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var data = JSON.parse(e.postData.contents || '{}');
    var clean = function (v) {
      v = String(v == null ? '' : v).trim().slice(0, 200);
      // Stop anything being treated as a formula in the sheet.
      return /^[=+\-]/.test(v) ? "'" + v : v;
    };
    var row = [
      new Date(),
      clean(data.name),
      clean(data.instagram),
      clean(data.city),
      clean(data.code),
      clean(data.agreed),
      clean(data.version)
    ];
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
    sheet.appendRow(row);

    var to = NOTIFY_EMAIL || Session.getEffectiveUser().getEmail();
    if (to) {
      MailApp.sendEmail({
        to: to,
        subject: 'New promoter agreement: ' + row[1] + ' (' + row[2] + ')',
        body:
          'A promoter just signed the DG Promoter Agreement.\n\n' +
          'Name: ' + row[1] + '\n' +
          'Instagram: ' + row[2] + '\n' +
          'City: ' + row[3] + '\n' +
          'Promo code: ' + row[4] + '\n' +
          'Agreed: ' + row[5] + '\n\n' +
          'All agreements: ' + ss.getUrl()
      });
    }
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService.createTextOutput('DG Promoter Agreement endpoint is running.');
}
