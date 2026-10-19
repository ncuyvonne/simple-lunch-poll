# Quickstart: Validate the Lunch Poll Home Screen

## Prerequisites

- Node.js 22.12 or later and pnpm 11.25.0.
- Dependencies installed from the project root with `pnpm install`.

## Automated Validation

Run from the project root:

```cmd
pnpm.cmd test -- --run
pnpm.cmd typecheck
pnpm.cmd build
```

Expected results:

- The initial poll screen shows the lunch question, exactly three labeled choices with current counts, and the submit action.
- A valid selection updates the submitting page with all current totals and a success message.
- An empty submission shows a clear error and leaves every count unchanged.
- A failed poll load shows a clear error and no fabricated vote totals.
- Type checking and production build complete successfully.

## Browser Viewport Validation

1. Start the application from the project root:

   ```cmd
   pnpm.cmd dev
   ```

2. Open the Vite URL shown in the terminal, normally `http://127.0.0.1:5173/`.
3. Use browser responsive mode at **320px** and **1280px** viewport widths.
4. Confirm the question, choices, counts, submit action, and footer remain readable and reachable with no horizontal scrolling.
5. Submit a vote and confirm the current page updates; verify the footer says the result updates after voting and does not promise that other open pages update live.

## Data and API Scope

This feature uses the existing poll API and aggregate SQLite totals. No API contract or database migration is required.

## Implementation Verification (2026-10-19)

- `pnpm.cmd test -- --run`: passed; 9 test files and 20 tests passed.
- `pnpm.cmd typecheck`: passed.
- `pnpm.cmd build`: passed; TypeScript check and Vite production build completed.
- Browser checks at 320px and 1280px: passed. The user verified both viewports as normal, with the poll content and controls readable and reachable and no horizontal scrolling.
