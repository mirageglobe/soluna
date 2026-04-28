import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { test } from 'node:test';

const require = createRequire(import.meta.url);
const { solarToLunar, lunarToSolar } = require('../soluna.js');

// ===== BASIC SOLAR TO LUNAR CONVERSION TESTS =====

test('Solar to Lunar: 2020 Chinese New Year (Jan 25, 2020 = 1st day of 1st month)', () => {
  const result = solarToLunar(new Date('2020-01-25'));

  assert.strictEqual(result.lunar.year, 2020, 'Year should be 2020');
  assert.strictEqual(result.lunar.month, 1, 'Month should be 1st month');
  assert.strictEqual(result.lunar.day, 1, 'Day should be 1st day');
  assert.strictEqual(result.lunar.isLeapMonth, false, 'Should not be a leap month');
  assert.strictEqual(result.lunar.zodiac, '鼠', 'Zodiac should be Rat (鼠)');
});

test('Solar to Lunar: 2021 Chinese New Year (Feb 12, 2021 = 1st day of 1st month)', () => {
  const result = solarToLunar(new Date('2021-02-12'));

  assert.strictEqual(result.lunar.year, 2021, 'Year should be 2021');
  assert.strictEqual(result.lunar.month, 1, 'Month should be 1st month');
  assert.strictEqual(result.lunar.day, 1, 'Day should be 1st day');
  assert.strictEqual(result.lunar.zodiac, '牛', 'Zodiac should be Ox (牛)');
});

test('Solar to Lunar: Mid-Autumn Festival dates across years (no calendar drift)', () => {
  // Mid-Autumn Festival (中秋节) is always on Lunar August 15
  // Sources: Hong Kong Observatory, Taiwan Central Weather Bureau
  const midAutumnDates = [
    // 1980s
    { solar: '1980-09-23', lunarYear: 1980 },
    { solar: '1985-09-29', lunarYear: 1985 },
    { solar: '1989-09-14', lunarYear: 1989 },
    // 1990s
    { solar: '1990-10-03', lunarYear: 1990 },
    { solar: '1995-09-09', lunarYear: 1995 },
    { solar: '1999-09-24', lunarYear: 1999 },
    // 2000s
    { solar: '2000-09-12', lunarYear: 2000 },
    { solar: '2005-09-18', lunarYear: 2005 },
    { solar: '2008-09-14', lunarYear: 2008 },
    // 2010s
    { solar: '2010-09-22', lunarYear: 2010 },
    { solar: '2015-09-27', lunarYear: 2015 },
    { solar: '2019-09-13', lunarYear: 2019 },
    // 2020s
    { solar: '2020-10-01', lunarYear: 2020 },
    { solar: '2024-09-17', lunarYear: 2024 },
    { solar: '2025-10-06', lunarYear: 2025 },
    // 2030s-2040s
    { solar: '2030-09-12', lunarYear: 2030 },
    { solar: '2040-09-20', lunarYear: 2040 },
    { solar: '2049-09-11', lunarYear: 2049 },
    // 2050s-2090s (extended LUNAR_INFO data)
    { solar: '2050-09-30', lunarYear: 2050 },
    { solar: '2060-09-09', lunarYear: 2060 },
    { solar: '2070-09-19', lunarYear: 2070 },
    { solar: '2080-09-28', lunarYear: 2080 },
    { solar: '2090-09-08', lunarYear: 2090 },
    { solar: '2099-09-29', lunarYear: 2099 }
  ];

  midAutumnDates.forEach(({ solar, lunarYear }) => {
    const result = solarToLunar(new Date(solar));
    assert.strictEqual(result.lunar.year, lunarYear, `${solar}: Lunar year should be ${lunarYear}`);
    assert.strictEqual(result.lunar.month, 8, `${solar}: Lunar month should be August (8)`);
    assert.strictEqual(result.lunar.day, 15, `${solar}: Lunar day should be 15`);
    assert.strictEqual(result.lunar.isLeapMonth, false, `${solar}: Should NOT be a leap month`);
  });
});

