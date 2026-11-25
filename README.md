# Apple Books macOS — UI test automation

Automated smoke and regression tests for **Apple Books** on macOS, built with
WebdriverIO, TypeScript and the Appium Mac2 driver.

- Mission, tech stack and roadmap: [`specs/product/`](specs/product/)
- Test cases and their automation status: [`specs/test-cases/`](specs/test-cases/README.md)

## Prerequisites

| Requirement | Notes |
| --- | --- |
| macOS with Apple Books | Books ships with macOS. Launch it once manually and close any first-run dialogs. |
| Xcode (full app) | Needed to build WebDriverAgentMac. After installing run `sudo xcode-select -s /Applications/Xcode.app` and launch Xcode once to accept the license. |
| Node.js 22 LTS | `nvm install && nvm use` (reads `.nvmrc`). wdio 9.33 needs Node ≥ 22.23.4 (or ≥ 20.20.2). |

### macOS permissions (one-time)

1. **Accessibility** — *System Settings → Privacy & Security → Accessibility*:
   enable your terminal app (Terminal / iTerm / VS Code) and, after the first
   run, `Xcode Helper` / `WebDriverAgentRunner-Runner` if prompted.
2. **Automation mode without password prompts**:
   ```bash
   automationmodetool enable-automationmode-without-authentication
   ```

## Installation

```bash
git clone <repo-url> && cd wdio-mac2
nvm use
npm ci
```

Appium and the Mac2 driver are installed locally as part of `npm ci`; the
Appium server is started automatically by `@wdio/appium-service` on port 4724.
The first run takes longer because Xcode builds WebDriverAgentMac.

## Running tests

| Command | What it runs |
| --- | --- |
| `npm test` | all specs in `test/e2e/` |
| `npm run test:smoke` | tests tagged `@smoke` |
| `npm run test:regression` | tests tagged `@regression` |
| `npm test -- --mochaOpts.grep @navigation` | one area |
| `npm test -- --mochaOpts.grep BKS-SRCH-001` | one test case by ID |
| `npm test -- --spec test/e2e/search.spec.ts` | one spec file |
| `npm run typecheck` | TypeScript check, no tests |
| `npm run tc:report` | test-case coverage by area/status + consistency checks (`-- --list` lists all cases) |

Don't use the mouse or keyboard while tests run — they drive the real app.

### Logs and debugging

- Test output: console (spec reporter).
- Appium server log: `wdio-appium.log` in the project root.
- `npm run inspect` launches Books and saves its UI tree to
  `.page-source/launch.xml` — use it to find element types and labels for
  locators. Set `INSPECT_NAME=foo` to change the file name. For deeper
  screens, call `dumpPageSource("name")` from `tools/page-source.ts`
  temporarily inside a test.

## Project structure

```
app/              Page Objects (screens, *-locators.ts, base-screen.ts)
test/e2e/         Mocha specs, one file per area
tools/            dev utilities (page-source dump)
specs/product/    mission, tech stack, roadmap
specs/test-cases/ test-case specifications (one .md per case)
.claude/skills/   Claude Code skills (/automating-test-cases)
CLAUDE.md         rules for AI agents working in this repo
```

## Test cases and tags

Every automated test maps to a test case file with an ID like `BKS-NAV-001`.
The case's frontmatter `status` (`draft`, `ready`, `automated`, `blocked`,
`manual-only`) shows whether it is automated; the test title carries the ID
and tags (`@smoke`/`@regression`, `@<area>`). Details:
[specs/test-cases/README.md](specs/test-cases/README.md).

## Working with Claude Code

- `/automating-test-cases create <scenario or feature>` — writes new test case(s) to
  `specs/test-cases/`.
- `/automating-test-cases automate <ID>` — finds locators, extends the POM, writes the
  test, runs it and marks the case `automated` once it passes.

## Troubleshooting

- **`Could not find a driver for automationName 'mac2'`** — run
  `npx appium driver list --installed`; if mac2 is missing, reinstall with
  `npm ci`.
- **Session fails to start / xcodebuild errors** — check `xcode-select -p`
  points to Xcode.app (not CommandLineTools) and Accessibility permissions are
  granted.
- **Port 4724 in use** — a previous Appium process is still running:
  `lsof -i :4724` and stop it.
