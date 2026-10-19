# Feature Specification: Simple Lunch Poll

**Feature Branch**: `001-simple-lunch-poll`

**Created**: 2026-10-19

**Status**: Draft

**Input**: User description: "建立「簡易小投票器」。頁面顯示問題「今天午餐要吃什麼？」與兩個選項「便當」和「麵」。使用者每次只能選一個選項投票；投票後立即顯示各選項目前票數。若尚未選擇選項就送出，顯示清楚錯誤訊息且不計票。"

## Clarifications

### Session 2026-10-19

- Q: 投票後的累計票數應如何保存與分享？ → A: 所有參與者共用累計票數，重新載入後仍保留。

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Vote on Lunch (Priority: P1)

As a participant, I want to choose between the lunch options and submit one vote, so I can
express my preference and see the current results.

**Why this priority**: Casting a vote and seeing results is the complete core value of the
poll.

**Independent Test**: Open the poll, select either option, submit once, and verify the
selected option's count increases by one and both current counts are shown immediately.

**Acceptance Scenarios**:

1. **Given** the poll is open and neither option has votes, **When** a participant selects
   「便當」 and submits, **Then** 「便當」 increases to one vote, 「麵」 remains at zero,
   and both counts are displayed immediately.
2. **Given** the poll is open, **When** a participant selects 「麵」 and submits, **Then**
   「麵」 receives exactly one vote and both current counts are displayed immediately.
3. **Given** a participant has selected an option, **When** they change their selection
   before submitting, **Then** only the final selected option receives a vote.

---

### User Story 2 - Prevent an Empty Vote (Priority: P1)

As a participant, I want a clear message when I submit without selecting an option, so I
know what to do and the poll results remain accurate.

**Why this priority**: An empty submission must not create an invalid vote or mislead
participants about the results.

**Independent Test**: Submit while neither option is selected and verify a clear error is
shown and neither count changes.

**Acceptance Scenarios**:

1. **Given** neither option is selected, **When** the participant submits, **Then** a
   clear error asks them to select one option and no vote is counted.
2. **Given** an empty submission has shown an error, **When** the participant selects a
   valid option and submits, **Then** the vote succeeds and the error is cleared.

### Edge Cases

- Submitting with no selection MUST show an error and leave both counts unchanged.
- Repeatedly changing the selection before submission MUST result in only one vote for
  the final choice.
- A vote count starts at zero for each option and MUST increase by exactly one per
  accepted submission.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The page MUST display the question 「今天午餐要吃什麼？」.
- **FR-002**: The page MUST provide exactly two choices: 「便當」 and 「麵」.
- **FR-003**: A participant MUST be able to select at most one choice at a time.
- **FR-004**: The system MUST reject submission when no choice is selected, display a
  clear actionable error, and leave all vote counts unchanged.
- **FR-005**: On a valid submission, the system MUST count exactly one vote for the
  selected choice.
- **FR-006**: After a valid submission, the system MUST immediately display the current
  shared cumulative vote count for both choices. Counts MUST remain available after
  reloading the page.
- **FR-007**: The page MUST communicate successful submission and update results without
  requiring the participant to navigate away.
- **FR-008**: The feature MUST be covered by tests for at least one valid vote, an empty
  submission boundary case, and rejection of an invalid or missing choice, including a
  clear error and unchanged counts.

### Key Entities *(include if feature involves data)*

- **Poll**: The lunch question and its two fixed choices.
- **Choice**: One of the poll's available options and its current vote count.
- **Vote Count**: The shared cumulative number of accepted votes for a choice. Individual
  submissions and their timestamps are not retained.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Participants can identify the question and both choices on the poll page
  without additional instructions.
- **SC-002**: For every valid submission, the displayed selected-choice count increases by
  exactly one and the other count remains unchanged.
- **SC-003**: After a valid submission, both current counts are visible immediately on
  the same page.
- **SC-004**: In every empty-submission case, participants see an actionable error and
  neither choice's count changes.

## Assumptions

- The poll has one fixed question and two fixed choices; poll creation and editing are out
  of scope.
- Each accepted submission counts as one vote. Preventing the same person from submitting
  more than once is not specified and is out of scope.
- Results show the shared aggregate vote counts for both choices, and accepted votes
  remain included after the page is reloaded.
- Only the aggregate count for each choice is persisted; individual choices and vote
  timestamps are not stored.
- The poll remains available during a participant's voting session.
