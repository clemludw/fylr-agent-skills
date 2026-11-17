#!/usr/bin/env node
// Link check for everything under .apm/.
// - docs.fylr.io links must be listed in https://docs.fylr.io/llms.txt
// - other http(s) links must be reachable
// - relative links and anchors are resolved against the source file and checked locally
// Usage: node scripts/check/check-links.mjs [--offline] [repoRoot]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const offline = args.includes("--offline");
const root = path.resolve(args.find((a) => !a.startsWith("--")) || path.join(path.dirname(fileURLToPath(import.meta.url)), "../.."));
const apm = path.join(root, ".apm");
const errors = [];
const err = (f, line, m) => errors.push(`${path.relative(root, f)}:${line}: ${m}`);

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else if (e.name.endsWith(".md")) out.push(p);
  }
  return out;
}

// GitHub-style heading slugs.
function slugs(file) {
  const seen = new Map();
  const out = new Set();
  let fence = false;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    if (/^(```|~~~)/.test(line)) fence = !fence;
    if (fence) continue;
    const m = line.match(/^#{1,6}\s+(.*?)\s*#*\s*$/);
    if (!m) continue;
    let s = m[1].replace(/`/g, "").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").toLowerCase().trim()
      .replace(/[^\p{L}\p{N}\s_-]/gu, "").replace(/\s/g, "-");
    const n = seen.get(s) || 0;
    seen.set(s, n + 1);
    out.add(n ? `${s}-${n}` : s);
  }
  return out;
}
const slugCache = new Map();
const slugOf = (f) => (slugCache.has(f) ? slugCache.get(f) : (slugCache.set(f, slugs(f)), slugCache.get(f)));

function links(file) {
  const res = [];
  let fence = false;
  fs.readFileSync(file, "utf8").split("\n").forEach((line, i) => {
    if (/^\s*(```|~~~)/.test(line)) fence = !fence;
    if (fence) return;
    const noCode = line.replace(/`[^`]*`/g, "");
    for (const m of noCode.matchAll(/\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) res.push({ url: m[1], line: i + 1 });
    for (const m of noCode.matchAll(/<(https?:\/\/[^>\s]+)>/g)) res.push({ url: m[1], line: i + 1 });
    // Bare URLs outside markdown links and autolinks.
    const rest = noCode.replace(/\]\([^)]*\)/g, "]").replace(/<https?:\/\/[^>\s]+>/g, "");
    for (const m of rest.matchAll(/https?:\/\/[^\s<>()\[\]`"']+/g)) res.push({ url: m[0].replace(/[.,;:!?]+$/, ""), line: i + 1 });
  });
  return res;
}

const normDocs = (u) => {
  const x = new URL(u);
  let p = x.pathname.replace(/\/$/, "").replace(/\.md$/, "");
  if (p === "" || p === "/readme") p = "/";
  return `${x.host}${p}`;
};

const http = new Map(); // url -> [{file,line}]
const docs = [];
const files = fs.existsSync(apm) ? walk(apm) : [];
for (const f of files) {
  for (const { url, line } of links(f)) {
    if (/^mailto:/.test(url)) continue;
    if (/^https?:\/\//.test(url)) {
      if (new URL(url).host === "docs.fylr.io") docs.push({ url, f, line });
      else {
        const key = url.split("#")[0];
        if (!http.has(key)) http.set(key, []);
        http.get(key).push({ f, line });
      }
      continue;
    }
    if (/^[a-z]+:/i.test(url)) { err(f, line, `unsupported link scheme: ${url}`); continue; }
    // Relative link or pure anchor.
    const [rel, anchor] = url.split("#");
    const target = rel ? path.resolve(path.dirname(f), decodeURIComponent(rel)) : f;
    if (!target.startsWith(apm + path.sep) && target !== apm) { err(f, line, `relative link leaves .apm/: ${url}`); continue; }
    if (!fs.existsSync(target)) { err(f, line, `missing file: ${url}`); continue; }
    if (anchor && target.endsWith(".md") && !slugOf(target).has(anchor.toLowerCase())) err(f, line, `missing anchor #${anchor} in ${path.relative(root, target)}`);
  }
}

async function fetchRetry(url, method, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { method, redirect: "follow", headers: { "user-agent": "fylr-agents-skills-link-check" }, signal: AbortSignal.timeout(20000) });
      if (r.status !== 429 && r.status < 500) return r.status;
    } catch { /* retry */ }
    await new Promise((s) => setTimeout(s, 1000 * (i + 1)));
  }
  return 0;
}

if (!offline) {
  const r = await fetch("https://docs.fylr.io/llms.txt");
  if (!r.ok) errors.push(`llms.txt not reachable (${r.status})`);
  else {
    const index = new Set([...(await r.text()).matchAll(/\((https:\/\/docs\.fylr\.io[^)\s]*)\)/g)].map((m) => normDocs(m[1])));
    for (const { url, f, line } of docs) {
      if (normDocs(url) === "docs.fylr.io/llms.txt") continue; // the index itself
      if (!index.has(normDocs(url))) err(f, line, `not in llms.txt: ${url}`);
    }
  }
  const queue = [...http.keys()];
  await Promise.all(Array.from({ length: 6 }, async () => {
    while (queue.length) {
      const url = queue.shift();
      let s = await fetchRetry(url, "HEAD");
      if (s === 0 || s >= 400) s = await fetchRetry(url, "GET");
      if (s === 0 || s >= 400) for (const { f, line } of http.get(url)) err(f, line, `unreachable (${s || "network error"}): ${url}`);
    }
  }));
}

for (const e of errors) console.log(`ERROR ${e}`);
console.log(`check-links: ${files.length} files, ${docs.length} docs links, ${http.size} other URLs${offline ? " (offline: not fetched)" : ""}, ${errors.length} errors`);
process.exit(errors.length ? 1 : 0);
