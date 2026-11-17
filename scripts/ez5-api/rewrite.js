// Rewrites the ez5 reference already in the skill with the current rules of output.js
// (selection and sanitizing), without easydb5.js. Use it after changing output.js when no
// licensed bundle is at hand; generate.js produces the same result from the bundle.
//
//   node rewrite.js [referencesDir]
const fs = require("fs");
const path = require("path");
const { writeReference } = require("./output");

const dir = process.argv[2] || path.join(__dirname, "../../.apm/skills/fylr-ez5/references");
const index = fs.readFileSync(path.join(dir, "index.md"), "utf8");
const version = (index.match(/FRONTEND_VERSION` ([^\s]+?)\.?\n/) || [, "unknown"])[1];
const unlink = (s) => s.replace(/\[(`[^`]+`)\]\([^)]*\)/g, "$1");

const classes = fs.readdirSync(path.join(dir, "classes")).filter((f) => f.endsWith(".md")).map((f) => {
  const text = fs.readFileSync(path.join(dir, "classes", f), "utf8");
  const name = text.match(/^# (.+)$/m)[1].trim();
  const body = text.split("\n").slice(5).join("\n"); // heading, blank, provenance, index link, blank
  return { name, body: unlink(body) };
});

const r = writeReference({ outDir: dir, version, classes });
console.log("ez5 " + version + " (rewrite): " + r.classes + " of " + r.of + " classes -> " + dir);
