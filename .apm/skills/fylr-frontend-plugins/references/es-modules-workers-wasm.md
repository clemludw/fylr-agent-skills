# ES modules, web workers and WebAssembly in frontend plugins

fylr runs plugin JavaScript as classic scripts. Many current libraries ship only ES modules, start
web workers or load WebAssembly. This page extends
[loading-dependencies.md](loading-dependencies.md); base URL, load-once flag and error handling
stay the same. This is not in the fylr docs; it comes from experience.

## 1. Find the library's format

Check `package.json` (`exports`, `main`, `module`, `browser`) and the files in `dist/` before
choosing. Decide per file, not per package: a library can ship an ES module for the main thread and
a classic script for its worker.

| Format of the main file | How the plugin loads it |
|---|---|
| UMD or IIFE, sets a global | `CUI.loadScript(url)` as in loading-dependencies.md |
| ES module, no bare imports (`from "pkg"`) | Ship unchanged, load with dynamic `import(url)` (section 2) |
| ES module with bare imports | Ask the developer: vendored bundle (section 3) or another library |
| CommonJS only | Same as bare imports |

Find bare imports with `grep -oE 'from ?"[^./][^"]*"' dist/<file>.mjs`. A file that contains
`import.meta` is always an ES module: `CUI.loadScript` fails with
`Cannot use 'import.meta' outside a module`.

## 2. Load an ES module with dynamic `import()`

- `import(url)` is plain JavaScript and works in classic scripts; static `import`/`export` does
  not. The rule "no `import` or `require`" means static imports, not `import()`.
- Write the loader in a `.js` file. CoffeeScript 1.x cannot compile `import()`; in a CoffeeScript
  plugin use one embedded JavaScript expression: `` `import(url)` ``.
- Make the URL absolute: `new URL(base + "thirdparty/<lib>/<file>.mjs", document.baseURI).href`.
- `import()` returns a native Promise. Wrap it in the `CUI.Deferred` of loading-dependencies.md so
  that callers keep one style.
- Check the module namespace, not a global: `mod.Map` or `mod.default`. Keep the module in a static
  field of the loader class; ES modules create no global.
- Modules are fetched strictly: the server must send a JavaScript MIME type for `.mjs`. If the
  developer sees `Expected a JavaScript module script`, ship the file as `.js` and adjust URLs that
  the library derives from its own file name (for example the worker URL, section 4).

```javascript
class MyPluginMap {
  static load() {
    if (MyPluginMap.lib) {
      return CUI.resolvedPromise(MyPluginMap.lib);
    }
    const base = ez5.pluginManager.getPlugin("my-plugin").getBareBaseURL() + "thirdparty/maplib/";
    const url = new URL(base + "maplib.mjs", document.baseURI).href;
    const dfr = new CUI.Deferred();
    new CUI.CSSLoader().load({ url: base + "maplib.css" }).always(() => {
      import(url).then((mod) => {
        if (!mod.Map) {
          throw new Error("export Map missing");
        }
        MyPluginMap.lib = mod;
        dfr.resolve(mod);
      }).catch((e) => {
        console.error("my-plugin: failed to load", url, e);
        dfr.reject(e);
      });
    });
    return dfr.promise();
  }
}
MyPluginMap.lib = null;

// usage
MyPluginMap.load().done((lib) => this.renderMap(lib));
```

`my-plugin`, `maplib` and `Map` are placeholders: use the real `plugin.name`, library and export.

## 3. Vendored bundle (only with the developer's consent)

When a library has bare imports, a one-off bundle turns it into a self-contained file in
`thirdparty/`. This is not part of the plugin build and does not replace fylr-build-plugin.

- Propose it, do not do it unasked. Prefer an IIFE with a global
  (`--format=iife --global-name=<Lib>`) if the source has no `import.meta`, so section 2 is not
  needed; otherwise `--format=esm`.
- Record in `thirdparty/<lib>/README.md`: package and version, the exact bundle command, licenses
  of all bundled packages. Commit the result; the build only copies it (`webfrontend.install`).

## 4. Web workers

- A worker URL must have the same origin as fylr. Load workers from `thirdparty/`, never from a CDN.
- Classic worker files (`new Worker(url)`) need nothing special. Module workers
  (`{type: "module"}`) follow the MIME rule of section 2.
- Many libraries find their worker next to their own file (`import.meta.url`) or start it from a
  `blob:` URL. Ship the worker in the same folder; if the library offers a setter for the worker
  URL, set it explicitly with the absolute URL.

## 5. WebAssembly

- Ship `.wasm` files in `thirdparty/` and pass the library their absolute URL; never load them
  from a CDN.
- Streaming compilation needs the MIME type `application/wasm`. Libraries often fall back to a
  slower path or fail; the developer checks the response header in the network tab.
- A Content Security Policy may block `blob:` workers or WebAssembly (`worker-src`,
  `wasm-unsafe-eval`). That is instance configuration: hand it to the developer, do not work
  around it.
- Prefer builds without threads. Threaded builds need `SharedArrayBuffer` and cross-origin
  isolation headers that fylr cannot be assumed to send.

## Verify (handover checklist)

- Network tab: every file from `thirdparty/` loads with status 200 and the expected MIME type
  (`.mjs`/`.js` JavaScript, `.wasm` `application/wasm`).
- Console: no CSP violation, no module or worker error.
- The feature works after a reload without cache; a second use does not load the files again.
