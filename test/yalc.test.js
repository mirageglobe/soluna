/**
 * AVA Test Suite for YALC (Yet Another Lunar Calendar Converter)
 *
 * HOW TO RUN TESTS:
 * -----------------
 * 1. Install AVA if not already installed:
 *    npm install --save-dev ava
 *
 * 2. Run all tests:
 *    npm test
 *    or
 *    npx ava
 *
 * 3. Run tests in watch mode (auto-rerun on changes):
 *    npx ava --watch
 *
 * 4. Run specific test file:
 *    npx ava test.js
 *
 * 5. Run tests with verbose output:
 *    npx ava --verbose
 *
 * WHAT THESE TESTS COVER:
 * ------------------------
 * - Solar to Lunar conversions for known dates
 * - Lunar to Solar reverse conversions
 * - Leap month handling
 * - Chinese zodiac animals
 * - Time period (时辰) calculations
 * - Edge cases and special dates
 */

const test = require('ava');
const { solarToLunar, lunarToSolar, getTimePeriod } = require('./yalc.js');

// ===== BASIC SOLAR TO LUNAR CONVERSION TESTS =====

test('Solar to Lunar: 2020 Chinese New Year (Jan 25, 2020 = 1st day of 1st month)', t => {
  const result = solarToLunar(new Date('2020-01-25'));

  t.is(result.lunar.year, 2020, 'Year should be 2020');
  t.is(result.lunar.month, 1, 'Month should be 1st month');
  t.is(result.lunar.day, 1, 'Day should be 1st day');
  t.is(result.lunar.isLeapMonth, false, 'Should not be a leap month');
  t.is(result.lunar.zodiac, '鼠', 'Zodiac should be Rat (鼠)');
});

test('Solar to Lunar: 2021 Chinese New Year (Feb 12, 2021 = 1st day of 1st month)', t => {
  const result = solarToLunar(new Date('2021-02-12'));

  t.is(result.lunar.year, 2021, 'Year should be 2021');
  t.is(result.lunar.month, 1, 'Month should be 1st month');
  t.is(result.lunar.day, 1, 'Day should be 1st day');
  t.is(result.lunar.zodiac, '牛', 'Zodiac should be Ox (牛)');
});

test('Solar to Lunar: Mid-Autumn Festival dates across years (no calendar drift)', t => {
  // Mid-Autumn Festival (中秋节) is always on Lunar August 15
  // These are verified solar dates spanning 1980-2099 to check for calendar drift
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
    // 2030s-2040s (testing mid-range)
    { solar: '2030-09-12', lunarYear: 2030 },
    { solar: '2040-09-20', lunarYear: 2040 },
    { solar: '2049-09-11', lunarYear: 2049 },
    // 2050s-2090s (testing extended LUNAR_INFO data)
    { solar: '2050-09-30', lunarYear: 2050 },
    { solar: '2060-09-09', lunarYear: 2060 },
    { solar: '2070-09-19', lunarYear: 2070 },
    { solar: '2080-09-28', lunarYear: 2080 },
    { solar: '2090-09-08', lunarYear: 2090 },
    { solar: '2099-09-29', lunarYear: 2099 }
  ];

  midAutumnDates.forEach(({ solar, lunarYear }) => {
    const result = solarToLunar(new Date(solar));
    t.is(result.lunar.year, lunarYear, `${solar}: Lunar year should be ${lunarYear}`);
    t.is(result.lunar.month, 8, `${solar}: Lunar month should be August (8)`);
    t.is(result.lunar.day, 15, `${solar}: Lunar day should be 15`);
    t.is(result.lunar.isLeapMonth, false, `${solar}: Should NOT be a leap month`);
  });
});

test('Solar to Lunar: Basic 2024 date conversion', t => {
  const result = solarToLunar(new Date('2024-12-26'));

  t.is(result.solar.year, 2024, 'Solar year should be 2024');
  t.is(result.lunar.year, 2024, 'Lunar year should be 2024');
  t.is(result.lunar.zodiac, '龙', 'Zodiac should be Dragon (龙)');
  t.false(result.lunar.isLeapMonth, 'Should not be a leap month');
});

// ===== LUNAR TO SOLAR CONVERSION TESTS =====

