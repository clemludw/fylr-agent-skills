#!/usr/bin/env bash
# Runs all package checks. Exit code != 0 if any fails.
# Usage: scripts/check/run-all.sh [--offline]   (--offline skips network link checks)
set -uo pipefail
cd "$(dirname "$0")/../.."
rc=0
node scripts/check/check-structure.mjs || rc=1
node scripts/check/check-links.mjs "$@" || rc=1
scripts/check/test-install.sh || rc=1
[ $rc -eq 0 ] && echo "run-all: all checks passed" || echo "run-all: FAILED"
exit $rc
