# ez5 extension points

How a fylr webfrontend plugin hooks into the frontend, read from the bundle
(`ez5.FRONTEND_VERSION` 5.156.0). The base classes have no class file; the hooks below are the
reference. Globals the hooks use: [globals.md](globals.md).

## Rules for all extension points

- Subclass the base class (CoffeeScript `class X extends DetailSidebarPlugin`, or JavaScript
  `class X extends DetailSidebarPlugin`) and register it. Override hooks; call
  `super.<method>(...)` (CoffeeScript `super`) when the base method does work, for example in
  `initOpts`, `readOpts` and `destroy`.
- "When" says whether the registry exists at load time ("load") or only after
  `ez5.session_ready` has run ("session_ready"). Register session_ready registries from inside
  `ez5.session_ready(-> ...)`. Registering there also works for "load" registries, so doing it
  always is safe.
- "Pass" says whether the register function takes the class or an instance. The register
  functions assert the type (`instanceof` the base class), so a wrong one fails at load time.
- `CUI.PluginRegistry` creates a new plugin instance per host object with `new Plugin(opts)`;
  the opts are listed per registry (for example `detailSidebar`) and are read as `this._<name>`.

## Overview

| Feature | Register call | Pass | When | Base class |
| --- | --- | --- | --- | --- |
| Detail view panel or button | `DetailSidebar.plugins.registerPlugin` | class | session_ready | `DetailSidebarPlugin` |
| Editor checks and save hook | `Editor.plugins.registerPlugin` | class | session_ready | `ez5.EditorPlugin` |
| Custom data type | `CustomDataType.register` | class | load | `CustomDataType` |
| Mask splitter | `MaskSplitter.plugins.registerPlugin` | class | load | `CustomMaskSplitter` |
| Search toolbox tools | `SearchMain.toolPlugins.registerPlugin` | class | load | `ez5.SearchToolPlugin` |
| Expert search field hook | `SearchExpertOptions.plugins.registerPlugin` | class | session_ready | `ez5.SearchExpertPlugin` |
| Object type admin tab | `Objecttype.plugins.registerPlugin` | class | load | `ez5.ObjecttypePlugin` |
| Pool admin tabs | `Pool.plugins.registerPlugin` | class | load | `ez5.PoolPlugin` |
| User admin tabs | `User.plugins.registerPlugin` | class | load | `ez5.UserPlugin` |
| Base config field type | `BaseConfig.registerPlugin` | instance | load | `BaseConfigPlugin` |
| Export format ("produce" plugin) | `ExportManager.registerPlugin` | instance | load | `ExportManagerPlugin` |
| Export transport | `TransportsEditor.registerPlugin` | instance | load | `ExportTransportPlugin` |
| Collection toolbox tools | `Collection.registerPlugin` | instance | load | `CollectionPlugin` |
| Schema custom settings | `Schema.registerPlugin` | instance | load | `SchemaPlugin` |
| Workflow transition action | `TransitionAction.registerAction` | class | load | `TransitionActionAction` |
| Task manager module | `TaskManagerList.registerModule` | class | load | `TaskModuleBase` |
| Presentation download | `Presentation.registerDownloadManager` | class | load | `PresentationDownloadManager` |
| Main menu app | `ez5.rootMenu.registerApp` | class | session_ready | `RootMenuApp` |
| Tray app (top right) | `ez5.tray.registerApp` | instance | session_ready | `TrayApp` |
| Asset viewer in the asset browser | `AssetBrowser.plugins.registerPlugin` | class | session_ready | `AssetDetail` |
| Asset browser tool button | `AssetBrowserInfoControl.plugins.registerPlugin` | class | session_ready | `ez5.AssetBrowserToolPlugin` |
| Image zoomer overlay or panel | `ZoomerV2.plugins.registerPlugin` | class | session_ready | `ZoomerPlugin` |
| Video player overlay, markers | `VideoPlayer.plugins.registerPlugin` | class | session_ready | `VideoPlayerPlugin` |
| 3D splat viewer | `SplatViewer.plugins.registerPlugin` | class | session_ready | `SplatViewerPlugin` |
| Video editor modal | `VideoEditorModal.plugins.registerPlugin` | class | session_ready | `ez5.VideoEditorPlugin` |
| Asset versions editor tools | `AssetVersions.plugins.registerPlugin` | class | session_ready | `AssetVersionsEditorPlugin` |
| Script runner script | `ez5.ScriptRunner.plugins.registerPlugin` | class | session_ready | `ez5.ScriptRunner.Plugin` |
| Fields migrator caster | `ez5.ScriptRunner.FieldsMigrator.casterPlugins.registerPlugin` | class | session_ready | `ez5.CasterPlugin` |

`ez5.tray` and `ez5.rootMenu` are created by the startup code before plugins load, but the
frontend registers its own apps in `ez5.session_ready`, and apps are loaded right after it; do
the same.

