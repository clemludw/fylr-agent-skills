---
name: fylr-server-dependencies
description: Use when a fylr server plugin needs a third-party library or binary - npm packages for Node.js, Python packages, Go modules, Rust or other compiled binaries, scripts or data files - and you must decide how it gets into the plugin ZIP, because nothing is installed on the fylr instance.
---

# Dependencies of server plugins

## When to use

- Adding, removing or upgrading a dependency of a server program.
- A build fails on an unresolvable `require`, a compiled Python package or a missing binary.

## Sources

- [fylr-build-plugin](https://github.com/programmfabrik/fylr-build-plugin), especially
  [What build does](https://github.com/programmfabrik/fylr-build-plugin#what-build-does),
  [build.yml](https://github.com/programmfabrik/fylr-build-plugin#buildyml) and
  [npm dependencies](https://github.com/programmfabrik/fylr-build-plugin#npm-dependencies).
  Look up `build.yml` keys there; do not restate them.
- Libraries already on the server: [Install from source](https://docs.fylr.io/for-system-administrators/installation/from-source.md)
  (for example Python modules installed with `pip3` for some plugins: requests,
  requests-oauthlib, opencv, cssselect, tinycss2).

## Decisions

**Nothing is installed on the fylr instance or the execserver.** A server plugin can only use what
the fylr image brings or what fylr-build-plugin packs into the plugin ZIP. Every shipped file is
listed explicitly in `build.yml`.

| Language | How the dependency gets in | Hard limits |
|---|---|---|
| Node.js | Declare in `package.json`, commit `package-lock.json`. The build resolves the `require`s of every Node program the manifest starts via `%_exec.pluginDir%/….js` and embeds the modules into the program. No own configuration. | No native modules (node-gyp, for example `pg-native`, `sharp`): they cannot be embedded and are host-bound. An unresolvable `require` fails the build. `node_modules` is never shipped. |
| Python | List packages per program folder under `server.python` in `build.yml`. The build resolves them with `uv` for the Python version of the fylr image and installs them into that folder; only programs in exactly that folder can import them. | Only pure-Python packages are shipped. Compiled packages must come from the fylr image (the docs currently name `numpy` and `opencv-python`, capped at the image's version). Any other compiled package fails the build and first has to be added to the image. Prefer pure-Python alternatives. No `pip` runs on the instance. |
| Go | `server.go.modules`: cross-compiled for every configured platform, without CGO. Binary names must match the `%_exec.GOOS%` and `%_exec.GOARCH%` placeholders in the manifest. | Go source is not shipped. Check golib first (`fylr-golib`). |
| Rust and other compiled languages | Started through the execserver service `exec`. fylr-build-plugin compiles only Go, so build the binaries before the build for every platform fylr runs on and ship them via `server.install`. | Statically linked like Go binaries; no host libraries. Same platform placeholders as Go. |
| Scripts, data, ready binaries | `server.install` copies files and folders unchanged. | `.DS_Store`, `.gitignore`, `.git` and `node_modules` are always excluded, so a Node package cannot be shipped through `install`. |
| External programs (ImageMagick, Chromium, …) | Not shippable: must be listed in `fylr.services.execserver.commands` and installed on the server (`fylr-execserver`). | Ask the developer to confirm availability. |

## Process

1. Check whether the standard library, golib (Go) or the fylr image already covers the need.
2. Pick the way from the table; justify every new dependency in the plan.
3. Declare it (`package.json`/lockfile, `server.python`, `go.mod`, `server.install`).
4. Build with fylr-build-plugin and evaluate the `check` warnings (`fylr-build-release`).
5. Test dependencies (test runners, stubs) are never shipped.

## Pitfalls

- Testing locally with globally installed packages hides a missing declaration. The built plugin
  is what counts.
- A Python package that installs fine locally may be compiled (wheels with C extensions).
- Shipping `node_modules` or a vendored native module through `server.install`.
- Third-party code is part of the security review (`fylr-security-review`); keep the list short.

## Verify

- The build succeeds, `check` reports no unexplained warning, and every dependency has a
  justification in the plan.