test('Solar to Lunar: Basic 2024 date conversion', () => {
  const result = solarToLunar(new Date('2024-12-26'));

  assert.strictEqual(result.solar.year, 2024, 'Solar year should be 2024');
  assert.strictEqual(result.lunar.year, 2024, 'Lunar year should be 2024');
  assert.strictEqual(result.lunar.zodiac, '龙', 'Zodiac should be Dragon (龙)');
  assert.strictEqual(result.lunar.isLeapMonth, false, 'Should not be a leap month');
});

// ===== LUNAR TO SOLAR CONVERSION TESTS =====

test('Lunar to Solar: 2011-1-3 converts to solar 2011-02-05', () => {
  const result = lunarToSolar(new Date(2011, 0, 3), false);

  assert.strictEqual(result.solar.year, 2011, 'Solar year should be 2011');
  assert.strictEqual(result.solar.month, 2, 'Solar month should be February (2)');
  assert.strictEqual(result.solar.day, 5, 'Solar day should be 5');
});

test('Lunar to Solar: Round-trip conversion maintains accuracy', () => {
  const originalSolar = new Date('2020-01-25');
  const lunarResult = solarToLunar(originalSolar);
  const solarResult = lunarToSolar(
    new Date(lunarResult.lunar.year, lunarResult.lunar.month - 1, lunarResult.lunar.day),
    lunarResult.lunar.isLeapMonth
  );

  assert.strictEqual(solarResult.solar.year, 2020, 'Year should match');
  assert.strictEqual(solarResult.solar.month, 1, 'Month should match');
  assert.strictEqual(solarResult.solar.day, 25, 'Day should match');
});

// ===== LEAP MONTH TESTS =====

test('Leap month: 2012 has leap 4th month - regular 4th month', () => {
  const result = lunarToSolar(new Date(2012, 3, 7), false);

  assert.strictEqual(result.solar.year, 2012, 'Solar year should be 2012');
  assert.strictEqual(result.solar.month, 4, 'Should be April');
  assert.strictEqual(result.solar.day, 27, 'Should be 27th');
});

test('Leap month: 2012 leap 4th month (different from regular 4th month)', () => {
  const result = lunarToSolar(new Date(2012, 3, 7), true);

  assert.strictEqual(result.solar.year, 2012, 'Solar year should be 2012');
  assert.strictEqual(result.solar.month, 5, 'Should be May (one month later)');
  assert.strictEqual(result.solar.day, 27, 'Should be 27th');
});

// ===== ZODIAC ANIMAL TESTS =====

test('Zodiac animals: Verify full 12-year cycle (using dates after LNY)', () => {
  const zodiacCycle = [
    { year: 2020, animal: '鼠' }, // Rat
    { year: 2021, animal: '牛' }, // Ox
    { year: 2022, animal: '虎' }, // Tiger
    { year: 2023, animal: '兔' }, // Rabbit
    { year: 2024, animal: '龙' }, // Dragon
    { year: 2025, animal: '蛇' }, // Snake
    { year: 2026, animal: '马' }, // Horse
    { year: 2027, animal: '羊' }, // Goat
    { year: 2028, animal: '猴' }, // Monkey
    { year: 2029, animal: '鸡' }, // Rooster
    { year: 2030, animal: '狗' }, // Dog
    { year: 2031, animal: '猪' } // Pig
  ];

  zodiacCycle.forEach(({ year, animal }) => {
    const result = solarToLunar(new Date(`${year}-05-01`));
    assert.strictEqual(result.lunar.zodiac, animal, `Year ${year} should be ${animal}`);
  });
});

// ===== TIME PERIOD (时辰) TESTS =====

test('Time period: Midnight (00:30) is Rat/子时', () => {
  const result = solarToLunar(new Date('2023-12-25T00:30:00'));

  assert.ok(result.timePeriod, 'Time period should exist');
  assert.strictEqual(result.timePeriod.name, '子时', 'Should be 子时');
  assert.strictEqual(result.timePeriod.zodiac, '鼠', 'Should be Rat (鼠)');
  assert.strictEqual(result.timePeriod.branch, '子', 'Branch should be 子');
});

