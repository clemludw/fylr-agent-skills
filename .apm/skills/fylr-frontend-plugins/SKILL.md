---
name: fylr-frontend-plugins
description: Use when adding or changing code that runs in the fylr web frontend - plugin JavaScript or CoffeeScript, CSS, HTML templates, webfrontend bundles in build.yml, the plugin bundle (bundle.js) and its loading behavior, choosing CoffeeScript or JavaScript, or adding a third-party frontend library.
---

# fylr web frontend plugins

## When to use

- Writing or changing frontend code, `plugin.webfrontend` in the manifest or `webfrontend` in
  `build.yml`.
- Adding a frontend library. Also load `fylr-ez5` (frontend classes, registries), `fylr-cui`
  (UI and templates), `fylr-custom-data-types` and `fylr-localization` as needed.

## Sources

- [manifest.yml, `plugin.webfrontend`](https://docs.fylr.io/for-developers/plugin/manifest.md#webfrontend): bundles and loading behavior
- [Debugging frontend plugins](https://docs.fylr.io/for-developers/plugin.md#debugging-frontend-plugins): describes the behavior before 6.35.1
- fylr-build-plugin: [What build does](https://github.com/programmfabrik/fylr-build-plugin#what-build-does), [build.yml](https://github.com/programmfabrik/fylr-build-plugin#buildyml)
- Frontend plugin types: [easydb 5 webfrontend plugin docs](https://raw.githubusercontent.com/programmfabrik/easydb-documentation/master/content/technical/plugins/webfrontend/_index.en.md) (frontend only)
- Examples in both languages: `fylr-plugin-design`, [references/example-plugins.md](../fylr-plugin-design/references/example-plugins.md)
- [references/loading-dependencies.md](references/loading-dependencies.md): pattern for loading shipped libraries on demand

## Decisions

- **CoffeeScript or JavaScript:** existing plugins keep the repository's language. For a new
  plugin the spec or the developer decides; if open, ask. Both extend the same global ez5 and CUI
  base classes and register the same way (`class MyType extends CustomDataType`, then
  `CustomDataType.register(MyType)`). Mixing both in one plugin needs a reason.
- **CUI and ez5 are globals.** Use them directly; never import, bundle, install or replace them
  with a second copy. Prefer them over other libraries; add a library only if neither covers the
  task.
- **Per third-party library, choose one way deliberately:**
  - `webfrontend.bundles`: the library becomes a source file of the plugin bundle, concatenated in
    `build.yml` order and loaded on every frontend start. For small libraries the plugin always
    needs. Library before the code using it. It grows the bundle of all plugins, and an error in it
    takes the plugin down (before 6.35.1 also every later plugin).
  - `webfrontend.install`: larger libraries shipped unchanged, by convention in a folder
    `thirdparty`. fylr does not load them; the plugin loads them itself when needed with the
    pattern in loading-dependencies.md.
- Document origin, version and license of every library in `thirdparty`.

## Process

1. Read the extension point in `fylr-ez5` and the frontend plugin type docs.
2. Add sources to `webfrontend.bundles` in `build.yml` in dependency order (base class before
   subclasses). fylr-build-plugin compiles `.coffee` with CoffeeScript 1.x and copies `.js` as is.
3. Templates and CSS: `fylr-cui`. Texts: `fylr-localization`.
4. Build; every source file must compile or parse (`fylr-testing`).

## Pitfalls

- **Bundling:** fylr merges JavaScript, CSS and HTML of all active plugins into
  `/api/v1/plugin/bundle.js`, `bundle.css`, `bundle.html`.
  - **From fylr 6.35.1** each plugin's JavaScript runs as its own script. A plugin that fails to
    parse or throws while loading fails alone; the console says `Plugin "<name>" failed to load`
    and later plugins load. Top-level declarations stay visible to plugins loaded later.
  - **Before 6.35.1** such an error aborts the rest of the bundle: all plugins after it do not
    load, even unchanged ones.
  - So know the developer's fylr version before judging a frontend error (`fylr-debugging`).
- **Order between plugins:** if the code needs another plugin's code, declare it in
  `plugin.dependencies`. Without a dependency the order is not a contract: it changed in 6.35.1
  (manifest page, `dependencies`).
- **JavaScript runs as written:** no `import` or `require`, no syntax that needs a transpiler.
- **Class pitfalls:** CoffeeScript 1.x classes are functions. A JavaScript class can extend one,
  not the other way round: a CoffeeScript class extending a JavaScript class fails with
  `Class constructor … cannot be invoked without 'new'`. In JavaScript classes `this` exists only
  after `super(...)`, and class fields are set after it, so methods the base constructor calls
  must not rely on them. Class bodies are strict mode: undeclared variables throw `ReferenceError`.
- New plugins build with fylr-build-plugin, even where an example uses webpack.

## Verify

- The build compiles every frontend source; `check` has no unexplained warning.
- The handover checklist tells the developer what to look at in the browser and to send the
  console output on failure.
