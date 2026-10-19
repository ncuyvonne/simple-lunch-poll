# Implementation Plan: Lunch Poll Home Screen

**Branch**: `004-poll-home-screen` | **Date**: 2026-10-19 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/004-poll-home-screen/spec.md`

## Summary

Make the existing poll page the polished first screen described by the supplied visual reference. Preserve the existing poll data and single-choice voting flow, refine the card's desktop and narrow-screen presentation, and change the footer copy so it accurately describes immediate updates on the submitting page. Add automated coverage for the screen, empty-submission protection, and loading/failure state.

## Technical Context

**Language/Version**: TypeScript 5.9; Node.js 22.12 or later

**Primary Dependencies**: Existing React 19, Vite 7, Tailwind CSS 4, and Vitest 3; no new dependencies

**Storage**: Existing aggregate-only SQLite poll counts; no schema or persistence changes

**Testing**: Vitest UI tests for loaded screen, vote validation, and loading/failure behavior; `pnpm.cmd test -- --run`; `pnpm.cmd typecheck`; `pnpm.cmd build`; manual viewport check at 320px and 1280px

**Target Platform**: Modern desktop and mobile web browsers

**Project Type**: Existing full-stack web application; this feature is limited to the client page and its tests

**Performance Goals**: No new initial-load time target is introduced. Preserve the existing initial poll request and vote submission behavior, with no additional network requests.

**Constraints**: Open directly to the poll homepage, not a splash screen; retain exactly the existing three choices and current tallies; keep inputs accessible and errors clear; avoid horizontal scrolling at target narrow and wide widths; do not imply cross-browser live updates

**Scale/Scope**: One poll page, three fixed choices, existing API; no new user, voting, or persistence behavior

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Validated Inputs and Clear Errors**: Pass. Existing empty-vote validation remains in place and must continue to show an actionable error without changing counts.
- **II. Secret Handling**: Pass. No secrets, credentials, or logging changes are introduced.
- **III. Feature-Level Tests**: Pass. Cover the normal loaded poll screen and valid vote, the empty-submission boundary, and poll-loading failure with no fabricated counts.
- **IV. Clear, Maintainable Design**: Pass. Reuse the existing poll page, semantic form controls, and Tailwind styling; add no UI framework or data layer.
- **V. Verifiable Delivery**: Pass. Run and report the Vitest suite, typecheck, build, and viewport validation.

**Gate result before research**: PASS. No exceptions required.

## Project Structure

### Documentation (this feature)

```text
specs/004-poll-home-screen/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── spec.md
```

No `contracts/` artifact is needed because the existing poll API contract does not change.

### Source Code (repository root)

```text
src/features/poll/
├── PollPage.tsx                 # Refine homepage hierarchy and accurate footer text
└── poll-page.css                # Preserve/refine responsive warm background styling

tests/ui/
├── poll-page.test.tsx           # Verify the initial poll home screen and valid vote
├── poll-validation.test.tsx     # Preserve empty-choice validation coverage
└── poll-loading.test.tsx        # Verify loading and failure states have no fake counts
```

**Structure Decision**: Reuse the current client feature and UI test organization. The feature changes no server endpoints, shared contracts, database schema, or dependencies.

## Phase 0: Research

- Keep the existing Tailwind CSS and semantic HTML form controls; the current UI already contains the visual building blocks shown in the reference.
- Refine existing page spacing and width rather than adding a component library or separate splash route.
- Use the truthful footer text 「投票後立即更新」 so participants understand that their own submitted result updates immediately; other open pages are not live-pushed.
- Use Vitest for content and state behavior. Validate actual horizontal overflow at narrow and wide viewports in a browser because the configured jsdom environment does not perform reliable visual layout measurement.
- No unresolved technical questions or new dependencies remain. Alternatives and rationale are recorded in `research.md`.

## Phase 1: Design & Validation

- Existing Poll, Choice, and aggregate Vote Count remain unchanged; see `data-model.md`.
- No external interface contract is introduced.
- `quickstart.md` documents automated tests, build checks, and browser validation at the two target viewport widths.

**Gate result after design**: PASS. The plan preserves poll data and validation behavior, adds normal and boundary test coverage, and limits implementation to the existing UI.

## Complexity Tracking

No constitution violations or additional complexity require justification.
