# Data Model: Lunch Poll Home Screen

This feature adds no persisted data and changes no server-side entity.

## Existing Displayed Entities

| Entity | Fields used by the screen | Validation / behavior |
| --- | --- | --- |
| Poll | Question and fixed choices | Loaded from the existing poll service; absent data is shown as loading or a clear failure, never as fabricated totals |
| Choice | Stable choice identifier, label, current count | Exactly 「便當」、「麵」、「沙拉」 are displayed; one radio choice may be selected at a time |
| Vote Count | Shared aggregate integer for each choice | Updated only after the existing API accepts a vote; no per-person vote record is introduced |
| Vote Submission | One selected choice identifier | Empty submission shows an error and does not change counts |

## Relationships and Lifecycle

- A Poll contains its existing fixed set of Choices.
- Each Choice displays its current shared Vote Count.
- A successful Vote Submission updates the selected Choice count and refreshes totals on the submitting page.
- Loading, loaded, submitting, success, and error states remain transient UI state; they are not persisted by this feature.
