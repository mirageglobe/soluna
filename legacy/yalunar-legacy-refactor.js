/**
 * YALC - Yet Another Lunar Calendar Converter
 *
 * @author Jimmy Lim (mirageglobe@gmail.com)
 * @version 2.0.0
 */

class LunarCalendar {
  constructor() {
    this.initializeConstants();
  }

  /**
   * Initialize all constant data used for lunar calendar calculations
   */

  initializeConstants() {
    // Lunar calendar data from 1900-2049
    // Each hex value encodes month lengths and leap month info
    this.lunarInfo = [
      0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
      0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
      0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
      0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
      0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
      0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0,
      0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
      0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6,
      0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
      0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
      0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
      0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
      0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
      0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
      0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0
    ];

    // Chinese characters for numbers, stems, branches, etc.
    this.heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    this.earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    this.zodiacAnimals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
    this.dayNames = ['日', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    this.dayPrefixes = ['初', '十', '廿', '卅'];
    this.monthNames = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '腊'];

    // 24 Solar Terms
    this.solarTerms = [
      '小寒', '大寒', '立春', '雨水', '惊蛰', '春分',
      '清明', '谷雨', '立夏', '小满', '芒种', '夏至',
      '小暑', '大暑', '立秋', '处暑', '白露', '秋分',
      '寒露', '霜降', '立冬', '小雪', '大雪', '冬至'
    ];

    // Base date for calculations (Jan 31, 1900)
    this.baseDate = new Date(1900, 0, 31);
    this.baseDateValue = this.baseDate.valueOf();
    this.millisecondsPerDay = 86400000;
  }

  /**
   * Convert Gregorian (solar) date to Lunar date
   * @param {Date} solarDate - The Gregorian date to convert
   * @returns {Object} Comprehensive lunar calendar information
   */

  solarToLunar(solarDate) {
    if (!(solarDate instanceof Date) || isNaN(solarDate.getTime())) {
      throw new Error('Invalid date provided');
    }

    const normalizedDate = new Date(solarDate.getFullYear(), solarDate.getMonth(), solarDate.getDate());
    const lunarInfo = this.calculateLunarDate(normalizedDate);

    return this.createCalendarInfo({
      solarDate: normalizedDate,
      lunarInfo: lunarInfo,
      isConvertingFromSolar: true
    });
  }

  /**
   * Convert Lunar date to Gregorian (solar) date
   * @param {Date} lunarDate - The lunar date to convert (year, month-1, day format)
   * @param {boolean} isLeapMonth - Whether the month is a leap month
   * @returns {Object} Comprehensive calendar information
   */

  lunarToSolar(lunarDate, isLeapMonth = false) {
    if (!(lunarDate instanceof Date) || isNaN(lunarDate.getTime())) {
      throw new Error('Invalid date provided');
    }

    const solarInfo = this.calculateSolarDate(lunarDate, isLeapMonth);
    const lunarInfo = {
      year: lunarDate.getFullYear(),
      month: lunarDate.getMonth() + 1,
      day: lunarDate.getDate(),
      isLeap: isLeapMonth
    };

    return this.createCalendarInfo({
      solarDate: new Date(solarInfo.year, solarInfo.month, solarInfo.day),
      lunarInfo: lunarInfo,
      isConvertingFromSolar: false
    });
  }

  /**
   * Calculate lunar date information from solar date
   * @private
   */

  calculateLunarDate(solarDate) {
    const dayOffset = Math.round((solarDate.valueOf() - this.baseDateValue) / this.millisecondsPerDay);
    let totalDays = dayOffset;
    let year = 1900;

    // Find the lunar year
    while (year < 2050 && totalDays > 0) {
      const yearDays = this.getLunarYearDays(year);
      if (totalDays < yearDays) break;
      totalDays -= yearDays;
      year++;
    }

    if (totalDays < 0) {
      year--;
      totalDays += this.getLunarYearDays(year);
    }

    // Find the lunar month and day
    const leapMonth = this.getLeapMonth(year);
    let month = 1;
    let isLeapMonth = false;

    while (month <= 12 && totalDays > 0) {
      let monthDays;

      // Handle leap month
      if (leapMonth > 0 && month === leapMonth + 1 && !isLeapMonth) {
        month--;
        isLeapMonth = true;
        monthDays = this.getLeapMonthDays(year);
      } else {
        monthDays = this.getMonthDays(year, month);
      }

      if (totalDays < monthDays) break;

      totalDays -= monthDays;

      if (isLeapMonth) {
        isLeapMonth = false;
      }
      month++;
    }

    // Handle edge case for leap month
    if (totalDays === 0 && leapMonth > 0 && month === leapMonth + 1) {
      if (isLeapMonth) {
        isLeapMonth = false;
      } else {
        isLeapMonth = true;
        month--;
      }
    }

    if (totalDays < 0) {
      month--;
      totalDays += this.getMonthDays(year, month);
    }

    return {
      year: year,
      month: month,
      day: totalDays + 1,
      isLeap: isLeapMonth
    };
  }