test('Lunar to Solar: 2011-1-3 converts to solar 2011-02-05', t => {
  const result = lunarToSolar(new Date(2011, 0, 3), false); // Lunar 2011-01-03

  t.is(result.solar.year, 2011, 'Solar year should be 2011');
  t.is(result.solar.month, 2, 'Solar month should be February (2)');
  t.is(result.solar.day, 5, 'Solar day should be 5');
});

test('Lunar to Solar: Round-trip conversion maintains accuracy', t => {
  // Start with a solar date
  const originalSolar = new Date('2020-01-25');

  // Convert to lunar
  const lunarResult = solarToLunar(originalSolar);

  // Convert back to solar
  const solarResult = lunarToSolar(
    new Date(lunarResult.lunar.year, lunarResult.lunar.month - 1, lunarResult.lunar.day),
    lunarResult.lunar.isLeapMonth
  );

  t.is(solarResult.solar.year, 2020, 'Year should match');
  t.is(solarResult.solar.month, 1, 'Month should match');
  t.is(solarResult.solar.day, 25, 'Day should match');
});

// ===== LEAP MONTH TESTS =====

test('Leap month: 2012 has leap 4th month - regular 4th month', t => {
  const result = lunarToSolar(new Date(2012, 3, 7), false);

  t.is(result.solar.year, 2012, 'Solar year should be 2012');
  t.is(result.solar.month, 4, 'Should be April');
  t.is(result.solar.day, 27, 'Should be 27th');
});

test('Leap month: 2012 leap 4th month (different from regular 4th month)', t => {
  const result = lunarToSolar(new Date(2012, 3, 7), true);

  t.is(result.solar.year, 2012, 'Solar year should be 2012');
  t.is(result.solar.month, 5, 'Should be May (one month later)');
  t.is(result.solar.day, 27, 'Should be 27th');
});

// ===== ZODIAC ANIMAL TESTS =====

test('Zodiac animals: Verify 12-year cycle (using dates after LNY)', t => {
  const zodiacCycle = [
    { year: 2020, animal: '鼠' }, // Rat
    { year: 2021, animal: '牛' }, // Ox
    { year: 2022, animal: '虎' }, // Tiger
    { year: 2023, animal: '兔' }, // Rabbit
    { year: 2024, animal: '龙' }, // Dragon
  ];

  zodiacCycle.forEach(({ year, animal }) => {
    // Using May 1st to ensure we are well past Lunar New Year
    const result = solarToLunar(new Date(`${year}-05-01`));
    t.is(result.lunar.zodiac, animal, `Year ${year} should be ${animal}`);
  });
});

// ===== TIME PERIOD (时辰) TESTS =====

test('Time period: Midnight (00:30) is Rat/子时', t => {
  const result = solarToLunar(new Date('2023-12-25T00:30:00'));

  t.truthy(result.timePeriod, 'Time period should exist');
  t.is(result.timePeriod.name, '子时', 'Should be 子时');
  t.is(result.timePeriod.zodiac, '鼠', 'Should be Rat (鼠)');
  t.is(result.timePeriod.branch, '子', 'Branch should be 子');
});

test('Time period: Noon (12:30) is Horse/午时', t => {
  const result = solarToLunar(new Date('2023-12-25T12:30:00'));

  t.truthy(result.timePeriod, 'Time period should exist');
  t.is(result.timePeriod.name, '午时', 'Should be 午时');
  t.is(result.timePeriod.zodiac, '马', 'Should be Horse (马)');
  t.is(result.timePeriod.branch, '午', 'Branch should be 午');
});

test('Time period: Evening (18:30) is Rooster/酉时', t => {
  const result = solarToLunar(new Date('2023-12-25T18:30:00'));

  t.truthy(result.timePeriod, 'Time period should exist');
  t.is(result.timePeriod.name, '酉时', 'Should be 酉时');
  t.is(result.timePeriod.zodiac, '鸡', 'Should be Rooster (鸡)');
});

test('Time period: 23:00 (子时) belongs to next day', t => {
  const result = solarToLunar(new Date('2023-12-25T23:30:00'));

  t.is(result.timePeriod.name, '子时', 'Should be 子时');
  t.is(result.timePeriod.zodiac, '鼠', 'Should be Rat');
  // Note: The lunar date should be adjusted to next day due to 子时 rule
});

