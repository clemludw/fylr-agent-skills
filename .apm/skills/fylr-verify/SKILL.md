---
name: fylr-verify
description: Use when a fylr plugin change is implemented and you are about to hand it back to the developer - run all local checks and write the handover report that classifies every spec requirement as verified, not verified, or to be checked by the developer on their instance, with concrete steps.
---

# Verification and handover report

## When to use

- After implementing or fixing anything in a fylr plugin, before saying it is done.

## Sources

- Tests and build: `fylr-testing`, `fylr-build-release`.
- [references/handover-report.md](references/handover-report.md): report template.
- [Load Custom Plugins](https://docs.fylr.io/for-system-administrators/configuration/custom-plugin.md): how the developer loads the build.

## Process

1. Run everything that runs without an instance: unit tests, frontend compile check, build with
   `check`. Record the commands and results.
2. Go through **every requirement of the plugin spec** and classify it:
   - **Verified:** by a test or the build, with the result.
   - **Not verified:** with the reason.
   - **To check on the instance:** for the developer, with concrete steps.
3. For each instance check, write: load the plugin via `plugin.paths` (pointing at `build/`), the
   action to perform, the expected result, the apitest suite to run, and which hints to send back
   on failure (fylr version, browser console, response headers, receipt, log excerpt, `/inspect`
   pages; see `fylr-debugging`).
4. List every `check` warning with its fix or justification, and every dependency added.
5. Use the template in references/handover-report.md.

## Pitfalls

- "It builds" is not verification of behavior.
- Claiming behavior that only an instance or a browser can show. Hand it to the developer instead.
- Quoting logs or responses with secrets: redact first.
- Handing back with a known failure without stating it.

## Verify

- Every spec requirement appears in the report with one of the three classes.
- Every instance check has steps, expected result and the hints to send back.
