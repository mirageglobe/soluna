# Soluna — Technical Specification

## overview

single-file JavaScript library for bidirectional conversion between Gregorian (solar) and Chinese lunar calendar dates. exports functions for solar↔lunar conversion, BaZi (八字) four-pillar calculation, time periods (时辰), festival lookup, and 24 solar terms.

supports node.js (CommonJS) and browser (window global).

---

## architecture

```
soluna/
├── examples/
│   ├── run.js           # dev runner (3-day view)
│   └── test-ui.html     # browser-based visual test UI
├── legacy/
│   ├── yalunar-legacy.js
│   └── yalunar-legacy-refactor.js
├── test/
│   └── soluna.test.mjs  # node:test suite
├── soluna.js            # entire library — constants, utilities, core, public API
├── Makefile             # build/dev targets
└── package.json         # node metadata, npm publish files list
```

### module layout (within soluna.js)

| section | description |
| :--- | :--- |
| constants | `LUNAR_INFO`, stems, branches, zodiac, day/month names, time periods, festivals, solar term data |
| utility functions | date validation, bit-extraction helpers, lunar day formatter, time zodiac adjuster |
| time period functions | `getTimePeriod` — maps hour → 时辰 |
| core conversion | `calculateLunarFromSolar`, `calculateSolarFromLunar`, `calculateStemBranch`, `getSolarTermDay` |
| festival lookup | `getSolarFestival`, `getLunarFestival`, `isSanniangShaDay` |
| public API | `solarToLunar`, `lunarToSolar` |
| module export | dual: `module.exports` (CommonJS) and `window.Soluna` (browser global) |

---

## data model

### `LUNAR_INFO` encoding

201-element array of 20-bit hex values covering years 1900–2100.

```
bit 20     : leap month size (1=30 days, 0=29 days)
bits 19–8  : month sizes for M1–M12 (1=30 days, 0=29 days)
bits 4–1   : leap month number (0=none, 1–12=which month has a leap)
```

base date: `1900-01-31` — all day offsets are relative to this.

### public API output shape

both `solarToLunar` and `lunarToSolar` return the same structure:

```javascript
{
  solar:      { year, month, day, weekDay, time: { hour, minute, second } },
  lunar:      { year, month, day, isLeapMonth, monthName, dayName, zodiac },
  stemBranch: { year, month, day, time },           // 干支 names
  baZi:       { year, month, day, hour },           // { stem, branch } per pillar
  timePeriod: { name, zodiac, period, branch, description },
  festivals:  { solar, lunar, sanniangSha },
  solarTerms: ''                                    // placeholder — not yet populated
}
```

---

## core algorithms

### solar → lunar

1. compute day offset from base date (`1900-01-31`)
2. subtract full lunar year lengths (from `LUNAR_INFO`) until remainder fits within a year
3. subtract full lunar month lengths (regular + leap month branching) until remainder fits a month
4. remainder + 1 = lunar day; track whether the final month was a leap instance

### lunar → solar (reverse)

1. sum all lunar year lengths from 1900 to target year
2. sum month lengths for complete months in target year (including any leap month before target)
3. add day offset to base date

### stem-branch (干支) / BaZi

- **year pillar**: `(year - 1900 + 36) % 60`, adjusted back one year if date precedes 立春 (Start of Spring)
- **month pillar**: total months since 1900 base, adjusted using the sectional solar term (Jie) for the current Gregorian month
- **day pillar**: days since unix epoch + fixed offset, mod 60
- **hour pillar**: derived from day stem index and time branch index using `HourStemIndex = (dayStemIdx % 5 * 2 + hourBranchIdx) % 10`

### solar term day calculation

`day = floor(yearSuffix × 0.2422 + C) − floor(yearSuffix / 4)`

where `C` is a century-specific constant from `SOLAR_TERM_INFO`. max deviation ~1 day; sufficient for pillar boundary detection. astronomical-precision would require VSOP87.

### 子时 boundary

23:00–01:00 is the Rat hour (子时) and belongs to the **next calendar day** in traditional Chinese timekeeping. `adjustForTimeZodiac` shifts the date forward when `hour === 23` before the lunar conversion.

---

## build and debug

