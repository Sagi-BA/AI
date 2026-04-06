window.CALC_DATA = {
  "meta": {
    "title": "מחשבון מילואים בלי ניחושים",
    "subtitle": "בדיקה פשוטה ומהירה לגילוי ההטבות המגיעות לך. תוך פחות מדקה תוכלו לוודא 100% מימוש עם 0% ניחושים.",
    "lastUpdated": "05/04/2026",
    "disclaimer": "מחשבון זה נבנה על בסיס מידע שפורסם על ידי קרן הסיוע, מוקד מילואים 360 ומקורות רשמיים נוספים. ייתכנו שינויים, עדכונים או הסרות בזכויות מצד הגורמים הרשמיים, וליוצרי המחשבון אין אחריות על נכונות, עדכניות או שלמות המידע המוצג.",
    "credits": "כל הזכויות שמורות - יוצרי המחשבון"
  },
  "form": {
    "steps": [
      {
        "id": "service",
        "title": "פרטי השירות הבסיסיים",
        "subtitle": "נתחיל בפרטים הבסיסיים על השירות שלך\nהמסך החדש מתבסס על מדרגי פעילות",
        "icon": "shield"
      },
      {
        "id": "personal",
        "title": "מעמד אישי ומשפחתי",
        "subtitle": "פרטים על המצב האישי והמשפחתי שלך ופרטי לימודים",
        "icon": "heart"
      }
    ],
    "questions": [
      {
        "id": "outlineSelection",
        "step": "service",
        "question": "באיזה מתווה תרצה לחשב?",
        "type": "choice",
        "icon": "gear",
        "options": [
          "מתווה 2026",
          "מתווה 2025"
        ],
        "default": "מתווה 2026"
      },
      {
        "id": "activityLevel",
        "step": "service",
        "question": "לאיזה מדרג פעילות אתה משוייך?",
        "type": "choice",
        "icon": "shield",
        "helper": "בחר את מדרג הפעילות שלך",
        "helpButton": "איזה מדרג אני?",
        "helpContent": "מדרג א+ - גדודים לוחמים ומקביליהם\nמדרג א׳ - חטיבות ומקבילותיהן\nמדרג ב׳ - אוגדות ומקבילותיהן\nמדרג ג׳ - הגמ״ר\nמדרג ד׳ - יחידות הדרכה ואבטחה\nמדרג ה׳ - פיקודים ומטות\n\nהחלוקה למדרגים מובאת לצורך המחשה עקרונית בלבד,*\nואינה מהווה חלוקה מחייבת. לבירור המדרג ניתן לפנות\n.למוקד המילואים בטלפון 1111 שלוחה 4 ואז שלוחה 1",
        "options": [
          "א+",
          "א",
          "ב",
          "ג",
          "ד",
          "ה"
        ],
        "required": true
      },
      {
        "id": "commandRole",
        "step": "service",
        "question": "מה התפקיד שלך?",
        "type": "choice",
        "icon": "star",
        "options": [
          "ללא תפקיד פיקודי",
          "מג\"ד",
          "סמג\"ד",
          "מ\"פ",
          "סמ\"פ",
          "מ\"מ"
        ],
        "showIf": {
          "field": "activityLevel",
          "equalsAny": ["א+", "א"]
        }
      },
      {
        "id": "days2025",
        "step": "service",
        "question": "כמה ימי מילואים ביצעת מתחילת המלחמה ועד סוף 2025?",
        "type": "number",
        "icon": "calendar",
        "placeholder": "הכנס מספר"
      },
      {
        "id": "days2026",
        "step": "service",
        "question": "כמה ימי מילואים ביצעת בשנת 2026?",
        "type": "number",
        "icon": "calendar",
        "placeholder": "הכנס מספר"
      },
      {
        "id": "isParent",
        "step": "personal",
        "question": "האם אתה הורה לילד עד גיל 14?",
        "type": "boolean",
        "icon": "heart",
        "helper": "הורים לילדים צעירים זכאים למענקי משפחה"
      },
      {
        "id": "childrenCount",
        "step": "personal",
        "question": "כמה ילדים יש לך עד גיל 18?",
        "type": "choice",
        "icon": "people",
        "helper": "בחר את מספר הילדים עד גיל 18",
        "options": [
          "0",
          "1-3",
          "4 ומעלה"
        ]
      },
      {
        "id": "isStudent",
        "step": "personal",
        "question": "האם אתה סטודנט בשנת הלימודים תשפ\"ו?",
        "type": "boolean",
        "icon": "graduation",
        "helper": "סטודנטים עשויים להיות זכאים להחזרים וסיוע כלכלי"
      }
    ]
  },
  "rates": {
    "hotzaotIshiot": {
      "א+": 46,
      "א": 39,
      "ב": 31,
      "ג": 31,
      "ד": 18,
      "ה": 11
    },
    "mishpacha": {
      "א+": 83,
      "א": 71,
      "ב": 60,
      "ג": 60,
      "ד": 33,
      "ה": 21
    },
    "kalkalatBayit": {
      "א+": 1250,
      "א": 1065,
      "ב": 815,
      "ג": 500,
      "ד": 500,
      "ה": 400
    },
    "kalkalatBayitMugdal": {
      "א+": 133,
      "א": 113,
      "ב": 86,
      "ג": 60,
      "ד": 40,
      "ה": 30
    },
    "tagmulMeyuchad": {
      "א+": 3990,
      "א": 3400,
      "ב": 2700,
      "ג": 1200,
      "ד": 1200,
      "ה": 900
    },
    "maanakKalendari": {
      "א+": 145.2,
      "א": 125,
      "ב": 100,
      "ג": 45,
      "ד": 45,
      "ה": 35
    },
    "rishonLeMai": {
      "א+": 45,
      "א": 40,
      "ב": 30
    },
    "tagmulNosafMai": {
      "א+": 120,
      "א": 100,
      "ב": 80
    },
    "amitCoins": {
      "א+": 12000,
      "א": 10000,
      "ב": 8000,
      "ג": 4000,
      "ד": 4000,
      "ה": 3000
    },
    "mefakdim": {
      "א+": 2630,
      "א": 2200,
      "ב": 1700
    },
    "babysitterDaily": {
      "א+": 100,
      "א": 90,
      "ב": 80,
      "ג": 60,
      "ד": 60,
      "ה": 50
    },
    "babysitterMonthCap": {
      "א+": 2000,
      "א": 1800,
      "ב": 1500,
      "ג": 1000,
      "ד": 1000,
      "ה": 800
    },
    "babysitterYearCap": {
      "א+": 8000,
      "א": 7000,
      "ב": 6000,
      "ג": 4000,
      "ד": 4000,
      "ה": 3500
    },
    "movingCosts": {
      "א+": 2500,
      "א": 2200,
      "ב": 2000,
      "ג": 1500,
      "ד": 1500,
      "ה": 1200
    },
    "taxCreditValuePerPoint": 2904
  },
  "hitargnutTable": {
    "א+": [
      {
        "min": 1,
        "max": 9,
        "days": 2
      },
      {
        "min": 10,
        "max": 19,
        "days": 3
      },
      {
        "min": 20,
        "max": 29,
        "days": 4
      },
      {
        "min": 30,
        "max": 99,
        "days": 5
      },
      {
        "min": 100,
        "max": 999,
        "days": 7
      }
    ],
    "א": [
      {
        "min": 1,
        "max": 9,
        "days": 2
      },
      {
        "min": 10,
        "max": 19,
        "days": 3
      },
      {
        "min": 20,
        "max": 29,
        "days": 4
      },
      {
        "min": 30,
        "max": 99,
        "days": 5
      },
      {
        "min": 100,
        "max": 999,
        "days": 7
      }
    ],
    "ב": [
      {
        "min": 1,
        "max": 9,
        "days": 1
      },
      {
        "min": 10,
        "max": 19,
        "days": 2
      },
      {
        "min": 20,
        "max": 29,
        "days": 3
      },
      {
        "min": 30,
        "max": 99,
        "days": 4
      },
      {
        "min": 100,
        "max": 999,
        "days": 5
      }
    ],
    "ג": [
      {
        "min": 1,
        "max": 9,
        "days": 1
      },
      {
        "min": 10,
        "max": 19,
        "days": 1
      },
      {
        "min": 20,
        "max": 29,
        "days": 2
      },
      {
        "min": 30,
        "max": 99,
        "days": 3
      },
      {
        "min": 100,
        "max": 999,
        "days": 4
      }
    ],
    "ד": [
      {
        "min": 1,
        "max": 9,
        "days": 1
      },
      {
        "min": 10,
        "max": 19,
        "days": 1
      },
      {
        "min": 20,
        "max": 29,
        "days": 2
      },
      {
        "min": 30,
        "max": 99,
        "days": 3
      },
      {
        "min": 100,
        "max": 999,
        "days": 4
      }
    ],
    "ה": [
      {
        "min": 1,
        "max": 9,
        "days": 0
      },
      {
        "min": 10,
        "max": 19,
        "days": 1
      },
      {
        "min": 20,
        "max": 29,
        "days": 1
      },
      {
        "min": 30,
        "max": 99,
        "days": 2
      },
      {
        "min": 100,
        "max": 999,
        "days": 3
      }
    ]
  },
  "benefits": [
    {
      "id": "hotzaot_ishiot",
      "name": "מענק הוצאות אישיות מוגדל",
      "category": "ישירות לחשבון",
      "icon": "₪",
      "rateTable": "hotzaotIshiot",
      "calcType": "perDay_above_threshold",
      "threshold": {
        "totalDays": 40
      },
      "basedOn": "days2026",
      "receivingDate": "בכל 1 לחודש בהתאם לימים המבוצעים ותאריך גזירת שכר",
      "description": "מענק הוצאות אישיות מוגדל מחושב על בסיס כל יום, המענק מחולק בהתאם לכמות הימים המבוצעת בכל סוג של צו בראשון לחודש בהתאם לגזירות השכר.",
      "videoUrl": "https://www.instagram.com/p/DUgGr0IjX-2/"
    },
    {
      "id": "mishpacha_mugdal",
      "name": "מענק משפחה מוגדל",
      "category": "ישירות לחשבון",
      "icon": "family",
      "rateTable": "mishpacha",
      "calcType": "perDay_above_threshold",
      "threshold": {
        "totalDays": 40
      },
      "basedOn": "days2026",
      "receivingDate": "בכל 1 לחודש בהתאם לימים המבוצעים ותאריך גזירת שכר",
      "conditions": {
        "isParent": true
      },
      "description": "מענק משפחה מוגדל מחושב על בסיס כל יום, המענק מחולק בהתאם לכמות הימים המבוצעת בכל סוג של צו בראשון לחודש בהתאם לגזירות השכר.",
      "videoUrl": "https://www.instagram.com/p/DUgGr0IjX-2/"
    },
    {
      "id": "kalkala_bayit",
      "name": "מענק כלכלת הבית",
      "category": "ישירות לחשבון",
      "icon": "₪",
      "rateTable": "kalkalatBayit",
      "calcType": "fixed_by_level",
      "threshold": {
        "days2026Min": 20
      },
      "receivingDate": "1/9",
      "description": "מענק קבוע המבוסס על מינימום 20 ימי שירות ב-2026."
    },
    {
      "id": "kalkala_bayit_mugdal",
      "name": "מענק כלכלת הבית המוגדל",
      "category": "ישירות לחשבון",
      "icon": "₪",
      "rateTable": "kalkalatBayit",
      "calcType": "fixed_by_level",
      "threshold": {
        "totalDays": 45
      },
      "receivingDate": "1/9",
      "description": "מיועד למשרתי מילואים פעילים ומתוכנן לחלוקה ב-1/9/2026."
    },
    {
      "id": "tagmul_meyuchad",
      "name": "התגמול המיוחד",
      "category": "ישירות לחשבון",
      "icon": "₪",
      "rateTable": "tagmulMeyuchad",
      "calcType": "fixed_by_level",
      "threshold": {
        "days2026Min": 10
      },
      "receivingDate": "1/5/27",
      "description": "תגמול מיוחד שנתי המבוסס על שירות ב-2026."
    },
    {
      "id": "manak_kalendari",
      "name": "המענק הקלנדרי - מאי 2027",
      "category": "ישירות לחשבון",
      "icon": "₪",
      "rateTable": "maanakKalendari",
      "calcType": "perDay_all2026",
      "threshold": {
        "days2026Min": 10
      },
      "receivingDate": "1/5/27",
      "description": "מענק קלנדרי המחושב לפי כל ימי השירות ב-2026."
    },
    {
      "id": "rishon_lemai",
      "name": "מענק ראשון למאי - 2026",
      "category": "ישירות לחשבון",
      "icon": "₪",
      "rateTable": "rishonLeMai",
      "calcType": "perDay_all2026",
      "threshold": {
        "days2026Min": 1,
        "levelsOnly": [
          "א+",
          "א",
          "ב"
        ]
      },
      "receivingDate": "1/5/26",
      "description": "מענק ראשון למאי לבעלי מדרג א+, א, או ב."
    },
    {
      "id": "tagmul_nosaf_mai",
      "name": "תגמול נוסף ראשון למאי - 2026",
      "category": "ישירות לחשבון",
      "icon": "₪",
      "rateTable": "tagmulNosafMai",
      "calcType": "perDay_all2026",
      "threshold": {
        "days2026Min": 1,
        "levelsOnly": [
          "א+",
          "א",
          "ב"
        ]
      },
      "receivingDate": "1/5/26",
      "description": "תגמול נוסף למענק ראשון למאי."
    },
    {
      "id": "mefakdim",
      "name": "מענק למפקדים",
      "category": "ישירות לחשבון",
      "icon": "star",
      "rateTable": "mefakdim",
      "calcType": "fixed_by_level",
      "threshold": {
        "days2026Min": 1,
        "levelsOnly": [
          "א+",
          "א",
          "ב"
        ],
        "commandRoles": [
          "מג\"ד",
          "סמג\"ד",
          "מ\"פ",
          "סמ\"פ",
          "מ\"מ"
        ]
      },
      "receivingDate": "בכל 1 לחודש",
      "description": "מענק למפקדים בעלי תקן ומינוי מתאים, בעיקר ביחידות לוחמות."
    },
    {
      "id": "fighter_card",
      "name": "ארנק דיגיטלי פייטר (כרטיס FIGHTER)",
      "category": "הטבות למימוש",
      "icon": "₪",
      "calcType": "info_only",
      "displayAmount": "טעינה חודשית",
      "threshold": {
        "totalDaysMin": 20
      },
      "receivingDate": "1/1/2026 ואילך",
      "description": "ארנק דיגיטלי הניתן לשימוש ברשתות שונות, מטעם אגף משאבי אנוש. הטעינה מתבצעת מדי חודש."
    },
    {
      "id": "tax_credits",
      "name": "נקודות זיכוי במס",
      "category": "הטבות למימוש",
      "icon": "document",
      "calcType": "tax_credit",
      "threshold": {
        "days2026Min": 1
      },
      "receivingDate": "2027",
      "description": "ניתן להגיש טופס 101 מעודכן למעסיק או לפנות לרשות המסים."
    },
    {
      "id": "amit_program",
      "name": "תוכנית עמית",
      "category": "הטבות למימוש",
      "icon": "star",
      "rateTable": "amitCoins",
      "calcType": "coins_by_level",
      "threshold": {
        "totalDaysMin": 50
      },
      "description": "תוכנית הטבות למשרתי מילואים פעילים הכוללת מטבעות לרכישת מוצרים ושירותים."
    },
    {
      "id": "active_benefits",
      "name": "הטבות משרת מילואים פעיל",
      "category": "הטבות למימוש",
      "icon": "star",
      "calcType": "info_only",
      "displayAmount": "מגוון הטבות",
      "threshold": {
        "totalDaysMin": 20
      },
      "description": "הנחה בארנונה עד 5%, הנחה בחידוש דרכון, הנחה באגרת חידוש והוצאת רישיון נשק, הנחות מתכונין במקרקעין, הנחות לרואי חשבון באגרות שנתיות, כניסה חינם למוזיאונים, הנחה לנוטריונים, הנחה ברכישת כרטיס מסמן לשמאי מקרקעין (15% חניות, 25% כניסה), הנחה באגרת רישיון טיס."
    },
    {
      "id": "moving_costs",
      "name": "השתתפות בעלויות מעבר דירה",
      "category": "הטבות למימוש",
      "icon": "home",
      "rateTable": "movingCosts",
      "calcType": "fixed_by_level",
      "threshold": {
        "totalDaysMin": 45
      },
      "receivingDate": "כחודש לאחר הגשה לקרן הסיוע",
      "description": "השתתפות בעלויות מעבר דירה בהתאם למדרג."
    },
    {
      "id": "vacation_voucher",
      "name": "שובר חופשה",
      "category": "הטבות למימוש",
      "icon": "vacation",
      "calcType": "info_only",
      "displayAmount": "שובר נופש",
      "threshold": {
        "totalDaysMin": 20
      },
      "receivingDate": "בהתאם למדיניות 2026",
      "description": "שובר חופשה/נופש למשרתי מילואים פעילים."
    },
    {
      "id": "babysitter",
      "name": "החזר בייביסיטר",
      "category": "הטבות למימוש",
      "icon": "heart",
      "calcType": "babysitter",
      "threshold": {
        "totalDaysMin": 20
      },
      "conditions": {
        "isParent": true
      },
      "receivingDate": "כחודש לאחר הגשה לקרן הסיוע",
      "description": "החזר עלויות בייביסיטר למשרתי מילואים שהם הורים."
    },
    {
      "id": "camp_funding",
      "name": "השתתפות במימון קייטנות",
      "category": "הטבות למימוש",
      "icon": "heart",
      "calcType": "camp_funding",
      "campBaseAmount": 500,
      "campExtraPerKid": 250,
      "campMaxAmount": 2000,
      "threshold": {
        "days2026Min": 5
      },
      "conditions": {
        "isParent": true,
        "hasChildren": true
      },
      "receivingDate": "כחודש לאחר הגשה לקרן הסיוע",
      "description": "השתתפות במימון קייטנות לילדים בהתאם למדרג ומספר ילדים."
    },
    {
      "id": "mental_health",
      "name": "השתתפות בעלויות טיפולים נפשיים",
      "category": "הטבות למימוש",
      "icon": "heart",
      "calcType": "info_only",
      "displayAmount": "מכוסה",
      "threshold": {
        "days2026Min": 1
      },
      "description": "השתתפות בעלויות טיפולים נפשיים למשרתי מילואים ובני/בנות זוגם."
    },
    {
      "id": "arnona",
      "name": "הנחה בארנונה",
      "category": "הטבות למימוש",
      "icon": "home",
      "calcType": "info_only",
      "displayAmount": "עד 5% הנחה",
      "threshold": {
        "totalDaysMin": 20
      },
      "receivingDate": "בתיאום מול הרשות/המועצה",
      "description": "הנחה של עד 5% בארנונה למשרתי מילואים פעילים."
    },
    {
      "id": "arnona_mugdal",
      "name": "הנחה מוגדלת בארנונה",
      "category": "הטבות למימוש",
      "icon": "home",
      "calcType": "info_only",
      "displayAmount": "עד 15% הנחה",
      "threshold": {
        "totalDaysMin": 60
      },
      "receivingDate": "בתיאום מול הרשות/המועצה",
      "description": "הנחה מוגדלת של עד 15% בארנונה."
    },
    {
      "id": "car_license",
      "name": "הנחה באגרת רישיון רכב (טסט)",
      "category": "הטבות למימוש",
      "icon": "gear",
      "calcType": "fixed_amount",
      "fixedAmount": 193,
      "threshold": {
        "totalDaysMin": 20
      },
      "receivingDate": "אוטומטי",
      "description": "הנחה של 15% עבור משרתי מילואים פעילים."
    },
    {
      "id": "dental",
      "name": "רפואת שיניים",
      "category": "הטבות למימוש",
      "icon": "heart",
      "calcType": "info_only",
      "displayAmount": "טיפולים מורחבים",
      "threshold": {
        "totalDaysMin": 20
      },
      "description": "טיפולים משמרים, עקירות, צילומים, טיפולי שורש ועוד - בתיאום מול *6690 שלוחה 1."
    },
    {
      "id": "kvish6",
      "name": "החזר כביש 6",
      "category": "הטבות למימוש",
      "icon": "gear",
      "calcType": "info_only",
      "displayAmount": "עד 300 ₪ בחודש",
      "threshold": {
        "totalDaysMin": 20
      },
      "description": "החזר עד 300 ש\"ח לחודש על נסיעות בכביש 6 במהלך שירות מילואים."
    },
    {
      "id": "pet_pension",
      "name": "החזר פנסיון בעלי חיים",
      "category": "הטבות למימוש",
      "icon": "gear",
      "calcType": "info_only",
      "displayAmount": "עד 1,000 ₪",
      "threshold": {
        "totalDaysMin": 20,
        "days2026Min": 5
      },
      "receivingDate": "כחודש לאחר הגשה לקרן הסיוע",
      "description": "החזר עלויות פנסיון בעלי חיים בזמן שירות מילואים."
    },
    {
      "id": "alternative_medicine",
      "name": "כל סוגי הרפואה המשלימה והעיסויים בפריסה ארצית רחבה",
      "category": "הטבות למימוש",
      "icon": "heart",
      "calcType": "treatments_by_days2025",
      "treatmentsDivisor": 3,
      "treatmentsMax": 22,
      "threshold": {
        "days2025Min": 60
      },
      "highlight": true,
      "description": "טיפולים מטפלים מוסמכים - מערך לוחם."
    },
    {
      "id": "hitargnut",
      "name": "ימי התארגנות",
      "category": "הטבות למימוש",
      "icon": "calendar",
      "calcType": "hitargnut",
      "threshold": {
        "days2026Min": 1
      },
      "description": "ימי התארגנות הם ימים שאתם לא מבצעים פעילות מבצעית או שאתם ביחידה ולמעשה הצו נשאר פתוח. הצו נחשב לכל המענקים, התגמולים והשכר בהתאם. ימי ההתארגנות הם רק למשימות מבצעיות/ תעסוקה מבצעית בצו 8 וליחידות סגורות בלבד."
    },
    {
      "id": "tuition",
      "name": "סיוע בשכר לימוד - מלגה",
      "category": "הטבות למימוש",
      "icon": "graduation",
      "calcType": "info_only",
      "displayAmount": "עד 3,000 ₪",
      "threshold": {
        "days2026Min": 10
      },
      "conditions": {
        "isStudent": true
      },
      "description": "סיוע בגין שיעורי עזר ו/או החזר על ביטול/חזרה על קורס, ללימודי מכינות ולימודי השלמה בלבד."
    },
    {
      "id": "private_lessons",
      "name": "החזר שיעורים פרטיים/קורסים חוזרים",
      "category": "הטבות למימוש",
      "icon": "graduation",
      "calcType": "info_only",
      "displayAmount": "עד 3,000 ₪",
      "threshold": {
        "days2026Min": 10
      },
      "conditions": {
        "isStudent": true
      },
      "description": "סיוע בגין שיעורי עזר ו/או החזר על ביטול/חזרה על קורס."
    },
    {
      "id": "behatzda_club",
      "name": "זכאות למועדון בהצדעה",
      "category": "הטבות למימוש",
      "icon": "star",
      "calcType": "info_only",
      "displayAmount": "הטבות מגוונות",
      "threshold": {
        "totalDaysMin": 20
      },
      "description": "מועדון בהצדעה הינו מועדון צרכנות מלווה בכרטיס אשראי הנותן הטבות קוד קופון, ארנקים דיגיטליים, טעינות דיגיטליות ועוד."
    },
    {
      "id": "shavim_yoter",
      "name": "זכאות להצטרפות למועדון שווים יותר",
      "category": "הטבות למימוש",
      "icon": "star",
      "calcType": "info_only",
      "displayAmount": "הצטרפות למועדון",
      "threshold": {},
      "highlight": true,
      "highlightColor": "blue",
      "description": "הקהילה הוקמה עבור משרתי מילואים להנגשת הטבות, זכויות והזדמנויות במגוון תחומים. תנאים לקבלה: לכל המערכים, ללא תלות בכמות ימי מילואים."
    },
    {
      "id": "terror_law",
      "name": "חוק נפגעי פעולות טרור ופצועי מלחמה",
      "category": "הטבות למימוש",
      "icon": "law",
      "calcType": "info_only",
      "displayAmount": "עד 5,000,000 ₪",
      "threshold": {},
      "highlight": true,
      "highlightColor": "red",
      "description": "על פי חוק נפגעי טרור התשפ\"ד 2024 חייל/אזרח שנפגע בפיגוע טרור או במהלך פעילות מבצעית וקיבל נכות צמיתה זכאי לפיצוי של 5 מיליון שקלים מהרשות הפלסטינית."
    },
    {
      "id": "spouse_absence",
      "name": "ימי היעדרות לבן/בת זוג",
      "category": "הטבות למימוש",
      "icon": "heart",
      "calcType": "info_only",
      "displayAmount": "ימי היעדרות",
      "threshold": {
        "days2026Min": 1
      },
      "description": "בן/בת הזוג של משרת/ת מילואים זכאי/ת לימי היעדרות ממקום העבודה."
    },
    {
      "id": "maternity_extension",
      "name": "מענק הארכת חופשת לידה",
      "category": "הטבות למימוש",
      "icon": "heart",
      "calcType": "info_only",
      "displayAmount": "בהתאם לזכאות",
      "threshold": {
        "days2026Min": 10
      },
      "conditions": {
        "isParent": true
      },
      "description": "מענק המיועד להורים שנמצאים בחופשת לידה במהלך שירות מילואים."
    },
    {
      "id": "haver_club",
      "name": "מועדון חבר",
      "category": "הטבות למימוש",
      "icon": "star",
      "calcType": "info_only",
      "displayAmount": "הטבות מגוונות",
      "threshold": {
        "totalDaysMin": 20
      },
      "description": "מועדון חבר של משרתי הקבע - פתוח גם למשרתי מילואים פעילים."
    },
    {
      "id": "commander_vacation",
      "name": "נופש מפקדים",
      "category": "הטבות למימוש",
      "icon": "vacation",
      "calcType": "info_only",
      "displayAmount": "נופש מסובסד",
      "threshold": {
        "commandRoles": [
          "מג\"ד",
          "סמג\"ד",
          "מ\"פ",
          "סמ\"פ",
          "מ\"מ"
        ]
      },
      "description": "נופש מסובסד למפקדים בעלי תפקיד פיקודי."
    },
    {
      "id": "sport_points",
      "name": "נקודות לקניית ציוד ואביזרי ספורט",
      "category": "הטבות למימוש",
      "icon": "star",
      "calcType": "info_only",
      "displayAmount": "נקודות ספורט",
      "threshold": {
        "totalDaysMin": 20
      },
      "description": "נקודות לקניית ציוד ואביזרי ספורט למשרתי מילואים פעילים."
    },
    {
      "id": "help_lessons",
      "name": "סיוע בשיעורי עזר",
      "category": "הטבות למימוש",
      "icon": "graduation",
      "calcType": "info_only",
      "displayAmount": "סיוע לימודי",
      "threshold": {
        "totalDaysMin": 20
      },
      "conditions": {
        "isStudent": true
      },
      "description": "סיוע בשיעורי עזר לסטודנטים משרתי מילואים."
    }
  ]
};
