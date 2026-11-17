---
name: fylr-concepts
description: Use when a fylr plugin task touches records, objecttypes, the data model, nested tables, hierarchies, masks, pools, tags, permissions, search or assets. Points to the fylr concept pages and names the mistakes those pages do not stress.
---

# fylr concepts and data model

## When to use

- A plugin reads, validates or writes records, or depends on objecttypes, fields or masks.
- A plugin needs rights (pools, groups, system rights) or reacts to tags, transitions or search.

## Sources

Read the page before relying on a concept; do not restate it.

- [Concepts overview](https://docs.fylr.io/for-developers/concepts.md) (start here)
- [Records and objecttypes](https://docs.fylr.io/for-developers/concepts/records-and-objecttypes.md)
- [The data model](https://docs.fylr.io/for-developers/concepts/the-datamodel.md)
- [Nested and reverse-nested tables](https://docs.fylr.io/for-developers/concepts/nested-and-reverse-nested.md), [Hierarchies](https://docs.fylr.io/for-developers/concepts/hierarchies-and-polyhierarchies.md)
- [Masks](https://docs.fylr.io/for-developers/concepts/masks.md)
- [Pools](https://docs.fylr.io/for-developers/concepts/pools.md)
- [Permissions](https://docs.fylr.io/for-developers/concepts/permissions.md) (rights, system rights), [Tags and transitions](https://docs.fylr.io/for-developers/concepts/tags-and-transitions.md)
- [Search and events](https://docs.fylr.io/for-developers/concepts/search-and-events.md)
- [Record JSON](https://docs.fylr.io/for-developers/record-json.md) (anatomy of a record), [Files and assets](https://docs.fylr.io/for-developers/concepts/files-and-assets.md)

## Decisions

- Which objecttypes, fields and masks the plugin depends on: take them from the spec or from the
  developer (typed in, or an exported data model or mask definition). Mark anything unknown as
  `[OPEN: …]` in the spec (`fylr-spec-questions`).
- As which user the plugin acts, and the least rights it needs.

## Pitfalls

- **Every instance has its own data model.** Never derive objecttypes, fields or masks from fylr
  defaults, examples, example plugins or another instance. Ask for structure (field names and
  types), never for records.
- **A record has several identifiers** (`_id`, `_system_object_id`, `_global_object_id`,
  `_uuid`). Read Record JSON before storing or comparing any of them.
- **Masks decide what a user sees and may write.** Code that ignores masks works for root and
  fails for real users. Test fixtures and test plans include a non-root user.
- Real records never enter the repository, specs, fixtures or reports; fixtures are synthetic.

## Verify

- Every objecttype, field and mask the code uses appears in the spec's `## fylr facts` section.
- The handover checklist includes a test as a non-root user with a restricted mask.