test('Time period: Noon (12:30) is Horse/午时', () => {
  const result = solarToLunar(new Date('2023-12-25T12:30:00'));

  assert.ok(result.timePeriod, 'Time period should exist');
  assert.strictEqual(result.timePeriod.name, '午时', 'Should be 午时');
  assert.strictEqual(result.timePeriod.zodiac, '马', 'Should be Horse (马)');
  assert.strictEqual(result.timePeriod.branch, '午', 'Branch should be 午');
});

test('Time period: Evening (18:30) is Rooster/酉时', () => {
  const result = solarToLunar(new Date('2023-12-25T18:30:00'));

  assert.ok(result.timePeriod, 'Time period should exist');
  assert.strictEqual(result.timePeriod.name, '酉时', 'Should be 酉时');
  assert.strictEqual(result.timePeriod.zodiac, '鸡', 'Should be Rooster (鸡)');
});

test('Time period: 23:30 (子时) advances lunar day to next day', () => {
  const before = solarToLunar(new Date('2023-12-25T22:30:00')); // 亥时
  const result = solarToLunar(new Date('2023-12-25T23:30:00')); // 子时 — same solar day

  assert.strictEqual(result.timePeriod.name, '子时', 'Should be 子时');
  assert.strictEqual(result.timePeriod.zodiac, '鼠', 'Should be Rat');
  assert.strictEqual(result.lunar.day, before.lunar.day + 1, 'Lunar day should advance by 1 vs 22:30');
});

// ===== STEM-BRANCH (干支) TESTS =====

test('Stem-branch: Should have year, month, day pillars', () => {
  const result = solarToLunar(new Date('2024-12-26'));

  assert.ok(result.stemBranch, 'Stem-branch should exist');
  assert.ok(result.stemBranch.year, 'Year pillar should exist');
  assert.ok(result.stemBranch.month, 'Month pillar should exist');
  assert.ok(result.stemBranch.day, 'Day pillar should exist');
  assert.strictEqual(result.stemBranch.year.length, 2, 'Year pillar should be 2 characters');
  assert.strictEqual(result.stemBranch.month.length, 2, 'Month pillar should be 2 characters');
  assert.strictEqual(result.stemBranch.day.length, 2, 'Day pillar should be 2 characters');
});

// ===== LUNAR DAY NAME FORMATTING TESTS =====

test('Lunar day names: Special formatting for specific days', () => {
  const result1 = solarToLunar(new Date('2020-01-25')); // CNY 2020
  assert.strictEqual(result1.lunar.dayName, '初一', 'First day should be 初一');

  const result10 = solarToLunar(new Date('2020-02-03'));
  assert.strictEqual(result10.lunar.dayName, '初十', '10th day should be 初十');

  const result20 = solarToLunar(new Date('2020-02-13'));
  assert.strictEqual(result20.lunar.dayName, '二十', '20th day should be 二十');
});

// ===== EDGE CASE TESTS =====

test('Edge case: Date at start of lunar calendar range (1900)', () => {
  const result = solarToLunar(new Date('1900-02-15'));

  assert.strictEqual(result.solar.year, 1900);
  assert.strictEqual(typeof result.lunar.year, 'number');
  assert.strictEqual(typeof result.lunar.month, 'number');
  assert.strictEqual(typeof result.lunar.day, 'number');
});

test('Edge case: Date near end of lunar calendar range (2049)', () => {
  const result = solarToLunar(new Date('2049-01-01'));

  assert.strictEqual(result.solar.year, 2049);
  assert.strictEqual(typeof result.lunar.year, 'number');
  assert.strictEqual(typeof result.lunar.month, 'number');
  assert.strictEqual(typeof result.lunar.day, 'number');
});

