---
name: new-landing-page
description: Use this skill to create a new Hebrew RTL landing page in the c:\projects\AI repo following the project's standard design system (GA, OG meta, Heebo/Alef fonts, WhatsApp float, contact section, reveal-on-scroll, prefers-reduced-motion). Trigger when the user says things like "תוסיף דף נחיתה חדש ל...", "צור דף נחיתה ל...", "create a new landing page for...", or "I need a new landing page about X". DO NOT use this skill for price-quote pages, meeting summaries, or campaign-internal dashboards.
---

# new-landing-page

מייצר דף נחיתה עברי RTL חדש לפי הסטנדרט של הרפו. הדף החדש יישב ב־`landing-pages/<slug>/index.html` ויתווסף אוטומטית לגלריית הפורטפוליו ב־`index.html` (אלא אם הוא דף עם מחירים).

## שלבי הביצוע

### שלב 1 — איסוף קלט מהמשתמש

שאל את המשתמש את כל השאלות הבאות לפני שאתה מתחיל לכתוב קוד. השתמש ב־AskUserQuestion עם options ברורים, או שאל בטקסט אם ה־AskUserQuestion לא מתאים. השאלות:

1. **כותרת ראשית (H1)** — מה הכותרת של הדף? (למשל: "איך הופכים דאטה מסובך לשיחה פשוטה?")
2. **Slug** — מה השם של התיקייה? (lowercase-with-dashes, באנגלית. למשל: `data-to-conversation`)
3. **תיאור קצר** — תיאור 1–2 משפטים ל־meta description ול־OG (משמש גם כ־subtitle בהירו).
4. **צבע מותג ראשי** — אילו אופציות:
   - `purple` (סגול — ברירת מחדל, כמו ai-agents)
   - `cyan` (תכלת)
   - `green` (ירוק)
   - `orange` (כתום)
   - `gold` (זהב)
5. **תמונת hero** — נתיב יחסי לתמונה (למשל: `images/hero.webp`). אם אין עדיין — השאר ריק והשתמש ב־fallback.
6. **קטגוריה ב־`index.html`** — לאיזו קטגוריה בגלריה להוסיף את הדף:
   - `landing` (דפי נחיתה — ברירת מחדל)
   - `games` (משחקים & סימולציות)
   - `workshops` (סדנאות & הרצאות)
   - `campaigns` (קמפיינים & פרומפטים)
   - `none` (אל תוסיף לגלריה — למשל אם זה דף עם מחירים)
7. **תיאור ל־`index.html`** — תיאור 1–3 משפטים שיופיע בכרטיס בגלריה (יכול להיות זהה לתיאור הקצר משלב 3, או שונה).
8. **תמונת thumbnail לגלריה** — איזו תמונה תופיע בכרטיס הגלריה (יכולה להיות תמונת ה־hero, או אחרת).

### שלב 2 — צור את התיקייה והקבצים

1. צור את התיקייה: `landing-pages/<slug>/` עם תת־תיקייה `images/`.
2. קרא את `template.html` (באותה תיקייה כמו ה־SKILL הזה).
3. בצע replace על ה־placeholders הבאים בתבנית:

| Placeholder | מה להזריק |
|---|---|
| `__TITLE__` | הכותרת מהמשתמש |
| `__DESCRIPTION__` | התיאור הקצר מהמשתמש |
| `__SLUG__` | ה־slug מהמשתמש |
| `__HERO_IMAGE__` | נתיב התמונה (או `images/hero.webp` אם ריק) |
| `__ACCENT_PRIMARY__` | hex צבע ראשי לפי הבחירה (ראה טבלת צבעים למטה) |
| `__ACCENT_DEEP__` | hex צבע עמוק לפי הבחירה |
| `__ACCENT_SOFT__` | rgba רך לפי הבחירה |
| `__ACCENT_GLOW__` | rgba glow לפי הבחירה |
| `__OG_IMAGE_URL__` | URL מלא לתמונת OG (`https://sagi-ba.github.io/AI/landing-pages/<slug>/<hero_image>`) |
| `__CANONICAL_URL__` | `https://sagi-ba.github.io/AI/landing-pages/<slug>/` |
| `__WHATSAPP_MSG__` | טקסט URL-encoded להודעת WhatsApp (ראה דוגמה למטה) |

### טבלת צבעים

| בחירה | primary | deep | soft (rgba) | glow (rgba) |
|---|---|---|---|---|
| purple | `#8b5cf6` | `#6d28d9` | `rgba(139, 92, 246, 0.12)` | `rgba(139, 92, 246, 0.35)` |
| cyan | `#06b6d4` | `#0e7490` | `rgba(6, 182, 212, 0.12)` | `rgba(6, 182, 212, 0.35)` |
| green | `#10b981` | `#047857` | `rgba(16, 185, 129, 0.12)` | `rgba(16, 185, 129, 0.35)` |
| orange | `#f97316` | `#c2410c` | `rgba(249, 115, 22, 0.12)` | `rgba(249, 115, 22, 0.35)` |
| gold | `#eab308` | `#a16207` | `rgba(234, 179, 8, 0.12)` | `rgba(234, 179, 8, 0.35)` |

### דוגמת `__WHATSAPP_MSG__`

הודעה דיפולטיבית — קח את הכותרת של הדף והכנס לטמפלייט:
```
היי שגיא, ראיתי את הדף "<TITLE>" ואשמח לדבר
```
ואז URL-encode (נקודות חשובות: רווח → `%20`, גרשיים כפולים → `%22`).

מספר הטלפון: `972549995050`. אימייל: `sagi.baron76@gmail.com`.

### שלב 3 — הוסף את הדף ל־`index.html` PROJECTS array

אם המשתמש בחר קטגוריה (לא `none`):

1. קרא את `c:\projects\AI\index.html`.
2. מצא את ה־PROJECTS array.
3. הוסף אובייקט חדש בקטגוריה הנכונה (אחרי הפרויקטים האחרים באותה קטגוריה — שמור על הסדר לפי הקיים):
   ```javascript
   {
       title: '<TITLE>',
       desc: '<DESC לגלריה>',
       href: 'landing-pages/<SLUG>/index.html',
       img: '<THUMB_IMAGE>',
       category: '<CATEGORY>'
   },
   ```

אם המשתמש בחר `none` — דלג על השלב הזה והודע למשתמש שהדף לא נוסף לגלריה.

### שלב 4 — הצג את התוצאה

הצג למשתמש:
- נתיב הקובץ שנוצר
- URL מקומי לבדיקה: `http://127.0.0.1:8080/landing-pages/<slug>/`
- URL פרודקשן (אחרי push): `https://sagi-ba.github.io/AI/landing-pages/<slug>/`
- האם נוספה כניסה ב־`index.html` (וב־איזו קטגוריה)
- הזכר למשתמש: `npx http-server -p 8080` להרצה מקומית

**אל תבצע commit / push אוטומטית.** המשתמש יבדוק ויאשר ידנית.

## הערות

- אם הדף כולל מחירים / הצעות מחיר — בחר `none` בקטגוריה. דפים פרטיים אלה נשארים מחוץ לגלריה הציבורית (ראה הערה בראש `index.html`).
- ה־GA snippet (`G-XSH19K5LBZ`) כלול אוטומטית בתבנית. לא צריך להוסיף ידנית.
- ה־template.html מכיל 2–3 sections של דמו עם placeholder text. המשתמש ימלא את התוכן האמיתי בעריכה ידנית אחר־כך.
