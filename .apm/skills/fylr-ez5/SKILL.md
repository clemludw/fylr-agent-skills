---
name: fylr-ez5
description: Use when frontend plugin code uses a global of the fylr web frontend - ez5.* singletons, $$, plugin base classes and registries such as CustomDataType, DetailSidebarPlugin, Editor.plugins, ExportManager - or when choosing a base class, registry or registration time, or checking a method's name, options or return value.
---

# ez5: the web frontend library (easydb5.js)

## When to use

- Frontend code calls `ez5.*`, extends an ez5 base class or registers with an ez5 registry.
- Picking the extension point and registration time for a frontend feature.
- Also load `fylr-frontend-plugins` (bundles, loading, languages) and `fylr-cui` (UI toolkit,
  which ez5 builds on).

## Sources

ez5 has no official documentation. This skill ships a small reference, read from the bundle and
labeled with its `ez5.FRONTEND_VERSION`:

- [references/extension-points.md](references/extension-points.md): every registry and register
  function, when it exists, what to pass, the hooks a plugin implements. Start here.
- [references/globals.md](references/globals.md): startup order and every global plugins use
  (`ez5.session`, `ez5.api`, `ez5.server`, `EventPoller`, `ez5.loca`, ...), with the parameters
  to pass and the class behind it.
- [references/index.md](references/index.md): one generated file per class behind those globals
  (methods, argument counts, option keys). Read only the class file you need.
- Usage examples: the example plugins in `fylr-plugin-design` (workshop demo, easydb example
  plugins). Frontend plugin types: the easydb 5 webfrontend docs (`fylr-docs`).

## Decisions

- **Extension point:** choose it from extension-points.md. If none fits, tell the developer
  before patching core classes.
- **When the code runs:** at load time, in `ez5.session_ready` or in `ez5.defaults_done` (startup
  order in globals.md).
- **Oldest supported fylr version:** newer registries and methods do not exist in older frontends;
  guard them with `ez5.version(...)` or a presence check.

## Pitfalls

- **Registration timing:** many registries, including `DetailSidebar.plugins` and
  `Editor.plugins`, are created inside `ez5.session_ready`. Registering earlier throws
  `Cannot read properties of undefined`. Register inside `ez5.session_ready(...)`; custom data
  types register at top level.
- **Class or instance:** some register functions take the class (`CustomDataType.register(MyClass)`,
  `X.plugins.registerPlugin(MyClass)`), others an instance
  (`ExportManager.registerPlugin(new MyPlugin())`). The wrong one fails an assertion.
- **Internal API without stability promise:** methods starting with `_` are private: never call or
  override them. Re-check every used method after a fylr update (`fylr-maintenance`).
- **Global or class not in the reference:** it is internal to the frontend. Tell the developer
  before building on it and look for a listed global or extension point first.
- **Argument names are minified away.** When the reference shows only a count (`load(2)`), find a
  caller in an example plugin before guessing what the arguments mean.
- Many methods branch on `ez5.version("6")`; the easydb 5 path is dead code in fylr.
- Use `ez5.api.<endpoint>(...)` or `ez5.server(...)` for fylr API calls: they add the session token
  and the frontend's error handling.
- **The bundle is licensed.** Never commit `easydb5.js`, copy it into a plugin, or quote larger
  parts of it. Never regenerate the reference in a plugin repository; maintainers do that in the
  fylr-agents-skills repository.

## Verify

- Ask the developer for `ez5.FRONTEND_VERSION` from the browser console. If it differs from the
  version in [references/index.md](references/index.md), say the reference may be stale and list
  the methods the plugin relies on for the developer to check.
- Every registry is used at the right time and with class or instance as extension-points.md says.
