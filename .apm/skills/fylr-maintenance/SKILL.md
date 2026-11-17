---
name: fylr-maintenance
description: Use when a fylr plugin's target fylr version changes, a fylr update broke a plugin, or an easydb 5 plugin is ported to fylr - read the release notes of every version in between, check each change against the extension points the plugin uses, and report every finding with its link.
---

# Maintenance: new fylr versions and easydb 5 ports

## When to use

- The target fylr version in `## fylr facts` changes, or a plugin broke after a fylr update.
- An easydb 5 plugin is ported to fylr.

## Sources

- [Release notes](https://docs.fylr.io/releases.md): one page per release; what needs action is under "Important"
- [Disk to URL plugin migration](https://docs.fylr.io/plugins/disk-to-url-migration.md)
- [Changes easydb 5 → fylr](https://docs.fylr.io/for-developers/changes-easydb5-fylr.md)
- The docs pages of every extension point the plugin uses (their version notes)
- ez5 reference version: `fylr-ez5`

## Decisions

- The previous and the new target version. Ask if the task does not state both.

## Process

1. List what the plugin uses: manifest keys, callbacks, endpoints, API calls, frontend registries
   and ez5 methods, custom data types, configuration it relies on.
2. Read the release notes of **every** release after the old target up to and including the new
   one, "Important" sections first. Patch releases count (for example frontend bundle loading
   changed in 6.35.1).
3. For each change that touches an item from step 1, read the current docs page of that feature.
4. Apply what affects the plugin; for ez5, check every used method in the current frontend
   (`fylr-ez5`).
5. Test and build (`fylr-testing`, `fylr-verify`).
6. Report every change found, with release note link and whether it applied, and what the
   developer must check on the instance.

### Porting from easydb 5

- Port behavior, not code structure: server parts become extensions or callbacks, layout and build
  come from fylr-plugin-example, manifest per fylr docs.
- Frontend code from `src/webfrontend` usually carries over; move it to the top-level
  `webfrontend/` folder (no `src/`, as in fylr-plugin-example) and check each registry and method
  against the ez5 reference.
- Never carry over easydb 5 server code, paths or configuration.

## Pitfalls

- Reading only the latest release note misses changes from the releases in between.
- fylr recognizes its own plugins by name: a plugin named like a formerly shipped one can be
  converted or replaced during an update (Disk-to-URL page).
- A plugin that stays disabled after an update may be a licence matter, not a code bug
  (`fylr-debugging`).

## Verify

- The report lists every release read and every relevant change with link and outcome.
- Tests and build pass; instance checks are in the handover report.
