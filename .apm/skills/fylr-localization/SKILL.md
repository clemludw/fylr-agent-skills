---
name: fylr-localization
description: Use when a fylr plugin adds or changes any text a user sees - frontend strings, base config labels, rights, events, error messages, manifest displayname/info - or when working with the plugin's l10n CSV, plugin.l10n, the loca command or the central localization sheet.
---

# Localization of fylr plugins

## When to use

- Any user-visible text is added or changed, in the frontend, the manifest or server errors.
- The l10n CSV, `plugin.l10n` or a `loca` entry in `build.yml` is touched.

## Sources

- [manifest.yml](https://docs.fylr.io/for-developers/plugin/manifest.md) (`plugin.l10n`, `displayname`, `info`)
- [Localization](https://docs.fylr.io/for-developers/localization.md) (sheet conventions, review flow)
- [Plugin Conventions and Standards](https://docs.fylr.io/for-developers/plugin/conventions.md) (CSV layout)
- [fylr-build-plugin: Loca](https://github.com/programmfabrik/fylr-build-plugin#loca)

## Decisions

Where the translations are maintained:

- `build.yml` has a `loca` entry: the central Google Sheet is the source. Fetch the CSV with
  `fylr-build-plugin loca`; **never edit the CSV by hand**. New keys go into the sheet, which the
  developer (or whoever has access) maintains.
- No `loca` entry: the CSV in the repository is the source and is edited there.
- New plugin: the spec decides (`## fylr facts`, field "Localization source").

## Process

1. Every visible text goes through a localization key; in the frontend through `$$("<key>")`.
2. Keys start with the plugin's namespace, because a plugin key replaces a fylr key of the same name.
3. `en-US` is required. Add other languages the spec asks for.
4. Manifest `displayname` and `info` are maps from language to text.

## Pitfalls

- A plain string for `displayname` or `info` makes the manifest invalid.
- A change to a CSV fetched from the sheet is lost with the next `loca`.
- Machine translations are never presented as reviewed; mark them for review as the Localization
  page describes, or leave the column empty and say so in the report.
- Visible text inside HTML templates: it belongs in slots, filled with `$$(...)` (`fylr-cui`).

## Verify

- `grep` finds no visible literal strings in frontend code outside `$$(...)` and no template text.
- Every new key exists with `en-US` text in the source the decision names, with the plugin prefix.
