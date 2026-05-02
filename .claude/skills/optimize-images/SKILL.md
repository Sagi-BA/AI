---
name: optimize-images
description: Use this skill to convert PNG/JPG images in a directory to WebP, resize oversized images, and update HTML references. Trigger when the user says things like "תמיר תמונות ל־WebP", "אופטימיזציה של תמונות", "התמונות גדולות מדי", "the images are too big", "convert PNGs to WebP", or after the user adds new image assets to a landing page. Requires Pillow (`pip install Pillow`).
---

# optimize-images

ממיר PNG/JPG ל־WebP, מקטין תמונות חורגות מהרוחב המומלץ, ומעדכן הפניות HTML. הקבצים המקוריים נשארים — מחיקה ידנית לאחר אימות.

## דרישה מקדימה

- Python 3.8+
- Pillow: `pip install Pillow`

הסקריפט יבדוק לבד ויחזיר שגיאה ברורה אם Pillow לא מותקן.

## שלבי הפעלה

### שלב 1 — קבל מהמשתמש את הנתיב

שאל: **"איזו תיקייה לסרוק?"** (לדוגמה: `landing-pages/from-darkness-to-revival/images/`, `games/my-rabbit/fact-images/`, או נתיב ספציפי לתיקיית פרויקט שלם).

⚠️ **אל תריץ על כל הרפו ללא בקשה מפורשת.** הסקריפט דורש argument חובה — כך מונעים סריקה תאונתית של 124 ה־WebP קיימים (אגב הם לא יעובדו שוב כי הוא מטפל רק ב־PNG/JPG).

### שלב 2 — הרץ dry-run

```bash
python .claude/skills/optimize-images/optimize.py <path> --dry-run --json
```

קבל JSON עם:
- רשימת קבצים שיעובדו
- גודל מקור וגודל יעד צפוי לכל קובץ
- סך כל החיסכון
- רשימת קבצי HTML שמכילים הפניות

### שלב 3 — הצג למשתמש

הצג סיכום קצר:
- כמה קבצים יומרו
- חיסכון צפוי (X MB → Y MB, Z%)
- כמה קובצי HTML יושפעו

שאל: **"להמשיך?"**

### שלב 4 — בצע המרה (ללא עדכון HTML)

```bash
python .claude/skills/optimize-images/optimize.py <path>
```

יצור קובצי `.webp` ליד המקוריים. **לא נוגע ב־HTML.** מקבל בחזרה את רשימת ההפניות שצריכות עדכון.

### שלב 5 — הצג את ה־HTML diff

לכל קובץ HTML שמושפע, הצג למשתמש:
- שם הקובץ
- מספר ההפניות
- אילו תמונות יוחלפו (`foo.png → foo.webp`)

שאל: **"להחיל את העדכון ב־HTML?"**

### שלב 6 — החל את העדכון

```bash
python .claude/skills/optimize-images/optimize.py <path> --apply-html
```

זה ירוץ שוב במצב מלא (יידלג על קובצי WebP שכבר קיימים) ויעדכן את ה־HTML.

### שלב 7 — סיכום סופי

הצג למשתמש:
- כמה קבצים הומרו
- כמה MB נחסכו
- כמה קובצי HTML עודכנו
- **תזכורת חשובה:** הקבצים המקוריים (PNG/JPG) נשארו בדיסק. המשתמש יבחן את הדפים ב־browser ואז ימחק ידנית.

## פרמטרים מתקדמים

הסקריפט תומך ב:
- `--quality N` (default 85) — איכות WebP
- `--max-width N` (default 1600) — רוחב מקסימלי לתמונות תוכן
- `--og-max-width N` (default 1200) — רוחב מקסימלי לתמונות OG (זוהות לפי שם הקובץ — מכיל `og`)
- `--repo-root PATH` (default cwd) — שורש הרפו לסריקת HTML
- `--json` — פלט מובנה לעיבוד מכונה
- `--dry-run` — בלי לכתוב כלום

אם המשתמש מבקש איכות שונה או רוחב שונה — השתמש בפרמטרים אלה.

## הערות חשובות

- **אם קובץ `.webp` כבר קיים ליד `.png`/`.jpg` — הסקריפט מדלג עליו** (לא דורס). אם המשתמש רוצה לכפות המרה מחדש — שיש למחוק את ה־WebP הישן קודם.
- **אם אתה רואה שהחיסכון קטן** (פחות מ־30%) — הקובץ כבר מאוד דחוס. אולי כדאי להציע quality נמוך יותר (75) לקבלת חיסכון נוסף.
- **OG images ייחודיים** — תמיד 1200px (לא 1600), כי GitHub/Twitter/Facebook מצפים לפורמט הזה.
- **אל תבצע commit/push אוטומטית.** המשתמש בודק לפני.

## שילוב עם הזיכרון (עתידי)

אחרי שה־SKILL מאומת ויציב, נוסיף feedback memory rule שיגרום ל־Claude להציע אוטומטית להריץ `/optimize-images` כשהמשתמש מוסיף תמונות חדשות לדף נחיתה (לפני commit).
