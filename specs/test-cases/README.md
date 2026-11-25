# Test cases

Manual test-case specifications for Apple Books (macOS). Each case is one
Markdown file; its YAML frontmatter is the **single source of truth** for the
case's automation status.

Create and automate cases with the `/automating-test-cases` skill (`/automating-test-cases create …`,
`/automating-test-cases automate BKS-XXX-NNN`).

## Layout

```
specs/test-cases/<area>/<ID>-<short-kebab-slug>.md
```

Example: `specs/test-cases/navigation/BKS-NAV-001-open-home.md` (the slug is a
short 2–5 word summary, not the full title).

## ID scheme

`BKS-<AREA>-<NNN>` — three-digit, zero-padded, never reused (even if a case is
deleted).

| Area code | Folder         | Covers                                              |
| --------- | -------------- | --------------------------------------------------- |
| `NAV`     | `navigation/`  | Sidebar / nav bar, switching between top-level screens |
| `SRCH`    | `search/`      | Search field, suggestions, results                  |
| `LIB`     | `library/`     | Library sections, filters, sorting, views           |
| `COLL`    | `collections/` | Creating, renaming, deleting collections            |
| `BOOK`    | `book/`        | Book details, opening a book, reader basics         |

Add a new row here before using a new area code.

## Frontmatter

```yaml
---
id: BKS-NAV-001                 # required, unique
title: Verify that the Home screen opens when the user clicks Home in the sidebar  # required, see Titles
area: navigation                # required, folder name from the table above
type: smoke                     # required: smoke | regression
priority: high                  # required: high | medium | low
status: ready                   # required, see below
automated_in:                   # spec path, required when status = automated
blocked_reason:                 # required when status = blocked or manual-only
---
```

### `status` values

| Status        | Meaning                                                                 |
| ------------- | ----------------------------------------------------------------------- |
| `draft`       | Being written; steps or expected results not final.                     |
| `ready`       | Reviewed and ready to automate.                                         |
| `automated`   | Automated test exists **and passed locally**; `automated_in` is set.    |
| `blocked`     | Cannot be automated right now (app bug, missing locator, env); see `blocked_reason`. |
| `manual-only` | Deliberately not automated (e.g. needs a real purchase); see `blocked_reason`. |

Allowed transitions: `draft → ready → automated`, `ready → blocked → ready`,
any → `manual-only`. Only set `automated` after the test passed.

## Titles

Manual test cases are written **from the user's perspective**:

```
Verify that <expected result the user observes> when | if <action or condition>
```

- Start with `Verify that`; one expected result per title.
- Name the outcome first, then the trigger after `when` (an action) or `if`
  (a state/condition).
- Use UI labels exactly as shown in the app, in single quotes.

Examples:

- Verify that the user sees 'No Suggestions' message when they search for books that are not in collections
- Verify that the Home screen opens when the user clicks 'Home' in the sidebar
- Verify that the 'Want to Read' section is empty if no books are marked as Want to Read

### Automated test title

The Mocha `it()` title is the same check rewritten **from the SUT's
perspective** (the app is the subject, `it` reads as "it should…"):

```
<ID> @<type> @<area> should <what the app does> when | if <action or condition>
```

| Manual case title | Automated test title |
| --- | --- |
| Verify that the user sees 'No Suggestions' message when they search for books that are not in collections | `BKS-SRCH-001 @regression @search should show 'No Suggestions' message when searching for books that are not in collections` |
| Verify that the Home screen opens when the user clicks 'Home' in the sidebar | `BKS-NAV-001 @smoke @navigation should open the Home screen when 'Home' is clicked in the sidebar` |

Conversion: drop `Verify that`; turn the user-observed outcome into an app
action (`the user sees X` → `should show X`, `X opens` → `should open X`);
keep the `when`/`if` clause, phrased without "the user" (`when searching for…`,
`when 'Home' is clicked…`).

## Body

```markdown
## Preconditions
## Steps
1. …
## Expected result
- …
## Notes            (optional: data, known issues, locator hints)
```

Write steps in user language ("Click **Library** in the sidebar"), not in
locator or code terms. One behaviour per case; each expected result must be
observable in the UI.

## Linking to the automated test

The Mocha test title starts with the ID, followed by tags derived from the
frontmatter — `@<type> @<area>`:

```ts
it("BKS-NAV-001 @smoke @navigation should open the Home screen when 'Home' is clicked in the sidebar", ...)
```

- Run a tag: `npm run test:smoke`, `npm test -- --mochaOpts.grep @navigation`
- Run one case: `npm test -- --mochaOpts.grep BKS-NAV-001`
- Find a case's test: `grep -rn "BKS-NAV-001" test/e2e`

## Coverage report

`npm run tc:report` prints cases by area × status and automated % per area and
type (`-- --list` adds every case). It also checks consistency — required
fields, valid enums, unique IDs, file/folder naming, `automated_in` points to
a spec containing the ID, tags match `type`/`area`, titles follow the
formats in [Titles](#titles), and no test IDs without a case — and exits with code 1 if anything is off.
