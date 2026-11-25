# Tech stack

| Layer            | Choice                                   | Version (installed) |
| ---------------- | ---------------------------------------- | ------------------- |
| Language         | TypeScript (strict, ESM, `.ts` imports)  | 5.9                 |
| Runtime          | Node.js                                  | 22 LTS (see `.nvmrc`) |
| Test runner      | WebdriverIO (`@wdio/cli`, local runner)  | 9.33                |
| Test framework   | Mocha (BDD) via `@wdio/mocha-framework`  | —                   |
| Assertions       | `expect-webdriverio`                     | 7.x                 |
| Automation server| Appium, started by `@wdio/appium-service` on port 4723 | 3.9 |
| Driver           | `appium-mac2-driver` (XCTest / WebDriverAgentMac) | 3.5        |
| Reporter         | `@wdio/spec-reporter`                    | —                   |
| App under test   | Apple Books, bundle id `com.apple.iBooksX` | ships with macOS  |

## Why

- **WebdriverIO + Appium Mac2** — the maintained way to drive native macOS apps
  via the accessibility tree, with a familiar WebDriver API.
- **TypeScript** — typed Page Objects catch broken locators/method names at
  `npm run typecheck` time rather than at runtime.
- **Mocha + grep tags** — simple tag-based suite selection (`@smoke`,
  `@regression`, `@<area>`) without extra tooling.

## Constraints

- Node: wdio 9.33 requires ≥ 20.20.2 / ≥ 22.23.4; Appium 3 requires ≥ 20.19.
- Mac2 driver runs one session at a time → `maxInstances: 1`.
- Requires Xcode (builds WebDriverAgentMac) and macOS Accessibility /
  Automation permissions — see the [README](../../README.md).
- Locator strategies available in Mac2: accessibility id (`~id`),
  `-ios predicate string`, `-ios class chain`, XPath, class name.

## Code layout

```
app/                          Page Object Model
  base-component.ts           BaseComponent — getElement() adds the //XCUIElementType prefix
  base-screen.ts              BaseScreen — extends BaseComponent, exposes shared components (navBar)
  components/                 shared UI components (extend BaseComponent)
    nav-bar.ts                NavBar — sidebar navigation
    nav-bar-locators.ts       NavBarLocators — one locator per sidebar item
  screens/                    one class per screen (extend BaseScreen)
    search-screen.ts          SearchScreen
    search-screen-locators.ts SearchScreenLocators
test/e2e/                 Mocha specs, one file per area (navigation.spec.ts, search.spec.ts…)
tools/                    dev utilities (page-source dump for locator discovery)
specs/                    product docs and test-case specifications
```
