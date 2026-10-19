# Research: Simple Lunch Poll

**Date**: 2026-10-19

## Shared, Persistent Vote Totals

- **Decision**: Use a small application API as the only writer and reader of a SQLite
  database stored on persistent disk. The browser fetches current totals and submits a
  selected choice to the API. The API validates the choice, atomically increments the
  selected choice's aggregate count, and returns authoritative totals. Persist only one
  count per fixed choice; do not retain individual selections or submission timestamps.
- **Rationale**: The specification requires the same cumulative totals for all
  participants and requires totals to remain after reload. Browser storage is scoped to a
  browser and cannot be the shared source of truth. Aggregate counts are sufficient to
  meet the results requirement; per-submission records and timestamps are unnecessary
  and would retain voting data beyond the feature's needs. SQLite supports small web
  sites and an application-specific server can mediate all database access; this keeps
  data access off the client and avoids a separately managed database for the student
  project's stated scale. The host must preserve its database file across
  restarts/deployments.
- **Alternatives considered**: Browser local storage is only local to one browser and
  loses shared totals. A hosted client/server database such as PostgreSQL is preferable
  when multiple application hosts, high write concurrency, or managed hosting are needed,
  but adds external service setup for this single-poll scope.
- **Concurrency rule**: Increment the selected choice's stored count atomically within a
  database transaction, then read and return both totals. Do not perform a client-side
  read/modify/write. SQLite serializes writers; if traffic later needs multiple API hosts
  or high write concurrency, move to a client/server database.
- **Sources**: [SQLite: Appropriate Uses](https://www.sqlite.org/whentouse.html),
  [SQLite: About](https://sqlite.org/about.html).

## Frontend and Tooling

- **Decision**: Use React with TypeScript and Vite, apply Tailwind CSS using its Vite
  integration, and use Vitest for UI and API tests.
- **Rationale**: These are the user-selected technologies. Vite provides a React
  TypeScript template and supports TypeScript modules. Vitest shares Vite configuration,
  supports TypeScript/JSX and component testing, and can run in a DOM environment for
  interaction tests. React's guidance supports keeping related UI state together and
  avoiding redundant state for selected choice, request state, and results.
- **Type checking**: Vite transpiles TypeScript but does not type-check it; include an
  explicit TypeScript type-check command in the project scripts and quickstart.
- **Secret handling**: Do not put database credentials in `VITE_*` variables because
  Vite exposes those variables to client code. Keep any database configuration on the
  server in environment variables and omit it from logs.
- **Alternatives considered**: A separate browser testing framework is unnecessary for
  this small UI when Vitest component tests can cover interactions; add browser end-to-end
  testing only if implementation needs cross-browser workflow validation.
- **Sources**: [React: Using TypeScript](https://react.dev/learn/typescript),
  [Vite: Getting Started](https://vite.dev/guide/),
  [Vite: Features and TypeScript](https://vite.dev/guide/features.html),
  [Tailwind CSS: Installation](https://tailwindcss.com/docs/installation/using-vite),
  [Vitest: Features](https://vitest.dev/guide/features),
  [Vitest: Component Testing](https://vitest.dev/guide/browser/component-testing),
  [Vite: Shared Options and Environment Variables](https://vite.dev/config/shared-options).

## Deployment and Live Updates

- **Decision**: Serve the browser application and API from one host with persistent disk
  for SQLite. After a successful vote, the submitting participant sees the returned
  totals; other open pages see updated totals when they reload or request results again.
- **Rationale**: The clarified requirement asks for shared durable counts and immediate
  results after the participant votes. It does not require automatic push updates to
  participants whose pages are already open.
- **Alternatives considered**: WebSockets or periodic polling could update every open
  page, but would add behavior and infrastructure not required by the specification.
