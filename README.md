# Soluna

[![CI](https://github.com/mirageglobe/soluna/actions/workflows/ci.yml/badge.svg)](https://github.com/mirageglobe/soluna/actions/workflows/ci.yml)

Bidirectional Gregorian ↔ Chinese lunar calendar conversion for JavaScript. Zero dependencies. Single file. Node.js and browser.

**Range:** 1900–2100 &nbsp;·&nbsp; **License:** BUSL-1.1

---

## what it does

- `solarToLunar` — Gregorian → lunar date, zodiac, stem-branch (干支), BaZi four pillars, time period (时辰), festivals
- `lunarToSolar` — lunar → Gregorian, leap month aware
- Month pillar calculated against actual solar term boundaries (not Gregorian month edges)
- Festival detection: public holidays, Buddhist and Taoist dates, folk traditions, 三娘煞日

---

## install

No npm package yet — copy `soluna.js` directly into your project.

### Node.js

```js
const { solarToLunar, lunarToSolar } = require('./soluna.js');
```

### Browser

```html
<script src="soluna.js"></script>
<script>
  const { solarToLunar, lunarToSolar } = window.Soluna;
</script>
```

---

## usage

### solar → lunar

```js
const result = solarToLunar(2024, 12, 28, 15, 30, 0);
// or: solarToLunar(new Date())

result.lunar
// { year: 2024, month: 11, day: 28, isLeapMonth: false,
//   monthName: '十一', dayName: '廿八', zodiac: '龙' }

result.baZi
// { year:  { stem: '甲', branch: '辰' },
//   month: { stem: '丙', branch: '子' },
//   day:   { stem: '辛', branch: '未' },
//   hour:  { stem: '丙', branch: '申' } }

result.timePeriod
// { name: '申时', zodiac: '猴', period: '15:00-17:00',
//   branch: '申', description: '晡时，又名日铺、夕食' }

result.festivals
// { solar: null, lunar: null, sanniangSha: false }
```

### lunar → solar

```js
const result = lunarToSolar(2012, 4, 7, false, 12, 0, 0);
// pass true as 4th arg for leap month

result.solar
// { year: 2012, month: 4, day: 27, weekDay: '五',
//   time: { hour: 12, minute: 0, second: 0 } }
```

### festival lookup

```js
const cny = solarToLunar(new Date('2025-01-29'));

cny.festivals.lunar
// { name: '春节', isHoliday: true, english: 'Spring Festival',
//   extra: '元始天尊圣旦 弥勒佛圣旦 四始吉日' }
```

---

## output shape

```js
{
  solar:      { year, month, day, weekDay, time: { hour, minute, second } },
  lunar:      { year, month, day, isLeapMonth, monthName, dayName, zodiac },
  stemBranch: { year, month, day, time },        // 干支 strings e.g. '甲辰'
  baZi:       { year, month, day, hour },        // each { stem, branch }
  timePeriod: { name, zodiac, period, branch, description },
  festivals:  { solar, lunar, sanniangSha }
}
```

---

## festival coverage

| category | examples |
|---|---|
| solar (13) | 元旦, 劳动节, 国庆节, 圣诞节 |
| major lunar (8) | 春节, 端午节, 七夕, 中秋节, 除夕 |
| buddhist (13) | 释迦牟尼佛诞/涅槃/成道, 观音圣旦/成道/出家, 文殊, 普贤, 地藏王, 韦陀, 阿弥陀佛, 达摩 |
| taoist (14+) | 玉皇大帝诞, 妈祖, 关帝, 太上老君, 吕洞宾, 王母娘娘, 保生大帝, 文昌, 福德正神 |
| folk (8+) | 龙抬头, 头牙/尾牙, 送神/迎神, 寒衣节, 下元节 |
| 三娘煞日 | days 3, 7, 13, 18, 22, 27 each lunar month (wedding warning) |

---

## notes

**子时 day boundary** — 23:00–01:00 (Rat hour) belongs to the *next* day in traditional Chinese timekeeping. `solarToLunar` adjusts automatically.

**Month pillar** — the BaZi month pillar uses the Jie sectional solar term date, not the Gregorian month edge, so dates near the boundary may differ from naive implementations.

**Precision** — the solar term formula covers 1900–2100 with ≤1 day deviation. VSOP87 would be needed for sub-day precision.

---

## development

```bash
make install   # install dev dependencies
make test      # run AVA test suite
make today     # sanity check: today's lunar + BaZi
make run       # 3-day demo output
```

See [SPEC.md](SPEC.md) for architecture, algorithm detail, and roadmap.

---

## references

- [lunar-javascript](https://github.com/6tail/lunar-javascript) — reference implementation
- [Programming Hunter](https://www.programminghunter.com/article/85501142176/) — algorithm explanation
- [晶晶的博客](https://blog.jjonline.cn/userInterFace/173.html) — extended lunar data 1900–2100

---

## license

BUSL-1.1 — see [LICENSE.md](LICENSE.md)
