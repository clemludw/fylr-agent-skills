# Typical requirements → plugin kind and extension point

A starting point, not a decision. Always read the docs page of the chosen extension point
([extension-points.md](extension-points.md)) and justify the choice in the plan.

| Requirement | Obvious way | Check |
|---|---|---|
| Validate or complete data on save | Callback `db_pre_save` | [Events and Webhooks](https://docs.fylr.io/for-developers/events-and-webhooks.md) if the plugin only needs to react, not to prevent the save |
| Field filled from an external vocabulary or authority file | Custom data type, possibly with updater (`fylr-custom-data-types`) | It has a frontend part and a server part |
| Own API endpoint for an external system | Extension (`fylr-server-plugins`) | Rights of the calling user; apitest suite |
| Own export format or transport | Callback `export` or `export_transport` | Frontend part in the Export Manager |
| Additional view or action in the detail view, editor or collection | Frontend plugin at the matching ez5 extension point (`fylr-frontend-plugins`, `fylr-ez5`) | Registration timing (`ez5.session_ready`) and other ez5 pitfalls |
| Inform an external system about changes | Event polling (`/event/poll`) or a workflow webhook in `after_commit_async` mode instead of a callback | A callback or `pre_save` webhook would block or break the save; webhooks fire only on workflow transitions; the WebSocket stream may drop events |
| Own file versions or metadata from files | File-processing recipe | File Worker; external programs available on the execserver |
| Options an administrator can set | Base-config parameters | Localized labels (`fylr-localization`) |
| Callback needs rights the acting user does not have | Plugin user via base config ([The callback contract](https://docs.fylr.io/for-developers/plugin/callbacks/contract.md)) | Least rights; document what the administrator configures |
