// Generates CSV files for Google Sheets import from data.js
// Run: node generate-csvs.js
// Then import each CSV as a separate tab in Google Sheets

const fs = require('fs');
global.window = {};
require('./data.js');
const data = window.CALC_DATA;

function csvEscape(val) {
  if (val === null || val === undefined) return '';
  let s = String(val);
  if (s.includes(',') || s.includes('"') || s.includes('\n') || s.includes('\r')) {
    s = '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

function toCsv(headers, rows) {
  const BOM = '\uFEFF';
  const lines = [headers.map(csvEscape).join(',')];
  rows.forEach(row => {
    lines.push(headers.map(h => csvEscape(row[h])).join(','));
  });
  return BOM + lines.join('\n');
}

// 1. meta.csv
const metaHeaders = ['key', 'value'];
const metaRows = Object.entries(data.meta).map(([k, v]) => ({ key: k, value: v }));
fs.writeFileSync('sheets_meta.csv', toCsv(metaHeaders, metaRows), 'utf8');

// 2. steps.csv
const stepsHeaders = ['id', 'title', 'subtitle', 'icon'];
const stepsRows = data.form.steps.map(s => ({
  id: s.id,
  title: s.title,
  subtitle: (s.subtitle || '').replace(/\n/g, '\\n'),
  icon: s.icon
}));
fs.writeFileSync('sheets_steps.csv', toCsv(stepsHeaders, stepsRows), 'utf8');

// 3. questions.csv
const qHeaders = ['id', 'step', 'question', 'type', 'icon', 'helper', 'helpButton', 'helpContent', 'options', 'default', 'required', 'placeholder', 'showIf_field', 'showIf_equalsAny'];
const qRows = data.form.questions.map(q => ({
  id: q.id,
  step: q.step,
  question: q.question,
  type: q.type,
  icon: q.icon || '',
  helper: q.helper || '',
  helpButton: q.helpButton || '',
  helpContent: q.helpContent ? q.helpContent.replace(/\n/g, '\\n') : '',
  options: q.options ? q.options.join(';') : '',
  'default': q.default || '',
  required: q.required ? 'TRUE' : '',
  placeholder: q.placeholder || '',
  showIf_field: q.showIf ? q.showIf.field : '',
  showIf_equalsAny: q.showIf ? (q.showIf.equalsAny ? q.showIf.equalsAny.join(';') : (q.showIf.equals || '')) : ''
}));
fs.writeFileSync('sheets_questions.csv', toCsv(qHeaders, qRows), 'utf8');

// 4. rates.csv
const ratesHeaders = ['rateTable', 'type', 'א+', 'א', 'ב', 'ג', 'ד', 'ה'];
const levels = ['א+', 'א', 'ב', 'ג', 'ד', 'ה'];
const ratesRows = Object.entries(data.rates).map(([name, val]) => {
  if (typeof val === 'number') {
    const row = { rateTable: name, type: 'single' };
    levels.forEach(l => row[l] = '');
    row['א+'] = val;
    return row;
  }
  const row = { rateTable: name, type: 'perLevel' };
  levels.forEach(l => row[l] = val[l] !== undefined ? val[l] : '');
  return row;
});
fs.writeFileSync('sheets_rates.csv', toCsv(ratesHeaders, ratesRows), 'utf8');

// 5. hitargnutTable.csv
const hitHeaders = ['level', 'min', 'max', 'days'];
const hitRows = [];
levels.forEach(level => {
  (data.hitargnutTable[level] || []).forEach(entry => {
    hitRows.push({ level, min: entry.min, max: entry.max, days: entry.days });
  });
});
fs.writeFileSync('sheets_hitargnutTable.csv', toCsv(hitHeaders, hitRows), 'utf8');

// 6. benefits.csv
const bHeaders = [
  'id', 'name', 'category', 'icon', 'calcType', 'rateTable', 'basedOn',
  'fixedAmount', 'displayAmount', 'campBaseAmount', 'campExtraPerKid', 'campMaxAmount',
  'treatmentsDivisor', 'treatmentsMax',
  'threshold_totalDays', 'threshold_totalDaysMin', 'threshold_days2026Min', 'threshold_days2025Min',
  'threshold_levelsOnly', 'threshold_commandRoles',
  'conditions_isParent', 'conditions_isStudent', 'conditions_hasChildren',
  'receivingDate', 'description', 'videoUrl', 'highlight', 'highlightColor'
];
const bRows = data.benefits.map(b => {
  const t = b.threshold || {};
  const c = b.conditions || {};
  return {
    id: b.id,
    name: b.name,
    category: b.category,
    icon: b.icon || '',
    calcType: b.calcType,
    rateTable: b.rateTable || '',
    basedOn: b.basedOn || '',
    fixedAmount: b.fixedAmount != null ? b.fixedAmount : '',
    displayAmount: b.displayAmount || '',
    campBaseAmount: b.campBaseAmount != null ? b.campBaseAmount : '',
    campExtraPerKid: b.campExtraPerKid != null ? b.campExtraPerKid : '',
    campMaxAmount: b.campMaxAmount != null ? b.campMaxAmount : '',
    treatmentsDivisor: b.treatmentsDivisor != null ? b.treatmentsDivisor : '',
    treatmentsMax: b.treatmentsMax != null ? b.treatmentsMax : '',
    threshold_totalDays: t.totalDays != null ? t.totalDays : '',
    threshold_totalDaysMin: t.totalDaysMin != null ? t.totalDaysMin : '',
    threshold_days2026Min: t.days2026Min != null ? t.days2026Min : '',
    threshold_days2025Min: t.days2025Min != null ? t.days2025Min : '',
    threshold_levelsOnly: t.levelsOnly ? t.levelsOnly.join(';') : '',
    threshold_commandRoles: t.commandRoles ? t.commandRoles.join(';') : '',
    conditions_isParent: c.isParent === true ? 'TRUE' : '',
    conditions_isStudent: c.isStudent === true ? 'TRUE' : '',
    conditions_hasChildren: c.hasChildren === true ? 'TRUE' : '',
    receivingDate: b.receivingDate || '',
    description: b.description || '',
    videoUrl: b.videoUrl || '',
    highlight: b.highlight === true ? 'TRUE' : '',
    highlightColor: b.highlightColor || ''
  };
});
fs.writeFileSync('sheets_benefits.csv', toCsv(bHeaders, bRows), 'utf8');

console.log('Generated 6 CSV files:');
console.log('  sheets_meta.csv');
console.log('  sheets_steps.csv');
console.log('  sheets_questions.csv');
console.log('  sheets_rates.csv');
console.log('  sheets_hitargnutTable.csv');
console.log('  sheets_benefits.csv');
console.log('\nImport instructions:');
console.log('1. Open Google Sheets and create a new spreadsheet');
console.log('2. For each CSV: File > Import > Upload > select the CSV');
console.log('3. Choose "Insert new sheet" and name the tab to match (without "sheets_" prefix)');
console.log('4. Publish: File > Share > Publish to web > Entire document > CSV');
console.log('5. Copy the Sheet ID from the URL and paste it in sheets-loader.js');
