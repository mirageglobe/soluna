
# ===== Configuration =====

.DEFAULT_GOAL := help
MAIN_BRANCH ?= main
.PHONY: help install run ui today test test-watch clean release-patch release-minor release-major release-tag _release-prep site-install site-build site-dev site-preview _site-prep

# ===== Helpers =====

help: ## Show this help menu
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# ===== Menu =====

install: ## Install project dependencies
	npm install

run: ## Run the example test runner (run.js)
	node examples/run.js

ui: ## Launch the test UI in the default browser
	open examples/test-ui.html

test: ## Run lint (Biome) and tests (node:test)
	npm run lint
	npm test

test-watch: ## Run tests in watch mode (node:test)
	node --test --watch test/soluna.test.mjs

today: ## Show lunar and BaZi info for today's date
	@node -e "const { solarToLunar } = require('./soluna.js'); \
	const r = solarToLunar(new Date()); \
	const p = n => String(n).padStart(2, '0'); \
	const timeStr = r.solar.time ? ' ' + p(r.solar.time.hour) + ':' + p(r.solar.time.minute) + ':' + p(r.solar.time.second) : ''; \
	console.log('\n📅 Solar Date:', r.solar.year + '-' + p(r.solar.month) + '-' + p(r.solar.day) + timeStr); \
	console.log('🌙 Lunar Date:', r.lunar.year + '-' + r.lunar.month + '-' + r.lunar.day + ' (' + r.lunar.dayName + ')'); \
	console.log('🐯 Zodiac:', r.lunar.zodiac); \
	console.log('\n🏮 BaZi (Eight Characters):'); \
	console.log('  Year:  ' + r.baZi.year.stem + r.baZi.year.branch); \
	console.log('  Month: ' + r.baZi.month.stem + r.baZi.month.branch); \
	console.log('  Day:   ' + r.baZi.day.stem + r.baZi.day.branch); \
	console.log('  Hour:  ' + (r.baZi.hour ? r.baZi.hour.stem + r.baZi.hour.branch : 'Not provided')); \
	console.log('\n✨ Festivals:'); \
	console.log('  Solar: ' + (r.festivals.solar ? r.festivals.solar.name : 'None')); \
	console.log('  Lunar: ' + (r.festivals.lunar ? r.festivals.lunar.name : 'None')); \
	if (r.festivals.sanniangSha) console.log('  ⚠️  Warning: Sanniang Sha Day (三娘煞)'); \
	console.log('');"

# ===== Release (never commits to main) =====
# flow: on a branch run make release-<kind> (tests, bump, rebuild site, commit, push the branch)
# then open a PR and merge it; then on main run make release-tag; then npm publish by hand

release-patch: ## On a branch: bump patch (2.4.0 to 2.4.1), rebuild the site, push the branch
	@$(MAKE) _release-prep KIND=patch

release-minor: ## On a branch: bump minor (2.4.0 to 2.5.0), rebuild the site, push the branch
	@$(MAKE) _release-prep KIND=minor

release-major: ## On a branch: bump major (2.4.0 to 3.0.0), rebuild the site, push the branch
	@$(MAKE) _release-prep KIND=major

_release-prep:
	@branch="$$(git rev-parse --abbrev-ref HEAD)"; \
	case "$$branch" in main|master|$(MAIN_BRANCH)) echo "[ FAIL ] run release-$(KIND) on a branch, not on $$branch"; exit 1;; esac; \
	[ -z "$$(git status --porcelain)" ] || { echo "[ FAIL ] working tree is not clean"; exit 1; }
	@$(MAKE) test
	@version="$$(node -p "const [a,b,c]=require('./package.json').version.split('.').map(Number); ({patch:a+'.'+b+'.'+(c+1),minor:a+'.'+(b+1)+'.0',major:(a+1)+'.0.0'})['$(KIND)']")"; \
	if git ls-remote --exit-code --tags origin "refs/tags/v$$version" >/dev/null 2>&1; then echo "[ FAIL ] tag v$$version already exists on origin"; exit 1; fi; \
	grep -q "^## \[$$version\]" CHANGELOG.md || echo "[ WARN ] CHANGELOG.md has no entry for $$version"; \
	echo "releasing v$$version"; \
	npm version "$$version" --no-git-tag-version >/dev/null && \
	git add package.json package-lock.json && \
	git commit -q -m "chore: bump version to $$version" && \
	$(MAKE) site-build && \
	git add docs && \
	git commit -q -m "chore(site): rebuild docs for $$version" && \
	git push -u origin HEAD && \
	echo "[ OK ] pushed the branch for v$$version; open a PR, merge it, then run: make release-tag"

release-tag: ## On main after the release PR is merged: tag the version and push the tag
	@[ "$$(git rev-parse --abbrev-ref HEAD)" = "$(MAIN_BRANCH)" ] || { echo "[ FAIL ] run release-tag on $(MAIN_BRANCH)"; exit 1; }
	@git fetch -q origin $(MAIN_BRANCH) && [ "$$(git rev-parse HEAD)" = "$$(git rev-parse origin/$(MAIN_BRANCH))" ] || { echo "[ FAIL ] $(MAIN_BRANCH) is not at origin/$(MAIN_BRANCH); git pull first"; exit 1; }
	@[ -z "$$(git status --porcelain)" ] || { echo "[ FAIL ] working tree is not clean"; exit 1; }
	@cmp -s soluna.js docs/soluna.js || { echo "[ FAIL ] docs/soluna.js differs from soluna.js; run make site-build in the release PR"; exit 1; }
	@version="$$(node -p "require('./package.json').version")"; \
	if git ls-remote --exit-code --tags origin "refs/tags/v$$version" >/dev/null 2>&1; then echo "[ FAIL ] tag v$$version already exists on origin"; exit 1; fi; \
	git tag "v$$version" && git push origin "v$$version" && \
	echo "[ OK ] tagged v$$version; now publish by hand: npm publish --access public"

# ===== Site (astro in site/, built output in docs/, served by github pages from main /docs) =====
# docs/ is build output only: astro empties it on every build, so never put hand-written files there.
# the stamp in docs/version.json ends in -dirty when the build ran with uncommitted changes.

_site-prep:
	cp soluna.js site/public/soluna.js
	printf '{"version":"%s","source":"%s","built":"%s"}\n' "$$(node -p "require('./package.json').version")" "$$(git rev-parse --short HEAD)$$(git diff --quiet HEAD || echo -dirty)" "$$(date -u +%Y-%m-%dT%H:%M:%SZ)" > site/public/version.json

site-install: ## Install site dependencies
	cd site && npm install

site-dev: _site-prep ## Start the site dev server (hot reload)
	cd site && npm run dev

site/node_modules:
	cd site && npm install

site-build: site/node_modules _site-prep ## Build the site into docs/ (commit docs/ to deploy)
	cd site && npm run build

site-preview: site-build ## Build, then serve docs/ locally
	cd site && npm run preview

clean: ## Remove node_modules, site build copies and logs
	rm -rf node_modules site/node_modules site/.astro site/public/soluna.js site/public/version.json
	rm -rf *.log
	rm -rf npm-debug.log*
