# Soluna

[![CI](https://github.com/mirageglobe/yalc/actions/workflows/ci.yml/badge.svg)](https://github.com/mirageglobe/yalc/actions/workflows/ci.yml)

A JavaScript library for converting between Gregorian (solar) and Chinese lunar calendar dates.

**Maintainer:** Jimmy Lim <mirageglobe@gmail.com>

---

## Features

- **Solar to Lunar** conversion
- **Lunar to Solar** conversion (with leap month support)
- **Chinese zodiac animals** (12-year cycle)
- **Time periods** (时辰) - Traditional 12 two-hour periods
- **Stem-Branch system** (干支) - Year, month, day pillars
- **BaZi (Eight Characters)** - Precise Month Pillar calculation using Solar Terms (24 Jie Qi)
- **Lunar day formatting** - Chinese character representation
- **Festival detection** - Solar, lunar, and religious festivals
- **Date range:** 1900-2100

---

## Quick Start

> **Note:** npm publish is not yet set up. Until then, copy `yalc.js` directly into your project.

### Node.js

```javascript
const { solarToLunar, lunarToSolar } = require('./soluna.js');

// Solar to Lunar — Date Object
const result1 = solarToLunar(new Date());

// Solar to Lunar — Numerical (Year, Month, Day, Hour, Min, Sec)
const result2 = solarToLunar(2024, 12, 28, 15, 30, 0);

console.log(result2.lunar);
// Output: { year: 2024, month: 11, day: 28, dayName: '廿八', ... }

// BaZi (Eight Characters) with Hour Pillar
console.log(result2.baZi);
/* Output:
{
  year: { stem: '甲', branch: '辰' },
  month: { stem: '丙', branch: '子' },
  day: { stem: '辛', branch: '未' },
  hour: { stem: '丙', branch: '申' }
}
*/

// Lunar to Solar — Date Object + isLeap
const solar1 = lunarToSolar(new Date(2012, 3, 7), false);

// Lunar to Solar — Numerical (Year, Month, Day, isLeap, Hour, Min, Sec)
const solar2 = lunarToSolar(2012, 4, 7, false, 12, 0, 0);

console.log(solar2.solar);
// Output: { year: 2012, month: 4, day: 27, time: { hour: 12, ... }, ... }
```

### Browser

Copy `soluna.js` into your project and include it via a script tag. The library is available as `window.Soluna`.

```html
<script src="soluna.js"></script>
<script>
  const { solarToLunar, lunarToSolar } = window.Soluna;

  const result = solarToLunar(new Date());
  console.log(result.lunar);
</script>
```

### Requirements

- Node.js >= 14, or any modern browser
- No build step or bundler required

---

## Festival Data

The library returns festival information in the `festivals` object:

```javascript
{
  solar: { name: '元旦', isHoliday: true, english: "New Year's Day" },
  lunar: { name: '春节', isHoliday: true, english: 'Spring Festival', extra: '...' },
  sanniangSha: false  // Wedding inauspicious day warning
}
```

### Included Festivals

| Category | Count | Examples |
|----------|-------|----------|
| **Solar Festivals** | 13 | 元旦, 情人节, 劳动节, 国庆节, 圣诞节 |
| **Major Lunar Festivals** | 8 | 春节, 元宵节, 端午节, 七夕, 中秋节, 重阳节, 腊八节, 除夕 |
| **Buddhist Dates** | 6 | 释迦牟尼佛诞, 观世音菩萨圣旦/成道/出家日, 地藏王菩萨诞 |
| **Taoist Dates** | 6 | 玉皇大帝诞, 太上老君圣旦, 关公圣旦, 妈祖圣旦, 值年太岁 |
| **Folk Traditions** | 8+ | 龙抬头, 头牙/尾牙, 送神/迎神日, 寒衣节, 下元节 |
| **三娘煞日** | 6/month | Days 3, 7, 13, 18, 22, 27 (wedding warnings) |
| **24 Solar Terms** | 24 | 立春→冬至 (data defined) |

---

## Testing

```bash
make test
```

---

## Known Issues

**Time Boundary**: The hour 23:00-01:00 (子时/Rat time) is considered part of the **next day** in traditional Chinese timekeeping. This is handled automatically by the library but may seem counterintuitive.

---

## Contributing

Contributions are welcome. Before submitting a PR, run `make test`. See [SPEC.md](SPEC.md) for architecture and build details.

---

## References

- [lunar-javascript](https://github.com/6tail/lunar-javascript) - Reference implementation
- [Programming Hunter Article](https://www.programminghunter.com/article/85501142176/) - Algorithm explanation
- [晶晶的博客](https://blog.jjonline.cn/userInterFace/173.html) - Extended lunar data source (1900-2100)

---

## License

Apache License 2.0 - See [LICENSE](LICENSE) file for details

See [SPEC.md](SPEC.md#roadmap) for the project roadmap.