test('Regression: Solar to Lunar 2026-01-01 should be Lunar 2025-11-13', () => {
  const result = solarToLunar(new Date('2026-01-01'));

  assert.strictEqual(result.lunar.year, 2025, 'Lunar year should be 2025');
  assert.strictEqual(result.lunar.month, 11, 'Lunar month should be 11');
  assert.strictEqual(result.lunar.day, 13, 'Lunar day should be 13');
  assert.strictEqual(result.lunar.isLeapMonth, false, 'Should NOT be a leap month');
});

// ===== DATA STRUCTURE VALIDATION TESTS =====

test('Output structure: Solar to Lunar contains all required fields', () => {
  const result = solarToLunar(new Date('2024-12-26T12:30:00'));

  assert.partialDeepStrictEqual(result, {
    solar: { year: 2024, month: 12, day: 26 },
    lunar: { year: 2024, month: 11, day: 26, isLeapMonth: false }
  });
  assert.strictEqual(typeof result.solar.weekDay, 'string');
  assert.strictEqual(typeof result.lunar.monthName, 'string');
  assert.strictEqual(typeof result.lunar.dayName, 'string');
  assert.strictEqual(typeof result.lunar.zodiac, 'string');
  assert.ok(result.stemBranch);
  assert.ok(result.timePeriod);
});

test('Output structure: Lunar to Solar contains all required fields', () => {
  const result = lunarToSolar(new Date(2024, 0, 1), false);

  assert.ok(result.solar);
  assert.ok(result.lunar);
  assert.ok(result.stemBranch);
  assert.strictEqual(result.timePeriod, null);
});

// ===== HISTORICAL DATE VERIFICATION (cross-referenced against HKO) =====

test('Historical: Chinese New Year dates across decades', () => {
  // source: Hong Kong Observatory perpetual calendar
  const cnyDates = [
    { solar: '1903-01-29', year: 1903 },
    { solar: '1957-01-31', year: 1957 },
    { solar: '1984-02-02', year: 1984 },
    { solar: '2001-01-24', year: 2001 },
    { solar: '2004-01-22', year: 2004 },
    { solar: '2006-01-29', year: 2006 },
    { solar: '2009-01-26', year: 2009 },
    { solar: '2012-01-23', year: 2012 },
    { solar: '2020-01-25', year: 2020 },
    { solar: '2023-01-22', year: 2023 },
    { solar: '2025-01-29', year: 2025 }
  ];

  cnyDates.forEach(({ solar, year }) => {
    const r = solarToLunar(new Date(solar)).lunar;
    assert.strictEqual(r.year, year, `${solar}: lunar year`);
    assert.strictEqual(r.month, 1, `${solar}: lunar month 1`);
    assert.strictEqual(r.day, 1, `${solar}: lunar day 1`);
    assert.strictEqual(r.isLeapMonth, false, `${solar}: not leap`);
  });
});

test('Historical: Year crossover — late December falls in prior lunar year', () => {
  const r = solarToLunar(new Date('2022-12-31')).lunar;
  assert.strictEqual(r.year, 2022);
  assert.strictEqual(r.month, 12);
  assert.strictEqual(r.day, 9);
  assert.strictEqual(r.isLeapMonth, false);
});

test('Historical: Leap month boundaries — 1903 leap 5th month', () => {
  // source: HKO
  const cases = [
    { solar: '1903-05-27', month: 5, day: 1, leap: false }, // regular 5/1
    { solar: '1903-06-25', month: 5, day: 1, leap: true }, // leap 5/1
    { solar: '1903-07-23', month: 5, day: 29, leap: true }, // leap 5 last day
    { solar: '1903-07-24', month: 6, day: 1, leap: false } // regular 6/1
  ];
  cases.forEach(({ solar, month, day, leap }) => {
    const r = solarToLunar(new Date(solar)).lunar;
    assert.strictEqual(r.month, month, `${solar}: month`);
    assert.strictEqual(r.day, day, `${solar}: day`);
    assert.strictEqual(r.isLeapMonth, leap, `${solar}: isLeapMonth`);
  });
});

