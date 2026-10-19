# Implementation Plan: Simple Lunch Poll

**Branch**: `001-simple-lunch-poll` | **Date**: 2026-10-19 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-simple-lunch-poll/spec.md`

## Summary

Build a single-page lunch poll where participants select one of two fixed choices,
submit one vote, and see the shared totals immediately. Use the requested TypeScript,
React, Vite, Tailwind CSS, and Vitest stack, with a small TypeScript API service and
SQLite persistence so totals are shared across participants and survive page reloads.
The API validates the choice and atomically increments the selected choice's aggregate
count; individual submissions are not retained. The browser never writes vote totals
directly.

## Technical Context

**Language/Version**: TypeScript; Node.js 22.12 or later for the development/build runtime
**Primary Dependencies**: React, Vite, Tailwind CSS, Vitest; Express API and SQLite driver
**Storage**: SQLite database on persistent local/server disk; only one aggregate count
  per fixed choice is persisted
**Testing**: Vitest for UI, validation, and API behavior; persistence integration coverage
  for accepted and rejected votes
**Target Platform**: Modern desktop and mobile browsers; single Node.js application host
**Project Type**: Web application with frontend and API service
**Performance Goals**: One vote submission returns the updated totals in the same request;
  no custom throughput target is defined for this small poll
**Constraints**: The database is accessed only through the API service. The host must
  provide persistent writable storage. Invalid or missing choices must not create votes.
  Secrets, if introduced, must be supplied through server-side environment variables and
  must never enter browser bundles or logs.
**Scale/Scope**: One fixed poll, two fixed choices, multiple participants, repeated votes
  allowed, aggregate results shared across participants and page reloads. Existing
  requirements do not require an identity check or live push updates to other open pages.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Validated inputs and clear errors**: Pass. Validate selection in the UI for immediate
  feedback and validate request body and choice ID again at the API boundary. Return a
  stable error code and plain-language message; do not change totals on rejection.
- **Secret handling**: Pass. No credentials are required by the selected local API and
  SQLite design. Any future secret remains server-side in environment variables and is
  excluded from logs and browser bundles.
- **Feature-level tests**: Pass. Plan tests for a valid vote, empty submission, invalid
  choice, unchanged totals after rejection, and persistence across reload/read.
- **Data minimization**: Pass. Persist only the two aggregate choice counts required for
  shared durable results; do not retain individual choices or vote timestamps.
- **Maintainability and delivery verification**: Pass. Keep one UI, one API service, and
  a small explicit data model; the quickstart lists test and run commands for delivery.

## Project Structure

### Documentation (this feature)

```text
specs/001-simple-lunch-poll/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
    └── poll-api.md
```

### Source Code (repository root)

```text
src/
├── components/
├── features/poll/
├── services/
├── App.tsx
└── main.tsx

server/
└── src/
    ├── api/
    ├── poll/
    └── storage/

shared/
└── poll-contracts.ts

tests/
├── ui/
├── api/
└── integration/
```

**Structure Decision**: Use a single repository with a Vite React client in `src/`, a
TypeScript API service in `server/src/`, shared request/response types in `shared/`, and
Vitest tests grouped by UI, API, and persistence integration. Vite proxies `/api` to the
local API during development; production serves the client and API from one host.

## Complexity Tracking

No constitution violations. The API and SQLite store are necessary to meet the clarified
requirement that all participants share totals and totals survive reloads; browser-only
storage cannot provide that behavior.
