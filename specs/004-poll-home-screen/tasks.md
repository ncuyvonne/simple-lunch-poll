---
description: "Task list for the lunch poll home screen"
---

# Tasks: Lunch Poll Home Screen

**Input**: Design documents from `specs/004-poll-home-screen/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, and `quickstart.md`

**Tests**: Required by the feature specification and project constitution. Cover the normal loaded/successful-vote flow, empty-submission boundary, and loading/failure behavior.

**Organization**: Tasks are grouped by user story. This feature has one P1 story.

## Phase 1: Setup

**Purpose**: Confirm the existing app and test setup; no project initialization or dependency changes are required.

No setup tasks. The existing React/Vite/Tailwind/Vitest project is already configured.

## Phase 2: Foundational

**Purpose**: Complete shared prerequisites before the user story.

No foundational tasks. The feature uses the existing poll API, data model, page route, and test environment without shared infrastructure changes.

## Phase 3: User Story 1 - Open the Lunch Poll Home Page (Priority: P1) 🎯 MVP

**Goal**: On opening the site, participants see the lunch poll directly in a clear, responsive layout, can choose one of exactly 「便當」、「麵」、「沙拉」, submit a valid vote, and see refreshed totals. Empty or failed states remain clear and do not show false counts.

**Independent Test**: Load the page with a successful poll response, verify the question, exactly three labeled choices and their counts, single-choice controls, submit action, reference-inspired hierarchy, and successful vote confirmation. Also verify empty submission leaves counts unchanged, failed loading shows no fabricated totals, and the page has no horizontal overflow at 320px or 1280px.

### Tests for User Story 1

- [X] T001 [P] [US1] Add initial-screen and successful-vote assertions in `tests/ui/poll-page.test.tsx`, covering the question, exactly three choices with current counts, one-choice selection, refreshed totals, and success confirmation.
- [X] T002 [P] [US1] Add or preserve empty-submission boundary assertions in `tests/ui/poll-validation.test.tsx`, verifying a clear error, no vote request, and unchanged choice counts.
- [X] T003 [P] [US1] Add loading and rejected-request assertions in `tests/ui/poll-loading.test.tsx`, verifying clear state messaging and no fabricated choice/count rows.

### Implementation for User Story 1

- [X] T004 [US1] Refine the existing page presentation and footer wording to 「投票後立即更新」 while preserving loading, error, single-choice, submit, and successful-refresh behavior in `src/features/poll/PollPage.tsx`.
- [X] T005 [US1] Adjust the centered card, warm page background, and narrow-screen choice/count layout to preserve the reference hierarchy without horizontal overflow in `src/features/poll/poll-page.css`.

**Checkpoint**: User Story 1 must pass its targeted Vitest tests, typecheck, build, and browser viewport checks before proceeding to cross-cutting validation.

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Run feature-wide verification and ensure the documented quickstart matches the delivered behavior.

- [X] T006 Run `pnpm.cmd test -- --run`, `pnpm.cmd typecheck`, and `pnpm.cmd build`; record commands and results in `specs/004-poll-home-screen/quickstart.md`.
- [X] T007 Verify responsive behavior at 320px and 1280px in a browser and record the observed result in `specs/004-poll-home-screen/quickstart.md`.

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No work required; existing project setup is reused.
- **Foundational (Phase 2)**: No work required; no shared infrastructure is changed.
- **User Story 1 (Phase 3)**: Can start immediately. Complete T001–T003 before T004–T005; tests should be confirmed failing before their corresponding implementation changes.
- **Polish (Phase 4)**: Depends on the User Story 1 implementation and its targeted tests passing.

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies on other user stories; delivers the entire feature MVP.

### Within User Story 1

- T001, T002, and T003 target separate test files and can be done in parallel.
- T004 and T005 touch separate implementation files and can be done in parallel after the test cases are in place.
- T006 and T007 are validation tasks and follow the implementation checkpoint.

## Parallel Example: User Story 1

```text
Task: "T001 initial screen and successful vote in tests/ui/poll-page.test.tsx"
Task: "T002 empty submission in tests/ui/poll-validation.test.tsx"
Task: "T003 loading and failure in tests/ui/poll-loading.test.tsx"
```

## Implementation Strategy

### MVP First

1. Reuse the existing project setup; no setup or foundational code is needed.
2. Add the normal and boundary UI test coverage for User Story 1.
3. Refine the poll page and responsive styles.
4. **Stop and validate** the complete story with targeted Vitest tests, typecheck, build, and browser checks at 320px and 1280px.

### Incremental Delivery

This feature has a single user story, so User Story 1 is the MVP and complete delivery. Do not begin further feature work until its checkpoint passes.

## Notes

- Every task has a checkbox, sequential task ID, required story label where applicable, and an exact file path.
- No API, SQLite schema, dependency, secret, or logging changes are planned.
- Manual viewport validation is needed because jsdom does not compute rendered layout.

## Phase 5: Convergence

- [X] T008 Complete the pending browser viewport validation from T007 at 320px and 1280px, confirm controls remain reachable without horizontal scrolling, and record both results in `specs/004-poll-home-screen/quickstart.md` per SC-002 (partial).

## Phase 6: Convergence

- [X] T009 Obtain and record actual browser validation at both 320px and 1280px for no horizontal scrolling and reachable poll controls in `specs/004-poll-home-screen/quickstart.md` per SC-002 (partial).
