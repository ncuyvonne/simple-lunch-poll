---
description: "Dependency-ordered implementation tasks for Simple Lunch Poll"
---

# Tasks: Simple Lunch Poll

**Input**: Design documents from `/specs/001-simple-lunch-poll/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/poll-api.md,
quickstart.md

**Tests**: Included because spec FR-008 and the project constitution require normal,
boundary, and invalid-input test coverage for every feature.

**Organization**: Tasks are grouped by user story so each story can be implemented and
verified as an increment.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it uses separate files and has no unfinished task
  dependency.
- **[Story]**: User story label for story-phase tasks.
- Each task includes a concrete file path.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the empty full-stack TypeScript project and its development commands.

- [X] T001 Create root package scripts and metadata in `package.json`.
- [X] T002 [P] Configure strict TypeScript compiler options for client, server, shared code, and tests in `tsconfig.json`.
- [X] T003 [P] Scaffold the Vite React TypeScript client and HTML entry in `index.html`, `vite.config.ts`, `src/main.tsx`, and `src/App.tsx`.
- [X] T004 Configure Tailwind CSS Vite integration and base stylesheet in `vite.config.ts` and `src/index.css`.
- [X] T005 Configure Vitest with UI DOM environment and API Node environment in `vitest.config.ts`.
- [X] T006 Add Express, SQLite driver, React Testing Library, jsdom, and type definitions to `package.json` and create the server entry in `server/src/index.ts`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared contracts, durable storage, and API/test infrastructure used by both user stories.

**Checkpoint**: Complete these tasks before starting either user story.

- [X] T007 [P] Define poll, choice, vote request, and response types in `shared/poll-contracts.ts` using fixed poll ID `lunch-poll`, choices `bento` and `noodles`, and labels 「便當」 and 「麵」.
- [X] T008 [P] Define a SQLite aggregate-tally table in `server/src/storage/schema.sql` with exactly one row per fixed choice, a non-negative count initialized to zero, and no per-submission or timestamp fields.
- [X] T009 Create SQLite connection, schema initialization, and isolated database path configuration in `server/src/storage/database.ts` and `server/src/config.ts`.
- [X] T010 Create JSON parsing, stable validation-error response, and safe unexpected-error handling in `server/src/api/middleware.ts`; do not log request secrets or raw database errors.
- [X] T011 Configure Vite `/api` development proxy and Express route mounting in `vite.config.ts` and `server/src/app.ts`.
- [X] T012 Create reusable isolated SQLite test setup and cleanup helpers plus a tally-schema smoke test in `tests/setup/database.ts` and `tests/setup/database.test.ts`.

---

## Phase 3: User Story 1 - Vote on Lunch (Priority: P1) 🎯 MVP

**Goal**: Participants can select one lunch choice, submit a valid vote, and immediately see the shared persisted totals.

**Independent Test**: With a clean test database, submit one vote for each fixed choice in separate runs; each accepted request increments only that choice, returns both totals, and a subsequent poll read returns the same totals.

### Tests for User Story 1

> Write tests first and confirm they fail before implementing the behavior.

- [X] T013 [P] [US1] Add UI tests for the question, exactly two single-select choices, valid submission, and immediate display of returned totals in `tests/ui/poll-page.test.tsx`.
- [X] T014 [P] [US1] Add API contract tests for initial zero totals and valid vote responses for both choice IDs in `tests/api/poll-routes.test.ts`.
- [X] T015 [P] [US1] Add persistence integration tests proving aggregate counts survive database reopen and no individual submission records are retained in `tests/integration/poll-persistence.test.ts`.

### Implementation for User Story 1

- [X] T016 [US1] Implement an atomic selected-choice tally increment and aggregate count reads in `server/src/storage/poll-repository.ts`, without storing individual submissions or timestamps.
- [X] T017 [US1] Implement `GET /api/poll` and valid `POST /api/poll/votes` responses from `contracts/poll-api.md` in `server/src/api/poll-routes.ts`.
- [X] T018 [US1] Implement typed poll fetching and vote submission calls in `src/features/poll/poll-api.ts`.
- [X] T019 [US1] Build the poll page with the fixed question, two accessible radio choices, submit action, and returned aggregate totals in `src/features/poll/PollPage.tsx` and `src/features/poll/poll-page.css`.
- [X] T020 [US1] Connect the poll page to the application entry and handle loading and successful submission states in `src/App.tsx` and `src/features/poll/PollPage.tsx`.

**Checkpoint**: Valid votes work independently; both choices display correct shared totals after submission and reload.

---

## Phase 4: User Story 2 - Prevent an Empty Vote (Priority: P1)

**Goal**: An empty or invalid selection receives a clear error and never changes vote totals.

**Independent Test**: Submit with no selected choice and submit an unknown choice ID directly to the API; each case returns a clear validation error, displays the empty-selection error to the participant where applicable, and preserves both totals.

### Tests for User Story 2

> Write tests first and confirm they fail before implementing the behavior.

- [X] T021 [P] [US2] Add UI tests for empty submission error, unchanged displayed totals, and error clearing after a valid selection in `tests/ui/poll-validation.test.tsx`.
- [X] T022 [P] [US2] Add API tests for missing, empty, malformed, and unknown choice input returning clear 400 errors without inserting votes in `tests/api/poll-validation.test.ts`.

### Implementation for User Story 2

- [X] T023 [US2] Validate missing, empty, and unknown choice IDs before storage writes and return `NO_CHOICE_SELECTED` or `INVALID_CHOICE` errors in `server/src/api/poll-routes.ts`.
- [X] T024 [US2] Validate selection before submission, show the actionable message 「請先選擇一個選項再送出。」, and clear it after a valid selection in `src/features/poll/PollPage.tsx`.
- [X] T025 [US2] Normalize malformed JSON and unexpected API failures into safe user-facing errors without changing totals or exposing internals in `server/src/api/middleware.ts` and `src/features/poll/poll-api.ts`.

**Checkpoint**: Empty and invalid submissions are rejected at both UI and API boundaries, with no vote counted.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Verify the complete feature against its constitution, quickstart, and accessibility needs.

- [X] T026 [P] Add accessible labels, keyboard-operable radio controls, and live announced status/error messages in `src/features/poll/PollPage.tsx` and `tests/ui/poll-validation.test.tsx`.
- [X] T027 [P] Ensure client configuration contains no database secrets and server logging omits request secrets and raw internal errors in `vite.config.ts`, `server/src/config.ts`, `server/src/api/middleware.ts`, and `.gitignore`.
- [X] T028 Run the full test suite and TypeScript check from `package.json`, fixing any failures in the affected files under `tests/`, `src/`, and `server/src/`.
- [X] T029 Verify the install, dev server, API smoke checks, persistence, and test commands in `specs/001-simple-lunch-poll/quickstart.md`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No prior feature tasks. Create project manifests and client/server tooling.
- **Foundational (Phase 2)**: Depends on Setup; blocks both user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational; provides the valid vote and results MVP.
- **User Story 2 (Phase 4)**: Depends on Foundational and the poll page/API from US1; adds rejection and recovery behavior.
- **Polish (Phase 5)**: Depends on both user stories.

### User Story Dependencies

- **US1 (P1)**: Can start after Phase 2; no dependency on another user story.
- **US2 (P1)**: Starts after US1 because it extends the same submit flow and verifies invalid cases against its API and page.

### Parallel Opportunities

- During Setup, T002 and T003 use distinct files after T001 creates the package workspace. T004 follows T003 because both update `vite.config.ts`; T005 can proceed once package metadata exists, and T006 adds server dependencies after T001.
- In Foundational, T007, T008, and T010 are independent file additions; T009 depends on the schema from T008; T011 depends on the client/server entries; T012 depends on the database setup shape from T009.
- In US1, T013, T014, and T015 are independent test files and can be written in parallel before implementation. T016, T018, and T019 touch separate areas after the shared contract exists; T017 depends on T016 and T007; T020 depends on T019.
- In US2, T021 and T022 are independent tests and can be written together. T023 and T024 touch separate API and UI files; T025 follows error contract decisions in T023.
- In Polish, T026 and T027 touch distinct concerns and may proceed in parallel; T028 and T029 follow implementation.

## Parallel Example: User Story 1

```text
Write tests in parallel:
Task: T013 tests/ui/poll-page.test.tsx
Task: T014 tests/api/poll-routes.test.ts
Task: T015 tests/integration/poll-persistence.test.ts

After the shared contract exists, implement separately:
Task: T016 server/src/storage/poll-repository.ts
Task: T018 src/features/poll/poll-api.ts
Task: T019 src/features/poll/PollPage.tsx
```

## Implementation Strategy

### MVP First (User Story 1)

1. Complete Setup and Foundational phases.
2. Write the US1 tests and verify they fail before implementation.
3. Implement valid voting, shared totals, and persistence.
4. Run the US1 tests and demonstrate the flow independently.

### Incremental Delivery

1. Deliver US1 with valid vote submission and persisted shared results.
2. Add US2 empty/invalid input errors and verify counts remain unchanged.
3. Complete accessibility, secret-handling review, full tests, and quickstart validation.

## Notes

- Every task is a checkbox with a sequential ID; `[P]` marks independent work and `[US1]` / `[US2]` maps story work to the specification.
- All task descriptions name the files to create or update.
- Test tasks are required by spec FR-008 and the project constitution; write them before the matching implementation tasks.

## Phase 6: Convergence

- [X] T030 Review the unrequested `GET /health` route in `server/src/app.ts`; document its operational purpose in the plan/API contract or remove the route per plan API scope (unrequested).
