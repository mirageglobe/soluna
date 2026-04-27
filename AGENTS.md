# AGENTS.md

agent briefing for the `yalc` repository.

---

## what this project is

single-file JavaScript library for bidirectional conversion between Gregorian and Chinese lunar calendar dates. no external runtime dependencies. supports CommonJS (node.js) and browser (window global).

see [SPEC.md](SPEC.md) for architecture, data model, core algorithms, and roadmap.

---

## file ownership

| file | owns |
| :--- | :--- |
| `yalc.js` | entire library — constants, utilities, conversion core, public API, module export |
| `test.js` | AVA test suite; covers public API only (`solarToLunar`, `lunarToSolar`) |
| `run.js` | dev runner; 3-day demo output — not part of the public API |
| `test-ui.html` | browser-based visual verification; standalone, no build step |
| `Makefile` | build/dev targets; `make test` is the canonical test command |
| `package.json` | node metadata, AVA config, dev dependencies |
| `yalunar-legacy.js` | legacy reference — do not modify or import |
| `yalunar-legacy-refactor.js` | legacy reference — do not modify or import |

---

## do-not rules

| do not | do instead |
| :--- | :--- |
| add dependencies to `yalc.js` | keep the library zero-dependency; inline any needed logic |
| split `yalc.js` into multiple files | the single-file constraint is a deliberate design decision (see SPEC.md decisions) |
| modify `yalunar-legacy*.js` | treat as read-only historical reference |
| write tests that reach into internal functions | test only via `solarToLunar` / `lunarToSolar` public API |
| commit to `main` or `master` | branch using `YYYYMMDD-adjective-noun` format |
| commit secrets or credentials | stop immediately if any token/key is detected in staged files |
| skip linting before commit | run `npx eslint yalc.js` as part of pre-commit |

---

## how to work on this project

```bash
make install      # install dev dependencies
make test         # run full test suite (AVA) — mandatory before any commit
make today        # quick sanity check: lunar + BaZi for right now
make run          # 3-day demo output
make ui           # open visual test UI in browser
```

test runner: AVA. node.js >= 14 required.

---

## picking up a task

roadmap items are in [SPEC.md#roadmap](SPEC.md#roadmap). each item carries:
- a component tag `[yalc]` identifying the file/area
- a difficulty tag `[easy]`, `[medium]`, or `[hard]`

pick a task matching your capability, implement with a test first (TDD), then run `make test` before committing.
