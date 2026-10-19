# Quickstart: Simple Lunch Poll

## Prerequisites

- Node.js 22.12 or later and pnpm 11.25 or later.
- A writable persistent directory for the SQLite database when running the API.

## Install and run locally

Install dependencies and start the client and API together:

```sh
pnpm install
pnpm dev
```

Open the local URL printed by Vite. The development server proxies `/api` requests to
the API service. The initial poll shows 「便當」 and 「麵」 with zero votes.

## Validate the behavior

Run automated tests and the TypeScript check:

```sh
pnpm test -- --run
pnpm typecheck
```

Expected coverage includes:

1. Submit 「便當」 and verify its count increases by one while 「麵」 remains unchanged.
2. Submit 「麵」 and verify its count increases by one while 「便當」 remains unchanged.
3. Submit without selecting an option; verify a clear error and unchanged totals.
4. Send an unknown choice ID to the API; verify a validation error and unchanged totals.
5. Reload or re-fetch the poll; verify accepted votes remain in the shared totals.

## API smoke checks

With the API running, request `GET /api/poll`, then submit
`POST /api/poll/votes` with `{"choiceId":"bento"}`. The response MUST include both
updated totals. Submitting `{}` or an unknown choice MUST return a `400` validation error
without changing totals. See [poll-api.md](contracts/poll-api.md) for the full contract.

To build and serve the production client and API from one process:

```sh
pnpm build
pnpm start
```

## Deployment note

The API host must use a persistent writable disk path for SQLite. Do not deploy this
configuration on ephemeral storage if vote totals must survive restarts or deployments.
If hosting requires multiple API instances or a database service, revisit the storage
decision and use a shared client/server database.
