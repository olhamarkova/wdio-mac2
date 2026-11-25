# Mission

## Goal

Provide a reliable, maintainable automated **smoke and regression suite for
Apple Books on macOS**, so that a build of macOS / Books can be checked quickly
and repeatably instead of by hand.

## Priorities

1. **Navigation smoke first** — every top-level area of the app is reachable
   and renders its main content.
2. **Functional regression next** — core user flows (search, library
   management, collections, book details) behave as expected.
3. **Maintainability over volume** — fewer, stable tests built on a clean Page
   Object Model beat many flaky ones.

## Principles

- Every automated test traces to a written test case in
  [`specs/test-cases/`](../test-cases/README.md), and every test case shows
  whether it is automated.
- Tests are independent, deterministic and readable as plain user steps.
- UI details (locators) are isolated from test logic, so UI changes are fixed
  in one place.

## In scope

- Apple Books desktop app (`com.apple.iBooksX`) on the local Mac.
- UI-level end-to-end tests through Appium Mac2 driver.
- Smoke (`@smoke`) and regression (`@regression`) suites.

## Out of scope

- CI / pipeline execution (tests are run locally).
- Purchases, payments and account management in Book Store / Audiobook Store.
- Book content rendering correctness, iOS / iPadOS Books, performance testing.
