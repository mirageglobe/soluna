;(function () {
  const root = this

  /*
    version: 1.0.0
    source: https://github.com/mirageglobe/lunar

    reference
    https://www.programminghunter.com/article/85501142176/
    https://blog.csdn.net/guomainet309/article/details/51802589

    base data about chinese year information
    保存公历农历之间的转换信息:以任意一年作为起点，
    把从这一年起若干年(依需要而定)的农历信息保存起来。 要保存一年的信息，只要两个信息就够了:
    1) 农历每个月的大小
    2) 今年是否有闰月，闰几月以及闰月的大小。

    用一个整数来保存这些信息就足够了。
    具体的方法是:用一位来表示一个月的大小，大月记为1，小月记为0，
    这样就用掉12位(无闰月)或13位(有闰月)，再用高四位来表示闰月的月份，没有闰月记为0。

    example: 2000年的信息数据是0xc96，化成二进制就是110010010110B，
    表示的含义是:1、2、5、8、10、11月大，其余月份小。 2001年的农历信息数据是0x1a95(因为闰月，所以有13位)，
    具体的就是1、2、4、5、8、10、12月大， 其余月份小(0x1a95=1101010010101B)，
    4月的后面那一个0表示的是闰4月小，接着的那个1表示5月大。
    这样就可以用一个数组来保存这些信息。在这里用数组lunarInfo[]来保存这些信息
    0x代表十六进制. i.e 1980年的数据是： 0x095b0

    0x代表十六进制，后面的是十六进制数。
    举个例子：
    1980年的数据是： 0x095b0
    二进制：0000 1001 0101 1011 0000
    1-4: 表示当年有无闰年，有的话，为闰月的月份，没有的话，为0。
    5-16：为除了闰月外的正常月份是大月还是小月，1为30天，0为29天。
    注意：从1月到12月对应的是第16位到第5位。
    17-20：表示闰月是大月还是小月，仅当存在闰月的情况下有意义。
    表示1980年没有闰月，从1月到12月的天数依次为：30、29、29、30、29、30、29、30、30、29、30、30

    0x stands for hexadecimal, followed by a hexadecimal number.
    For example:
    The data for 1980 are: 0x095b0
    Binary: 0000 1001 0101 1011 0000
    1-4: Indicates whether there is a leap year in the current year, if there is, it is the month of the leap month, if not, it is 0.
    5-16: Whether the normal month other than a leap month is a major or minor month, 1 is 30 days and 0 is 29 days. Note: From January to December corresponds to positions 16th to 5th.
    17-20: Indicates whether a leap month is a major or minor month, and only makes sense if a leap month exists
    Indicates that there was no leap month in 1980, and the number of days from January to December was: 30, 29, 29, 30, 30, 29, 30, 29, 30, 30.
    when testing, from hexadecimal to binary, the first four zeros 0000 are ignored ( https://www.rapidtables.com/convert/number/hex-to-binary.html )
   */

  const lunarInfo = [
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
    0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0]

  const gan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
  const zhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
  const zodiac = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']

  // TODO is this needed?
  const sTermInfo = [
    0, 21208, 42467, 63836, 85337, 107014, 128867, 150921, 173149, 195551,
    218072, 240693, 263343, 285989, 308563, 331033, 353350, 375494, 397447, 419210,
    440795, 462224, 483532, 504758]

  const nStr1 = ['日', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
  const nStr2 = ['初', '十', '廿', '卅', '□']

  // let monthName = new Array("JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC")
  const cmonthName = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '腊']

  // 公历节日 *表示放假日
  const sFtv = [
    '0101*元旦',
    '0214 情人节',
    '0308 妇女节',
    '0312 植树节',
    '0401 愚人节',
    '0422 地球日',
    '0501 劳动节',
    '0504 青年节',
    '0601 儿童节',
    '0910 教师节',
    '1224 平安夜',
    '1225 圣诞节'
  ]

  // 某月的第几个星期几。 5,6,7,8 表示到数第 1,2,3,4 个星期几
  const wFtv = new Array(
    // 一月的最后一个星期日（月倒数第一个星期日）
    '1144 感恩节'
  )

  // 农历节日
  const lFtv = [
    '0101*春节 元始天尊圣旦 四始吉日',
    '0103 三娘煞日',
    '0104 迎神日',
    '0107 三娘煞日',
    '0115 元宵节',
    '0202 龙抬头 福德正神圣旦',
    '0203 文昌圣旦 三娘煞日',
    '0207 三娘煞日',
    '0215 释迦牟尼涅槃 太上老君圣旦 九天玄女圣旦',
    '0216 头牙祭拜地主日',
    '0219 观世音菩萨圣旦',
    '0303 三娘煞日',
    '0307 三娘煞日',
    '0401 四始吉日',
    '0403 三娘煞日',
    '0407 三娘煞日',
    '0408 释迦牟尼佛旦',
    '0505 端午节',
    '0513 三娘煞日',
    '0518 三娘煞日',
    '0613 三娘煞日',
    '0618 三娘煞日',
    '0619 观世音菩萨成道日',
    '0624 关公圣旦',
    '0701 四始吉日',
    '0707 七夕',
    '0713 三娘煞日',
    '0715 中元节',
    '0718 三娘煞日',
    '0719 值年太岁圣旦',
    '0813 三娘煞日',
    '0815 中秋节',
    '0818 三娘煞日',
    '0909 重阳节',
    '0919 观世音菩萨出家日',
    '0922 三娘煞日',
    '0927 三娘煞日',
    '1001 四始吉日',
    '1022 三娘煞日',
    '1027 三娘煞日',
    '1122 三娘煞日',
    '1127 三娘煞日',
    '1208 腊八节',
    '1216 尾牙谢地主日',
    '1222 三娘煞日',
    '1223 小年',
    '1227 三娘煞日',
    '1224 送神吉日',
    '1225 天官巡人间',
    '0100*除夕'
  ]

  // 返回农历 y年的总天数
  function lYearDays (y) {
    let i
    let sum = 348

    for (i = 0x8000; i > 0x8; i >>= 1) sum += (lunarInfo[y - 1900] & i) ? 1 : 0
    return (sum + leapDays(y))
  }

  // 返回农历 y年的闰月的天数
  function leapDays (y) {
    if (leapMonth(y)) return ((lunarInfo[y - 1900] & 0x10000) ? 30 : 29)
    else return (0)
  }

  // 返回农历 y年闰哪个月 1-12，没闰返回 0
  function leapMonth (y) {
    return (lunarInfo[y - 1900] & 0xf)
  }

  // 返回农历 y年m月的总天数
  function monthDays (y, m) {
    return ((lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29)
  }

  // 算出农历，传入日期对象，返回农历日期日期对象
  // 该对象属性有 .year .month .day .isLeap .yearCyl .dayCyl .monCyl
  function Lunar (date) {
    const objDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    let i
    let leap = 0
    let temp = 0
    let offset = 0
    const baseDate = new Date(1900, 0, 31)

    // mac和linux平台的firefox在此处会产生浮点数错误
    offset = Math.round((objDate - baseDate) / 86400000)

    this.dayCyl = offset + 40
    this.monCyl = 14

    for (i = 1900; i < 2050 && offset > 0; i++) {
      temp = lYearDays(i)
      offset -= temp
      this.monCyl += 12
    }

    if (offset < 0) {
      offset += temp
      i--
      this.monCyl -= 12
    }

    this.year = i
    this.yearCyl = i - 1864

    leap = leapMonth(i) // 闰哪个月
    this.isLeap = false

    for (i = 1; i < 13 && offset > 0; i++) {
      // 闰月
      if (leap > 0 && i === (leap + 1) && this.isLeap === false) {
        --i; this.isLeap = true; temp = leapDays(this.year)
      } else {
        temp = monthDays(this.year, i)
      }

      // 解除闰月
      if (this.isLeap === true && i === (leap + 1)) this.isLeap = false

      offset -= temp
      if (this.isLeap === false) this.monCyl++
    }

    if (offset === 0 && leap > 0 && i === leap + 1) {
      if (this.isLeap) {
        this.isLeap = false
      } else {
        this.isLeap = true; --i; --this.monCyl
      }
    }

    if (offset < 0) {
      offset += temp
      --i
      --this.monCyl
    }

    this.month = i
    this.day = offset + 1
  }

  /*
   * lunar to solar
  */

  // year .month .day .isLeap .yearCyl .dayCyl .monCyl
  function Solar (date, isLeapMonth) {
    const lyear = date.getFullYear()
    const lmonth = date.getMonth() + 1
    const lday = date.getDate()
    const leap = isLeap(lyear)
    let offset = 0
    let i

    // increment year
    for (i = 1900; i < lyear; i++) {
      offset += lYearDays(i)
    }

    // increment month
    // add days in all months up to the current month
    for (i = 1; i < lmonth; i++) {
      // add extra days for leap month
      if (i === leapMonth(lyear)) {
        offset += leapDays(lyear)
      }
      offset += monthDays(lyear, i)
    }
    // if current month is leap month, add days in normal month
    if (leap && isLeapMonth) {
      offset += monthDays(lyear, i)
    }

    // increment
    offset += parseInt(lday) - 1

    const baseDate = new Date(1900, 0, 31)
    const solarDate = new Date(baseDate.valueOf() + offset * 86400000)

    this.year = solarDate.getFullYear()
    this.month = solarDate.getMonth()
    this.day = solarDate.getDate()
    this.isLeap = leap
  }

  function isLeap (year) {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
  }

  function getAnimalYear (year) {
    return zodiac[((year - 1900) % 12)]
  }

  // 传入 offset 返回干支, 0=甲子
  function cyclical (num) {
    return (gan[num % 10] + zhi[num % 12])
  }

  // 返回该年的复活节(春分后第一次满月周后的第一主日)
  function easter (y) {
    const term2 = sTerm(y, 5) // 取得春分日期
    const dayTerm2 = new Date(Date.UTC(y, 2, term2, 0, 0, 0, 0)) // 取得春分的公历日期控件(春分一定出现在3月)
    const lDayTerm2 = new Lunar(dayTerm2) // 取得取得春分农历
    let lMlen

    if (lDayTerm2.day < 15) { // 取得下个月圆的相差天数
      lMlen = 15 - lDayTerm2.day
    } else {
      lMlen = (lDayTerm2.isLeap ? leapDays(y) : monthDays(y, lDayTerm2.month)) - lDayTerm2.day + 15
    }

    // 一天等于 1000*60*60*24 = 86400000 毫秒
    const l15 = new Date(dayTerm2.getTime() + 86400000 * lMlen) // 求出第一次月圆为公历几日
    const dayEaster = new Date(l15.getTime() + 86400000 * (7 - l15.getUTCDay())) // 求出下个周日

    this.m = dayEaster.getUTCMonth()
    this.d = dayEaster.getUTCDate()
  }

  // 中文日期
  function getCDay (d) {
    let s

    switch (d) {
      case 10:
        s = '初十'
        break
      case 20:
        s = '二十'
        break
      case 30:
        s = '三十'
        break
      default :
        s = nStr2[Math.floor(d / 10)]
        s += nStr1[d % 10]
    }
    return (s)
  }

  /*
   * 24 节气
   */

  const solarTerm = [
    '小寒', '大寒', '立春', '雨水', '惊蛰', '春分',
    '清明', '谷雨', '立夏', '小满', '芒种', '夏至',
    '小暑', '大暑', '立秋', '处暑', '白露', '秋分',
    '寒露', '霜降', '立冬', '小雪', '大雪', '冬至'
  ]

  const solarTermBase = [4, 19, 3, 18, 4, 19, 4, 19, 4, 20, 4, 20, 6, 22, 6, 22, 6, 22, 7, 22, 6, 21, 6, 21]
  const solarTermIdx = '0123415341536789:;<9:=<>:=1>?012@015@015@015AB78CDE8CD=1FD01GH01GH01IH01IJ0KLMN;LMBEOPDQRST0RUH0RVH0RWH0RWM0XYMNZ[MB\\]PT^_ST`_WH`_WH`_WM`_WM`aYMbc[Mde]Sfe]gfh_gih_Wih_WjhaWjka[jkl[jmn]ope]qph_qrh_sth_W'
  const solarTermOS = '211122112122112121222211221122122222212222222221222122222232222222222222222233223232223232222222322222112122112121222211222122222222222222222222322222112122112121222111211122122222212221222221221122122222222222222222222223222232222232222222222222112122112121122111211122122122212221222221221122122222222222222221211122112122212221222211222122222232222232222222222222112122112121111111222222112121112121111111222222111121112121111111211122112122112121122111222212111121111121111111111122112122112121122111211122112122212221222221222211111121111121111111222111111121111111111111111122112121112121111111222111111111111111111111111122111121112121111111221122122222212221222221222111011111111111111111111122111121111121111111211122112122112121122211221111011111101111111111111112111121111121111111211122112122112221222211221111011111101111111110111111111121111111111111111122112121112121122111111011111121111111111111111011111111112111111111111011111111111111111111221111011111101110111110111011011111111111111111221111011011101110111110111011011111101111111111211111001011101110111110110011011111101111111111211111001011001010111110110011011111101111111110211111001011001010111100110011011011101110111110211111001011001010011100110011001011101110111110211111001010001010011000100011001011001010111110111111001010001010011000111111111111111111111111100011001011001010111100111111001010001010000000111111000010000010000000100011001011001010011100110011001011001110111110100011001010001010011000110011001011001010111110111100000010000000000000000011001010001010011000111100000000000000000000000011001010001010000000111000000000000000000000000011001010000010000000'

  // 形式如function sTerm(year, n)，用来计算某年的第n个节气（从0小寒算起）为几号，这也基本被认可为节气计算的基本形式。由于没个月份有两个节气，计算时需要调用两次（n和n+1）
  // 某年的第n个节气为几日（从0小寒起算）
  function sTerm (y, n) {
    return (solarTermBase[n] + Math.floor(solarTermOS.charAt((Math.floor(solarTermIdx.charCodeAt(y - 1900)) - 48) * 24 + n)))
  }

  /*
   * CalElement model
   */

  // 阴历属性
  function CalElement (sYear, sMonth, sDay, week, lYear, lMonth, lDay, isLeap, cYear, cMonth, cDay) {
    // 瓣句
    this.sYear = sYear // 公元年4位数字
    this.sMonth = sMonth // 公元月数字
    this.sDay = sDay // 公元日数字
    this.week = week // 星期, 1个中文

    // 农历
    this.lYear = lYear // 公元年4位数字
    this.lMonth = lMonth // 农历月数字
    this.lDay = lDay // 农历日数字
    this.isLeap = isLeap // 是否为农历闰月?

    // 八字
    this.cYear = cYear // 年柱, 2个中文
    this.cMonth = cMonth // 月柱, 2个中文
    this.cDay = cDay // 日柱, 2个中文

    this.lunarDay = getCDay(lDay)
    this.lunarMonth = cmonthName[lMonth - 1]
    this.lunarYear = getAnimalYear(lYear)

    this.lunarFestival = '' // 农历节日
    this.solarFestival = '' // 公历节日
    this.solarTerms = '' // 节气
  }

  // date's month should be -1, example: 2012-5-21 -> new Date(2012, 4, 21)
  // no matter solar or lunar
  function Lune () {
    this.solar2lunar = function (date) {
      const sYear = date.getFullYear()
      const sMonth = date.getMonth()
      const sDay = date.getDate()
      const weekDay = nStr1[date.getDay()]
      const lunar = new Lunar(date)
      const lunarYear = lunar.year
      const lunarMonth = lunar.month
      const lunarDay = lunar.day
      const isLeap = lunar.isLeap

      return addFstv(sYear, sMonth, sDay, weekDay, lunarYear, lunarMonth, lunarDay, isLeap)
    }

    this.lunar2solar = function (date, isLeapMonth) {
      const lunarYear = date.getFullYear()
      const lunarMonth = date.getMonth() + 1
      const lunarDay = date.getDate()
      const solar = new Solar(date, isLeapMonth)
      const sYear = solar.year
      const sMonth = solar.month
      const sDay = solar.day
      const weekDay = nStr1[new Date(sYear, sMonth, sDay).getDay()]
      const isLeap = solar.isLeap

      return addFstv(sYear, sMonth, sDay, weekDay, lunarYear, lunarMonth, lunarDay, isLeap)
    }
  }

  function addFstv (sYear, sMonth, sDay, weekDay, lunarYear, lunarMonth, lunarDay, isLeap) {
    let cYear
    let cMonth
    let cDay = ''
    let that = {}

    // 年柱 1900年立春后为庚子年(60进制36)
    if (sMonth < 2) {
      cYear = cyclical(sYear - 1900 + 36 - 1)
    } else {
      cYear = cyclical(sYear - 1900 + 36)
    }

    const term2 = sTerm(sYear, 2) // 立春日期

    // 月柱 1900年1月小寒以前为 丙子月(60进制12)
    const firstNode = sTerm(sYear, sMonth * 2) // 返回当月「节」为几日开始
    cMonth = cyclical((sYear - 1900) * 12 + sMonth + 12)

    // 依节气调整二月分的年柱, 以立春为界
    if (sMonth === 1 && sDay >= term2) cYear = cyclical(sYear - 1900 + 36)

    // 依节气月柱, 以「节」为界
    if (sDay >= firstNode) cMonth = cyclical((sYear - 1900) * 12 + sMonth + 13)

    // 当月一日与 1900/1/1 相差天数
    // 1900/1/1与 1970/1/1 相差25567日, 1900/1/1 日柱为甲戌日(60进制10)
    const dayCyclical = Date.UTC(sYear, sMonth, 1, 0, 0, 0, 0) / 86400000 + 25567 + 10

    // 日柱
    cDay = cyclical(dayCyclical + sDay - 1)

    // sYear, sMonth, sDay, weekDay, lYear, lMonth, lDay, isLeap, cYear, cMonth, cDay
    that = new CalElement(sYear, sMonth + 1, sDay, weekDay, lunarYear, lunarMonth, lunarDay, isLeap, cYear, cMonth, cDay)

    // 节气
    let tmp1 = sTerm(sYear, sMonth * 2) - 1
    let tmp2 = sTerm(sYear, sMonth * 2 + 1) - 1

    if (tmp1 === (sDay - 1)) {
      that.solarTerms = solarTerm[sMonth * 2]
    }
    if (tmp2 === (sDay - 1)) {
      that.solarTerms = solarTerm[sMonth * 2 + 1]
    }

    // 公历节日
    let i
    let item

    for (i = 0; item = sFtv[i]; i++) {
      if (item.match(/^(\d{2})(\d{2})([\s*])(.+)$/)) {
        if (Number(RegExp.$1) === (sMonth + 1)) {
          if (Number(RegExp.$2) === sDay) {
            that.solarFestival += RegExp.$4 + ' '
          }
        }
      }
    }

    // 月周节日
    for (i = 0; item = wFtv[i]; i++) {
      if (item.match(/^(\d{2})(\d)(\d)([\s*])(.+)$/)) {
        if (Number(RegExp.$1) === (sMonth + 1)) {
          tmp1 = Number(RegExp.$2)
          tmp2 = Number(RegExp.$3)
          if (tmp1 < 5) {
            const wFtvDate = (tmp2 === 0 ? 7 : 0) + (tmp1 - 1) * 7 + tmp2
            if (wFtvDate === sDay) {
              that.solarFestival += RegExp.$5 + ' '
              break
            }
          }
        }
      }
    }

    let lMonLen

    // 农历节日
    for (i = 0; item = lFtv[i]; i++) {
      if (item.match(/^(\d{2})(.{2})([\s*])(.+)$/)) {
        tmp1 = Number(RegExp.$1)
        tmp2 = Number(RegExp.$2)
        lMonLen = monthDays(lunarYear, lunarMonth)

        // 月份是12月，且为最后一天，则设置为春节
        if ((tmp1 === lunarMonth && tmp2 === lunarDay) || (tmp2 === '00' && lunarMonth === 12 && lMonLen === lunarDay)) {
          that.lunarFestival += RegExp.$4 + ' '
          break
        }
      }
    }
    return that
  }

  // ************************************************************
  // * main example
  // ************************************************************

  // Date(yyyy, mm, dd, hh, mm, ss) where month mm jan = 0, feb = 1, ...
  // 2021, 11, 28, 2, 0, 0

  // const greDate = '2021-01-01 18:30:35'
  const greDate = '1980-03-21 23:30:35'
  console.log(greDate.toString())

  const yalunar = new Lune()
  const calDate = yalunar.solar2lunar(new Date(greDate.toString()))

  // let calDate = lalune.lunar2solar(new Date(2011, 0, 3))
  // 2010,11,29

  // let calDate = lalune.solar2lunar(new Date(2010, 10, 29))
  // 2011, 1, 3

  // 农历转公历时，如果那一月是那一年的闰月，则需额外传一个参数，才能得到正确的公历日期
  // let calDate = lalune.solar2lunar(new Date(2012, 4, 27))
  // 2012年4月初7, 其中 isLeap为true，表示为闰四月

  // let calDate = lalune.lunar2solar(new Date(2012, 3, 7))
  // 得到错误时间：2012, 4, 27

  // let calDate = lalune.lunar2solar(new Date(2012, 3, 7), true)
  // 正确: 2012, 5, 27

  console.log('lunar-day : ' + calDate.lunarDay + ' ' + calDate.cDay)
  console.log('lunar-month : ' + calDate.lunarMonth + ' ' + calDate.cMonth)
  console.log('lunar-year : ' + calDate.lunarYear + ' ' + calDate.cYear)
  console.log('lunar-festival : ' + calDate.lunarFestival)
  console.log('solar-day : ' + calDate.sDay)
  console.log('solar-month : ' + calDate.sMonth)
  console.log('solar-year : ' + calDate.sYear)
  console.log('solar-festival : ' + calDate.solarFestival)

  /*
   * example:
   * let lalune = new Lune()
   *
   * lalune.lunar2solar(new Date(2011, 0, 3))         --> 2010,11,29
   * lalune.solar2lunar(new Date(2010, 10, 29))       --> 2011, 1, 3
   *
   * 农历转公历时，如果那一月是那一年的闰月，则需额外传一个参数，才能得到正确的公历日期
   * lalune.solar2lunar(new Date(2012, 4, 27))        --> 2012年4月初7, 其中 isLeap为true，表示为闰四月
   * lalune.lunar2solar(new Date(2012, 3, 7))         --> 得到错误时间：2012, 4, 27
   * lalune.lunar2solar(new Date(2012, 3, 7), true)   --> 正确: 2012, 5, 27
   *
   * result:
   *  {
   *    cDay: "戊戌"
   *    , cMonth: "丁未"
   *    , cYear: "壬辰"
   *    , isLeap: false             // 该月是否为闰月
   *    , lDay: 18
   *    , lMonth: 6
   *    , lYear: 2012
   *    , lunarDay: "十八"
   *    , lunarFestival: ""
   *    , lunarMonth: "六"
   *    , lunarYear: "龙"
   *    , sDay: 5
   *    , sMonth: 8
   *    , sYear: 2012
   *    , solarFestival: ""         // 节日
   *    , solarTerms: ""            // 节气
   *    , week: "日"                // 周几
   *  }
   */
})()
