---
name: fylr-execserver
description: Use when building, configuring or debugging any server-side fylr plugin part (extension, callback, file recipe, custom data type updater) - how the execserver runs plugin jobs, its limits (slot wait, timeout, stall, memory), API access from a job via the passed base URL and api_tx_url, services node/python3/exec, external programs, fylr configuration merging, and fylr's own tech stack as context.
---

# The execserver: where server plugins run

## When to use

- Designing or implementing any server plugin part: all of them run as jobs in the execserver.
- Reading a receipt, an execserver log, `/inspect` output or a configuration snippet the developer
  provides.
- Deciding whether a failure lies in the plugin, the configuration or the platform.

## Sources

- [Exec server](https://docs.fylr.io/for-developers/execserver.md): job protocol, topology, concurrency, execution limits
- [Execserver slot broker white paper](https://docs.fylr.io/for-developers/concepts/white-papers/execserver-slot-broker.md)
- [Architecture](https://docs.fylr.io/for-system-administrators/architecture.md): services, datastores, media tools, deployment variants
- [fylr.default.yml](https://docs.fylr.io/for-system-administrators/configuration/fylr.default.yml.md): built-in configuration, services, default limits
- [Install from source](https://docs.fylr.io/for-system-administrators/installation/from-source.md): fylr's tech stack and the third-party tools of the execserver
- [/inspect](https://docs.fylr.io/for-system-administrators/inspect.md) and [System](https://docs.fylr.io/for-system-administrators/inspect/system.md) (execserver and topology pages)
- [The File Worker](https://docs.fylr.io/for-developers/file-worker.md), [OAuth2](https://docs.fylr.io/for-developers/api/oauth2.md)
- [references/where-things-run.md](references/where-things-run.md): plugin part → service → signals and logs

## Decisions

- **Which execserver service runs the program:** per `fylr.default.yml`, `node` and `python3`
  for the plugin runtimes and `exec` for arbitrary programs (compiled binaries). A specialized
  execserver can switch services off. If no reachable execserver offers the plugin's service, the
  plugin does not run.
- **Which external programs the plugin may call:** only programs installed on the server and
  known to the execserver: listed in `fylr.services.execserver.commands` (resolved via `$PATH`
  or a path there), or, if not listed, named in a `FYLR_CMD_<PROG>` environment variable. Example from the docs: the PDF creator plugin needs Chromium. Never
  assume a program exists; never install anything on the instance.
- **API base URL:** use the one fylr passes to the job. Writes inside a save transaction go to
  `api_tx_url`. Both must reach the fylr instance (replica) that created the job. Never hard-code
  an API address.

## Process

How a plugin job runs (details: Exec server page):

1. fylr registers the job with the execserver and waits for a free slot.
2. The execserver gets the job; input arrives on STDIN, output leaves on STDOUT.
3. At the end the execserver returns a **receipt** with the result or the error.

Limits where plugin jobs fail. Look up current values and keys in `fylr.default.yml`, for example
`connectTimeoutSec`, `pluginJobTimeoutSec`, `stallTimeoutSec`; never copy them into code or docs:

- **Slot wait:** without a slot within `fylr.execserver.connectTimeoutSec`, the request fails.
  Unlike file jobs, a plugin callback is not retried.
- **Run time:** at most `fylr.execserver.pluginJobTimeoutSec`, unless the callback sets its own timeout.
- **Progress:** a command without visible progress is stopped after the stall time.
- **Memory and CPU:** a job above its memory budget is aborted; the thread count arrives as
  `FYLR_CONVERT_THREADS`.

Configuration: fylr merges `fylr.default.yml`, `fylr.yml` files and `FYLR_*` environment
variables. A key with `+` extends a block, without `+` it replaces the block, with `-` it removes
entries. Use this to judge whether a developer's snippet really configures what they think.

## Pitfalls

- **fylr and execserver must run the same version** (since 6.35). A mismatch is a possible cause
  of otherwise unexplained failures; ask for both versions.
- A `startupCheck` reports a wrong program version only as a warning in the startup log. A listed
  program that is missing stops fylr from starting.
- fylr's tech stack (Go binary, embedded web frontend, PostgreSQL, OpenSearch, SQLite for
  development) is context for reading behavior and logs. You never build fylr to develop a
  plugin, and a plugin's stack comes from its own repository.
- Web frontend plugins extend the single-page app embedded in fylr; only server parts go through
  the execserver.

## Verify

- The plan names, for each server part, its execserver service and any external program, and
  that the program is listed in the configuration the developer confirmed.
- No timeout, memory or slot value is copied into the plugin or its docs.
