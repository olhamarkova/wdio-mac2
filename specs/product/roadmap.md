# Roadmap

Status: `[x]` done · `[ ]` planned. Update this file when an item is finished.
CI execution is out of scope (see [mission](mission.md)).

## Phase 0 — Foundation

- [x] WebdriverIO + Appium Mac2 setup, first Books test (search)
- [x] Base POM: `BaseScreen`, locator classes in separate files
- [x] Project docs: README, CLAUDE.md, mission, tech stack, roadmap
- [x] Test-case format, ID scheme and status tags (`specs/test-cases/README.md`)
- [x] `/automating-test-cases` skill (create + automate)
- [x] `npm run inspect` — page-source dump for locator discovery
- [x] `npm run tc:report` — coverage report: cases by area × status, automated %, and consistency checks (missing `automated_in`, IDs not found in `test/e2e`, test IDs without a case)

## Phase 1 — Navigation smoke

- [x] Refactor: extract the sidebar into `app/components/nav-bar.ts` + `nav-bar-locators.ts`, expose it from `BaseScreen` (`this.navBar`)
- [x] Refactor: split `app/ibooks-app.ts` into screen-level POMs (`app/screens/`, first: `SearchScreen`); add new screens there
- [ ] Map the real sidebar items with `npm run inspect` and record them in test cases
- [ ] Smoke cases (`@smoke @navigation`): each sidebar item opens its screen —
      Home, Book Store, Audiobook Store, Search, Library sections
      (All, Want to Read, Finished, Books, Audiobooks, PDFs, Samples…), Collections
- [ ] App launch smoke: main window and sidebar are displayed
- [ ] Test isolation: return the app to a known screen before each test

## Phase 2 — Functional regression

- [ ] Search: suggestions, no-results, clearing the query (BKS-SRCH-001 done)
- [ ] Library: switching sections, sorting, grid/list view
- [ ] Collections: create, rename, delete a collection; add a book to it
- [ ] Book details: open details of a library book; open a sample/PDF in the reader
- [ ] Test data: a known set of local PDFs/EPUBs imported before the suite

## Phase 3 — Quality & reporting

- [ ] Richer local reporting (e.g. Allure) with screenshots on failure
- [ ] Retries / flakiness tracking for known-unstable steps
- [ ] Shared custom waits/helpers in `BaseScreen` as patterns emerge

## Risks / open questions

- Store screens need network and may need a signed-in Apple Account; content changes over time → assert on structure, not on specific titles.
- macOS / Books updates can change accessibility labels → keep locators centralised and prefer stable identifiers.