```bash
make install      # npm install
make test         # node --test
make test-watch   # node --test --watch
make run          # node run.js (3-day demo)
make today        # lunar + BaZi for right now
make ui           # open test-ui.html in browser
make clean        # remove node_modules and logs
```

test runner: node:test (built-in). node.js >= 22 required.

### test UI (`test-ui.html`)

browser-based visual verification tool. `make ui` opens it directly.

- **solar to lunar**: pick any date — shows lunar date, zodiac, BaZi pillars
- **lunar to solar**: input lunar date to convert back to Gregorian
- **BaZi grid**: visualises the four pillars with correct solar term-based month pillars

---

## contributing

CI runs on every PR via GitHub Actions:

| check | detail |
| :--- | :--- |
| tests | node:test on Node.js 22, 24 |
| lint | Biome (`npm run lint`) |
| security | CodeQL scanning |
| dependencies | Dependabot automated updates |

pre-PR checklist: `make test` (runs Biome + node:test).

---

## decisions

| decision | choice | why |
| :--- | :--- | :--- |
| single-file library | `soluna.js` for all code | library is self-contained domain math with no external dependencies; splitting would add indirection without benefit at this scale |
| lookup table for lunar data | `LUNAR_INFO` hex array | precomputed data from established sources (1900–2100); astronomical recalculation would be far more complex and error-prone for a utility library |
| functional paradigm | pure functions, no mutation | easier unit testing; each conversion step is independently verifiable; immutable inputs prevent subtle date mutation bugs |
| solar term approximation | simplified formula (±1 day) | acceptable for pillar boundary detection; VSOP87 is overkill for this use case |
| dual export | CommonJS + browser global | maximises compatibility without a build step or bundler dependency |
| linter | Biome over ESLint | single devDependency, zero config overhead, handles lint + format + import sorting; ESLint plugin ecosystem not needed for plain JS |
| test runner | node:test over AVA | zero devDependencies; built into Node 22+; sufficient for pure synchronous computation tests |

---

## complexity score

| dimension | score | notes |
| :--- | :--- | :--- |
| overall | 3 / 5 | single-file but non-trivial calendar domain math |
| data layer | 2 / 5 | hex lookup table; decoding is straightforward bit manipulation |
| conversion core | 3 / 5 | iterative day-counting with leap month branching |
| stem-branch / BaZi | 4 / 5 | multi-layer cross-referencing across solar term boundaries |
| festival lookup | 1 / 5 | static map keyed by MMDD string |
| time periods | 1 / 5 | simple hour-range matching with midnight-span special case |

---

## roadmap

### near term

- [x] `[soluna]` npm publish pipeline via GitHub Actions — prerequisite for consumers to `npm install` the library `[easy]`
- [x] `[soluna]` add linter — Biome chosen over ESLint; `biome.json` config, wired into `make test` and CI `[easy]`
- [x] `[soluna]` solar terms support: `getSolarTermsForYear(year)` helper returning all 24 term dates, and populate the `solarTerms` field in API output (currently empty string) `[medium]`
- [x] `[soluna]` expand test coverage for stem-branch / BaZi pillar accuracy across edge-case years `[medium]`
- [x] `[soluna]` validate leap month input in `lunarToSolar` (guard against invalid leap month for years with no leap) `[easy]`
- [x] `[soluna]` tradition tagging: annotate each festival entry with one or more tradition tags (`public`, `buddhist`, `taoist`, `folk`) and expose a filter option on `solarToLunar` / `lunarToSolar` to include only the requested traditions in the `festivals` output `[medium]`

### ideas

- [x] `[soluna]` TypeScript type definitions (`soluna.d.ts`) for consumer projects `[easy]`
- [x] `[soluna]` timezone-aware mode (currently assumes local time; could accept explicit UTC offset) `[hard]`
- [x] `[soluna]` CLI wrapper (`npx soluna <date>`) for quick lookups `[medium]`
- [ ] `[soluna-go]` Go port of the soluna library — expose the same public API (`SolarToLunar`, `LunarToSolar`, `GetSolarTermsForYear`) as a native Go module; zero CGo, pure Go, suitable for server-side and FFI/gRPC use `[hard]`
