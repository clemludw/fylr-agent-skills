---
name: fylr-server-plugins
description: Use when adding or changing a fylr server plugin part - an extension endpoint, a callback (db_pre_save, transition_db_pre_save, collection upload, export, export_transport), the manifest exec map, STDIN/STDOUT/%info.json% handling, error responses, or choosing the server language (Node.js, Python, Java, Go, Rust).
---

# fylr server plugins: extensions and callbacks

## When to use

- Writing or changing a server program, its `exec` map entry in `manifest.yml`, or its error
  handling.
- Not for frontend code (`fylr-frontend-plugins`) or dependencies (`fylr-server-dependencies`).

## Sources

- [manifest.yml](https://docs.fylr.io/for-developers/plugin/manifest.md), section [the exec map](https://docs.fylr.io/for-developers/plugin/manifest.md#the-exec-map) and the error format
- [Extensions](https://docs.fylr.io/for-developers/plugin/extensions.md)
- [Callbacks](https://docs.fylr.io/for-developers/plugin/callbacks.md) and [The callback contract](https://docs.fylr.io/for-developers/plugin/callbacks/contract.md) (info map, tokens, plugin user, `api_tx_url`, errors)
- One page per callback type, **read it before implementing or debugging that callback**:
  [db_pre_save](https://docs.fylr.io/for-developers/plugin/callbacks/db-pre-save.md),
  [transition_db_pre_save](https://docs.fylr.io/for-developers/plugin/callbacks/transition-db-pre-save.md),
  [collection upload](https://docs.fylr.io/for-developers/plugin/callbacks/collection-upload.md),
  [export](https://docs.fylr.io/for-developers/plugin/callbacks/export.md),
  [export_transport](https://docs.fylr.io/for-developers/plugin/callbacks/export-transport.md)
- [Base config parameters](https://docs.fylr.io/for-developers/plugin/manifest/base-config.md)
- Python helper library: [fylr-lib-plugin-python3](https://github.com/programmfabrik/fylr-lib-plugin-python3)
- How jobs run and fail: `fylr-execserver`

## Decisions

- **Extension or callback:** clients call an extension; a callback runs inside fylr's own API
  call. If only reacting to changes, check events and webhooks first (`fylr-plugin-design`).
- **Language and form:** from the repository or the spec.
  - Interpreted programs on the runtimes fylr brings: Node.js and Python 3 (per the docs) and Java
    (listed as command `java` in `fylr.default.yml`). Look up current versions in the docs.
  - Compiled binaries (Go, Rust, …) started directly through the execserver service `exec`. Go:
    `fylr-golib`; building and shipping binaries: `fylr-server-dependencies`.
- **Identity:** the token of the acting user, or a plugin user with least rights where the
  callback needs its own rights (contract page). Never stored credentials.
- **Python helper:** for Python plugins, consider fylr-lib-plugin-python3, added as a Git submodule
  inside the program folder (the folder name must not contain `-`) and shipped via
  `server.install` in `build.yml`.

## Process

1. Read the docs page of the extension point and the contract page.
2. Wire the program in the `exec` map: the execserver starts the program, input comes on STDIN,
   the context as argument `%info.json%`, the result goes back on STDOUT. The same map serves
   extensions and callbacks.
3. Implement: parse `%info.json%` and STDIN, validate input first, call the API only via the
   passed base URL and tokens (`fylr-rest-api`), write the documented response to STDOUT.
4. Return errors in the documented API-error JSON so the client sees the real cause.
5. Write unit tests over STDIN/`%info.json%`/STDOUT (`fylr-testing`), and for each extension an
   apitest suite.

## Pitfalls

- `%info.json%` is substituted as an inline JSON string argument, not a file path.
- Older plugins use `stdin: { url: "%_input.url%" }` / `stdout: { url: "%_output.url%" }`. fylr
  does not substitute these placeholders; use `{ type: body }` (Callbacks page).
- The working directory does not contain the plugin's files; reference them with
  `%_exec.pluginDir%`.
- STDERR is never part of the response; use it for diagnostics, never for results.
- Non-zero exit without an API-error JSON on STDOUT, or an empty or invalid body, turns into a
  generic error naming the failed callback: the cause is lost.
- A failed write through `api_tx_url` fails the whole save, even if the program swallows the
  error. Report it as the callback's error.
- Validate before writing output: once an extension's response has started, the status is sent.
- Do not copy timeout values from memory; the limits are described in `fylr-execserver`.
- Never hard-code API addresses, credentials or instance-specific objecttypes.

## Verify

- Unit tests cover success, invalid input, API error and the error JSON format.
- Every callback's behavior matches its docs page (payload, response rules, error behavior).
- Each extension has an apitest suite for the developer to run.
