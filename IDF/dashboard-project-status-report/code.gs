const DASHBOARD_PASSWORD = "bonbon123"; 

function doGet(e) {
  // אם הבקשה מגיעה מה-Localhost שלך (עם ה-API KEY הישן) - נאשר לו גישה ישירה
  const providedKey = e.parameter.key;
  const providedPwd = e.parameter.pwd; // סיסמה שתגיע מהדשבורד

  // לוגיקת החזרת הנתונים (עבור ה-fetch ב-VS Code או הקריאה מהדשבורד)
  if (e.parameter && e.parameter.action === 'getData') {
    // בודק אם המפתח נכון (עבורך) או אם הסיסמה נכונה (עבור נטאלי/שלומי)
    if (providedKey === DASHBOARD_PASSWORD || providedPwd === DASHBOARD_PASSWORD) {
        const data = getTasksData();
        return ContentService.createTextOutput(JSON.stringify(data))
          .setMimeType(ContentService.MimeType.JSON);
    } else {
        return ContentService.createTextOutput(JSON.stringify({error: "Wrong Password"}))
          .setMimeType(ContentService.MimeType.JSON);
    }
  }

  // הצגת הדף עצמו לכל מי שיש לו את הלינק
  return HtmlService.createTemplateFromFile('Dashboard')
      .evaluate()
      .setTitle('ניהול משימות - צוות תקשוב')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// שים לב: שינינו את getTasksData כך שלא תצטרך לקבל פרמטרים פנימיים, 
// הבדיקה נעשית בתוך ה-doGet או בקריאה הישירה

function getTasksData() {
  // ── Cache: חוסך את עלות ה-read מהגיליון עבור בקשות עוקבות ──
  const cache = CacheService.getScriptCache();
  const CACHE_KEY = 'tasks_data_v1';
  const cached = cache.get(CACHE_KEY);
  if (cached) {
    try { return JSON.parse(cached); } catch (e) { /* fallthrough */ }
  }

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
        // מוסיפים רק URLs שלא כבר מופיעים בטקסט (כדי למנוע כפילות כשהטקסט הוא בעצמו ה-URL)
        const existingText = val ? String(val) : '';
        const newUrls = urls.filter(u => existingText.indexOf(u) === -1);
        if (newUrls.length > 0) {
          const urlsText = newUrls.join(' ');
          val = existingText ? (existingText + ' ' + urlsText) : urlsText;
        }
      }

      obj[header] = val;
    });

    result.push(obj);
  }

  // שמירה ב-cache למשך 60 שניות - הבקשה הבאה תהיה כמעט מיידית
  try { cache.put(CACHE_KEY, JSON.stringify(result), 60); } catch (e) {}

  return result;
}

// פונקציה עזר ניתנת לקריאה ידנית מ-Apps Script (למשל אחרי עדכון ידני בגיליון)
function clearTasksCache() {
  CacheService.getScriptCache().remove('tasks_data_v1');
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