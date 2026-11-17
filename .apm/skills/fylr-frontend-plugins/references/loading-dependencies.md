# Loading shipped frontend libraries on demand

For libraries shipped via `webfrontend.install` (usually in `thirdparty/`). fylr does not load
them; the plugin loads them when it needs them. This pattern is not in the fylr docs.

## Rules

- **Base URL:** `ez5.pluginManager.getPlugin("<plugin-name>").getBareBaseURL() + "thirdparty/<library>"`.
  `<plugin-name>` is `plugin.name` from `manifest.yml`; never guess it.
- **Load:** scripts with `CUI.loadScript(url)`, stylesheets with
  `new CUI.CSSLoader().load({url: url})`. Both return a promise.
- **Wait:** load files in parallel, combine with `CUI.whenAll([...])`. The function returns the
  promise of its own `CUI.Deferred`; code that uses the library waits for it.
- **Check success:** in `.always(...)`, check that the global the library creates exists (for
  example `window.<Library>`). If not, log an error with plugin name and URL and reject.
- **Load once:** a flag remembers success; later calls return `CUI.resolvedPromise()` at once.
- **Optional libraries:** load only when the configuration needs them. On failure, warn and offer
  the feature in a reduced form.

## CoffeeScript

```coffeescript
class MyPluginDeps
  @__loaded: false

  @load: ->
    if MyPluginDeps.__loaded
      return CUI.resolvedPromise()
    base = ez5.pluginManager.getPlugin("my-plugin").getBareBaseURL() + "thirdparty/chartlib/"
    dfr = new CUI.Deferred()
    CUI.whenAll([
      CUI.loadScript(base + "chartlib.min.js")
      new CUI.CSSLoader().load(url: base + "chartlib.min.css")
    ]).always =>
      if not window.ChartLib
        console.error("my-plugin: failed to load", base + "chartlib.min.js")
        dfr.reject()
        return
      MyPluginDeps.__loaded = true
      dfr.resolve()
    dfr.promise()

# usage
MyPluginDeps.load().done => @renderChart()
```

## JavaScript

```javascript
class MyPluginDeps {
  static load() {
    if (MyPluginDeps.loaded) {
      return CUI.resolvedPromise();
    }
    const base = ez5.pluginManager.getPlugin("my-plugin").getBareBaseURL() + "thirdparty/chartlib/";
    const dfr = new CUI.Deferred();
    CUI.whenAll([
      CUI.loadScript(base + "chartlib.min.js"),
      new CUI.CSSLoader().load({ url: base + "chartlib.min.css" }),
    ]).always(() => {
      if (!window.ChartLib) {
        console.error("my-plugin: failed to load", base + "chartlib.min.js");
        dfr.reject();
        return;
      }
      MyPluginDeps.loaded = true;
      dfr.resolve();
    });
    return dfr.promise();
  }
}
MyPluginDeps.loaded = false;

// usage
MyPluginDeps.load().done(() => this.renderChart());
```

`my-plugin` and `chartlib` are placeholders: use the real `plugin.name` and library.
