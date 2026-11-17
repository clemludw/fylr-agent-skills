#!/usr/bin/env node
// Structure check for the package.
// Usage: node scripts/check/check-structure.mjs [repoRoot]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(process.argv[2] || path.join(path.dirname(fileURLToPath(import.meta.url)), "../.."));
const apm = path.join(root, ".apm");
const errors = [];
const warnings = [];
const err = (f, m) => errors.push(`${path.relative(root, f)}: ${m}`);
const warn = (f, m) => warnings.push(`${path.relative(root, f)}: ${m}`);

const SKILL_MAX = 120;
const RULE_MAX = 30;
const SECTIONS = ["When to use", "Sources", "Decisions", "Process", "Pitfalls", "Verify"];
const PREFIX = "fylr-";

function frontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return null;
  const fm = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].replace(/^["']|["']$/g, "");
  }
  return fm;
}
const lines = (t) => t.replace(/\n$/, "").split("\n").length;

// Prefix rule: every top-level entry under .apm/skills and .apm/instructions.
for (const sub of ["skills", "instructions"]) {
  const dir = path.join(apm, sub);
  if (!fs.existsSync(dir)) { err(dir, "missing"); continue; }
  for (const e of fs.readdirSync(dir)) {
    if (!e.startsWith(PREFIX)) err(path.join(dir, e), `name must start with "${PREFIX}"`);
  }
}
for (const e of fs.existsSync(apm) ? fs.readdirSync(apm) : []) {
  if (!["skills", "instructions"].includes(e)) err(path.join(apm, e), "unexpected entry in .apm/ (only skills/ and instructions/ are shipped)");
}

// Always-on rule.
const rulesDir = path.join(apm, "instructions");
if (fs.existsSync(rulesDir)) {
  for (const f of fs.readdirSync(rulesDir)) {
    const p = path.join(rulesDir, f);
    if (!f.endsWith(".instructions.md")) { err(p, "instruction files end with .instructions.md"); continue; }
    const t = fs.readFileSync(p, "utf8");
    const fm = frontmatter(t);
    if (!fm || !fm.description || !fm.applyTo) err(p, "frontmatter needs description and applyTo");
    if (lines(t) > RULE_MAX) err(p, `${lines(t)} lines, max ${RULE_MAX}`);
  }
}

// Skills.
const skillsDir = path.join(apm, "skills");
const skills = fs.existsSync(skillsDir) ? fs.readdirSync(skillsDir).filter((d) => fs.statSync(path.join(skillsDir, d)).isDirectory()) : [];
for (const name of skills) {
  const p = path.join(skillsDir, name, "SKILL.md");
  if (!fs.existsSync(p)) { err(path.join(skillsDir, name), "missing SKILL.md"); continue; }
  const t = fs.readFileSync(p, "utf8");
  const fm = frontmatter(t);
  if (!fm) { err(p, "missing frontmatter"); continue; }
  if (fm.name !== name) err(p, `frontmatter name "${fm.name}" must equal folder "${name}"`);
  if (!fm.description) err(p, "missing description");
  else if (!/^Use when\b/.test(fm.description)) err(p, 'description must start with "Use when"');
  if (lines(t) > SKILL_MAX) err(p, `${lines(t)} lines, max ${SKILL_MAX} (move detail to references/)`);
  const heads = [...t.matchAll(/^## (.+)$/gm)].map((m) => m[1].trim());
  const known = heads.filter((h) => SECTIONS.includes(h));
  const unknown = heads.filter((h) => !SECTIONS.includes(h));
  if (unknown.length) err(p, `unknown sections: ${unknown.join(", ")} (allowed: ${SECTIONS.join(", ")})`);
  const order = known.map((h) => SECTIONS.indexOf(h));
  if (order.some((v, i) => i && v <= order[i - 1])) err(p, `sections out of order or duplicated: ${known.join(", ")}`);
  if (!known.includes("When to use")) warn(p, 'no "When to use" section');
}

// Heuristic: copied defaults and version numbers in hand-written content.
const GENERATED = /Generated from|do not edit by hand/i;
const ALLOWED_VERSIONS = new Set(["6.34", "6.35", "6.35.1"]);
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else if (e.name.endsWith(".md")) out.push(p);
  }
  return out;
}
for (const p of fs.existsSync(apm) ? walk(apm) : []) {
  const t = fs.readFileSync(p, "utf8");
  if (GENERATED.test(t.slice(0, 600))) continue;
  t.split("\n").forEach((line, i) => {
    if (/(pluginJobTimeoutSec|connectTimeoutSec|stallTimeoutSec)\D{0,20}\d+/.test(line)) warn(p, `line ${i + 1}: number next to a default-value key`);
    // Required version labels of the generated references are allowed.
    if (/FRONTEND_VERSION|golib\.version|pseudo-version/.test(line)) return;
    const stripped = line.replace(/https?:\/\/\S+/g, "");
    for (const m of stripped.matchAll(/(?<![\w.-])v?(\d+\.\d+(?:\.\d+)?)(?![\w.])/g)) {
      if (!ALLOWED_VERSIONS.has(m[1]) && /\d+\.\d+\.\d+/.test(m[1])) warn(p, `line ${i + 1}: version number ${m[1]}`);
    }
  });
}

for (const w of warnings) console.log(`WARN  ${w}`);
for (const e of errors) console.log(`ERROR ${e}`);
console.log(`check-structure: ${skills.length} skills, ${errors.length} errors, ${warnings.length} warnings`);
process.exit(errors.length ? 1 : 0);
