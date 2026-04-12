// Google Sheets Loader for MyDuty Calculator
// Fetches data from a published Google Sheet and converts it to CALC_DATA format.
// Falls back to the existing window.CALC_DATA from data.js if fetch fails.

(function () {
  // ===== CONFIGURATION =====
  // Replace with your Google Sheet ID after publishing it to the web
  var SHEET_ID = "12-MnWkEMc0Zn0onlLtrcRWvodH0mglcHoUI7X5BiAJ0";
  var FETCH_TIMEOUT = 5000; // ms

  var TAB_NAMES = ["meta", "steps", "questions", "rates", "hitargnutTable", "benefits", "faq"];

  function sheetCsvUrl(tabName) {
    return "https://docs.google.com/spreadsheets/d/" + SHEET_ID + "/gviz/tq?tqx=out:csv&headers=1&sheet=" + encodeURIComponent(tabName);
    // https://docs.google.com/spreadsheets/d/12-MnWkEMc0Zn0onlLtrcRWvodH0mglcHoUI7X5BiAJ0/
  }

  // ===== CSV PARSER =====
  // Handles quoted fields with commas, newlines, and escaped quotes
  function parseCSV(text) {
    var rows = [];
    var row = [];
    var field = "";
    var inQuotes = false;
    var i = 0;
    while (i < text.length) {
      var ch = text[i];
      if (inQuotes) {
        if (ch === '"') {
          if (i + 1 < text.length && text[i + 1] === '"') {
            field += '"';
            i += 2;
          } else {
            inQuotes = false;
            i++;
          }
        } else {
          field += ch;
          i++;
        }
      } else {
        if (ch === '"') {
          inQuotes = true;
          i++;
        } else if (ch === ",") {
          row.push(field);
          field = "";
          i++;
        } else if (ch === "\r") {
          i++;
        } else if (ch === "\n") {
          row.push(field);
          field = "";
          rows.push(row);
          row = [];
          i++;
        } else {
          field += ch;
          i++;
        }
      }
    }
    // Last field/row
    if (field || row.length > 0) {
      row.push(field);
      rows.push(row);
    }
    return rows;
  }

  function csvToObjects(text) {
    var rows = parseCSV(text.trim());
    if (rows.length < 2) return [];
    var headers = rows[0].map(function (h) { return h.trim(); });
    var result = [];
    for (var r = 1; r < rows.length; r++) {
      var obj = {};
      for (var c = 0; c < headers.length; c++) {
        if (headers[c]) obj[headers[c]] = (rows[r][c] || "").trim();
      }
      result.push(obj);
    }
    return result;
  }

  // ===== HELPERS =====
  function toNum(v) {
    if (v === "" || v === undefined || v === null) return null;
    var n = Number(v);
    return isNaN(n) ? null : n;
  }

  function toBool(v) {
    if (v === "" || v === undefined || v === null) return null;
    var s = String(v).toUpperCase().trim();
    if (s === "TRUE" || s === "1" || s === "כן") return true;
    if (s === "FALSE" || s === "0" || s === "לא") return false;
    return null;
  }

  function splitSemicolon(v) {
    if (!v || !v.trim()) return null;
    return v.split(";").map(function (s) { return s.trim(); }).filter(Boolean);
  }

  // ===== TRANSFORM FUNCTIONS =====

  function parseMeta(rows) {
    var meta = {};
    rows.forEach(function (r) {
      if (r.key) meta[r.key.trim()] = r.value || "";
    });
    return meta;
  }

  function parseSteps(rows) {
    return rows.map(function (r) {
      return {
        id: r.id,
        title: r.title || "",
        subtitle: (r.subtitle || "").replace(/\\n/g, "\n"),
        icon: r.icon || ""
      };
    });
  }

  function parseQuestions(rows) {
    return rows.map(function (r) {
      var q = {
        id: r.id,
        step: r.step,
        question: r.question || "",
        type: r.type || "choice",
        icon: r.icon || ""
      };
      if (r.helper) q.helper = r.helper;
      if (r.helpButton) q.helpButton = r.helpButton;
      if (r.helpContent) q.helpContent = (r.helpContent || "").replace(/\\n/g, "\n");
      if (r.options) q.options = splitSemicolon(r.options);
      if (r["default"]) q["default"] = r["default"];
      if (toBool(r.required) === true) q.required = true;
      if (r.placeholder) q.placeholder = r.placeholder;

      // showIf
      if (r.showIf_field) {
        q.showIf = { field: r.showIf_field };
        var eqAny = splitSemicolon(r.showIf_equalsAny);
        if (eqAny && eqAny.length === 1) {
          q.showIf.equals = eqAny[0];
        } else if (eqAny && eqAny.length > 1) {
          q.showIf.equalsAny = eqAny;
        }
      }

      return q;
    });
  }

  function parseRates(rows) {
    var rates = {};
    var levels = ["א+", "א", "ב", "ג", "ד", "ה"];
    rows.forEach(function (r) {
      var name = r.rateTable;
      if (!name) return;
      var type = (r.type || "perLevel").trim();

      if (type === "single") {
        var val = toNum(r["א+"]) || toNum(r["א"]);
        if (val !== null) rates[name] = val;
      } else {
        var table = {};
        levels.forEach(function (lvl) {
          var v = toNum(r[lvl]);
          if (v !== null) table[lvl] = v;
        });
        rates[name] = table;
      }
    });
    return rates;
  }

  function parseHitargnut(rows) {
    var table = {};
    rows.forEach(function (r) {
      var level = r.level;
      if (!level) return;
      if (!table[level]) table[level] = [];
      table[level].push({
        min: toNum(r.min) || 0,
        max: toNum(r.max) || 0,
        days: toNum(r.days) || 0
      });
    });
    return table;
  }

  function parseBenefits(rows) {
    return rows.map(function (r) {
      var b = {
        id: r.id,
        name: r.name || "",
        category: r.category || "",
        icon: r.icon || "",
        calcType: r.calcType || "info_only"
      };

      // Optional string fields
      if (r.rateTable) b.rateTable = r.rateTable;
      if (r.basedOn) b.basedOn = r.basedOn;
      if (r.receivingDate) b.receivingDate = r.receivingDate;
      if (r.description) b.description = r.description;
      if (r.videoUrl) b.videoUrl = r.videoUrl;
      if (r.displayAmount) b.displayAmount = r.displayAmount;

      // Optional numeric fields
      var numFields = ["fixedAmount", "campBaseAmount", "campExtraPerKid", "campMaxAmount", "treatmentsDivisor", "treatmentsMax"];
      numFields.forEach(function (f) {
        var v = toNum(r[f]);
        if (v !== null) b[f] = v;
      });

      // Highlight
      if (toBool(r.highlight) === true) {
        b.highlight = true;
        if (r.highlightColor) b.highlightColor = r.highlightColor;
      }

      // Threshold object
      var threshold = {};
      var thresholdFields = ["totalDays", "totalDaysMin", "days2026Min", "days2025Min"];
      thresholdFields.forEach(function (f) {
        var v = toNum(r["threshold_" + f]);
        if (v !== null) threshold[f] = v;
      });
      var levelsOnly = splitSemicolon(r.threshold_levelsOnly);
      if (levelsOnly) threshold.levelsOnly = levelsOnly;
      var commandRoles = splitSemicolon(r.threshold_commandRoles);
      if (commandRoles) threshold.commandRoles = commandRoles;
      b.threshold = threshold;

      // Conditions object
      var conditions = {};
      var hasConditions = false;
      ["isParent", "isStudent", "hasChildren"].forEach(function (f) {
        var v = toBool(r["conditions_" + f]);
        if (v !== null) {
          conditions[f] = v;
          hasConditions = true;
        }
      });
      if (hasConditions) b.conditions = conditions;

      return b;
    });
  }

  function parseFaq(rows) {
    return rows.map(function (r) {
      return { question: r.question || "", answer: r.answer || "" };
    }).filter(function (f) { return f.question; });
  }

  // ===== FETCH WITH TIMEOUT =====
  function fetchWithTimeout(url, timeout) {
    return new Promise(function (resolve, reject) {
      var timer = setTimeout(function () { reject(new Error("timeout")); }, timeout);
      fetch(url).then(function (res) {
        clearTimeout(timer);
        if (!res.ok) reject(new Error("HTTP " + res.status));
        else res.text().then(resolve).catch(reject);
      }).catch(function (err) {
        clearTimeout(timer);
        reject(err);
      });
    });
  }

  // ===== MAIN LOADER =====
  window.loadCalcData = function () {
    // If no sheet ID configured, use local data immediately
    if (!SHEET_ID || SHEET_ID === "YOUR_GOOGLE_SHEET_ID_HERE") {
      return Promise.resolve(window.CALC_DATA);
    }

    var fetches = TAB_NAMES.map(function (tab) {
      return fetchWithTimeout(sheetCsvUrl(tab), FETCH_TIMEOUT)
        .then(function (text) { return { tab: tab, data: csvToObjects(text) }; })
        .catch(function (err) {
          console.warn("sheets-loader: failed to fetch tab '" + tab + "':", err.message);
          return { tab: tab, data: null, error: err };
        });
    });

    return Promise.all(fetches).then(function (results) {
      var tabData = {};
      var allFailed = true;
      results.forEach(function (r) {
        tabData[r.tab] = r.data;
        if (r.data) allFailed = false;
      });

      // If all tabs failed, fall back to local data
      if (allFailed) {
        console.warn("sheets-loader: all tabs failed, using local data.js fallback");
        window.CALC_DATA_SOURCE = "local";
        return window.CALC_DATA;
      }

      try {
        var fallback = window.CALC_DATA || {};
        var fallbackForm = fallback.form || {};
        var sheetsData = {
          meta: tabData.meta ? parseMeta(tabData.meta) : (fallback.meta || {}),
          form: {
            steps: tabData.steps ? parseSteps(tabData.steps) : (fallbackForm.steps || []),
            questions: tabData.questions ? parseQuestions(tabData.questions) : (fallbackForm.questions || [])
          },
          rates: tabData.rates ? parseRates(tabData.rates) : (fallback.rates || {}),
          hitargnutTable: tabData.hitargnutTable ? parseHitargnut(tabData.hitargnutTable) : (fallback.hitargnutTable || {}),
          benefits: tabData.benefits ? parseBenefits(tabData.benefits) : (fallback.benefits || [])
        };

        // FAQ — loaded separately into window.FAQ_DATA
        if (tabData.faq) {
          window.FAQ_DATA = parseFaq(tabData.faq);
        }

        window.CALC_DATA = sheetsData;
        window.CALC_DATA_SOURCE = "sheets";
        console.log("sheets-loader: data loaded from Google Sheets");
        return sheetsData;
      } catch (err) {
        console.error("sheets-loader: transform error, using local fallback:", err);
        window.CALC_DATA_SOURCE = "local";
        return window.CALC_DATA;
      }
    });
  };
})();
