
# ===== Configuration =====

.DEFAULT_GOAL := help
.PHONY: help install run ui today test test-watch clean release-patch release-minor release-major

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
	npx biome check soluna.js test/soluna.test.mjs examples/run.js
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

release-patch: ## Bump patch version and publish (e.g. 2.4.0 → 2.4.1)
	$(eval TAG := $(shell node -p "const [a,b,c] = require('./package.json').version.split('.').map(Number); a+'.'+b+'.'+(c+1)"))
	@$(MAKE) _release TAG=$(TAG)

release-minor: ## Bump minor version and publish (e.g. 2.4.0 → 2.5.0)
	$(eval TAG := $(shell node -p "const [a,b,c] = require('./package.json').version.split('.').map(Number); a+'.'+(b+1)+'.0'"))
	@$(MAKE) _release TAG=$(TAG)

release-major: ## Bump major version and publish (e.g. 2.4.0 → 3.0.0)
	$(eval TAG := $(shell node -p "const [a,b,c] = require('./package.json').version.split('.').map(Number); (a+1)+'.0.0'"))
	@$(MAKE) _release TAG=$(TAG)

_release:
	@echo "releasing v$(TAG)"
	npm version $(TAG) --no-git-tag-version
	git add package.json
	git commit -m "chore: bump version to $(TAG)"
	git tag v$(TAG)
	git push origin HEAD
	git push origin v$(TAG)

clean: ## Remove node_modules and logs
	rm -rf node_modules
	rm -rf *.log
	rm -rf npm-debug.log*
