# HTML templating in fylr frontend plugins

Own content: the fylr docs do not cover this. Details come from the CUI tutorial
("Create a new template") and the `custom-element` example.

## Template files

- Templates live in their own `.html` files in the plugin's frontend folder, never as strings in
  code.
- Each template has a root element with `data-template="<name>"`. Places that get content are empty
  elements with `data-slot="<slot>"`.
- Names are global (`CUI.Template.nodeByName`): they start with the plugin name.
- A template holds only structure and CSS classes: no visible text (it comes localized through
  slots), no inline scripts, no event handlers (those belong to the CUI elements in the slots).

```html
<!-- webfrontend/my-plugin.html -->
<div data-template="my-plugin-summary" class="my-plugin-summary">
  <div class="my-plugin-summary__label" data-slot="label"></div>
  <div class="my-plugin-summary__value" data-slot="value"></div>
  <div class="my-plugin-summary__actions" data-slot="actions"></div>
</div>
```

## Shipping and loading

- List the file under `plugin.webfrontend.html` in `manifest.yml` and ship it via
  `webfrontend.install` in `build.yml`. Look up the exact keys in the manifest docs and the
  fylr-build-plugin README; fylr-plugin-example shows a working pair (`webfrontend/FylrExample.html`).
- fylr merges the HTML files of all active plugins into `/api/v1/plugin/bundle.html`. The web
  frontend loads it and registers the templates with CUI, so plugin code uses
  `new CUI.Template(name: "<name>", …)` directly. No own loading or registering.
- Only templates needed on demand may be loaded with `CUI.Template.loadTemplateFile(url)`. Build
  the URL absolute from the plugin's base URL
  (`ez5.pluginManager.getPlugin("<plugin-name>").getBareBaseURL() + "<file>.html"`), because CUI
  resolves relative paths against its own script. Wait for the returned promise before using the
  template.

## Usage

```coffeescript
template = new CUI.Template
  name: "my-plugin-summary"
  map:
    label: true      # true: element with data-slot="label"; a CSS selector also works
    value: true
    actions: true

waitBlock = new CUI.WaitBlock(element: template)
waitBlock.show()
@loadData().done (data) =>
  waitBlock.destroy()
  template.text($$("my-plugin.summary.label"), "label")
  template.text(data.value, "value")
  template.append(new CUI.Button
    text: $$("my-plugin.summary.reload")
    onClick: => @reload()
  , "actions")

# pass the template itself (or template.DOM) to layouts and CUI elements
panel = new CUI.SimplePane(content: template)
```

- Fill slots with `append`, `prepend`, `replace`, `text`, `empty`; `get(slot)` returns the DOM node.
- Contents are CUI elements, DOM nodes or strings, never a promise: wait for the data first, and
  show a `CUI.WaitBlock` on the template meanwhile.
- A reusable element extends `CUI.DOMElement` and calls `@registerTemplate(template)` in its
  constructor, as in the tutorial's `custom-element` example.
- Check names and options of layouts and helpers (`CUI.SimplePane`, `CUI.WaitBlock`) in the CUI docs
  or demo before use; the snippet shows the pattern, not a reference.

## Pitfalls

| Symptom | Cause |
|---|---|
| `new CUI.Template` throws: template not found | File not under `plugin.webfrontend.html`, not in `webfrontend.install`, or an on-demand template not loaded yet |
| `new CUI.Template` throws about a slot | A slot from `map` is missing in the HTML or occurs more than once |
| Wrong or foreign markup appears | Template name without plugin prefix collides with a frontend or other plugin template |
| On-demand template 404 | Relative URL passed to `loadTemplateFile`; use the plugin's absolute base URL |
