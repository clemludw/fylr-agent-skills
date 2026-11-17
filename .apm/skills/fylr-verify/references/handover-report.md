# Handover report template

Copy this structure into the final message (or a file the developer asked for). Never include
credentials, tokens, real records or unredacted logs.

```markdown
# Handover: <plugin name> – <change>

## Summary
<one paragraph: what changed and why>

## Local checks
| Check | Command | Result |
|---|---|---|
| Unit tests | `<command>` | <n passed, 0 failed> |
| Frontend compile | `<build command>` | <ok / error> |
| Build | `<fylr-build-plugin command>` | <ok> |
| `check` warnings | – | <none / list with fix or justification> |

## Requirements
| Spec requirement | Status | Evidence / reason / steps |
|---|---|---|
| <R1> | verified | <test name, result> |
| <R2> | not verified | <why, e.g. needs external service> |
| <R3> | check on instance | see I-1 |

## Checks on your instance
### I-1: <title>
1. Load the build: `plugin.paths` in `fylr.yml` → `<repo>/build/` (not the repository root), restart or reload as your setup requires.
2. Action: <what to do, as which user, with which mask>
3. Expected: <observable result>
4. apitest: `<command>` (run only against a disposable instance)
5. If it fails, send back: fylr version, <browser console / response headers `X-Execserver-Error`, `X-Fylr-Error-Code`, `X-Fylr-Error` / receipt / execserver log excerpt (redacted) / `/inspect/system/execserver/`>

## Dependencies and decisions
- <dependency, version, why, license>
- <deviations from repository conventions or package rules, reported not fixed>

## Open points
- <anything the developer must decide>
```
