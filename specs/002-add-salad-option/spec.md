# Feature Specification: Add Salad Option

**Feature Branch**: `002-add-salad-option`

**Created**: 2026-10-19

**Status**: Draft

**Input**: User description: "在投票系統新增沙拉的選項"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Vote for Salad (Priority: P1)

As a participant, I want to choose 「沙拉」 as well as 「便當」 or 「麵」, so I can vote
for the lunch option I prefer and see the updated shared results.

**Why this priority**: Adding the requested option expands the poll while preserving its
existing purpose and voting flow.

**Independent Test**: Open the lunch poll, verify all three choices are available, vote
for 「沙拉」, and verify only its count increases by one while all three totals are shown.

**Acceptance Scenarios**:

1. **Given** the lunch poll is open, **When** a participant views the choices, **Then**
   「便當」, 「麵」, and 「沙拉」 are available and no existing choice is removed.
2. **Given** the poll is open, **When** a participant selects 「沙拉」 and submits,
   **Then** 「沙拉」 receives exactly one vote, the other two counts remain unchanged,
   all three current counts are displayed immediately, and success is communicated.
3. **Given** a participant selects 「便當」 or 「麵」, **When** they submit,
   **Then** the selected existing choice continues to receive exactly one vote, all
   three current counts are displayed, and success is communicated.

### User Story 2 - Keep Invalid Submissions from Changing Results (Priority: P1)

As a participant, I want the existing empty and invalid submission protections to apply
to the expanded poll, so incorrect requests do not change any choice's results.

**Why this priority**: A third choice must follow the same validation guarantees as the
existing options so the shared totals remain accurate.

**Independent Test**: Submit without selecting a choice and submit an unknown choice;
verify clear errors are shown and the counts for all three choices remain unchanged.

**Acceptance Scenarios**:

1. **Given** no choice is selected, **When** a participant submits, **Then** a clear
   actionable error is shown and no count changes.
2. **Given** a request contains an unknown choice, **When** it is submitted,
   **Then** it is rejected with a clear error and no count changes.

### Edge Cases

- A newly initialized poll shows zero votes for 「便當」, 「麵」, and 「沙拉」.
- A valid salad submission increments its count by exactly one, including when other
  choices already have votes.
- Changing the selected choice before submitting counts only the final selection.
- Empty and unknown choices leave all three counts unchanged.
- After reloading the poll, accepted salad votes remain included in the shared total.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The lunch poll MUST provide exactly three choices: 「便當」, 「麵」, and
  「沙拉」. The existing question and choices MUST remain available.
- **FR-002**: A participant MUST be able to select at most one of the three choices at a
  time.
- **FR-003**: On a valid submission, the system MUST add exactly one vote to the selected
  choice and leave the other two counts unchanged.
- **FR-004**: After a valid submission, the page MUST immediately display the current
  shared cumulative count for all three choices; counts MUST remain available after
  reloading the page.
- **FR-005**: The page MUST communicate successful submission without requiring the
  participant to navigate away.
- **FR-006**: An empty submission MUST show a clear actionable error and leave all three
  counts unchanged.
- **FR-007**: An unknown choice MUST be rejected with a clear error and leave all three
  counts unchanged.
- **FR-008**: Tests MUST cover a valid salad vote, an empty-submission boundary case, and
  an unknown choice, including clear errors and unchanged counts for rejected requests.

### Key Entities *(include if data involved)*

- **Poll**: The existing lunch question and its three fixed choices.
- **Choice**: One of 「便當」, 「麵」, or 「沙拉」 and its current vote count.
- **Vote Count**: The shared cumulative number of accepted votes for a choice. Individual
  submissions and their timestamps are not retained.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The poll page displays exactly three separately labeled choices:
  「便當」, 「麵」, and 「沙拉」.
- **SC-002**: A valid salad submission increases the salad count by exactly one while
  the other two counts remain unchanged.
- **SC-003**: After a valid submission, all three current counts are visible immediately
  on the same page.
- **SC-004**: After reloading the page, all three shared counts include previously
  accepted votes.
- **SC-005**: In every empty or unknown-choice submission, participants receive an
  actionable error and none of the three counts changes.

## Assumptions

- This change extends the existing fixed lunch poll; the question remains
  「今天午餐要吃什麼？」.
- The choice set after this change is exactly 「便當」, 「麵」, and 「沙拉」; creating
  polls or editing their choices is out of scope.
- Existing accepted votes for 「便當」 and 「麵」 remain part of the shared totals.
- Each accepted submission counts as one vote; preventing the same person from voting
  more than once remains out of scope.
- Only aggregate counts are retained; individual choices and submission timestamps are
  not stored.