// ===== STEM-BRANCH (干支) TESTS =====

test('Stem-branch: Should have year, month, day pillars', t => {
  const result = solarToLunar(new Date('2024-12-26'));

  t.truthy(result.stemBranch, 'Stem-branch should exist');
  t.truthy(result.stemBranch.year, 'Year pillar should exist');
  t.truthy(result.stemBranch.month, 'Month pillar should exist');
  t.truthy(result.stemBranch.day, 'Day pillar should exist');
  t.is(result.stemBranch.year.length, 2, 'Year pillar should be 2 characters');
  t.is(result.stemBranch.month.length, 2, 'Month pillar should be 2 characters');
  t.is(result.stemBranch.day.length, 2, 'Day pillar should be 2 characters');
});

// ===== LUNAR DAY NAME FORMATTING TESTS =====

test('Lunar day names: Special formatting for specific days', t => {
  // Test 1st day
  const result1 = solarToLunar(new Date('2020-01-25')); // CNY 2020
  t.is(result1.lunar.dayName, '初一', 'First day should be 初一');

  // Test 10th day
  const result10 = solarToLunar(new Date('2020-02-03'));
  t.is(result10.lunar.dayName, '初十', '10th day should be 初十');

  // Test 20th day
  const result20 = solarToLunar(new Date('2020-02-13'));
  t.is(result20.lunar.dayName, '二十', '20th day should be 二十');
});

// ===== EDGE CASE TESTS =====

test('Edge case: Date at start of lunar calendar range (1900)', t => {
  const result = solarToLunar(new Date('1900-02-15'));

  t.is(result.solar.year, 1900, 'Should handle year 1900');
  t.truthy(result.lunar.year, 'Should have lunar year');
  t.truthy(result.lunar.month, 'Should have lunar month');
  t.truthy(result.lunar.day, 'Should have lunar day');
});

test('Edge case: Date near end of lunar calendar range (2049)', t => {
  const result = solarToLunar(new Date('2049-01-01'));

  t.is(result.solar.year, 2049, 'Should handle year 2049');
  t.truthy(result.lunar.year, 'Should have lunar year');
  t.truthy(result.lunar.month, 'Should have lunar month');
  t.truthy(result.lunar.day, 'Should have lunar day');
});

test('Regression: Solar to Lunar 2026-01-01 should be Lunar 2025-11-13', t => {
  const result = solarToLunar(new Date('2026-01-01'));

  t.is(result.lunar.year, 2025, 'Lunar year should be 2025');
  t.is(result.lunar.month, 11, 'Lunar month should be 11');
  t.is(result.lunar.day, 13, 'Lunar day should be 13');
  t.is(result.lunar.isLeapMonth, false, 'Should NOT be a leap month');
});

// ===== DATA STRUCTURE VALIDATION TESTS =====

test('Output structure: Solar to Lunar contains all required fields', t => {
  const result = solarToLunar(new Date('2024-12-26T12:30:00'));

  // Check solar object
  t.truthy(result.solar, 'Should have solar object');
  t.truthy(result.solar.year, 'Should have solar year');
  t.truthy(result.solar.month, 'Should have solar month');
  t.truthy(result.solar.day, 'Should have solar day');
  t.truthy(result.solar.weekDay, 'Should have week day');

  // Check lunar object
  t.truthy(result.lunar, 'Should have lunar object');
  t.truthy(result.lunar.year, 'Should have lunar year');
  t.truthy(result.lunar.month, 'Should have lunar month');
  t.truthy(result.lunar.day, 'Should have lunar day');
  t.is(typeof result.lunar.isLeapMonth, 'boolean', 'isLeapMonth should be boolean');
  t.truthy(result.lunar.monthName, 'Should have month name');
  t.truthy(result.lunar.dayName, 'Should have day name');
  t.truthy(result.lunar.zodiac, 'Should have zodiac animal');

  // Check stem-branch object
  t.truthy(result.stemBranch, 'Should have stem-branch object');

  // Check time period (if time provided)
  t.truthy(result.timePeriod, 'Should have time period');
});

