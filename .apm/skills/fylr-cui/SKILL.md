---
name: fylr-cui
description: Use when a fylr frontend plugin renders UI - forms, inputs, buttons, layouts, popovers, modals, lists - with CoffeeScript-UI (CUI), or needs its own HTML structure via CUI.Template, template files, data-slot, or bundle.html.
---

# CoffeeScript-UI (CUI) and HTML templates

## When to use

- A frontend plugin builds UI, or needs custom HTML structure.
- Debugging `new CUI.Template` errors or templates that do not show up.

## Sources

- CUI: [documentation](https://programmfabrik.github.io/coffeescript-ui/docs/), [demo](https://programmfabrik.github.io/coffeescript-ui/demo/index.html), [tutorial](https://programmfabrik.github.io/coffeescript-ui/tutorial/index.html), [repository](https://github.com/programmfabrik/coffeescript-ui)
- Templates: tutorial section ["Create a new template"](https://github.com/programmfabrik/coffeescript-ui/blob/master/tutorial/tutorial.md) and the [tutorial examples](https://github.com/programmfabrik/coffeescript-ui/tree/master/tutorial), especially [custom-element](https://github.com/programmfabrik/coffeescript-ui/tree/master/tutorial/simple-examples/examples/custom-element)
- Shipping: [manifest.yml, `plugin.webfrontend`](https://docs.fylr.io/for-developers/plugin/manifest.md#webfrontend) and [build.yml](https://github.com/programmfabrik/fylr-build-plugin#buildyml); a working pair is `webfrontend/FylrExample.html` in [fylr-plugin-example](https://github.com/programmfabrik/fylr-plugin-example)
- [references/templating.md](references/templating.md): files, shipping, usage and pitfalls with examples

## Decisions

Order of means:

1. **Ready-made CUI elements and layouts** first. Look them up in the demo.
2. **`CUI.Template`** when a view needs structure no CUI element covers.
3. **Never** build structure node by node with `CUI.dom.*` (`CUI.dom.div()`, `CUI.dom.li()`,
   `CUI.dom.append(...)`), `document.createElement`, `innerHTML` or concatenated HTML strings.
   `CUI.dom.*` stays allowed for small changes to existing nodes, such as setting a CSS class.

CUI is a global of the web frontend: never import, bundle or replace it.

## Process

1. Check the demo for elements that cover the UI.
2. For own structure: write a template file in the plugin's frontend folder, list it under
   `plugin.webfrontend.html` in the manifest and ship it via `webfrontend.install` in `build.yml`
   (details in templating.md).
3. Create the template with `new CUI.Template(name: "<plugin>-<name>", map: {...})`, fill slots
   with CUI elements and localized texts.
4. Pass the template (or `template.DOM`) to layouts and other CUI elements.

## Pitfalls

- Template names are global: prefix them with the plugin name, or they can overwrite or be
  overwritten by a frontend template of the same name.
- `new CUI.Template` fails if the template is not loaded (file not in `plugin.webfrontend.html`,
  not in `webfrontend.install`, or an on-demand template not loaded yet), or if a slot from `map`
  is missing in the HTML or appears more than once.
- Slots never take a promise: wait for the data, then fill the slot.
- The fylr docs do not explain these conventions, and the CUI docs are incomplete. When a page is
  missing, read the element in the demo and the CUI source, and say so in the plan.
- The DOM-building custom data type in fylr-plugin-example is not a model for new code.

## Verify

- No `CUI.dom.*` structure building, `createElement`, `innerHTML` or HTML strings in the plugin
  (`grep`), except small changes to existing nodes.
- Every `new CUI.Template` name exists as `data-template` in a file listed in the manifest and in
  `build.yml`, and every slot in `map` occurs exactly once in that file.
