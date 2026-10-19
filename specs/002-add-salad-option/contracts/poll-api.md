# Poll API Contract: Add Salad Option

The existing same-origin poll API remains authoritative for choice validation, accepted
votes, and shared aggregate counts. The fixed choice order is `bento`, `noodles`, `salad`.

## `GET /api/poll`

Returns the fixed poll and its current shared totals.

**Success `200`**

```json
{
  "id": "lunch-poll",
  "question": "今天午餐要吃什麼？",
  "choices": [
    { "id": "bento", "label": "便當", "voteCount": 0 },
    { "id": "noodles", "label": "麵", "voteCount": 0 },
    { "id": "salad", "label": "沙拉", "voteCount": 0 }
  ]
}
```

Each count is a non-negative integer and includes all previously accepted votes.

## `POST /api/poll/votes`

Records exactly one vote for a valid choice and returns updated totals.

**Request `application/json`**

```json
{ "choiceId": "salad" }
```

`choiceId` MUST be a non-empty string matching `bento`, `noodles`, or `salad`. Each
accepted request atomically increments the selected choice's aggregate count by one.
Repeated submissions are allowed; individual submissions and timestamps are not retained.

**Success `201`**

```json
{
  "accepted": true,
  "poll": {
    "id": "lunch-poll",
    "question": "今天午餐要吃什麼？",
    "choices": [
      { "id": "bento", "label": "便當", "voteCount": 0 },
      { "id": "noodles", "label": "麵", "voteCount": 0 },
      { "id": "salad", "label": "沙拉", "voteCount": 1 }
    ]
  }
}
```

**Validation errors `400`**

- Missing or empty choice: `NO_CHOICE_SELECTED`, message 「請先選擇一個選項再送出。」
- Unknown choice ID: `INVALID_CHOICE`, message 「請選擇有效的投票選項。」

Both errors leave all three persisted tallies unchanged and contain no secrets or internal
implementation details.

