# Research: Lunch Poll Home Screen

## Decision 1: Use the existing poll page as the homepage

- **Decision**: Keep the site opening directly to the existing lunch poll form and refine that screen to follow the supplied reference.
- **Rationale**: The user selected the attached full voting interface as the desired initial page, not a separate timed splash screen. The current application already uses the poll form as its root page.
- **Alternatives considered**: Add a separate welcome or splash page before the poll. Rejected because the user confirmed that the screenshot represents the page shown immediately on opening the site.

## Decision 2: Reuse the current styling and form controls

- **Decision**: Continue using the project's existing React page, Tailwind utilities, page stylesheet, and semantic radio form controls; add no dependency.
- **Rationale**: The current page already has the reference's warm background, dark heading panel, separated choices, counts, and submit button. Widen the centered card to a suitable desktop width and let choice labels/counts shrink or wrap at 320px. Refining existing structure is the smallest change and preserves keyboard and label behavior.
- **Alternatives considered**: Add a UI component library or replace the form with custom selection controls. Rejected because neither is needed to meet the visual requirements and either could increase dependency or accessibility risk.

## Decision 3: Keep responsive layout checks in a real browser

- **Decision**: Keep the card centered with a wider desktop maximum width and verify it has no horizontal overflow at 320px and 1280px.
- **Rationale**: The screenshot uses a wider card than the current `max-w-xl`; Tailwind's `max-w-2xl` is a reasonable starting point. Allowing the count text to wrap protects the narrow layout. The spec seeks the visual hierarchy, not pixel-perfect reproduction.
- **Alternatives considered**: Assert rendered dimensions in jsdom. Rejected because jsdom does not calculate browser layout; use a browser for overflow validation instead.

## Decision 4: Use accurate immediate-result wording

- **Decision**: Label the footer 「投票後立即更新」 rather than wording that could imply updates are pushed to every open page.
- **Rationale**: After submission the current page receives updated shared totals, while other open pages do not receive live pushes. The wording stays accurate and useful.
- **Alternatives considered**: Keep 「結果即時更新」. Rejected because it may be read as a promise of cross-browser live updates.

## Decision 5: Combine automated state tests with browser viewport validation

- **Decision**: Use Vitest for the initial screen, successful vote, empty submission, and failed poll load; check actual horizontal overflow manually in a browser at 320px and 1280px widths.
- **Rationale**: Automated UI tests verify state and accessible controls. The repository's jsdom test environment does not reliably compute rendered layout or horizontal overflow.
- **Alternatives considered**: Treat jsdom's viewport as proof of responsive layout. Rejected because it cannot faithfully measure the browser's rendered geometry.

## Decision 6: Preserve the existing request flow without a load-time target

- **Decision**: Do not introduce a measurable initial-load time requirement for this UI refinement; preserve the existing poll request flow and add no network requests.
- **Rationale**: The feature changes the presentation of the existing poll page, and the user chose not to add a load-time threshold. A threshold without a fixed device and network test environment would not be reproducible.
- **Alternatives considered**: Add a startup latency threshold. Rejected because this feature does not change the request flow and no test environment was specified for such a measurement.
