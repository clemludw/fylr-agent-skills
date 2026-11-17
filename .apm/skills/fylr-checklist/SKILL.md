---
name: fylr-checklist
description: Use when you are about to write the plan for a fylr plugin spec, and again before you start implementing it - a gate that checks the "## fylr facts" section, open questions, the documented extension point decision and the test scope, and stops the phase when anything is missing.
---

# Checklist before plan and implementation

## When to use

- Before writing the plan for a fylr plugin spec.
- Before implementing, after the plan exists.

## Sources

- Facts: `fylr-spec-questions`. Decision table: `fylr-plugin-design`. Test scope: `fylr-testing`.

## Process

Read the spec (and before implementing, the plan). Check each item and report pass or fail.

Before the plan:

1. `## fylr facts` exists and all nine fields are filled.
2. No `[OPEN: …]` marker remains.

Before implementing, additionally:

3. The plan has the decision table: requirement → plugin kind → extension point → docs pages read
   (links) → alternatives considered (events and webhooks for every callback).
4. The plan has the test scope: unit tests per server program (success, invalid input, API error,
   error format), build with `check`, frontend compile check, an apitest suite per own endpoint
   (success, invalid input, missing and insufficient rights, each own error code).
5. Every non-standard dependency is justified (golib checked first for Go; nothing that would
   need installing on the instance).

If any item fails: list the gaps, tell the developer, and **stop the phase**. Do not continue as
if the gaps were answered.

## Pitfalls

- Filling a gap yourself to make the check pass. Ask the developer.
- Treating a failed item as a warning.

## Verify

- Every item has a pass or fail result; the phase continued only when all passed.
