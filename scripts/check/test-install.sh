#!/usr/bin/env bash
# Installation test.
# Installs the package from the local path into an empty repository for the targets claude and
# copilot, checks that rule, skills and MCP server arrive, then adds project-specific files,
# reinstalls and updates, and checks that those files are unchanged.
# Usage: scripts/check/test-install.sh [packageRoot]
set -euo pipefail

PKG="$(cd "${1:-$(dirname "$0")/../..}" && pwd)"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
fail() { echo "FAIL $*"; exit 1; }
ok() { echo "ok   $*"; }

cd "$WORK"
git init -q
apm install "$PKG" --target claude,copilot >install.log 2>&1 || { cat install.log; fail "apm install"; }

mapfile -t SKILLS < <(cd "$PKG/.apm/skills" && ls -d fylr-*/ | tr -d /)
[ "${#SKILLS[@]}" -gt 0 ] || fail "package has no skills"

# Rule
[ -f .claude/rules/fylr-rules.md ] || fail "claude rule missing"
[ -f .github/instructions/fylr-rules.instructions.md ] || fail "copilot instruction missing"
ok "rule installed for claude and copilot"

# Skills (Claude: .claude/skills, Copilot: .agents/skills), including references/
for s in "${SKILLS[@]}"; do
  for d in .claude/skills .agents/skills; do
    [ -f "$d/$s/SKILL.md" ] || fail "$d/$s/SKILL.md missing"
    if [ -d "$PKG/.apm/skills/$s/references" ]; then
      diff -rq "$PKG/.apm/skills/$s/references" "$d/$s/references" >/dev/null || fail "$d/$s/references differs from package"
    fi
  done
done
ok "${#SKILLS[@]} skills installed for claude and copilot"

# MCP server
for f in .mcp.json .github/mcp.json; do
  grep -q '"fylr-docs"' "$f" || fail "fylr-docs missing in $f"
  grep -q 'https://docs.fylr.io/~gitbook/mcp' "$f" || fail "fylr-docs URL missing in $f"
done
ok "MCP server fylr-docs configured for claude and copilot"

# Project-specific customizations must survive reinstall and update
mkdir -p .claude/skills/project-conventions
printf -- '- Project rule: keep it.\n' > .claude/rules/project.md
printf -- '---\napplyTo: "**"\n---\n- Project rule: keep it.\n' > .github/instructions/project.instructions.md
printf -- '---\nname: project-conventions\ndescription: Use when testing.\n---\n# Project\n' > .claude/skills/project-conventions/SKILL.md
printf '# Project notes\n\nKeep this.\n' > CLAUDE.md
OWN=(.claude/rules/project.md .github/instructions/project.instructions.md .claude/skills/project-conventions/SKILL.md CLAUDE.md)
before="$(sha256sum "${OWN[@]}")"

apm install >reinstall.log 2>&1 || { cat reinstall.log; fail "apm install (reinstall)"; }
apm update --yes >update.log 2>&1 || { cat update.log; fail "apm update"; }
after="$(sha256sum "${OWN[@]}")"
[ "$before" = "$after" ] || { diff <(echo "$before") <(echo "$after"); fail "project files changed by reinstall/update"; }
[ -f .claude/rules/fylr-rules.md ] || fail "package rule missing after update"
ok "project-specific files unchanged after reinstall and update"

echo "test-install: passed"
