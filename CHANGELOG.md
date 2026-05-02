# Changelog

All notable changes to this project will be documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