test('Historical: Leap month boundaries — 2001 leap 4th month', () => {
  const cases = [
    { solar: '2001-05-22', month: 4, day: 30, leap: false }, // regular 4 last day
    { solar: '2001-05-23', month: 4, day: 1, leap: true }, // leap 4/1
    { solar: '2001-06-20', month: 4, day: 29, leap: true }, // leap 4 last day
    { solar: '2001-06-21', month: 5, day: 1, leap: false } // regular 5/1
  ];
  cases.forEach(({ solar, month, day, leap }) => {
    const r = solarToLunar(new Date(solar)).lunar;
    assert.strictEqual(r.month, month, `${solar}: month`);
    assert.strictEqual(r.day, day, `${solar}: day`);
    assert.strictEqual(r.isLeapMonth, leap, `${solar}: isLeapMonth`);
  });
});

test('Historical: Leap month boundaries — 2009 leap 5th month', () => {
  const cases = [
    { solar: '2009-06-23', month: 5, day: 1, leap: true }, // leap 5/1
    { solar: '2009-07-21', month: 5, day: 29, leap: true }, // leap 5 last day
    { solar: '2009-07-22', month: 6, day: 1, leap: false } // regular 6/1
  ];
  cases.forEach(({ solar, month, day, leap }) => {
    const r = solarToLunar(new Date(solar)).lunar;
    assert.strictEqual(r.month, month, `${solar}: month`);
    assert.strictEqual(r.day, day, `${solar}: day`);
    assert.strictEqual(r.isLeapMonth, leap, `${solar}: isLeapMonth`);
  });
});

test('Historical: Leap month boundaries — 2012 leap 4th month', () => {
  const cases = [
    { solar: '2012-04-21', month: 4, day: 1, leap: false }, // regular 4/1
    { solar: '2012-05-20', month: 4, day: 30, leap: false }, // regular 4 last day
    { solar: '2012-05-21', month: 4, day: 1, leap: true }, // leap 4/1
    { solar: '2012-06-18', month: 4, day: 29, leap: true }, // leap 4 last day
    { solar: '2012-06-19', month: 5, day: 1, leap: false } // regular 5/1
  ];
  cases.forEach(({ solar, month, day, leap }) => {
    const r = solarToLunar(new Date(solar)).lunar;
    assert.strictEqual(r.month, month, `${solar}: month`);
    assert.strictEqual(r.day, day, `${solar}: day`);
    assert.strictEqual(r.isLeapMonth, leap, `${solar}: isLeapMonth`);
  });
});

test('Historical: Leap month boundaries — 2020 leap 4th month', () => {
  const cases = [
    { solar: '2020-05-23', month: 4, day: 1, leap: true }, // leap 4/1
    { solar: '2020-06-20', month: 4, day: 29, leap: true }, // leap 4 last day
    { solar: '2020-06-21', month: 5, day: 1, leap: false } // regular 5/1
  ];
  cases.forEach(({ solar, month, day, leap }) => {
    const r = solarToLunar(new Date(solar)).lunar;
    assert.strictEqual(r.month, month, `${solar}: month`);
    assert.strictEqual(r.day, day, `${solar}: day`);
    assert.strictEqual(r.isLeapMonth, leap, `${solar}: isLeapMonth`);
  });
});

test('Historical: Leap month boundaries — 2023 leap 2nd month', () => {
  const cases = [
    { solar: '2023-03-22', month: 2, day: 1, leap: true }, // leap 2/1
    { solar: '2023-04-19', month: 2, day: 29, leap: true }, // leap 2 last day
    { solar: '2023-04-20', month: 3, day: 1, leap: false } // regular 3/1
  ];
  cases.forEach(({ solar, month, day, leap }) => {
    const r = solarToLunar(new Date(solar)).lunar;
    assert.strictEqual(r.month, month, `${solar}: month`);
    assert.strictEqual(r.day, day, `${solar}: day`);
    assert.strictEqual(r.isLeapMonth, leap, `${solar}: isLeapMonth`);
  });
});

