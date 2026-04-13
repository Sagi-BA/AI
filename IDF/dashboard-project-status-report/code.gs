const DEV_API_KEY = "SagiShlomiSecret2026"; // תמציא סיסמה חזקה משלך
const ALLOWED_USERS = ['Silverstyle10@gmail.com', 'shlomi.a82@gmail.com', 'sagi.baron76@gmail.com', 'gyhbrwn@gmail.com'];

function doGet(e) {
  const userEmail = Session.getActiveUser().getEmail();
  const providedKey = e.parameter.key;

  // בדיקת הרשאה: או שהמפתח נכון (לפיתוח מקומי) או שהמייל מורשה (לנטאלי)
  if (providedKey !== DEV_API_KEY && ALLOWED_USERS.indexOf(userEmail) === -1) {
    return ContentService.createTextOutput("Access Denied").setMimeType(ContentService.MimeType.TEXT);
  }

  // לוגיקת החזרת הנתונים (כמו קודם)
  if (e.parameter.action === 'getData') {
    const data = getTasksData();
    return ContentService.createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return HtmlService.createTemplateFromFile('Dashboard').evaluate();
}

function getTasksData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheets()[1]; // הגיליון הראשון
  const range = sheet.getDataRange();
  const data = range.getValues();
  const richTextValues = range.getRichTextValues();
  const headers = data[0];

  const result = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const richRow = richTextValues[i];
    const obj = {};

    headers.forEach((header, j) => {
      let val = row[j];

      // טיפול בתאריכים שגוגל שולח כאובייקטים
      if (val instanceof Date) {
        val = Utilities.formatDate(val, "GMT+3", "dd/MM/yyyy");
      }

      // חילוץ היפר-לינקים מוטמעים בתא (גם תא-לינק שלם וגם Rich Text רץ)
      const richCell = richRow[j];
      const urls = extractUrlsFromRichText(richCell);

      if (urls.length > 0) {
        // מוסיפים את הלינקים לטקסט כך שה-linkify בצד ה-HTML יהפוך אותם ללחיצים
        const urlsText = urls.join(' ');
        val = val ? (val + ' ' + urlsText) : urlsText;
      }

      obj[header] = val;
    });

    result.push(obj);
  }

  return result;
}

function extractUrlsFromRichText(richText) {
  const urls = [];
  if (!richText) return urls;

  // מקרה 1: הלינק מכסה את כל התא
  const cellUrl = richText.getLinkUrl();
  if (cellUrl) {
    urls.push(cellUrl);
    return urls;
  }

  // מקרה 2: לינקים ברצים (runs) - למשל מילה אחת בתוך פסקה עם לינק
  const runs = richText.getRuns ? richText.getRuns() : [];
  runs.forEach(run => {
    const runUrl = run.getLinkUrl();
    if (runUrl && urls.indexOf(runUrl) === -1) {
      urls.push(runUrl);
    }
  });

  return urls;
}