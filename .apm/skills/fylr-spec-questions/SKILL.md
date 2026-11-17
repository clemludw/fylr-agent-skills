---
name: fylr-spec-questions
description: Use when a spec for a fylr plugin or plugin change was written, changed or is being clarified - adds or completes the section "## fylr facts" (plugin name, kinds and extension points, localization source, target fylr versions, API user, rights, data model and masks, endpoints, languages), taking facts from the repository and asking the developer for the rest.
---

# fylr facts in the spec

## When to use

- Right after a plugin spec was written or changed, and before planning.
- Not for changes that alter no plugin behavior (typos, formatting).

## Sources

- Kinds and extension points: `fylr-plugin-design`. Localization source: `fylr-localization`.
- Data model terms: `fylr-concepts`. Naming: `fylr-build-release`.

## Process

1. Read the repository first (manifest, `build.yml`, dependency files, existing code): whatever it
   answers is taken from there, with the file as source.
2. Add a section `## fylr facts` to the existing spec with exactly these fields:

   | Field | Content |
   |---|---|
   | Plugin name | `plugin.name`, valid per the conventions page, checked against the Disk-to-URL migration list |
   | Plugin kinds and extension points | frontend, server (extension, callback, recipe), custom data type, base config …, with docs links |
   | Localization source | `central-sheet` (`loca` entry) or `repository-csv` |
   | Target fylr version(s) | for example the oldest and newest version to support |
   | API user | acting user, or plugin user with how it is configured |
   | Required rights | least rights of that user and of the plugin's system rights |
   | Data model and masks | objecttypes, fields (names and types), masks the plugin depends on |
   | Own endpoints | each extension endpoint with method and path, or `none` |
   | Languages | server language(s); frontend CoffeeScript or JavaScript |

3. Ask the developer for each missing fact, **one question at a time**, with a short reason why
   it matters.
4. Mark everything still unknown as `[OPEN: <question>]`.

## Pitfalls

- Never guess a value, take a default, or copy one from an example plugin or another instance.
- Ask for the data model's structure (field names and types), never for records.
- Do not start a second spec; extend the existing one.
- No credentials, tokens or instance URLs in the spec.

## Verify

- All nine fields exist; each value has a source (repository file or developer answer) or is an
  `[OPEN: …]` marker.
