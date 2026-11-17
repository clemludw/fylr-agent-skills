---
name: fylr-golib
description: Use when writing or changing Go code for a fylr server plugin (extension, callback, other server program) - check the programmfabrik golib library first, using the generated golib API reference in this skill, and justify any other Go dependency.
---

# Go server code: use golib

## When to use

- Writing or changing Go code for a fylr extension, callback or other server program.
- Choosing a Go dependency for JSON handling, HTTP, logging or small helpers.

## Sources

- [golib repository](https://github.com/programmfabrik/golib). There is no published API
  reference and there are no release tags.
- [references/index.md](references/index.md): generated from the golib source, one line per
  exported name, with the golib version it was generated from. Each function and type has its own
  file under `references/api/` (signature, doc comment, source file, methods). Read the index,
  then only the files you need; never read all of them.
- Building Go into the plugin: `fylr-server-dependencies` (`server.go.modules`, platform
  placeholders, no CGO).

## Decisions

- For each need beyond the standard library: does golib already provide it? Check the index first.
- Any other third-party dependency is justified in the plan (why golib does not cover it).

## Process

1. List what the program needs beyond the standard library.
2. Look each item up in [references/index.md](references/index.md) and read the matching
   `references/api/<Name>.md`.
3. Compare the version in the index with the golib version in the plugin's `go.mod`. If they
   differ, build your own view with `go doc` (below) instead of trusting the reference.
4. Use golib where it covers the need; otherwise add the dependency and note the reason in the plan.

### When the reference does not match the plugin's golib version

Run inside the plugin's Go module so `go doc` reads the version `go.mod` requires (if golib is not
a dependency yet, `go get github.com/programmfabrik/golib` first):

- `go doc -short github.com/programmfabrik/golib`: every exported name, one per line.
- `go doc golib.<Name>`: one function or type. `go doc -all github.com/programmfabrik/golib`: everything.
- `go doc -src golib.<Name>`: the source. Many doc comments are a single line; read the source
  before relying on a function.
- Never store this output in the plugin repository: it goes stale with the next golib version.

## Pitfalls

- golib's README says little; read the doc comments and the source.
- Do not copy helpers from other repositories when golib has the function.
- CGO is off for plugin builds: a dependency that needs CGO fails the build.
- Every extra module is part of the security review (`govulncheck`).

## Verify

- Every third-party Go dependency in `go.mod` other than golib has a justification in the plan.
- `go test ./...` and the fylr-build-plugin build succeed.
