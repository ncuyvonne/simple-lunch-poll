# Quickstart: Add Salad Option

## Prerequisites

- Node.js 22.12 or later and pnpm 11.25 or later.
- A writable persistent directory for the SQLite database.

## Install and run locally

From the repository root, install dependencies and start the client and API:

```sh
pnpm install
pnpm dev
```

Open the local URL printed by Vite. The poll shows 「便當」, 「麵」, and 「沙拉」.

## Validate the feature

Run the automated suite and TypeScript check:

```sh
pnpm test -- --run
pnpm typecheck
```

Expected scenarios:

1. Submit a salad vote and verify its count increases by one while both existing counts
   remain unchanged.
2. Submit a vote for each existing option and verify each remains selectable and all
   three totals are returned.
3. Submit with no choice and with an unknown choice; verify clear errors and unchanged
   totals for all three choices.
4. Re-fetch the poll or restart the API; verify all accepted counts remain available.
5. Open a database created by the previous two-choice version; verify existing `bento`
   and `noodles` counts are preserved, `salad` starts at zero, and initializing it again
   does not change those counts.

## API smoke check

With the API running, request `GET /api/poll` and confirm it returns three choices. Submit
`POST /api/poll/votes` with `{"choiceId":"salad"}` and confirm the response contains all
three updated totals. See [poll-api.md](contracts/poll-api.md) for the contract.

## Production run

Build and start the production client/API process:

```sh
pnpm build
pnpm start
```

