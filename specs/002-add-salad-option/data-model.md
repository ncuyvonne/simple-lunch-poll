# Data Model: Add Salad Option

## Poll

Represents the existing fixed lunch poll.

| Field | Type | Rules |
|---|---|---|
| `id` | string | Stable identifier `lunch-poll`; required |
| `question` | string | Fixed text 「今天午餐要吃什麼？」 |
| `choices` | Choice list | Exactly three fixed choices in display order |

## Choice

Represents one selectable answer and its persisted aggregate tally.

| ID | Label | Vote count rules |
|---|---|---|
| `bento` | 「便當」 | Non-negative integer; preserve existing value |
| `noodles` | 「麵」 | Non-negative integer; preserve existing value |
| `salad` | 「沙拉」 | Non-negative integer; initialize to zero when added |

All accepted votes increase exactly one selected choice's count by one. Empty or unknown
choice IDs are rejected before any count changes. Individual submissions and timestamps
are not retained.

## Vote Submission

Represents a request containing the selected choice ID. The choice ID MUST match one of
the three fixed choices. A successful submission atomically increments only that choice
and returns all three current totals.

## Existing Database Migration

When opening a database created with the two-choice schema, initialization migrates the
aggregate tally table in a transaction. It preserves the existing `bento` and `noodles`
counts, adds `salad` with a count of zero, and may be repeated without changing existing
counts. No individual vote data is created by the migration.

