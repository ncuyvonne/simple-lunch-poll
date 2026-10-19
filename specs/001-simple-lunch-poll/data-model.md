# Data Model: Simple Lunch Poll

## Poll

Represents the single fixed lunch poll.

| Field | Type | Rules |
|---|---|---|
| `id` | string | Stable identifier `lunch-poll`; required |
| `question` | string | Fixed text 「今天午餐要吃什麼？」 |
| `choices` | Choice list | Exactly two fixed choices |

## Choice

Represents one selectable answer and its persisted aggregate tally.

| Field | Type | Rules |
|---|---|---|
| `id` | string | Stable identifier `bento` or `noodles`; must belong to the poll |
| `label` | string | Fixed to 「便當」 or 「麵」 |
| `voteCount` | non-negative integer | Persisted aggregate; starts at zero and increases by exactly one per accepted submission |

## Vote Submission

Represents a participant's request to add one vote to a selected Choice. The request
contains only the selected choice ID. The individual request, selected choice, and
submission timestamp are not persisted after the aggregate count is updated.

## Relationships and State Changes

- A Poll has exactly two Choices, each with one persisted aggregate `voteCount`.
- A valid submission increments exactly one Choice's count atomically and leaves the
  other count unchanged.
- An empty or unknown choice ID is rejected before any count changes.
- Only the aggregate counts are retained, so reloads and all participants read the same
  durable totals without retaining individual voting records.
- The API returns the totals after the increment. The client replaces its displayed
  results with the API response and does not calculate or persist authoritative counts.
