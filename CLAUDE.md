# CLAUDE.md

UI test automation for **Apple Books on macOS** (`com.apple.iBooksX`) with
WebdriverIO 9 + TypeScript + Appium Mac2 driver. Goal: navigation smoke first,
then functional regression. Read before larger tasks:

- [specs/product/mission.md](specs/product/mission.md) — goal and scope
- [specs/product/tech-stack.md](specs/product/tech-stack.md) — stack and code layout
- [specs/product/roadmap.md](specs/product/roadmap.md) — what's next; tick items when done
- [specs/test-cases/README.md](specs/test-cases/README.md) — test-case format, IDs, statuses, tags

## Commands

```bash
npm run typecheck                              # tsc, no emit — run after every code change
npm test                                       # all specs in test/e2e
npm run test:smoke | test:regression           # by tag
npm test -- --mochaOpts.grep BKS-NAV-001       # one case
npm test -- --spec test/e2e/search.spec.ts     # one file
npm run inspect                                # dump UI tree → .page-source/launch.xml
npm run tc:report [-- --list]                  # test-case coverage + consistency checks
```

Tests drive the real Books app on this Mac: one session at a time, and the
app's UI state persists between runs.

## Workflow

- Test cases come first: write/update the case in `specs/test-cases/` before
  automating it. Use the `/automating-test-cases` skill for both steps.
- A case may be set to `status: automated` **only after its test passed
  locally** in this session. If it fails, report the failure; don't loosen
  assertions to make it pass.
- Never guess locators. Get them from the page source (`npm run inspect` or
  `dumpPageSource()` from `tools/page-source.ts`) and verify by running the test.
- Ask before changing `wdio.conf.ts`, `tsconfig.json` or dependencies.
- Keep `specs/product/roadmap.md` in sync when finishing a roadmap item.

## Page Object Model rules

- **Layout**: `app/base-component.ts` (`BaseComponent`, element helpers) →
  `app/base-screen.ts` (`BaseScreen extends BaseComponent`, exposes shared
  components) → `app/screens/<name>-screen.ts` and `app/components/<name>.ts`,
  each with a sibling `<file>-locators.ts`.
- **Locators live only in `*-locators.ts` files** — one class per screen or
  component (`SearchScreenLocators` in `search-screen-locators.ts`), one plain
  property per element. Write only the element type + attributes —
  `getElement()` in `BaseComponent` adds the `//XCUIElementType` prefix:
  `searchItem = 'Cell[@label="Search"]';` → `//XCUIElementTypeCell[@label="Search"]`.
  No selectors in screen methods or specs.
- **Keep it simple and readable** (juniors maintain this code): plain
  properties and one clearly named method per action — no generic
  "open(item)" helpers, lookup maps, `Record` types or locator templates built
  from parameters.
- **Screens** (`app/screens/<name>-screen.ts`, class `<Name>Screen`) extend `BaseScreen`, hold `readonly locators`,
  expose private element getters (`this.getElement(this.locators.x)`) and
  public **action** methods (`searchForBooks`) and **verify** methods
  (`verifyNoSuggestionsShown`) that contain the `expect` assertions.
- **Specs** (`test/e2e/*.spec.ts`) call only public POM methods — no `$()`,
  no selectors, no `browser.*` calls; they read as user steps.
- **Shared components** — UI present on many screens belongs in
  `app/components/<name>.ts` + `<name>-locators.ts`, extends `BaseComponent`
  (never `BaseScreen` — that would be circular) and is exposed from
  `BaseScreen`. The sidebar is `NavBar`: specs navigate with
  `screen.navBar.openSearch()`. To add a sidebar item: add a locator property
  in `NavBarLocators` (e.g. `libraryItem`, confirmed with `npm run inspect` —
  element types differ between items), a private getter and an
  `open<Item>()` method in `NavBar`.
- Screen methods don't navigate to their own screen; the spec does it via
  `navBar`, so test steps mirror the case steps.
- Locators are XPaths starting from the element type (the prefix is added
  for you). Prefer stable attributes: `@identifier` → `@label` / `@title`.
  Keep them short; avoid indexes (`[2]`) and nested paths.

## Test rules

- Titles (details in [specs/test-cases/README.md](specs/test-cases/README.md#titles)):
  - Manual case (user perspective): `Verify that <outcome> when|if <action/condition>`,
    e.g. `Verify that the user sees 'No Suggestions' message when they search for books that are not in collections`.
  - Automated `it()` (SUT perspective): `"<ID> @<type> @<area> should <what the app does> when|if <…>"`,
    e.g. `it("BKS-SRCH-001 @regression @search should show 'No Suggestions' message when searching for books that are not in collections", …)`.
  - Tags must match the case's frontmatter.
- One spec file per area: `test/e2e/<area>.spec.ts`, `describe("<Area>")`.
- Tests are independent: never rely on another test's state or run order;
  bring the app to a known screen first (e.g. via the nav bar).
- No `browser.pause()` / fixed sleeps — use `waitForDisplayed`, `waitUntil`
  or `expect(...).toBeDisplayed()` (which waits).
- Don't assert on Store content that changes (specific titles, prices);
  assert on structure and stable labels.

## Code style

- ESM with explicit `.ts` import extensions (`./base-screen.ts`).
- Strict TS; no `any`, no unused locals/params (tsconfig enforces).
- Files kebab-case, classes PascalCase, methods camelCase verbs.
