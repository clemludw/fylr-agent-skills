---
name: fylr-build-release
description: Use when creating a new fylr plugin repository, naming a plugin, changing its layout, manifest.yml or build.yml, building with fylr-build-plugin, evaluating check warnings, producing the installable ZIP, or telling the developer how to load the build via plugin.paths.
---

# Repository, naming, build and ZIP

## When to use

- Starting a new plugin repository or changing its layout, `manifest.yml`, `build.yml` or Makefile.
- Building the plugin, reading `check` output, or producing the ZIP for the developer.

## Sources

- [Plugin Conventions and Standards](https://docs.fylr.io/for-developers/plugin/conventions.md): layout, naming, l10n, release
- [Packaging and Release](https://docs.fylr.io/for-developers/plugin/release.md): the installable ZIP
- [manifest.yml](https://docs.fylr.io/for-developers/plugin/manifest.md)
- [fylr-build-plugin](https://github.com/programmfabrik/fylr-build-plugin): commands, `build.yml`, `check`, `zip`
- [Load Custom Plugins](https://docs.fylr.io/for-system-administrators/configuration/custom-plugin.md): `plugin.paths` during development
- [Disk to URL plugin migration](https://docs.fylr.io/plugins/disk-to-url-migration.md): names of fylr's own plugins
- Reference layout: [fylr-plugin-example](https://github.com/programmfabrik/fylr-plugin-example)

## Decisions

- **Build tool:** fylr-build-plugin is mandatory for every build, `check` and ZIP. There is no
  fallback. If it is not installed, give the developer the install steps from its README and wait;
  do not build any other way in the meantime.
- **Existing repository with another build** (webpack, Makefile rules, own scripts): do not extend
  or run it. Propose the migration to fylr-build-plugin and do it once the developer agrees.
- **Unsupported step** (e.g. compiling a language the tool does not build): prepare its output
  before the build and ship it through `build.yml`, as `fylr-server-dependencies` describes. The
  build itself still runs through fylr-build-plugin.
- **Plugin name:** per the conventions page (repository name and `plugin.name` follow different
  rules; look them up). The name must be unique, and fylr recognizes its own shipped plugins by
  name: check a new name against the Disk-to-URL migration page.
- **fylr-build-plugin version:** follow the repository or the conventions page; record the version
  used in the report.

## Process

1. **New repository:** `fylr-build-plugin init`, or follow the layout of fylr-plugin-example. The
   `Makefile` stays a thin wrapper around fylr-build-plugin.
2. List every shipped file explicitly in `build.yml` (dependencies: `fylr-server-dependencies`).
3. Build with fylr-build-plugin. Evaluate **every** warning of `check`: it verifies that each file
   the manifest references exists in the build folder, but reports missing files only as warnings.
   Fix each warning or justify it in the report.
4. Produce the ZIP with the tool, as "Packaging and Release" describes. Hand it to the developer.
5. Tell the developer how to load the build during development: `plugin.paths` in `fylr.yml`
   points at the `build/` folder, not the repository. fylr searches each path recursively and
   takes the first `manifest.yml` it meets as the plugin root.

## Pitfalls

- `build/` is never committed, never edited by hand, and the ZIP is never assembled by hand.
- Pointing `plugin.paths` at the repository root loads the unbuilt source tree as the plugin;
  fylr does not descend into `build/` below a manifest.
- Two loaded plugins with the same `plugin.name` stop fylr with an error.
- Renaming the repository changes the ZIP's asset name, and instances that installed from the old
  URL silently stop updating (Packaging and Release). Keep publishing the old name with
  `zip_aliases` in `build.yml` (fylr-build-plugin README, "Historical asset names").
- easydb 5 build files (Makefile rules, webpack, `manifest.master.yml`) do not apply to fylr.
- You never install, tag, publish or deploy the plugin; the developer does.

## Verify

- Build, `check` and ZIP ran through fylr-build-plugin; the report names the exact commands.
- The build succeeds; every `check` warning is fixed or justified in the report.
- The ZIP was produced by the tool, and its top-level folder is `plugin.name`.
