// Writes the ez5 reference: references/index.md (list of classes) and
// references/classes/<Class>.md (one file per class). Used by generate.js (from easydb5.js) and
// by rewrite.js (from the reference already in the skill). The hand-written extension-points.md
// and globals.md are never touched.
//
// The bundle is licensed, so the reference stays as small as possible:
// - Selection: only the classes and members listed in public.json: the classes behind the globals
//   in globals.md and their plugin-facing members. Everything else is internal and left out. A
//   listed member missing from the bundle is reported as a warning (renamed or removed in fylr).
// - Sanitizing: validation expressions, defaults and property values are kept only when they are
//   a type name, an enum of strings or a short literal. Anything that is code is dropped, and so
//   are properties without a literal value and subclass lists.
const fs = require("fs");
const path = require("path");

const LEGEND = [
  "Legend: `name(n)` takes n positional arguments (their names are minified away). `name(opts)` takes",
  "one options object; its keys are listed, `!` marks mandatory ones. \"reads\" lists the keys a method",
  "reads from its first argument when that is an options object. \"hook, empty default\": the base",
  "class does nothing; \"abstract\": subclasses must implement it. \"Promise\": returns a `CUI.Deferred`",
  "promise. `check` shows the expected type when the bundle states one. Methods starting with `_` are",
  "internal and left out. Inherited methods are listed only on the class that defines them; follow",
  "`extends`.",
].join("\n");

const provenance = (version) =>
  "Generated from the fylr web frontend bundle `easydb5.js`, `ez5.FRONTEND_VERSION` " + version + ".\n" +
  "Regenerate with `scripts/ez5-api/generate.js` in the fylr-agents-skills repository; do not edit by hand.";

const fileOf = (name) => name.replace(/[^\w.$-]/g, "_") + ".md";

// --- sanitizing -------------------------------------------------------------------------------

