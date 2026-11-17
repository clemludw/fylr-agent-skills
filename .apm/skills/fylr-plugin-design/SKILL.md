---
name: fylr-plugin-design
description: Use when starting work on a fylr plugin spec or a change to an existing plugin, before planning or coding - to read the repository, decide which plugin kinds and extension points are needed (frontend, extension, callback, file recipe, custom data type, base config), weigh events and webhooks against callbacks, and find the matching example plugin.
---

# Designing a fylr plugin

## When to use

- A new plugin spec arrives, or an existing plugin needs a new capability.
- Before writing the plan: the plan must name the chosen plugin kinds and extension points with
  the docs pages read.

## Sources

- [Plugin overview](https://docs.fylr.io/for-developers/plugin.md) and [manifest.yml](https://docs.fylr.io/for-developers/plugin/manifest.md)
- [Events and Webhooks](https://docs.fylr.io/for-developers/events-and-webhooks.md): the alternative to callbacks
- [references/extension-points.md](references/extension-points.md): docs page per extension point
- [references/requirements-map.md](references/requirements-map.md): typical customer requirements → extension point
- [references/example-plugins.md](references/example-plugins.md): which public example shows what, and its limits

## Decisions

A plugin is a `manifest.yml` plus resource files. There are two kinds, different in runtime,
tech stack and debugging:

- **Frontend plugins:** JavaScript (written in CoffeeScript or JavaScript), CSS and HTML templates
  loaded into the web frontend (`fylr-frontend-plugins`).
- **Server plugins:** programs the execserver runs (`fylr-execserver`, `fylr-server-plugins`):
  - **Extensions:** own HTTP endpoints below the plugin's base URL.
  - **Callbacks:** hooks fylr runs during its own API calls (`db_pre_save`,
    `transition_db_pre_save`, collection upload, `export`, `export_transport`).
  - **File-processing recipes:** cookbooks and versions for the File Worker.

Both kinds can also bring custom data types, base-config parameters, system rights and own event
types. One plugin may combine frontend and server parts.

Decide and justify, per requirement of the spec:

1. Which kind and which extension point. Start from the requirements map.
2. **Callback or something else?** A callback blocks fylr's own API call and can reject it. If the
   requirement only *reacts* to changes or informs another system, prefer polling the event log
   (durable), the WebSocket stream (live, may drop events) or a workflow webhook in
   `after_commit_async` mode (only on workflow transitions). See Events and Webhooks.
3. Which docs page describes the extension point. Read it before deciding (`fylr-docs`).
4. Which example plugin shows the pattern (with its limits).

## Process

1. **Existing repository first:** read `manifest.yml`, `build.yml`, the layout, the languages and
   the dependency files (`package.json`, `go.mod`, `server.python` entries). The plugin's tech
   stack comes from there, never from fylr's own stack. Continue the repository's conventions,
   even where they differ from the examples, and report deviations from the package rules instead
   of fixing them unasked.
2. Make sure the spec has a complete `## fylr facts` section (`fylr-spec-questions`).
3. Map each requirement to kind and extension point (Decisions above).
4. Write the decision into the plan as a table: requirement → kind → extension point → docs page
   URL(s) read → example used → alternatives rejected and why.
5. Run `fylr-checklist` before implementing.

## Pitfalls

- Choosing a callback for "notify system X when Y changes": a callback that fails or is slow
  blocks or breaks the user's save. Event polling and `after_commit_async` webhooks do not; a
  `pre_save` workflow webhook blocks like a callback.
- Choosing an extension point from memory or from an easydb 5 example. Read the fylr page.
- Copying the data model, plugin name or language of an example plugin into a new plugin.
- Mixing CoffeeScript and JavaScript without a reason; new plugins use the language from the spec.

## Verify

- The plan contains the decision table with docs links for every extension point used.
- Every callback in the plan states why an event or webhook does not fit.
