---
name: new-reichman-summary
description: Use this skill to create a new "Reichman University workshop summary" page in the c:\projects\AI repo. The Reichman summaries are nearly-identical clones — same agenda, same tools section, same WhatsApp group — with only the audience/ministry name and a per-workshop Google Doc URL changing. Trigger when the user says things like "סיכום סדנה לרייכמן ל...", "תוסיף סיכום של הסדנה ב...משרד...", "create a Reichman workshop summary for...". DO NOT use for non-Reichman summaries (Ariel University, Zefat College, ai-for-public-sector etc) — those are bespoke and should be hand-copied from `meeting-summary/ariel-university.html` per CLAUDE.md.
---

# new-reichman-summary

מייצר דף סיכום סדנת רייכמן חדש לפי התבנית הקנונית של [meeting-summary/reichman/workshop-for-ministry_of_energy.html](meeting-summary/reichman/workshop-for-ministry_of_energy.html). כל הסדנאות של רייכמן משתמשות באותו תוכן בדיוק (אג'נדה, כלים, קבוצת WhatsApp) — רק שם המשרד/הקהל וקישור ה־Google Doc משתנים.

## שלבי הביצוע

### שלב 1 — איסוף קלט מהמשתמש

שאל את המשתמש את 5 השאלות הבאות לפני שאתה מתחיל:

1. **שם הקהל / המשרד בעברית** — למשל: `משרד האנרגיה והתשתיות`, `מגזר הציבורי`, `רשות המיסים`. **חשוב:** אל תכלול את ה־"ל" המקדימה — התבנית מוסיפה אותה אוטומטית ("בינה מלאכותית ל__AUDIENCE__"). אם הקהל הוא "רשות המיסים" אז התוצאה תהיה "בינה מלאכותית לרשות המיסים".
2. **Slug** — שם הקובץ (lowercase-with-dashes או underscore, באנגלית). למשל: `workshop-for-ministry_of_energy`, `tax_authority`, `workshop-for-learning-managers-organizations-and-human-resources`.
3. **קישור Google Doc** — ה־URL המלא של המסמך עם הערות הסדנה הספציפית (כל סדנה מקבלת מסמך משלה). ברירת מחדל אם המשתמש עדיין לא יצר: השאר את הקישור של energy ואמור לו להחליף ידנית אחר־כך.
4. **כותרת לגלריה ב־`index.html`** — איך הפרויקט יופיע ב־`index.html` (קטגוריה `workshops`). למשל: "משרד האנרגיה והתשתיות — סדנת AI" או "אוניברסיטת רייכמן — רשות המיסים".
5. **תיאור לגלריה** — תיאור 1–2 משפטים. הצע ברירת מחדל: "סיכום סדנה מעשית עבור __AUDIENCE__. שילוב בינה מלאכותית בעבודה היומיומית של ארגון."
6. **תמונת thumbnail לגלריה** — נתיב יחסי. ברירת מחדל מומלצת: `meeting-summary/reichman/<slug>.webp` (המשתמש יצטרך ליצור את התמונה בנפרד; אם אין עדיין, השתמש ב־`meeting-summary/reichman/workshop-for-ministry_of_energy.webp` כ־fallback זמני).

### שלב 2 — צור את הקובץ

1. קרא את `template.html` (באותה תיקייה כמו ה־SKILL הזה).
2. בצע replace על ה־placeholders הבאים:

| Placeholder | מה להזריק | מספר מופעים |
|---|---|---|
| `__SLUG__` | ה־slug מהמשתמש | 2 (header comment) |
| `__AUDIENCE__` | שם הקהל בעברית | 2 (title + hero highlight) |
| `__GOOGLE_DOC_URL__` | URL ה־Google Doc | 1 (CTA button) |

3. כתוב את הקובץ ל־`meeting-summary/reichman/<slug>.html`.

**אזהרה:** אם הקובץ כבר קיים (slug תפוס) — אל תכתוב מעליו. שאל את המשתמש אם הוא רוצה לבחור slug אחר.

### שלב 3 — הוסף ל־`index.html`

הוסף אובייקט חדש לקטגוריית `workshops` ב־PROJECTS array של [index.html](index.html). שמור על הסדר — הוסף ליד שאר הסדנאות של רייכמן (חפש את שאר הקבצים שמתחילים ב־`meeting-summary/reichman/`):

```javascript
{
    title: '<גליארה_TITLE>',
    desc: '<גלריה_DESC>',
    href: 'meeting-summary/reichman/<SLUG>.html',
    img: '<THUMB_IMG>',
    category: 'workshops'
},
```

### שלב 4 — הצג למשתמש

1. נתיב הקובץ שנוצר
2. URL מקומי לבדיקה: `http://127.0.0.1:8080/meeting-summary/reichman/<slug>.html`
3. URL פרודקשן: `https://sagi-ba.github.io/AI/meeting-summary/reichman/<slug>.html`
4. אישור שנוסף ל־`index.html`
5. הזכר: צריך ליצור את התמונה ב־`meeting-summary/reichman/<slug>.webp` (אם המשתמש בחר נתיב חדש)

**אל תבצע commit / push אוטומטית.** המשתמש יבדוק ויאשר ידנית.

## הערות חשובות

- **התבנית סטטית** — אג'נדת הסדנה, רשימת הכלים, כלי Vibe Coding, ולינק ה־WhatsApp זהים בכל קובצי רייכמן. אם תוכן הסדנה השתנה (כלי חדש נוסף, סקציה הוסרה) — זה לא תיקון נקודתי לקובץ אחד אלא **עדכון התבנית** ב־`.claude/skills/new-reichman-summary/template.html`.
- **לסיכומי לא־רייכמן** — השתמש בהפניה הידנית מ־[CLAUDE.md](CLAUDE.md) ל־`meeting-summary/ariel-university.html`. הסקיל הזה לא מתאים לסדנאות באוניברסיטאות אחרות.
- **GA כלול אוטומטית** — התבנית כבר מכילה את הסניפט (G-XSH19K5LBZ).