// a type the bundle checks against: "PlainObject", Boolean, CUI.Button, ["a","b"]
const isType = (s) => /^("[\w.]+"|[A-Z$][\w.$]*|\[("[\w.-]*",?)+\])$/.test(s.trim());
// a literal worth showing: true, 16, "audio", [], {}, ["fulltext","token"]
const isLiteral = (s) =>
  /^(true|false|null|undefined|-?\d+(\.\d+)?|"[^"`]{0,60}"|\[\]|\{\}|\[((-?\d+|"[\w. -]*"),?)+\])$/.test(s.trim());

// split "a: X, b: Y" at top-level commas
function splitTop(s) {
  const out = [];
  let depth = 0, quote = null, cur = "";
  for (const ch of s) {
    if (quote) { if (ch === quote) quote = null; }
    else if (ch === '"' || ch === "'") quote = ch;
    else if ("([{".includes(ch)) depth++;
    else if (")]}".includes(ch)) depth--;
    if (ch === "," && depth === 0 && !quote) { out.push(cur); cur = ""; } else cur += ch;
  }
  if (cur.trim()) out.push(cur);
  return out.map((x) => x.trim());
}

// "opts {a!: check, b: check}" inside a method line
function sanitizeOptsNote(line) {
  const start = line.indexOf("opts {");
  if (start < 0) return line;
  let depth = 0, end = -1, quote = null;
  for (let i = start + 5; i < line.length; i++) {
    const ch = line[i];
    if (quote) { if (ch === quote) quote = null; continue; }
    if (ch === '"' || ch === "'") quote = ch;
    else if ("([{".includes(ch)) depth++;
    else if (")]}".includes(ch) && --depth === 0) { end = i; break; }
  }
  let parts;
  if (end >= 0) parts = splitTop(line.slice(start + 6, end).replace(/\\\|/g, "|"));
  else {
    // the generator cut a long check ("…"), so braces do not balance: split at `, key:` instead
    end = line.lastIndexOf("}") > start ? line.lastIndexOf("}") : line.length;
    parts = line.slice(start + 6, end).replace(/\\\|/g, "|").split(/, (?=[\w$]+!?(?::|,|$))/);
  }
  const items = parts.map((it) => {
    const m = it.match(/^([\w$]+!?)(?::\s*(.*))?$/s);
    if (!m) return null;
    return m[2] && isType(m[2]) ? m[1] + ": " + m[2] : m[1];
  }).filter(Boolean);
  return line.slice(0, start) + "opts {" + items.join(", ") + "}" + line.slice(end + 1);
}

// returns null for lines to drop
function sanitizeLine(line) {
  // meta line: superclass only, no subclass or registry lists
  if (/^extends /.test(line)) return line.split(" · ")[0];
  // property: - `name` = `value`, or - `name` (property)
  if (/^- `[^`(]+` \(property\)/.test(line)) return null;
  let m = line.match(/^- `([^`]+)` = `([^`]*)`(.*)$/);
  if (m) return isLiteral(m[2]) ? "- `" + m[1] + "` = `" + m[2] + "`" + m[3] : null;
  // option: - `name`! — check `X`; default `Y`; deprecated
  m = line.match(/^- (`[^`(]+`!?) — (.*)$/);
  if (m) {
    const bits = [];
    for (const b of m[2].matchAll(/(check|default) `([^`]*)`|\bdeprecated\b/g)) {
      if (!b[1]) bits.push("deprecated");
      else if (b[1] === "check" && isType(b[2])) bits.push("check `" + b[2] + "`");
      else if (b[1] === "default" && isLiteral(b[2])) bits.push("default `" + b[2] + "`");
    }
    return "- " + m[1] + (bits.length ? " — " + bits.join("; ") : "");
  }
  return sanitizeOptsNote(line);
}

const sanitizeBody = (body) =>
  body.split("\n").map(sanitizeLine).filter((l) => l !== null).join("\n")
    // a section heading left without entries
    .replace(/^(Options \(.*|Methods:|Static:)\n\n(?=[A-Z]|\s*$)/gm, "")
    .replace(/\n{3,}/g, "\n\n");

// --- selection --------------------------------------------------------------------------------

const PUBLIC = path.join(__dirname, "public.json");

/** public.json: {Class: {options, methods, static}}, the plugin-facing members per class */
function readPublic() {
  const pub = JSON.parse(fs.readFileSync(PUBLIC, "utf8"));
  delete pub._comment;
  return pub;
}

const SECTION = { "Options": "options", "Methods:": "methods", "Static:": "static" };

/**
 * Keeps the listed members of one class body and reports listed members it did not find.
 * @param {string} body  class body (sanitized)
 * @param {{options?: string[], methods?: string[], static?: string[]}} allowed
 */
function filterMembers(body, allowed) {
  const found = new Set();
  let section = null;
  const lines = body.split("\n").filter((line) => {
    const head = Object.keys(SECTION).find((k) => line.startsWith(k));
    if (head) { section = SECTION[head]; return true; }
    const m = line.match(/^- `([\w$]+)/);
    if (!m || !section) return true;
    const ok = (allowed[section] || []).includes(m[1]);
    if (ok) found.add(section + ":" + m[1]);
    return ok;
  });
  const missing = [];
  for (const [sec, names] of Object.entries(allowed))
    for (const n of names) if (!found.has(sec + ":" + n)) missing.push(sec + " " + n);
  const out = lines.join("\n")
    .replace(/^(Options \(.*|Methods:|Static:)\n\n(?=[A-Z]|\s*$)/gm, "")
    .replace(/\n{3,}/g, "\n\n");
  return { body: out, missing };
}

// --- writing ----------------------------------------------------------------------------------

/**
 * @param {object} o
 * @param {string} o.outDir     references folder of the fylr-ez5 skill
 * @param {string} o.version    ez5.FRONTEND_VERSION
 * @param {{name: string, body: string}[]} o.classes  body = markdown below the class heading, class
 *   names in backticks without links
 */
function writeReference({ outDir, version, classes: all }) {
  const pub = readPublic();
  const names = new Set(Object.keys(pub));
  for (const n of names) if (!all.some((c) => c.name === n)) console.warn("public.json: class " + n + " not found");
  const classes = all.filter((c) => names.has(c.name)).sort((a, b) => a.name.localeCompare(b.name));
  const link = (name, prefix) => (names.has(name) ? "[`" + name + "`](" + prefix + fileOf(name) + ")" : "`" + name + "`");

  const classDir = path.join(outDir, "classes");
  fs.rmSync(classDir, { recursive: true, force: true });
  fs.mkdirSync(classDir, { recursive: true });
  const supers = new Map();
  for (const c of classes) {
    const { body, missing } = filterMembers(sanitizeBody(c.body), pub[c.name]);
    for (const m of missing) console.warn("public.json: " + c.name + " " + m + " not found");
    const sup = (body.match(/^extends `([^`]+)`/m) || [])[1];
    if (sup) supers.set(c.name, sup);
    const out = [
      "# " + c.name,
      "",
      "ez5 class. " + provenance(version).replace("\n", " "),
      "Index: [index.md](../index.md). Legend: see the index.",
      "",
      body.replace(/^(extends .*)$/m, (line) => line.replace(/`([\w.$]+)`/g, (m, n) => link(n, ""))).trim(),
      "",
    ].join("\n");
    fs.writeFileSync(path.join(classDir, fileOf(c.name)), out);
  }

  const index = [
    "# ez5 reference index",
    "",
    provenance(version),
    "",
    "Scope: only the classes behind the globals in [globals.md](globals.md) and only their members",
    "meant for plugins. Anything not listed is internal: do not call or override it. Start with",
    "globals.md, then read only the class file you need. Base classes of extension points are",
    "described in [extension-points.md](extension-points.md) and have no class file.",
    "",
    LEGEND,
    "",
    "## Classes",
    "",
    ...classes.map((c) => "- " + link(c.name, "classes/") + (supers.has(c.name) ? " — extends " + link(supers.get(c.name), "classes/") : "")),
    "",
  ].join("\n");
  fs.writeFileSync(path.join(outDir, "index.md"), index);
  return { classes: classes.length, of: all.length };
}

module.exports = { writeReference, fileOf, sanitizeBody, filterMembers };