  /**
   * Calculate solar date from lunar date
   * @private
   */
  calculateSolarDate(lunarDate, isLeapMonth) {
    const lunarYear = lunarDate.getFullYear();
    const lunarMonth = lunarDate.getMonth() + 1;
    const lunarDay = lunarDate.getDate();

    let totalDays = 0;

    // Add days for complete years
    for (let year = 1900; year < lunarYear; year++) {
      totalDays += this.getLunarYearDays(year);
    }

    // Add days for complete months in the current year
    for (let month = 1; month < lunarMonth; month++) {
      if (month === this.getLeapMonth(lunarYear)) {
        totalDays += this.getLeapMonthDays(lunarYear);
      }
      totalDays += this.getMonthDays(lunarYear, month);
    }

    // If current month is leap month, add normal month days
    if (isLeapMonth && this.getLeapMonth(lunarYear) === lunarMonth) {
      totalDays += this.getMonthDays(lunarYear, lunarMonth);
    }

    // Add days in current month
    totalDays += lunarDay - 1;

    const solarDate = new Date(this.baseDateValue + totalDays * this.millisecondsPerDay);

    return {
      year: solarDate.getFullYear(),
      month: solarDate.getMonth(),
      day: solarDate.getDate()
    };
  }

  /**
   * Create comprehensive calendar information object
   * @private
   */
  createCalendarInfo({ solarDate, lunarInfo, isConvertingFromSolar }) {
    const solarYear = solarDate.getFullYear();
    const solarMonth = solarDate.getMonth();
    const solarDay = solarDate.getDate();
    const weekDay = this.dayNames[solarDate.getDay()];

    // Calculate Chinese calendar cycles
    const stemBranchInfo = this.calculateStemBranch(solarYear, solarMonth, solarDay);

    return {
      // Solar (Gregorian) calendar info
      solar: {
        year: solarYear,
        month: solarMonth + 1,
        day: solarDay,
        weekDay: weekDay
      },

      // Lunar calendar info
      lunar: {
        year: lunarInfo.year,
        month: lunarInfo.month,
        day: lunarInfo.day,
        isLeapMonth: lunarInfo.isLeap,
        monthName: this.monthNames[lunarInfo.month - 1],
        dayName: this.formatLunarDay(lunarInfo.day),
        zodiac: this.zodiacAnimals[(lunarInfo.year - 1900) % 12]
      },

      // Chinese stem-branch calendar
      stemBranch: {
        year: stemBranchInfo.year,
        month: stemBranchInfo.month,
        day: stemBranchInfo.day
      },

      // Additional information
      solarTerms: this.getSolarTerm(solarYear, solarMonth, solarDay),
      festivals: this.getFestivals(solarYear, solarMonth + 1, solarDay, lunarInfo)
    };
  }

  /**
   * Get total days in a lunar year
   * @private
   */
  getLunarYearDays(year) {
    let totalDays = 348; // Base days (12 months × 29 days)
    const yearInfo = this.lunarInfo[year - 1900];

    // Add extra days for big months (30 days instead of 29)
    for (let i = 0x8000; i > 0x8; i >>= 1) {
      totalDays += (yearInfo & i) ? 1 : 0;
    }

    return totalDays + this.getLeapMonthDays(year);
  }

  /**
   * Get days in leap month (0 if no leap month)
   * @private
   */
  getLeapMonthDays(year) {
    const leapMonth = this.getLeapMonth(year);
    if (leapMonth === 0) return 0;

    const yearInfo = this.lunarInfo[year - 1900];
    return (yearInfo & 0x10000) ? 30 : 29;
  }

  /**
   * Get which month is the leap month (0 if none)
   * @private
   */
  getLeapMonth(year) {
    return this.lunarInfo[year - 1900] & 0xf;
  }

  /**
   * Get days in a specific lunar month
   * @private
   */
  getMonthDays(year, month) {
    const yearInfo = this.lunarInfo[year - 1900];
    return (yearInfo & (0x10000 >> month)) ? 30 : 29;
  }

