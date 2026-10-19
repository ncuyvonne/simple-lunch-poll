# Poll API Contract

The browser uses same-origin JSON requests. The API is authoritative for validation,
accepted votes, and aggregate counts.

## `GET /api/poll`

Returns the fixed poll and its current shared totals.

**Success `200`**

```json
{
  "id": "lunch-poll",
  "question": "今天午餐要吃什麼？",
  "choices": [
    { "id": "bento", "label": "便當", "voteCount": 0 },
    { "id": "noodles", "label": "麵", "voteCount": 0 }
  ]
}
```

Each `voteCount` is a non-negative integer reflecting all persisted accepted votes at
the time of the request.

## `POST /api/poll/votes`

Records exactly one vote for a valid choice and returns updated totals.

**Request `application/json`**

```json
{ "choiceId": "bento" }
```

`choiceId` MUST be a non-empty string matching one of the fixed choices. The server MUST
validate the request regardless of client-side validation. Each accepted request
atomically increases the selected choice's aggregate count by one; repeated submissions
are allowed. The individual submission and its timestamp are not persisted.

**Success `201`**

```json
{
  "accepted": true,
  "poll": {
    "id": "lunch-poll",
    "question": "今天午餐要吃什麼？",
    "choices": [
      { "id": "bento", "label": "便當", "voteCount": 1 },
      { "id": "noodles", "label": "麵", "voteCount": 0 }
    ]
  }
}
```

**Validation error `400`**

```json
{
  "error": {
    "code": "NO_CHOICE_SELECTED",
    "message": "請先選擇一個選項再送出。"
  }
}
```

Use `NO_CHOICE_SELECTED` for a missing or empty choice and `INVALID_CHOICE` for an
unknown choice ID. Both errors MUST leave persisted tallies unchanged. Error
messages MUST be clear and MUST NOT contain secrets or internal implementation details.
