---
name: fylr-rest-api
description: Use when plugin code, tests or tools call the fylr API (authentication, records, search requests, objects, users). Points to the OpenAPI specification and the API pages, and covers tokens passed to plugins and the traps of copying easydb 5 examples.
---

# Calling the fylr API

## When to use

- A server plugin calls back into fylr, an apitest suite sends requests, or a unit test stubs an
  API response.

## Sources

- [API overview](https://docs.fylr.io/for-developers/api.md) and [OAuth2](https://docs.fylr.io/for-developers/api/oauth2.md)
- [OpenAPI 3.1 specification](https://raw.githubusercontent.com/programmfabrik/fylr-gitbook/main/.gitbook/assets/fylr-openapi-3.1.json): the authority for request and response shapes
- [Search Requests](https://docs.fylr.io/for-developers/search-requests.md)
- [Record JSON](https://docs.fylr.io/for-developers/record-json.md)
- [The callback contract](https://docs.fylr.io/for-developers/plugin/callbacks/contract.md): tokens and URLs fylr passes to a plugin
- [Changes easydb 5 → fylr](https://docs.fylr.io/for-developers/changes-easydb5-fylr.md)

## Decisions

- **Which identity the call uses:** the short-lived token fylr passes to the plugin (preferred), or
  a plugin user with least rights, configured by the administrator (for example for scheduled
  updaters that run without an acting user). Never stored or hard-coded credentials.
- **Which base URL:** always the one fylr passes in; writes inside a transaction go through
  `api_tx_url` (details: `fylr-execserver`). Never hard-code an API address.
- **Which fylr version:** check version notes on every endpoint used.

## Process

1. Look up the endpoint and its schemas in the OpenAPI specification.
2. Build search requests from Search Requests, not from memory or easydb 5 examples.
3. In unit tests, replace the API with a local stub that returns responses shaped like the
   OpenAPI schema (`fylr-testing`).
4. Handle API errors explicitly and return them in the plugin's documented error format.

## Pitfalls

- easydb 5 request and response shapes differ from fylr. Never copy them.
- Search requests are easy to get subtly wrong (field paths, nested tables, operators). Build them
  step by step from the docs and stub-test the exact JSON you send.
- Never log, print or commit tokens, including in example requests.

## Verify

- Every call's request and response shape is traceable to the OpenAPI specification.
- No credential, token or instance URL appears in code, tests or fixtures.
