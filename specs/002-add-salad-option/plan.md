# Implementation Plan: Add Salad Option

**Branch**: `002-add-salad-option` | **Date**: 2026-10-19 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-add-salad-option/spec.md`

## Summary

Add 「沙拉」 as a third fixed choice in the existing lunch poll. Extend the shared
choice definition so the API validation, returned poll, and radio list include it. Update
SQLite initialization to migrate existing two-choice databases transactionally, retaining
the current 「便當」 and 「麵」 counts and initializing 「沙拉」 to zero. Keep vote storage
aggregate-only and retain the existing validation, immediate result update, and persistence
behavior.

## Technical Context

**Language/Version**: TypeScript 5.9; Node.js 22.12 or later

**Primary Dependencies**: Existing React 19, Vite 7, Tailwind CSS 4, Express 5,
better-sqlite3 12, and Vitest 3 project dependencies; no new dependencies

**Storage**: Existing SQLite database with one aggregate tally per fixed choice. Migrate
legacy two-choice databases without losing existing tally counts.

**Testing**: Existing Vitest suite: UI, API, schema, and persistence integration tests.
Add coverage for the third choice and legacy database migration.

**Target Platform**: Modern desktop and mobile browsers; single Node.js application host
with persistent writable storage

**Project Type**: Existing full-stack web application

**Performance Goals**: Return updated counts in the existing vote response; no additional
throughput target is required for this fixed poll.

**Constraints**: Exactly three fixed choices (`bento`, `noodles`, `salad`); preserve old
counts; initialize the new count to zero; reject empty or unknown choices without changing
any count; retain aggregate counts only; no secrets in browser code or logs.

**Scale/Scope**: One existing poll with three choices and shared repeatable votes. No poll
editor, voter identity, duplicate-voter prevention, or live push updates to other open pages.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Validated Inputs and Clear Errors**: Pass. The existing UI and API validation
  remain in place; the server validates the new fixed choice against the shared choice
  list and rejects invalid submissions without changing totals.
- **II. Secret Handling**: Pass. The feature adds no credentials or sensitive
  configuration. Existing logs omit request bodies and database errors.
- **III. Feature-Level Tests**: Pass. Plan tests for a normal salad vote, empty and
  unknown choice boundaries, unchanged rejected totals, and migration of nonzero legacy
  tallies.
- **IV. Clear, Maintainable Design**: Pass. Extend the existing fixed-choice model and
  initialization path; no new service or dependency is needed.
- **V. Verifiable Delivery**: Pass. Quickstart documents install, test, typecheck, build,
  development run, and the migration validation scenario.
- **Data minimization**: Pass. Persist only the three aggregate counts; do not add per-vote
  records or timestamps.

**Post-design gate**: Pass. The design preserves existing tally data, validates all vote
inputs, adds no secrets or individual vote retention, and defines repeatable test coverage.

## Project Structure

### Documentation (this feature)

```text
specs/002-add-salad-option/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
    └── poll-api.md
```

### Source Code (existing project touchpoints)

```text
shared/poll-contracts.ts
server/src/storage/
├── schema.sql
└── database.ts
server/src/storage/poll-repository.ts
server/src/api/poll-routes.ts
src/features/poll/
├── PollPage.tsx
└── poll-api.ts
tests/
├── setup/database.test.ts
├── api/
├── integration/poll-persistence.test.ts
└── ui/
```

**Structure Decision**: Keep the existing single-repository web architecture: Vite React
client in `src/`, Express API and SQLite storage in `server/src/`, shared poll types in
`shared/`, and Vitest coverage grouped under `tests/`. No new application layer is needed.

