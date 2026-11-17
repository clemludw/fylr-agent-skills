# CLAUDE.md

This repository builds `fylr-agents-skills`, an APM package (Microsoft Agent Package Manager) that gives coding agents the fylr knowledge they need to develop, test, build and debug fylr plugins.

## Layout

```text
apm.yml                      APM manifest (name fylr-agents-skills, targets, MCP server fylr-docs)
.apm/instructions/           always-on rule fylr-rules.instructions.md (≤ 30 lines)
.apm/skills/fylr-*/          SKILL.md, optional references/
scripts/ez5-api/             ez5 reference generator (not shipped)
scripts/golib-api/           golib reference generator (not shipped, own go.mod, pinned via golib.version)
scripts/check/               check-structure.mjs, check-links.mjs, test-install.sh, run-all.sh
evals/                       evaluation scenarios
```

Only `.apm/` is shipped.

## Writing package content

- Everything under `.apm/`, as well as the README and CHANGELOG, is **English**.
- **Link, don't copy**. Point to docs.fylr.io pages and check each one with the `fylr-docs` MCP server (`searchDocumentation`, `getPage`). Never call `sendFeedback`. Do not put version numbers, default values or reference tables such as `build.yml` keys or timeouts into the package. The only own content is experience, conventions, error patterns, and knowledge from public repos.
- Skill format:
  - Frontmatter `name` must equal the folder name and start with `fylr-`. `description` starts with "Use when …".
  - Sections in this order, leaving empty ones out: `When to use`, `Sources`, `Decisions`, `Process`, `Pitfalls`, `Verify`.
  - A `SKILL.md` has at most 120 lines. Anything longer goes to `references/`.
- Prefix rule: every entry directly under `.apm/skills/` and `.apm/instructions/` starts with `fylr-`. Files inside a skill folder need no prefix.
- Agents using the package have **no access to fylr instances**. Do not write workflows that need live API, logs or `/inspect` access. Instead, the developer supplies hints, and the agent verifies through tests and build.

## Generated references

- ez5 (`fylr-ez5/references/`): generated from `easydb5.js`, which is licensed. Never commit it, copy it, or quote large parts of it. It is listed in `.gitignore`. Only maintainers regenerate the reference.
- golib (`fylr-golib/references/`): `cd scripts/golib-api && go run .` uses the version in `golib.version`. Updating it with `go run . latest` is at least a minor release.
- Do not edit generated files by hand.

## Checks

Run before considering a change done:

```sh
scripts/check/run-all.sh                    # structure, links, install test
node scripts/check/check-links.mjs --offline   # local links only
```

## Git

- Versioning: SemVer, `CHANGELOG.md`, tags `vX.Y.Z`. Do not tag or publish. The maintainer does that.
- Commit only when asked.
