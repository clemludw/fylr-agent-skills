# ez5 reference index

Generated from the fylr web frontend bundle `easydb5.js`, `ez5.FRONTEND_VERSION` 5.156.0.
Regenerate with `scripts/ez5-api/generate.js` in the fylr-agents-skills repository; do not edit by hand.

Scope: only the classes behind the globals in [globals.md](globals.md) and only their members
meant for plugins. Anything not listed is internal: do not call or override it. Start with
globals.md, then read only the class file you need. Base classes of extension points are
described in [extension-points.md](extension-points.md) and have no class file.

Legend: `name(n)` takes n positional arguments (their names are minified away). `name(opts)` takes
one options object; its keys are listed, `!` marks mandatory ones. "reads" lists the keys a method
reads from its first argument when that is an options object. "hook, empty default": the base
class does nothing; "abstract": subclasses must implement it. "Promise": returns a `CUI.Deferred`
promise. `check` shows the expected type when the bundle states one. Methods starting with `_` are
internal and left out. Inherited methods are listed only on the class that defines them; follow
`extends`.

## Classes

- [`AppManager`](classes/AppManager.md) — extends `CUI.Element`
- [`Asset`](classes/Asset.md) — extends `—`
- [`EventPoller`](classes/EventPoller.md) — extends `CUI.Element`
- [`ez5`](classes/ez5.md) — extends `—`
- [`Field`](classes/Field.md) — extends `CUI.Dummy`
- [`Localization`](classes/Localization.md) — extends `CUI.Element`
- [`Mask`](classes/Mask.md) — extends `CUI.Dummy`
- [`Objecttype`](classes/Objecttype.md) — extends `CUI.Dummy`
- [`Objecttypes`](classes/Objecttypes.md) — extends `CUI.Element`
- [`Plugin`](classes/Plugin.md) — extends `CUI.Dummy`
- [`PluginManager`](classes/PluginManager.md) — extends `CUI.Element`
- [`PoolManagerList`](classes/PoolManagerList.md) — extends `PoolManager`
- [`ResultObject`](classes/ResultObject.md) — extends `CUI.Dummy`
- [`RootMenu`](classes/RootMenu.md) — extends [`AppManager`](classes/AppManager.md)
- [`ServerRequest`](classes/ServerRequest.md) — extends `CUI.Element`
- [`ServerRequestApi`](classes/ServerRequestApi.md) — extends `CUI.Element`
- [`Session`](classes/Session.md) — extends `CUI.Element`