  /**
   * Format lunar day into Chinese characters
   * @private
   */
  formatLunarDay(day) {
    switch (day) {
      case 10: return '初十';
      case 20: return '二十';
      case 30: return '三十';
      default:
        return this.dayPrefixes[Math.floor(day / 10)] + this.dayNames[day % 10];
    }
  }

  /**
   * Calculate stem-branch (干支) information
   * @private
   */
  calculateStemBranch(year, month, day) {
    // Simplified stem-branch calculation
    const yearStemBranch = this.getStemBranch(year - 1900 + 36);
    const monthStemBranch = this.getStemBranch((year - 1900) * 12 + month + 12);

    // Day calculation based on days since epoch
    const dayOffset = Math.floor(Date.UTC(year, month, day) / this.millisecondsPerDay) + 25567 + 10;
    const dayStemBranch = this.getStemBranch(dayOffset + day - 1);

    return {
      year: yearStemBranch,
      month: monthStemBranch,
      day: dayStemBranch
    };
  }

  /**
   * Get stem-branch combination from number
   * @private
   */
  getStemBranch(num) {
    return this.heavenlyStems[num % 10] + this.earthlyBranches[num % 12];
  }

  /**
   * Get solar term for specific date
   * @private
   */
  getSolarTerm(year, month, day) {
    // Simplified solar term calculation
    // This would need the full solar term calculation logic
    return '';
  }

  /**
   * Get festivals for specific date
   * @private
   */
  getFestivals(solarYear, solarMonth, solarDay, lunarInfo) {
    return {
      solar: '',
      lunar: ''
    };
  }

  /**
   * Check if a Gregorian year is a leap year
   * @private
   */
  isLeapYear(year) {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  }
}

// Example usage and testing
const lunarCalendar = new LunarCalendar();

// Test solar to lunar conversion with time
const testDateTime1 = new Date('1980-03-21T23:30:35');
const result1 = lunarCalendar.solarToLunar(testDateTime1);

console.log('=== Solar to Lunar Conversion (with Time) ===');
console.log(`Solar Date: ${testDateTime1.toLocaleString()}`);
console.log(`Lunar Date: ${result1.lunar.year}-${result1.lunar.month}-${result1.lunar.day}`);
console.log(`Lunar Day Name: ${result1.lunar.dayName}`);
console.log(`Lunar Month Name: ${result1.lunar.monthName}`);
console.log(`Year Zodiac Animal: ${result1.lunar.zodiac}`);
console.log(`Time Period: ${result1.timePeriod.name} (${result1.timePeriod.period})`);
console.log(`Time Zodiac: ${result1.timePeriod.zodiac}`);
console.log(`Time Branch: ${result1.timePeriod.branch}`);
console.log(`Description: ${result1.timePeriod.description}`);
console.log(`Is Leap Month: ${result1.lunar.isLeapMonth}`);

// Test different time periods
console.log('\n=== Time Period Examples ===');
const testTimes = [
  new Date('2023-12-25T00:30:00'), // 子时 (Rat)
  new Date('2023-12-25T02:15:00'), // 丑时 (Ox)
  new Date('2023-12-25T06:45:00'), // 卯时 (Rabbit)
  new Date('2023-12-25T12:00:00'), // 午时 (Horse)
  new Date('2023-12-25T18:30:00'), // 酉时 (Rooster)
  new Date('2023-12-25T23:45:00')  // 子时 (Rat - next day)
];

testTimes.forEach(time => {
  const result = lunarCalendar.solarToLunar(time);
  console.log(`${time.toLocaleTimeString()}: ${result.timePeriod.name} - ${result.timePeriod.zodiac} (${result.timePeriod.period})`);
});

// Test lunar to solar conversion
const testDate2 = new Date(2012, 3, 7); // April 7th in lunar calendar (month is 0-indexed)
const result2 = lunarCalendar.lunarToSolar(testDate2, false);

console.log('\n=== Lunar to Solar Conversion ===');
console.log(`Lunar Date: ${testDate2.getFullYear()}-${testDate2.getMonth()+1}-${testDate2.getDate()}`);
console.log(`Solar Date: ${result2.solar.year}-${result2.solar.month}-${result2.solar.day}`);
console.log(`Week Day: ${result2.solar.weekDay}`);

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LunarCalendar;
} else if (typeof window !== 'undefined') {
  window.LunarCalendar = LunarCalendar;
}