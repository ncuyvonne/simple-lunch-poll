---
description: "Dependency-ordered implementation tasks for Add Salad Option"
---

# Tasks: Add Salad Option

**Input**: Design documents from `/specs/002-add-salad-option/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/poll-api.md,
quickstart.md

**Tests**: Required by FR-008 and the project constitution: valid salad vote, empty and
unknown-choice boundaries, unchanged rejected totals, and safe legacy database migration.

**Organization**: Tasks are grouped by user story, with database migration completed as a
blocking foundation before either story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it uses separate files and has no unfinished task
  dependency.
- **[Story]**: User story label for story-phase tasks.
- Every task names the exact file or files it covers.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Reuse the existing project tooling; no new dependencies are planned.

- [X] T001 Verify the existing scripts and compiler/test configuration support this feature without new dependencies in `package.json`, `tsconfig.json`, and `vitest.config.ts`.

---

## Phase 2: Foundational (Blocking Database Migration)

**Purpose**: Ensure existing and new databases can store exactly three aggregate counts
without losing accepted votes; this blocks both user stories.

### Tests

- [X] T002 Update the fresh-schema assertions to expect exactly three zeroed choices and add a legacy-database migration test with nonzero `bento` and `noodles` counts; verify old values survive, `salad` starts at zero, unsupported IDs and negative counts remain rejected, and repeated initialization preserves all counts in `tests/setup/database.test.ts` and `tests/integration/poll-migration.test.ts`.

### Implementation

- [X] T003 Update the fresh database schema to allow `bento`, `noodles`, and `salad`, seed exactly one zeroed row per choice, and transactionally migrate the legacy table while preserving existing counts in `server/src/storage/schema.sql` and `server/src/storage/database.ts`.

**Checkpoint**: Migration tests pass for both a fresh database and an existing two-choice database before user-story work begins.

---

## Phase 3: User Story 1 - Vote for Salad (Priority: P1) 🎯 MVP

**Goal**: Display the three fixed choices and accept a salad vote while preserving the
existing choices and shared totals.

**Independent Test**: Read the poll, submit one salad vote, and verify the API and page
show three choices with only the salad count increased; reopen the database and verify the
count persists.

### Tests

> Write these tests first and confirm the salad-specific assertions fail before implementation.

- [X] T004 [P] [US1] Test that the poll page shows exactly three radio choices, communicates successful submission, and displays updated totals after submitting salad in `tests/ui/poll-page.test.tsx`.
- [X] T005 [P] [US1] Test that `POST /api/poll/votes` accepts `salad` and returns all three updated counts in `tests/api/poll-routes.test.ts`.
- [X] T006 [P] [US1] Test that a salad vote and the existing choice totals remain available after reopening the database in `tests/integration/poll-persistence.test.ts`.

### Implementation

- [X] T007 [US1] Add fixed choice ID `salad` and label 「沙拉」 after the existing choices in `shared/poll-contracts.ts`; preserve the existing derived `ChoiceId` type.

**Checkpoint**: The salad option is selectable, accepted by the API, increments only its aggregate count, and appears with both existing choices after a reload.

---

## Phase 4: User Story 2 - Keep Invalid Submissions from Changing Results (Priority: P1)

**Goal**: Preserve the existing clear rejection behavior for empty and unknown choices
with three tallies present.

**Independent Test**: Submit without a selection and submit an unknown choice; confirm both
requests are rejected with clear errors and all three tallies remain unchanged.

### Tests

> Extend the existing validation tests after User Story 1 adds the third tally.

- [X] T008 [P] [US2] Extend API validation cases to verify missing, empty, and unknown choices leave all three tallies unchanged in `tests/api/poll-validation.test.ts`.
- [X] T009 [P] [US2] Extend the empty-submission UI test to verify all three displayed counts remain unchanged, the actionable error appears, and selecting a valid choice clears it in `tests/ui/poll-validation.test.tsx`.

**Checkpoint**: Empty and unknown submissions still fail safely without changing any of the three counts.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Verify the complete change against the project scripts and quickstart.

- [X] T010 Run the full Vitest suite, TypeScript check, and production build using the scripts in `package.json`.
- [X] T011 Validate the install, development flow, API behavior, legacy database migration, persistence, and production run instructions in `specs/002-add-salad-option/quickstart.md`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Verify existing tooling; no package or infrastructure changes are expected.
- **Foundational (Phase 2)**: Depends on setup verification; the migration test is written before schema and migration implementation and blocks both stories.
- **User Story 1 (Phase 3)**: Depends on the three-choice database foundation; write UI, API, and persistence tests before adding the shared salad choice.
- **User Story 2 (Phase 4)**: Depends on User Story 1 because validation must be checked with the salad tally present; test files are independent and may be updated in parallel.
- **Polish (Phase 5)**: Depends on both user stories passing their phase tests.

### User Story Dependencies

- **US1 (P1)**: Starts after Phase 2 and delivers the third choice and valid salad voting.
- **US2 (P1)**: Follows US1 so rejection coverage checks that all three counts are preserved.

### Parallel Opportunities

- In Phase 3, T004, T005, and T006 use separate test files and can be authored in parallel after Phase 2.
- In Phase 4, T008 and T009 use separate test files and can be authored in parallel.
- Implementation and validation tasks that touch the same files remain sequential.

## Parallel Example: User Story 1

```text
Write the tests in parallel and verify the salad-specific assertions fail:
Task: T004 tests/ui/poll-page.test.tsx
Task: T005 tests/api/poll-routes.test.ts
Task: T006 tests/integration/poll-persistence.test.ts

Then implement the shared fixed choice:
Task: T007 shared/poll-contracts.ts
```

## Implementation Strategy

### MVP First (User Story 1)

1. Verify existing tooling in Phase 1.
2. Complete and pass the migration test and implementation in Phase 2.
3. Write the User Story 1 tests, confirm they fail for the missing salad choice, then implement T007.
4. Run the User Story 1 tests and verify its acceptance scenarios before entering Phase 4.

### Incremental Delivery

1. Deliver User Story 1 with the three displayed choices and valid shared salad tally.
2. Add User Story 2 validation coverage and confirm rejected inputs do not alter any tally.
3. Run the complete suite and validate the quickstart in Phase 5.

## Notes

- Every task uses the required checkbox, sequential ID, optional parallel marker, story label where applicable, and concrete file path.
- Test tasks precede the implementation they verify; pass each phase's tests before proceeding to the next phase.
- No dependencies are added for this feature.