test('Output structure: Lunar to Solar contains all required fields', t => {
  const result = lunarToSolar(new Date(2024, 0, 1), false);

  t.truthy(result.solar, 'Should have solar object');
  t.truthy(result.lunar, 'Should have lunar object');
  t.truthy(result.stemBranch, 'Should have stem-branch object');
  t.true(result.timePeriod === null, 'Time period should be null for date-only input');
});

// ===== INVALID INPUT TESTS =====

test('Invalid input: Should throw error for invalid date', t => {
  t.throws(() => {
    solarToLunar(new Date('invalid'));
  }, { message: 'Invalid date provided' });
});

test('Invalid input: Should throw error for null', t => {
  t.throws(() => {
    solarToLunar(null);
  }, { message: 'Invalid date provided' });
});

test('BaZi: Verify Four Pillars (Year, Month, Day, Hour)', t => {
  // Test case: 2020-01-25 12:30 (Chinese New Year)
  // 2020 is Geng-Zi (庚子) year
  // 2020-01-25 is Ding-Mao (丁卯) day
  // 12:30 is Wu-Shi (午时) branch
  // Hour Stem for Ding Day and Wu Hour is Bing (丙)
  const date = new Date(2020, 0, 25, 12, 30);
  const result = solarToLunar(date);

  // Year pillar
  // 2020-01-25 is BEFORE Li Chun (Feb 4), so it belongs to previous Year Pillar (Ji Hai - 2019)
  // 2019 = Ji Hai (己亥)
  t.is(result.baZi.year.stem, '己', 'Year stem should be Ji (己) - Pre-Li Chun');
  t.is(result.baZi.year.branch, '亥', 'Year branch should be Hai (亥) - Pre-Li Chun');

  // Day pillar
  t.is(result.baZi.day.stem, '丁', 'Day stem should be Ding (丁)');
  t.is(result.baZi.day.branch, '卯', 'Day branch should be Mao (卯)');

  t.is(result.baZi.hour.stem, '丙', 'Hour stem for Ding Day + Wu Hour should be Bing (丙)');
  t.is(result.baZi.hour.branch, '午', 'Hour branch should be Wu (午)');
});

test('BaZi: Regression - Month Pillar for 1980-03-21 should be Ji-Mao (date after Jing Zhe)', t => {
  // 1980-03-21 is in 2nd Solar Month (Rabbit), but 2nd Lunar Month started Feb 16.
  // Previous bug calculated it as 1st Solar Month because math used Lunar Month index.
  const date = new Date('1980-03-21T13:30:00');
  const result = solarToLunar(date);

  // Year: Geng-Shen (Monkey) - 1980
  t.is(result.baZi.year.stem + result.baZi.year.branch, '庚申', 'Year should be Geng-Shen');

  // Month: Ji-Mao (Rabbit) - 2nd Solar Month
  // Incorrect buggy value was Wu-Yin (Tiger)
  t.is(result.baZi.month.stem + result.baZi.month.branch, '己卯', 'Month should be Ji-Mao (Correct Solar Month)');

  // Day: Gui-Si (Snake)
  t.is(result.baZi.day.stem + result.baZi.day.branch, '癸巳', 'Day should be Gui-Si');
});


test('Flexible Input: solarToLunar with numerical arguments', t => {
  // 2024-12-28 15:45:30
  const result = solarToLunar(2024, 12, 28, 15, 45, 30);

  t.is(result.solar.year, 2024);
  t.is(result.solar.month, 12);
  t.is(result.solar.day, 28);
  t.is(result.solar.time.hour, 15);
  t.is(result.solar.time.minute, 45);
  t.is(result.solar.time.second, 30);
});

test('Flexible Input: lunarToSolar with numerical arguments and time', t => {
  // Lunar 2025-11-9 12:30:00
  const result = lunarToSolar(2025, 11, 9, false, 12, 30, 0);

  t.is(result.lunar.year, 2025);
  t.is(result.lunar.month, 11);
  t.is(result.lunar.day, 9);
  t.is(result.solar.time.hour, 12);
  t.is(result.solar.time.minute, 30);
  t.is(result.solar.time.second, 0);
});
