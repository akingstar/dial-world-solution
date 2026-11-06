/**
 * Dial World Solution enquiry receiver.
 * Create a Google Sheet, then Extensions > Apps Script.
 * Paste this file, set SHEET_ID below, and deploy as a Web App.
 */
const SHEET_ID = "PASTE_YOUR_GOOGLE_SHEET_ID_HERE";
const TAB_NAME = "Enquiries";
const HEADERS = [
  "Timestamp", "Name", "Company", "Email", "Phone", "Country",
  "Currency", "Service", "Package", "Message", "Consent", "Website URL"
];

function doPost(e) {
  try {
    if (!SHEET_ID || SHEET_ID.indexOf("PASTE_") === 0) {
      throw new Error("Set SHEET_ID in Code.gs before deployment.");
    }
    const payload = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    // Basic server-side validation and spam honeypot.
    if (payload.website) return json_({ok: true});
    const name = clean_(payload.name, 100);
    const email = clean_(payload.email, 160);
    const country = clean_(payload.country, 80);
    const service = clean_(payload.service, 100);
    if (!name || !email || !country || !service || payload.consent !== "yes") {
      throw new Error("Required fields missing.");
    }
    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(TAB_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(TAB_NAME);
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
    } else if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
    }
    sheet.appendRow([
      new Date(),
      name,
      clean_(payload.company, 120),
      email,
      clean_(payload.phone, 30),
      country,
      clean_(payload.currency, 5),
      service,
      clean_(payload.package, 100),
      clean_(payload.message, 1500),
      "yes",
      clean_(payload.page, 500)
    ]);
    return json_({ok: true});
  } catch (err) {
    console.error(err);
    return json_({ok: false, error: String(err.message || err)});
  }
}

function doGet() {
  return json_({service: "Dial World Solution lead endpoint", status: "ready"});
}

function clean_(value, max) {
  return String(value || "").replace(/[\\u0000-\\u001F\\u007F]/g, " ").trim().slice(0, max);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}