The media registries (`ZoomerV2`, `VideoPlayer`, `SplatViewer`, `VideoEditorModal`,
`AssetVersions`, `AssetBrowserInfoControl`) are recent and used only on fylr
(`ez5.version("6")`). Guard them with `if (VideoPlayer.plugins)` when the plugin supports older
fylr versions.

## DetailSidebarPlugin

Opts: `detailSidebar` (`DetailSidebar`, mandatory). The detail sidebar creates one instance per
opened object. `this._detailSidebar.getResultObject()` returns the `ResultObject` shown.

Lifecycle per rendered object:

1. `isAvailable()` decides whether the plugin takes part. The base returns `undefined`, so a
   plugin that does not override it is never shown.
2. `renderObject()` is called, then a toggle button is created with the l10n key from
   `getButtonLocaKey()` in the pane from `getPane()` (`"top"` default, or `"left"`). Buttons in
   one pane are radio buttons.
3. If `prefName()` returns a user preference name and that preference is set and
   `isDisabled()` is false, the plugin starts active.
4. Activating the button calls `showDetail()` and `setActive()`; deactivating calls
   `hideDetail()` and `setInactive()`. With `prefName()`, the state is saved as a cookie
   preference.
5. After the detail output is rendered, the `detail-sidebar-render-object` event calls
   `renderObjectDetailSidebar()`.

Other hooks: `getCenterContent()` (content for the center pane), `callback(name, info)`
(sidebar callbacks), `isFullscreenAvailable()` (default `true`), `prefDefault()` (default
`false`), `destroy()` (call super; it destroys the button).

## ez5.EditorPlugin

Instantiated without opts for each editor. Two hooks, both called with one options object
`{bulk, new, editor, resultObject}`:

- `checkForm(opts)` returns an array of `CheckDataProblem` instances; any other value fails an
  assertion. An empty array means no problems.
- `onSave(opts)` additionally gets `objectList` and `event`. It may return a promise; a rejected
  promise stops the save. Default returns `[]`.

## CustomDataType

`CustomDataType.register(MyType)` takes the class. It instantiates it once and asserts that
`getCustomDataTypeName()` matches `^custom:[a-z][0-9a-z_.-]*[0-9a-z]$` and is not registered yet.
`CustomDataType.get(name)` returns the instance or a `CustomDataTypeUnknown`.

`CustomDataType` extends `DataColumn` extends `Field`, so most hooks are `Field` methods.
Abstract (the base renders "unimplemented"): `getCustomDataTypeName()`,
`getCustomDataOptionsInDatamodelInfo(1)`, `renderEditorInput(3)`, `renderDetailOutput(3)`,
`renderSearchInput(1)`, `getQueryFieldBadge(1)`. Commonly overridden: `getSaveData(3)` (empty
default), `getCustomDataTypeNameLocalized()`, `isEmpty(3)`, `checkValue(3)`, `getSearchFilter(2)`,
`supportsStandard()`, `renderFieldAsGroup(3)`, `getCustomSchemaSettings()`,
`getCustomMaskSettings()`, `getSortFields(1)` with `hasRenderForSort()`. The `Field` methods are
in [`Field`](classes/Field.md); use the example plugins for argument meanings. The `fylr-custom-data-types` skill covers manifest and
storage.

## CustomMaskSplitter

Registered class; the mask editor lists every registered splitter. Extends
`MaskSplitterBegin` and `ListViewEditTreeMaskRowNode`. Implement `renderField(opts)`; the base
renders a "renderField needs to be implemented" placeholder. `getOptions()` returns the form
fields of the splitter's options in the mask editor (base: an "Add options here" placeholder).
`isSimpleSplit()` (default `false`) marks a splitter without inner fields. Name methods:
`name()`, `nameLocalized()`, `locaKey()`. A splitter that wraps fields renders them with
`renderInnerFields(opts)`, which returns the rendered child nodes.

## ez5.SearchToolPlugin

Opts: `search` (`SearchMain`). `getTools()` returns an array of `ToolboxTool` instances or plain
option objects for `new ToolboxTool(...)`; missing `group` and `sort` come from `getGroup()`
(`"search"`) and `getSort()` (`"Z:1"`), a missing `run` becomes a no-op, and nested `tools` are
built the same way. `isAvailable()` defaults to `true`. Helpers for the tool code:
`getSelectedObjects()`, `getSelectedCount()`, `getResultCount()`, `getLastData()`,
`getCollection()`, `getSearchInput()`, `addQueryLanguageQuery(q)`, `setQueryLanguageQuery(q)`.

## ez5.SearchExpertPlugin

Instantiated without opts. `beforeFieldAdded({data, field})` is called before the expert search
adds a field; the base does nothing.

## ez5.ObjecttypePlugin, ez5.PoolPlugin, ez5.UserPlugin

Admin manager tabs. Opts: `objecttypeListViewItem`, `pool` or `user`.

