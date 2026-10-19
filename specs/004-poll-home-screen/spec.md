# Feature Specification: Lunch Poll Home Screen

**Feature Branch**: `004-poll-home-screen`

**Created**: 2026-10-19

**Status**: Draft

**Input**: User description: "幫我加入啟動的畫面" with the attached lunch-poll screen as a visual reference.

## Clarifications

### Session 2026-10-19

- Q: 你說的「啟動畫面」是指附圖那種一打開網站就能投票的首頁，還是要在投票頁前短暫出現一個 splash 畫面？ → A: 直接顯示附圖中的投票首頁，不加入投票頁之前的短暫 splash 畫面。
- Q: 這次首頁改版是否要新增可量測的初始載入時間目標？ → A: 不新增載入時間門檻；維持既有請求流程。

## User Scenarios & Testing

### User Story 1 - Open the Lunch Poll Home Page (Priority: P1)

As a participant who opens the voting site, I want to see a clear, welcoming lunch poll screen, so I can understand the question, compare the current choices, and vote without searching for the form.

**Why this priority**: The first screen is the main entry point to the student project and needs to make the poll's purpose and action immediately clear.

**Independent Test**: Open the site and confirm the initial page presents the lunch question, all three choices and their current counts, a single-choice selection control, and the vote action in a layout guided by the supplied reference image.

**Acceptance Scenarios**:

1. **Given** a participant opens the site and the poll loads successfully, **When** the initial screen appears, **Then** it presents the question 「今天午餐要吃什麼？」, the instruction to choose one option, 「便當」、「麵」、「沙拉」 with current vote counts, and a 「送出投票」 action.
2. **Given** a participant views the initial screen, **When** they scan the page, **Then** the content follows the reference's visual hierarchy: a warm neutral page, a centered light poll card, a dark green title area, clearly separated choice rows, a prominent submit action, and a concise footer.
3. **Given** a participant chooses an option and submits, **When** the vote succeeds, **Then** the same screen shows the updated totals and a clear success message.
4. **Given** a participant submits without choosing an option, **When** the form responds, **Then** a clear error appears and no vote count changes.
5. **Given** poll data is still loading or cannot be retrieved, **When** a participant opens the page, **Then** the page communicates loading or failure and does not display invented vote counts.
6. **Given** a participant submits a vote while another page is open elsewhere, **When** the participant reads the screen's footer, **Then** its wording describes the submitting page's immediate result update without promising live updates on the other page.

### Edge Cases

- On a narrow screen, the question, choice labels, counts, and submit action remain readable and usable without horizontal scrolling.
- While poll data is loading or unavailable, the page communicates the state clearly and does not present fabricated vote counts.
- The screen's footer copy must not imply that separate open browsers receive live updates; only the submitting participant sees the updated result immediately.

## Requirements

### Functional Requirements

- **FR-001**: The site MUST open directly to the lunch poll home page shown in the reference, without an intervening splash screen.
- **FR-002**: The initial screen MUST show the existing lunch question, exactly the three existing choices, each current vote count, a single-choice control, and the submit action.
- **FR-003**: The screen MUST follow the supplied reference's visual hierarchy, including a warm neutral background, centered light poll card, dark green heading area, separated choice rows, prominent submit button, and compact footer.
- **FR-004**: Participants MUST be able to select at most one choice and submit it from this screen; successful votes MUST show the refreshed counts and a clear confirmation.
- **FR-005**: An empty submission MUST show a clear actionable error and MUST NOT change any vote count.
- **FR-006**: Loading and poll-loading failure states MUST be communicated clearly without displaying invented poll data.
- **FR-007**: The screen MUST remain readable and usable on narrow and wide screens without horizontal scrolling.
- **FR-008**: The page MUST preserve the existing aggregate-only vote storage and MUST NOT imply live push updates to other open pages.

## Key Entities

- **Poll**: The existing lunch question and fixed set of choices displayed on the screen.
- **Choice**: One of 「便當」、「麵」、「沙拉」, with its current shared vote count.
- **Vote submission**: A participant's single selected choice; the existing system records only the resulting aggregate count.

## Success Criteria

### Measurable Outcomes

- **SC-001**: On initial load, participants can see the poll question, all three choices and their counts, and the submit action on the same screen.
- **SC-002**: At viewport widths of 320 and 1280 CSS pixels, all poll controls remain reachable and the page has no horizontal scrolling.
- **SC-003**: A valid vote updates the submitting page's displayed totals and confirmation without navigating away.
- **SC-004**: In 100% of empty-submission attempts, the page shows an actionable error and all vote counts remain unchanged.
- **SC-005**: During loading or a failed poll request, no choice is shown with a fabricated vote count.

## Assumptions

- The existing question, three choices, voting rules, and API behavior remain unchanged.
- This feature adds no initial-load time target and preserves the existing poll request flow.
- Footer copy may be adjusted to accurately describe immediate updates on the submitting page without implying live updates across browsers.
- The visual design should adapt to narrow screens while retaining the reference's hierarchy; exact pixel matching is not required.
