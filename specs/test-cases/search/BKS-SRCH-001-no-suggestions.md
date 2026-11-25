---
id: BKS-SRCH-001
title: Verify that the user sees 'No Suggestions' message when they search for books that are not in collections
area: search
type: regression
priority: medium
status: automated
automated_in: test/e2e/search.spec.ts
---

## Preconditions

- Books app is installed and launches to its main window.

## Steps

1. Click **Search** in the sidebar.
2. Type `harry potter` into the search field.

## Expected result

- The suggestions area shows the message **"No Suggestions"**.

## Notes

- The search field's accessibility label is `Apple Books`.
