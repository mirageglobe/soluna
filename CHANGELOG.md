# Changelog

All notable changes to this project will be documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.3.0] - 2026-05-02

### Added

- `utcOffset` option on `solarToLunar` and `lunarToSolar` — accepts a fixed UTC offset in hours (e.g. `8` for CST, `-5` for EST); when provided, the `Date` argument is interpreted at that offset instead of the runtime's local timezone
- `getComponents(date, utcOffset)` internal helper for timezone-safe component extraction
- `getTimePeriodForHour(hour)` internal helper; `getTimePeriod` delegates to it so 子时 detection also respects `utcOffset`
- `utcOffset?: number` field added to `FestivalOptions` in `soluna.d.ts`

---

## [2.2.0] - 2026-05-02

### Added

- `soluna.d.ts` — full TypeScript type definitions for all exported functions and return types
- `types` field in `package.json`; `soluna.d.ts` added to the published file list
- Types cover: `CalendarResult`, `BaZi`, `StemBranch`, `TimePeriod`, `Festival`, `Festivals`, `LunarDate`, `SolarDate`, `SolarTerm`, `LunarInfo`, `SolarInfo`, `FestivalOptions`, `Tradition`
- Function overloads for both Date-form and numeric-form signatures of `solarToLunar` and `lunarToSolar`

---

## [2.1.0] - 2026-05-02

### Added

- `getSolarTermsForYear(year)` — returns all 24 solar terms for a given Gregorian year as `{ nameZh, month, day }` objects; exported from CommonJS and `window.Soluna`
- `solarTerms` field in `solarToLunar` and `lunarToSolar` output — populated with the Chinese name of the solar term if the date falls on one, otherwise empty string
- Expanded BaZi / stem-branch edge-case tests: Li Chun year-boundary, Jie month-boundary, day-pillar continuity, century-formula boundary, and 60-year cycle verification (49 tests total)

---

## [2.0.0] - 2025-01-01

### Changed

- Renamed project from `yalunar` to `soluna`
- Rewrote library as a single zero-dependency file (`soluna.js`)
- Replaced AVA test runner with `node:test` (zero dev dependencies beyond Biome)
- Added Biome linter; wired into `make test` and CI

### Added

- `solarToLunar` / `lunarToSolar` public API with full BaZi (四柱) four-pillar calculation
- Solar and lunar festival lookup including Buddhist, Taoist, and folk traditions
- Time period (时辰) calculation
- San Niang Sha (三娘煞) inauspicious day detection
- CommonJS and browser (`window.Soluna`) dual export
