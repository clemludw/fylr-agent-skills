# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
A new version of a generated reference (ez5, golib) is at least a minor release.

## [Unreleased]

### Added

- APM manifest `apm.yml` for the package `fylr-agents-skills` with all supported agent
  targets and the `fylr-docs` MCP server.
- Always-on rule `fylr-rules.instructions.md`.
- Skills for the plugin workflow: `fylr-plugin-design`, `fylr-spec-questions`,
  `fylr-checklist`, `fylr-verify`.
- Skills for domain knowledge: `fylr-concepts`, `fylr-docs`, `fylr-rest-api`,
  `fylr-localization`.
- Skills for frontend plugins: `fylr-frontend-plugins`, `fylr-cui`, `fylr-ez5`
  (with a generated reference of the web frontend API).
- Skills for server plugins: `fylr-server-plugins`, `fylr-execserver`, `fylr-golib`
  (with a generated golib API reference), `fylr-server-dependencies`,
  `fylr-custom-data-types`.
- Skills for build, quality and upkeep: `fylr-build-release`, `fylr-testing`,
  `fylr-debugging`, `fylr-security-review`, `fylr-maintenance`.
- Reference generators for ez5 and golib under `scripts/` (not shipped).
- Checks under `scripts/check/`: structure, links and install test.
