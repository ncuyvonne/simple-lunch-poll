# Quickstart: Verify Spec Kit Development Documentation

## Prerequisites

- Project checkout with the root `README.md`.
- A text editor or Git diff viewer.

## Validation

1. Run the focused and full Vitest suite from the repository root:

   ```cmd
   pnpm.cmd test -- --run
   ```

   Expected result: tests confirm the development section is after the project introduction and before prerequisites, names the workflow stages, and describes Spec Kit as a development workflow rather than the application's runtime or framework (normal case); the existing prerequisite, startup, limitations, and API sections remain present (boundary case); the suite passes.
2. Read the new development section in `README.md` and confirm its position, wording, and distinction from the app technology stack.
3. Run the whitespace and patch-format check from the repository root:

   ```cmd
   git diff --check
   ```

   Expected result: no output and exit code 0.
