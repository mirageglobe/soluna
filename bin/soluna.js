#!/usr/bin/env node
'use strict';

const { solarToLunar } = require('../soluna.js');

const args = process.argv.slice(2);

let date;

if (args.length === 0) {
  date = new Date();
} else if (args.length === 1) {
  date = new Date(args[0]);
  if (isNaN(date.getTime())) {
    process.stderr.write(`error: invalid date "${args[0]}"\nusage: soluna [YYYY-MM-DD]\n`);
    process.exit(1);
  }
} else if (args.length === 3) {
  const [y, m, d] = args.map(Number);
  date = new Date(y, m - 1, d);
  if (isNaN(date.getTime())) {
    process.stderr.write(`error: invalid date "${args.join(' ')}"\nusage: soluna [YYYY MM DD]\n`);
    process.exit(1);
  }
} else {
  process.stderr.write('usage: soluna [YYYY-MM-DD | YYYY MM DD]\n');
  process.exit(1);
}

const r = solarToLunar(date);

function pad(n) { return String(n).padStart(2, '0'); }

const leapTag = r.lunar.isLeapMonth ? ' (leap)' : '';
const timeStr = r.solar.time
  ? ` ${pad(r.solar.time.hour)}:${pad(r.solar.time.minute)}:${pad(r.solar.time.second)}`
  : '';

console.log(`solar   ${r.solar.year}-${pad(r.solar.month)}-${pad(r.solar.day)}${timeStr}`);
console.log(`lunar   ${r.lunar.year}-${pad(r.lunar.month)}-${pad(r.lunar.day)}${leapTag}  ${r.lunar.dayName}`);
console.log(`zodiac  ${r.lunar.zodiac}`);

if (r.baZi) {
  const b = r.baZi;
  const hourStr = b.hour ? `  hour ${b.hour.stem}${b.hour.branch}` : '';
  console.log(`bazi    year ${b.year.stem}${b.year.branch}  month ${b.month.stem}${b.month.branch}  day ${b.day.stem}${b.day.branch}${hourStr}`);
}

if (r.solarTerms) {
  console.log(`term    ${r.solarTerms}`);
}

if (r.festivals) {
  const f = r.festivals;
  if (f.solar) console.log(`festival  solar: ${f.solar.name}`);
  if (f.lunar) console.log(`festival  lunar: ${f.lunar.name}`);
  if (f.sanniangSha) console.log('festival  sanniang sha (inauspicious for weddings)');
}
