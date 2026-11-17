# ez5 globals

What plugin code calls on the fylr web frontend's globals, read from the bundle
(`ez5.FRONTEND_VERSION` 5.156.0) and from the public fylr plugins. Each global names its class;
the class file under `classes/` lists all its public methods ([index.md](index.md)).

## Startup order

The startup code runs on `CUI.ready`:

1. `ez5.session` and the root layout with `ez5.rootMenu` and `ez5.tray` are created.
2. The session is authenticated, then every plugin's CSS, l10n and JavaScript is loaded. Plugin
   code runs now; schema, masks, object types and pools do not exist yet.
3. `ez5.session_ready(fn)` callbacks run while `ez5.schema`, `ez5.mask`, `ez5.objecttypes`,
   `ez5.pools` and the tags are loaded; then the `ez5.defaults_done(fn)` callbacks run.
4. Tray and root menu apps are loaded, the start app is shown.

The callbacks get no arguments and may return a promise, which startup waits for. A callback that
throws breaks startup with the "unexpected error" dialog.

| Plugin code needs | Put it in |
| --- | --- |
| Class definitions, custom data type registration, load-time registries ([extension-points.md](extension-points.md)) | top level |
| Session-ready registries, user, preferences, base config | `ez5.session_ready` |
| Schema, masks, object types, pools, tags | `ez5.defaults_done` |

## Singletons

| Global | Class | Available |
| --- | --- | --- |
| `ez5.session` | `Session` | plugin load |
| `ez5.api`, `ez5.server` | `ServerRequestApi`, `ServerRequest` | always |
| `ez5.loca`, `$$` | `Localization` | always (plugin keys after load) |
| `ez5.pluginManager` | `PluginManager`, returns `Plugin` | plugin load |
| `ez5.rootMenu`, `ez5.tray` | `RootMenu` (extends `AppManager`), `AppManager` | plugin load |
| `EventPoller` (static methods) | `EventPoller` | session_ready |
| `ez5.objecttypes` | `Objecttypes`, returns `Objecttype` | defaults_done |
| `ez5.pools` | `PoolManagerList` | defaults_done |
| `ez5.schema`, `ez5.mask` | plain objects; use `Mask`, `Objecttype`, `Field` | defaults_done |
| `ez5.splash` | plain object: `show(locaKey, attrs)`, `done(locaKey, attrs)`, `hide()` | always |
| `ez5.*` helpers | `ez5` | always |

## Server requests: `ez5.api` and `ez5.server`

