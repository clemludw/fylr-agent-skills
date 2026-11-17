# Typical failure patterns

Own content from experience; the docs pages linked in the skill describe the mechanisms. Always
confirm with the developer's hints before acting on a pattern.

## Server plugins

| Symptom | Likely cause | Ask for / check |
|---|---|---|
| Generic error naming the failed callback | Program exited non-zero without an API-error JSON on STDOUT, or wrote an empty or invalid body | STDOUT/STDERR handling in code; reproduce with a unit test; return the documented error JSON |
| Callback or extension gets no input or its output is ignored, in an older plugin | `exec` still uses `%_input.url%` / `%_output.url%`, which fylr does not substitute | Manifest `stdin`/`stdout`: `{ type: body }` (Callbacks page) |
| Save, transition or collection upload rejected with `DbPreSaveFailed` | The callback failed, or it got no execserver slot in time and never ran | Receipt (is there one at all?), the error body, execserver availability as above |
| Save refused at commit although the callback "succeeded" | A write through `api_tx_url` failed earlier in the callback; the whole transaction is marked failed | Error handling around `api_tx_url` writes; report that error as the callback's error |
| Extension answers `ServerGeneric` (400) without any program output | No execserver slot within the slot wait time (`connectTimeoutSec`), no reachable execserver, or none offering the service | Receipt, `/inspect/system/execserver/`, `/inspect/system/topology`; service (`node`, `python3`, `exec`) enabled on a reachable execserver |
| Receipt `TimedOut` | Run time limit reached (`pluginJobTimeoutSec` or the callback's own timeout) | Slow external calls, missing timeouts on HTTP calls, loops |
| Receipt `Stalled` | No visible progress for the stall time | Program waiting silently on a read, lock or hung helper |
| Receipt `OutOfMemory` | Memory budget exceeded | `PeakMemory` vs. budget on `/inspect/system/execserver/`; stream instead of loading everything |
| Receipt `Stopped` | Operational interruption (restart, drain, cancel) | Usually not the plugin; check whether it repeats |
| Error from the extension with `X-Fylr-Error-Code` | The program returned an API-error JSON | The code path that builds that error; validate input earlier |
| `require` error or `ModuleNotFoundError` only on the instance | Dependency not declared or not shippable (native module, compiled Python package) | `fylr-server-dependencies`; build output |
| External program not found | Not listed in `fylr.services.execserver.commands` and not named via `FYLR_CMD_<PROG>`, not in `$PATH`, or not installed | Configuration snippet; startup log `startupCheck` warnings |
| Plugin worked, fails after an execserver update | fylr and execserver versions differ (must match since 6.35) | Both versions |
| Plugin does not run, licence warning in the Plugin Manager, enabling refused (`PluginNotLicensed`) | Licence names the plugin without granting it, or a paid plugin is not granted | Not a code bug: the developer contacts the licence holder ([License](https://docs.fylr.io/license-management.md), [release notes of the licence change](https://docs.fylr.io/releases/2026/v6.35.0.md)) |
| Works for root, fails for normal users | Masks or rights ignored; callback acts as the calling user | Test as a restricted user; plugin user with least rights where needed |
| Configuration has no effect | Merge rules: key without `+` replaced the whole block, `-` removed entries | Developer's `fylr.yml` snippet against `fylr.default.yml` |

## Frontend plugins

| Symptom | Likely cause | Ask for / check |
|---|---|---|
| Several plugins missing at once (before 6.35.1) | One plugin threw while loading and aborted the rest of `bundle.js` | First `Uncaught …` error; `fylr.debug.noPluginsBundle: true` |
| Plugin silently missing from the frontend, no console error | `plugin.dependencies` unmet (dependency missing or disabled) or cyclic: fylr leaves the plugin out of the bundles | Plugin Manager state of the plugin and its dependencies |
| `Plugin "<name>" failed to load` (from 6.35.1) | That plugin fails to parse or throws at load time | The stack trace; JavaScript that needs a transpiler, undeclared variables in class bodies |
| `Cannot read properties of undefined` at registration | Registered before `ez5.session_ready` created the registry | Move registration into `ez5.session_ready` (`fylr-ez5`) |
| Assertion error at registration | Class passed where an instance is expected, or the reverse | `fylr-ez5` extension points |
| `Class constructor … cannot be invoked without 'new'` | CoffeeScript class extends a JavaScript class | `fylr-frontend-plugins` class pitfalls |
| `(plugin not loaded)` / "Unsupported Column Type" at a custom data type | Frontend code of the custom data type not loaded | Console errors on load; bundle order; registration |
| `new CUI.Template` throws | Template file not shipped or listed, slot missing or duplicated | `fylr-cui` templating pitfalls |
| Change not visible | Old build loaded or browser cache | `plugin.paths` points at `build/`; rebuild; reload without cache |
| Missing texts show as keys | l10n key missing or CSV not shipped | `fylr-localization` |
