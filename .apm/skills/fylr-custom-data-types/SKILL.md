---
name: fylr-custom-data-types
description: Use when a fylr plugin defines or changes a custom data type - its manifest definition, stored custom data, search mapping, frontend class (editor, detail, search), or a scheduled updater that refreshes data from an external vocabulary or authority file.
---

# Custom data types

## When to use

- A plugin adds a field type, or changes an existing custom data type's data, search mapping,
  frontend or updater.
- The data model editor shows `(plugin not loaded)` or "Unsupported Column Type".

## Sources

- [Custom Data](https://docs.fylr.io/for-developers/customdata.md): storage, search mapping, updater, manifest definition. Authoritative for everything except the frontend part.
- Frontend part: [easydb 5 custom data type docs](https://raw.githubusercontent.com/programmfabrik/easydb-documentation/master/content/technical/plugins/customdatatype/_index.en.md) and the `fylr-ez5` reference ([extension points](../fylr-ez5/references/extension-points.md))
- Examples: fylr-plugin-workshop-demo and fylr-plugin-example ([example-plugins.md](../fylr-plugin-design/references/example-plugins.md)); for new UI use templates (`fylr-cui`)
- Shared base for authority-file types: [fylr-plugin-commons-library](https://github.com/programmfabrik/fylr-plugin-commons-library) (CSV import of the field, helpers); its README lists the plugins built on it
- Plugin user for the updater: [The callback contract](https://docs.fylr.io/for-developers/plugin/callbacks/contract.md)

## Decisions

- Frontend only, or also a server-side updater that refreshes data from an external source.
- Build on commons-library or stand alone. An existing plugin that depends on it keeps the
  dependency; a new authority-file type should use it when it needs CSV import of the field.
- Which subfields are searchable, with which mapping options, for the target fylr version.
- The plugin name follows the conventions (`fylr-build-release`); the docs advise starting custom
  data type names with `custom-data-type-`.

## Process

1. Read Custom Data for the manifest definition and search mapping; follow fylr's manifest format,
   not the easydb 5 page.
2. Write the frontend class (`class MyType extends CustomDataType`, then
   `CustomDataType.register(MyType)` at top level, not in `ez5.session_ready`).
3. For an updater: implement it as a server program (`fylr-server-plugins`) and declare its plugin
   user as the Custom Data page describes.
4. Unit-test pure logic (value checks, mapping of external data) and the updater over
   STDIN/`%info.json%` with a stubbed external service (`fylr-testing`).

## Pitfalls

- fylr stores custom data once per `_uuid`. Changed data with the same `_uuid` updates nothing; it
  needs a new `_uuid`.
- "Unsupported Column Type" or `(plugin not loaded)` in the data model editor means the frontend
  code did not load (`fylr-debugging`, frontend part), not a data model error.
- Search mapping options depend on the fylr version. Check the target version on the docs page.
- A scheduled updater runs without an acting user; API calls need a configured plugin user.
- Code that uses commons-library without `commons-library` in `plugin.dependencies` works only by
  load-order luck and breaks when the order changes (manifest page, `dependencies`).

## Verify

- Unit tests and the build pass.
- The handover checklist lets the developer check: type shows in the data model editor and masks,
  values save and show in editor and detail, search finds the mapped subfields, the updater run
  changes data as expected.
