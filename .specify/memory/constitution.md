<!--
Sync Impact Report
- Version change: unresolved → 1.0.0 (first populated constitution)
- Modified principles: template placeholders replaced with project principles
- Added sections: Security and Data Handling; Development and Verification
- Removed sections: none
- Follow-up TODOs: ratification date is unknown and must be confirmed
-->
# Voting Student Project Constitution

## Core Principles

### I. Validated Inputs and Clear Errors
Every feature MUST validate all external input at its boundary, including requiredness,
format, range, and relevant business rules. Invalid input MUST return a clear, actionable
error without exposing secrets or internal implementation details. Validation behavior
MUST be covered by tests.

### II. Secret Handling
Credentials, tokens, keys, and other sensitive values MUST be supplied through environment
variables or an approved secret manager. They MUST NOT be embedded in source code,
committed configuration, test fixtures, or logs. Logs MUST omit or redact sensitive values.

### III. Feature-Level Tests
Each feature MUST have at least one test for a normal case and one for a boundary case.
Tests MUST be repeatable and MUST cover relevant input validation and error behavior.

### IV. Clear, Maintainable Design
Implementations MUST use the simplest design that meets the documented requirements.
Feature behavior and assumptions MUST be documented where they are not clear from the
interface. Changes MUST preserve existing behavior unless an approved specification says
otherwise.

### V. Verifiable Delivery
Work is complete only when the applicable tests have been run. Completion reports MUST
include the exact test command(s) and their results. A failed or unavailable test run MUST
be reported plainly and MUST NOT be described as passing.

## Security and Data Handling

Sensitive data includes passwords, authentication tokens, cryptographic keys, and personal
or voting data whose disclosure could harm participants or compromise voting integrity.
Collect and retain only data required by the approved feature specification. Access to
sensitive data MUST be limited to the feature's operational needs.

## Development and Verification

Before implementation, define expected normal, invalid, and boundary behavior in the
feature specification. For each feature, add automated coverage for at least one normal
case and one boundary case, and include relevant invalid-input cases. Review changes for
secret exposure in source, configuration, fixtures, and logs. Run the relevant test
commands before completion and include their commands and results in the delivery report.

## Governance

This constitution governs project specifications, implementation, and review. Every
change MUST be reviewed for compliance with its principles, including input validation,
secret handling, feature-level test coverage, and reported verification. A conflict MUST
be resolved in favor of this constitution or explicitly addressed by amending it before
the conflicting work is accepted.

Amendments require a documented rationale and review of affected specifications, tests,
and existing behavior. Versioning follows semantic versioning: MAJOR for incompatible
governance changes, MINOR for new or materially expanded principles or sections, and
PATCH for clarifications and non-semantic edits. Compliance MUST be checked during
feature planning and again during implementation review.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): confirm original adoption date | **Last Amended**: 2026-10-19