`ez5.api.<endpoint>(opts)` sends a request to `/api/v1/<endpoint><opts.api>` and returns a
`CUI.Deferred` promise: `.done(data, status, xhr)`, `.fail(xhr, status)`, `.always(...)`.
`ez5.server(opts)` does the same for any path. Both add the session token. Endpoints: `search`,
`db`, `db_info`, `publish`, `settings`, `export`, `schema`, `objects`, `objecttype`, `collection`,
`config`, `suggest`, `eas`, `system`, `tags`, `transitions`, `mask`, `l10n`, `plugin`, `session`,
`event`, `right`, `message`, `xmlmapping`, `user`, `group`, `pool`, `task`. Request bodies and
responses: [fylr API endpoints](https://docs.fylr.io/for-developers/api/endpoints).

Options (`ServerRequest`):

- `type`: `"GET"` (default), `"POST"`, `"PUT"`, `"DELETE"`, `"PATCH"`, `"HEAD"`.
- `api`: path after the endpoint, starts with `/`. For `ez5.server`, the path after `/api/v1`.
- `json_data`: JSON body. `data`: query parameters. `body`, `headers`: raw body and headers.
- `local_url` or `url`: instead of `api`, for other paths of the instance or other hosts.
- `add_token` (default `true`), `timeout`.
- `handle_error(xhr)`: return `true` to reject without the error dialog. `error`: callback;
  when set, no dialog either.

```coffeescript
# save objects: POST /api/v1/db/<objecttype>, body is an array of objects with _version
ez5.api.db(type: "POST", api: "/" + objecttypeName, json_data: objects)
# search: body as in /api/v1/search
ez5.api.search(type: "POST", json_data: {search: [...], objecttypes: ["object"], limit: 10})
# asset info
ez5.api.eas(type: "GET", data: {ids: JSON.stringify([assetId]), format: "long"})
# collections
ez5.api.collection(api: "/list", data: {limit: 100, offset: 0})
# a plugin extension (manifest `extensions`)
ez5.server(type: "POST", api: "/plugin/extension/<plugin-name>/<extension>", json_data: {...})
```

`ez5.api.search_no_limit(opts)` pages through more than 1000 hits. A 401 refreshes the session
and retries, a 502 is retried; any other error shows the frontend's error dialog, then rejects.
URLs the browser loads itself (images, downloads) need `Session.addToken(url)`.

## Events: `EventPoller`

- `EventPoller.saveEvent({type, info})` writes an event to the event log (`POST /api/v1/event`):
  `type` is the event type, `info` a plain object. A plugin's own types are declared under
  `custom_events` in the [manifest](https://docs.fylr.io/for-developers/plugin/manifest).
- `EventPoller.listen(opts)` subscribes frontend code to events from the server's event stream.
  Its option keys are listed under `listen` in [classes/EventPoller.md](classes/EventPoller.md); if
  none are listed, ask the developer for a working call before writing one.

## Session: `ez5.session`

- User and rights: `getUser()`, `isAuthenticated()`, `getGroupIds()`, `getDisplayName()`,
  `getSystemRight(name)` (no prefix means `system.`; `"frontend_features[metadata_export]"` reads
  one entry), `hasSystemRight(a, b, ...)` (true if any is set).
- Base config: `getBaseConfig("plugin", "<plugin-name>")` returns the plugin's `base_config`
  values (`{}` when unset).
- Preferences: `getPref(name)`, `setPref(name, value)`, `savePref(name, value)` (promise),
  `addCookieOnlyPref(name, default)`.
- Languages: `getLanguage()`, `getConfigFrontendLanguages()`, `getConfigDatabaseLanguages()`.

## Localization: `ez5.loca` and `$$`

- `$$(key, attrs)` returns the text; a missing key comes back as `<lang>:<key>`. The plugin's keys
  load in parallel with its code: call `$$` when rendering, not at load time.
- `ez5.loca.getLanguage()`, `ez5.loca.getDatabaseLanguages()`.
- Multilingual values `{"de-DE": ..., "en-US": ...}`: `getBestFrontendValue(map)` for frontend
  text, `getBestDatabaseValue(map)` for record data.
- `getLanguageControl()` (database languages) or `getLanguageControlAdmin()` (frontend languages)
  is the `control` option of `CUI.MultiInput` and `CUI.MultiOutput`.

## Plugins: `ez5.pluginManager`

`getPlugin("<plugin-name>")` returns a `Plugin`: `getBaseURL()` (URL of the plugin's webfrontend
files), `getName()`, `getOpts()`. `getPluginNames()` checks whether another plugin is installed.

## Data model: `ez5.objecttypes`, `ez5.pools`, `Mask`, `ResultObject`

- `ez5.objecttypes.getObjecttypes()` returns `Objecttype` instances. `Mask.getMaskByMaskName(name)`
  returns a `Mask`; `getFields(...)` returns `Field` instances.
- `ez5.pools.findPoolById(id)` returns the pool or `undefined`; its data is `pool.data.pool`.
- `ResultObject` is one record: load with the static `ResultObject.loadFromGlobalObjectId(...)`,
  `loadFromId(...)` or `loadFromUUID(...)` (promises), read with `getData()`, `getGlobalObjectId()`.
- `Asset` wraps a file value: `getValue()`, `getWidth()`, `getHeight()`; the static
  `Asset.getStandardVersion(...)` and `Asset.getBestImageForViewport(...)` pick a version.

## Helpers: `ez5`

`ez5.version("6.35")` is true from fylr 6.35 on; `ez5.version()` returns the fylr version
(`ez5.FRONTEND_VERSION` is the bundle version). Formatting: `ez5.format_date(d)`,
`ez5.format_date_and_time(d)`, `ez5.format_number(n)`, `ez5.format_filesize(bytes)`. Others:
`ez5.generateUUID()`, `ez5.copyToClipboard(text)`, `ez5.download_file(url)`,
`ez5.getAbsoluteURL(url, base)`.

## Conventions

- Classes are CoffeeScript 1 classes; JavaScript `class X extends Y` works on them. Most extend
  `CUI.Element`: options come from `initOpts()` and are read as `this._name`; call super in
  `initOpts` and `readOpts`.
- Async methods return `CUI.Deferred` promises; combine them with `CUI.when(...)`.
