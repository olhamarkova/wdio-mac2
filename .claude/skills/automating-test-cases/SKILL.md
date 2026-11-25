---
name: automating-test-cases
description: Create and automate Apple Books test cases. `create` writes test-case specs (Markdown with status frontmatter) into specs/test-cases/; `automate <ID>` turns a ready case into a WebdriverIO + Appium Mac2 test using the project's POM, runs it, and marks the case automated. Use whenever the user asks to write, add, draft, cover, or automate a test case / scenario / check for the Books app, or to update a case's automation status.
argument-hint: create <feature or scenario> | automate <BKS-ID ...>
---

# /automating-test-cases

Two modes. Pick from the first argument; if missing, infer from the request
(new scenario → `create`, an existing ID → `automate`). Always follow
[CLAUDE.md](../../../CLAUDE.md) and the format in
[specs/test-cases/README.md](../../../specs/test-cases/README.md) — read the
latter first, it defines IDs, areas, frontmatter and statuses.

---

## Mode 1 — `create`

Input: a feature, scenario, ticket text or list of checks.

1. **Understand scope.** Check [roadmap](../../../specs/product/roadmap.md) and
   [mission](../../../specs/product/mission.md) — skip out-of-scope things
   (purchases, account management, CI). If the request is vague, propose a list
   of case titles and confirm before writing files.
2. **Avoid duplicates.** List existing cases:
   `grep -rh "^\(id\|title\|status\):" specs/test-cases`. Update an existing case
   instead of creating a near-duplicate.
3. **Pick area and ID.** Area code/folder from the table in the test-cases
   README (add a row there if a new area is truly needed). Next ID = highest
   existing `NNN` in that area + 1 (`ls specs/test-cases/<area>/`).
4. **Write the file** `specs/test-cases/<area>/<ID>-<kebab-title>.md` from
   [template.md](template.md):
   - `type: smoke` for "screen opens / main element visible" checks;
     `regression` for behaviour/flows.
   - `status: ready` when steps and expected results are concrete and
     observable; otherwise `draft` and list open questions under `## Notes`.
   - Title from the user's perspective:
     `Verify that <outcome> when|if <action/condition>` — see "Titles" in the
     test-cases README. File slug = 2–5 word kebab summary.
   - Steps in user language; one behaviour per case; expected results that can
     be asserted in the UI.
   - Use real UI labels. If unsure of a label, run `npm run inspect` (Books must
     be closable/launchable) and read `.page-source/launch.xml`, or mark the
     case `draft` with a note.
5. Run `npm run tc:report` and fix any consistency problems it lists.
6. **Report**: table of created/updated cases (ID, title, type, status) and
   any open questions. Don't automate in this mode unless asked.

---

## Mode 2 — `automate <ID ...>`

Input: one or more case IDs with `status: ready` (or `draft` the user
explicitly wants automated). Process IDs one at a time.

1. **Read the case** (`grep -rl "id: <ID>" specs/test-cases`). If it's
   `automated`, `manual-only` or still vague, stop and tell the user.
2. **Map steps to the POM.** Reuse existing screen/component methods in `app/`
   first. List what's missing: screens, components, locators, actions, verify
   methods. For navigation cases, the nav bar must be a component
   (`app/components/nav-bar.ts`, exposed from `BaseScreen`) — if that refactor
   isn't done yet, propose it and get confirmation before continuing.
3. **Discover locators — never guess.**
   - Launch screen: `npm run inspect` → `.page-source/launch.xml`.
   - Deeper screens: temporarily add
     `await dumpPageSource("<name>")` (from `tools/page-source.ts`) inside the
     new test after the navigation steps, run that test, read the XML, then
     **remove the call**.
   - Choose per CLAUDE.md preference: `~identifier` → predicate/class chain →
     short XPath on element type + `@label`/`@identifier`/`@title`.
4. **Implement.**
   - Locators → the matching `*-locators.ts` class (create
     `<screen>-locators.ts` for a new screen/component).
   - Elements as private getters, plus public action / `verify*` methods in
     the screen or component class (assertions live in `verify*`).
   - Test in `test/e2e/<area>.spec.ts` (create with `describe("<Area>")` if
     missing):
     `it("<ID> @<type> @<area> should <what the app does> when|if <…>", async () => { ... })` —
     convert the case title to the SUT perspective (drop `Verify that`,
     `the user sees X` → `should show X`, keep the `when`/`if` clause) —
     only POM calls, steps in the same order as the case.
5. **Verify.**
   - `npm run typecheck` — must pass.
   - `npm test -- --mochaOpts.grep <ID>` — must pass. On failure, read the
     error and `wdio-appium.log`, fix locators/waits (no `pause`, no weakened
     assertions) and re-run. After 3 failed attempts, stop and report.
   - If the app behaves differently from the case's expected result, that's a
     possible bug: don't change the expectation silently — report it and ask
     whether to set `status: blocked` with a `blocked_reason`.
6. **Update the case** only after a passing run: `status: automated`,
   `automated_in: test/e2e/<area>.spec.ts`. Add locator hints to `## Notes` if
   useful.
7. **Update roadmap** checkboxes in `specs/product/roadmap.md` when a roadmap
   item becomes complete.
8. Run `npm run tc:report` — must show no consistency problems.
9. **Report**: per ID — result (automated / blocked / failed), files changed,
   the passing run command.

---

## Checklist before finishing

- [ ] No selectors outside `*-locators.ts`; no `$()`/`browser.*` in specs
- [ ] Case title follows `Verify that … when|if …`
- [ ] Test title starts with the ID, tags match frontmatter `type` + `area`, and reads `should … when|if …`
- [ ] Temporary `dumpPageSource` calls removed
- [ ] `npm run typecheck` passes
- [ ] `npm run tc:report` shows no consistency problems
- [ ] Every case marked `automated` had a passing run in this session
