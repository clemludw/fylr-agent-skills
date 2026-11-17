---
name: fylr-security-review
description: Use when the developer prepares a release of a fylr plugin - check secrets in the repository and its history, real records, dependency vulnerabilities, least rights of plugin user and system rights, input validation of every endpoint and callback, and that the ZIP comes from the build, then report to the developer without publishing anything.
---

# Security review before a release

## When to use

- The developer asks to prepare a release, or a release is the next step.
- The review informs the developer's release decision; you never release.

## Sources

- [The callback contract](https://docs.fylr.io/for-developers/plugin/callbacks/contract.md) (tokens, plugin user)
- [Base config parameters](https://docs.fylr.io/for-developers/plugin/manifest/base-config.md) and [manifest.yml](https://docs.fylr.io/for-developers/plugin/manifest.md) (system rights)
- [govulncheck](https://go.dev/doc/security/vuln/) for Go, [osv-scanner](https://google.github.io/osv-scanner/) for npm and Python

## Process

Check each item and record pass, findings or not applicable:

1. **Secrets:** no credentials, tokens, `.env` files or URLs with passwords in the repository or in
   its history since the last release (`git log -p <last-tag>..HEAD`, a secret scanner if the
   repository uses one).
2. **Records:** no real fylr records, users or data model exports outside synthetic fixtures.
3. **Dependencies:** run the scanner per ecosystem (`govulncheck ./...`, `osv-scanner` on lockfiles
   and Python requirements). List findings with severity and whether the vulnerable code is reached.
4. **Rights:** the plugin user and the plugin's system rights are the least the plugin needs;
   nothing runs as root without reason.
5. **Exposure:** nothing secret in `plugin.custom` (delivered by the public `GET /api/v1/plugin`)
   or under `base_url_prefix` (served without authentication). Keys and passwords use base-config
   type `secret`; sections with sensitive values set `require_system_right`, otherwise every
   logged-in user can read them (manifest and base-config pages).
6. **Input validation:** every endpoint and callback validates input and answers bad input with a
   documented API error; no injection into search requests, shell commands or file paths.
7. **Build output:** the ZIP comes from fylr-build-plugin, not a hand-assembled folder.

## Pitfalls

- A clean scan of the current files misses a secret committed earlier and removed later.
- Never paste a found secret into the report: name file, commit and line only.
- Never tag, publish, upload, release or notify a marketplace. Hand the report to the developer.

## Verify

- The report covers all six items and goes to the developer for the release decision.