test('Historical: Leap month boundaries — 2025 leap 6th month', () => {
  const cases = [
    { solar: '2025-06-25', month: 6, day: 1, leap: false }, // regular 6/1
    { solar: '2025-07-24', month: 6, day: 30, leap: false }, // regular 6 last day
    { solar: '2025-07-25', month: 6, day: 1, leap: true }, // leap 6/1
    { solar: '2025-08-22', month: 6, day: 29, leap: true }, // leap 6 last day
    { solar: '2025-08-23', month: 7, day: 1, leap: false } // regular 7/1
  ];
  cases.forEach(({ solar, month, day, leap }) => {
    const r = solarToLunar(new Date(solar)).lunar;
    assert.strictEqual(r.month, month, `${solar}: month`);
    assert.strictEqual(r.day, day, `${solar}: day`);
    assert.strictEqual(r.isLeapMonth, leap, `${solar}: isLeapMonth`);
  });
});

// ===== INVALID INPUT TESTS =====

test('Invalid input: Should throw error for invalid date', () => {
  assert.throws(() => solarToLunar(new Date('invalid')), { message: 'Invalid date provided' });
});

test('Invalid input: Should throw error for null', () => {
  assert.throws(() => solarToLunar(null), { message: 'Invalid date provided' });
});

// ===== BAZI (八字) TESTS =====

test('BaZi: Verify Four Pillars (Year, Month, Day, Hour)', () => {
  // 2020-01-25 12:30 — before Li Chun (Feb 4), so year pillar is Ji-Hai (己亥) not Geng-Zi
  const result = solarToLunar(new Date(2020, 0, 25, 12, 30));

  assert.strictEqual(result.baZi.year.stem, '己', 'Year stem should be Ji (己)');
  assert.strictEqual(result.baZi.year.branch, '亥', 'Year branch should be Hai (亥)');
  assert.strictEqual(result.baZi.day.stem, '丁', 'Day stem should be Ding (丁)');
  assert.strictEqual(result.baZi.day.branch, '卯', 'Day branch should be Mao (卯)');
  assert.strictEqual(result.baZi.hour.stem, '丙', 'Hour stem should be Bing (丙)');
  assert.strictEqual(result.baZi.hour.branch, '午', 'Hour branch should be Wu (午)');
});

test('BaZi: Regression - Month Pillar for 1980-03-21 should be Ji-Mao (date after Jing Zhe)', () => {
  const result = solarToLunar(new Date('1980-03-21T13:30:00'));

  assert.strictEqual(result.baZi.year.stem + result.baZi.year.branch, '庚申', 'Year should be Geng-Shen');
  assert.strictEqual(result.baZi.month.stem + result.baZi.month.branch, '己卯', 'Month should be Ji-Mao');
  assert.strictEqual(result.baZi.day.stem + result.baZi.day.branch, '癸巳', 'Day should be Gui-Si');
});

// ===== FLEXIBLE INPUT TESTS =====

test('Flexible Input: solarToLunar with numerical arguments', () => {
  const result = solarToLunar(2024, 12, 28, 15, 45, 30);

  assert.strictEqual(result.solar.year, 2024);
  assert.strictEqual(result.solar.month, 12);
  assert.strictEqual(result.solar.day, 28);
  assert.strictEqual(result.solar.time.hour, 15);
  assert.strictEqual(result.solar.time.minute, 45);
  assert.strictEqual(result.solar.time.second, 30);
});

test('Flexible Input: lunarToSolar with numerical arguments and time', () => {
  const result = lunarToSolar(2025, 11, 9, false, 12, 30, 0);

  assert.strictEqual(result.lunar.year, 2025);
  assert.strictEqual(result.lunar.month, 11);
  assert.strictEqual(result.lunar.day, 9);
  assert.strictEqual(result.solar.time.hour, 12);
  assert.strictEqual(result.solar.time.minute, 30);
  assert.strictEqual(result.solar.time.second, 0);
});
