---
name: fylr-testing
description: Use when writing or running tests for a fylr plugin without a fylr instance - unit tests for server programs over STDIN, %info.json% and STDOUT with a stubbed fylr API, synthetic Record JSON fixtures, compile checks for frontend sources, the build check, and apitest suites for extension endpoints that the developer runs.
---

# Testing without a fylr instance

## When to use

- Planning the test scope (required before implementing, `fylr-checklist`).
- Writing tests for server programs, frontend logic or extension endpoints.
- Reproducing a reported bug as a failing test (`fylr-debugging`).

## Sources

- Contract to test against: the docs pages of the extension point (`fylr-server-plugins`),
  [The callback contract](https://docs.fylr.io/for-developers/plugin/callbacks/contract.md),
  [Record JSON](https://docs.fylr.io/for-developers/record-json.md) and the API's
  [OpenAPI specification](https://raw.githubusercontent.com/programmfabrik/fylr-gitbook/main/.gitbook/assets/fylr-openapi-3.1.json)
- [apitest](https://github.com/programmfabrik/apitest) and its README for the test file format
- Model suite layout: [fylr-plugin-sequence/apitest](https://github.com/programmfabrik/fylr-plugin-sequence/tree/master/apitest)

## Decisions

- **Test tool:** the one the repository uses. If it has none, the language's standard tool, for
  example `node:test`, `pytest`, `go test`. Test dependencies are never shipped in the plugin.
- **What runs where:** you have no instance. Everything that needs one becomes a step of the
  developer's checklist (`fylr-verify`).

## Process

1. **Server programs (unit tests):** start the program as the execserver would: synthetic input on
   STDIN, synthetic context as the `%info.json%` argument. Assert STDOUT and the exit code against
   the documented contract: success response, invalid input, API error, the API-error JSON format.
2. **fylr API calls:** point the program at a local stub server (the base URL comes from the
   synthetic info JSON) that returns responses shaped like the OpenAPI schema, including error
   responses and a failing `api_tx_url` write where relevant.
3. **Fixtures:** follow Record JSON and the spec's data model, with synthetic values only. No real
   records, users, tokens or instance URLs.
4. **Frontend:** the build must compile or parse every source file. Logic without CUI or ez5
   dependencies may get unit tests (pure functions).
5. **Build:** fylr-build-plugin must succeed; every `check` warning is fixed or justified
   (`fylr-build-release`).
6. **Extensions:** write an apitest suite per own endpoint, laid out like fylr-plugin-sequence, with
   cases for success, invalid input, missing rights, insufficient rights and every own error code.
   The developer runs it against their instance; tell them how and what to send back.

## Pitfalls

- Testing the happy path only. Error paths are where plugins fail on real instances.
- Tests that pass only because globally installed packages hide a missing dependency declaration.
- A stub that accepts any request: assert the request (method, path, body, token header) too.
- apitest suites often purge or set up data. Tell the developer to run them only against a
  disposable instance.
- Copying an example plugin's data model into fixtures instead of the spec's.

## Verify

- Every server program has unit tests for success, invalid input, API error and error format.
- Unit tests, the frontend compile check and the build pass locally; results go into the handover
  report with the commands used.
