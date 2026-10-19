# Research: Add Salad Option

**Date**: 2026-10-19

## Fixed Choice Definition

- **Decision**: Add the fixed choice ID `salad` with label 「沙拉」 to the shared
  `CHOICES` definition. Continue deriving the `ChoiceId` type, API validation, returned
  choices, and UI radio controls from that list.
- **Rationale**: The existing API and UI already use the shared choice list, so extending
  it keeps validation and display consistent and avoids separate option lists.
- **Alternatives considered**: Add a separate salad-only code path or maintain distinct
  lists for UI and API; both duplicate a small fixed domain definition and can drift.
- **Code evidence**: `shared/poll-contracts.ts`, `server/src/api/poll-routes.ts`,
  `server/src/storage/poll-repository.ts`, and `src/features/poll/PollPage.tsx`.

## Existing SQLite Data Migration

- **Decision**: Migrate a legacy two-choice `poll_tallies` table transactionally to a
  table whose allowed IDs are `bento`, `noodles`, and `salad`. Copy existing counts,
  insert `salad` with count zero, and make initialization safe to run again.
- **Rationale**: The current table CHECK constraint only allows `bento` and `noodles`.
  `CREATE TABLE IF NOT EXISTS` does not change an existing table constraint, and inserting
  `salad` into the old table is rejected. A transaction prevents a partially rebuilt
  table and preserves previously accepted votes.
- **Alternatives considered**: Editing only the create-table SQL supports fresh databases
  but not existing installations. Resetting the table loses accepted votes and conflicts
  with the specification. A general migration framework adds unnecessary scope for this
  one fixed-choice change; use a small explicit, idempotent migration instead.
- **Code evidence**: `server/src/storage/schema.sql` has a two-ID CHECK constraint and
  seeds two rows; `server/src/storage/database.ts` executes that schema at startup without
  an existing migration mechanism.

## API and User Interface

- **Decision**: Keep the existing `GET /api/poll` and `POST /api/poll/votes` contracts.
  Include the salad choice in poll responses and accept `salad` as a valid `choiceId`.
  Render the new option through the existing data-driven radio list and return all three
  updated totals after voting.
- **Rationale**: The request and response shape already represents a fixed choice ID and
  an array of choice totals, so no endpoint or payload redesign is needed.
- **Alternatives considered**: Add a new salad endpoint or change the response shape; both
  are unnecessary and would make the client contract more complex.
- **Code evidence**: `server/src/api/poll-routes.ts`,
  `server/src/storage/poll-repository.ts`, `shared/poll-contracts.ts`, and
  `src/features/poll/PollPage.tsx`.

## Verification Strategy

- **Decision**: Extend existing Vitest setup/schema, API, persistence, and UI tests. Add a
  legacy-database migration test that starts with nonzero `bento` and `noodles` values,
  initializes the new schema, checks those values remain intact and `salad` is zero, and
  verifies reinitialization is safe.
- **Rationale**: The existing test structure already covers each affected boundary and
  supports isolated SQLite databases and HTTP integration tests.
- **Alternatives considered**: Introduce a separate test runner or rely only on a manual
  startup check; either duplicates tooling or misses the critical data-preservation case.