- Object type: `getTab()` returns one tab definition (or nothing), which is appended;
  `onLoad()` runs after the object type is loaded.
- Pool: `getTabs(tabs)`, `getInfoDivRows(rows)`, `getInfoDiv(div)`.
- User: `getTabs(tabs)`, `isAllowed()` (default `true`; plugins that return false are dropped).
- All three: `getSaveData(saveData)`.

`getTabs` and `getSaveData` get the host's array or object and change it in place; return values
are ignored. For pools and object types, `getSaveData` may throw an `InvalidSaveDataException`;
its problems are shown in the form. Store plugin data in the object's `custom_data` (for pools
`data.pool.custom_data`, which starts as an empty object).

## BaseConfigPlugin

Register an instance. For a base config parameter with `plugin_type`, `BaseConfig` asks every
registered plugin `getFieldDefFromParm(baseConfig, name, def, ...)` in order and uses the first
non-empty result as the form field definition. `onDataChanged(...)` is called on changes. Most
plugins only need the manifest's `base_config` and read values with
`ez5.session.getBaseConfig("plugin", "<plugin-name>")` (see [globals.md](globals.md)).

## ExportManagerPlugin and ExportTransportPlugin

- `ExportManagerPlugin` (instance): `name()` and `nameLocalized()` (both `"<unknown>"` by
  default), `renderForm()`, `getExportData()`, `saveAllowed()` (default `true`), `init(1)`,
  `deinit()`, `resetData()`, `expandForExport()`.
- `ExportTransportPlugin` (instance): abstract `getType()`, `getDisplayType()`,
  `getOptions(1)`; optional `getDisplayIcon()`, `getOptionsDisplay(data)`, `getSaveData(data)`,
  `isAllowed()` (`true`), `supportsPacker()` (`false`), `supportSecretFields()`.

## Apps: RootMenuApp, TrayApp

- `App` lifecycle, all returning promises: `load(1)`, `allow_unload()`, `unload()`, `reload()`,
  `update_path(1)`; `is_allowed()` (instance and static) may return a boolean or a promise.
- `RootMenuApp` is registered as a class; its menu entry comes from static methods: `label()`,
  `path()`, `group()`, `getId()`, `submenu()`, `isStartApp()`, `isBottomApp()`,
  `getSubmenuKey()`, `getSubmenuText()`, `getSubmenuIcon()`, `getSubmenuTooltip()`,
  `is_allowed()`. Instances use `pushState(1)`, `replaceState(1)`, `setTitle(2)`,
  `setSecondaryTitle(1)`.
- `TrayApp` is registered as an instance: `getDisplay()` returns the DOM node (base: an empty
  `div.tray-item`), `getSortValue()` orders the tray.

## Asset and media plugins

The host passes itself as the first argument, so one plugin instance can check its context:

- `AssetDetail` (asset browser viewers): opts `element`, `editor_mode`; `getAsset()`,
  `start(2)`, `isPlayer()`, `getButtonLocaKey(1)`, `resize()`, `reload()`, `destroy()`.
- `ez5.AssetBrowserToolPlugin`: `isAvailable(currentAsset)` (default `false`; the argument is
  the current asset, with `value` and `field`), `getIcon()`, `getTooltip()`,
  `open(1)`, `getToggleButton(1)`, `isToggleAvailable(currentAsset)`,
  `onAssetShown(currentAsset, assetBrowser)`.
- `ZoomerPlugin`: `isAvailable(zoomer, asset)` (default `false`), `getButtons(1)`,
  `renderOverlay(1)`, `renderPanel(1)`, `onUpdate(1)`, `onClose(1)`.
- `VideoPlayerPlugin`: `isAvailable(player, asset)` (default `false`),
  `getMarkerTracks(2)` (native `Promise`, default `[]`), `onMarkerClick(player, marker, ...)`
  (default seeks to `marker.start`), `getButtons(1)`, `renderOverlay(1)`, `renderPanel(1)`,
  `onTimeUpdate(2)`, `onVersionChange(2)`.
- `ez5.MediaEditorPlugin` / `ez5.VideoEditorPlugin`: `isAvailable(2)` (default `false`),
  `renderPanel(1)`, `renderOverlay(1)`, `onSceneLoaded(1)`, `onFrame(1)`, `onResize(1)`.
- `AssetVersionsEditorPlugin`: opts `assetVersions`, `asset`, `content`; `isAvailable(1)`,
  `getTools()`, `onRegister()`.

## Others

`CollectionPlugin.getCurrentTools(collection)` returns toolbox tools for a collection.
`SchemaPlugin` adds custom schema settings (`getCustomSettings(1)`,
`getCustomSettingsLabel(1)`, `getCustomSettingsDisplay(1)`, `getName()`).
`ez5.ScriptRunner.Plugin` and `ez5.CasterPlugin` extend the script runner and its field
migrator; they are rare in plugins. Find an example call before implementing their hooks.
