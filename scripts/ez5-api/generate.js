// Generates the ez5 API reference of the fylr-ez5 skill from the fylr web frontend bundle.
//
// The bundle is not part of this repository (license). Pass a local copy or the URL of a local
// fylr instance:
//
//   cd scripts/ez5-api && npm ci
//   node generate.js http://localhost/web/js/easydb5.js
//   node generate.js ../../easydb5.js [outDir]
//
// Output (see output.js): references/index.md and references/classes/<Class>.md, limited to the
// classes and members listed in public.json and without validation code. The hand-written
// references/extension-points.md and globals.md are not touched; check them after regenerating.
//
// The bundle is compiled, minified CoffeeScript: class and method names survive, argument names
// do not. Classes are found by the CoffeeScript class pattern
// `Name = function(sup) { function Name() {...} ...; return extend(Name, sup), ..., Name }(Sup)`.
const fs = require("fs");
const path = require("path");
const acorn = require("acorn");
const walk = require("acorn-walk");

const input = process.argv[2];
const outDir = process.argv[3] || path.join(__dirname, "../../.apm/skills/fylr-ez5/references");
const { writeReference } = require("./output");
if (!input) {
  console.error("usage: node generate.js <easydb5.js path or URL> [outDir]");
  process.exit(1);
}

async function readInput() {
  if (!/^https?:\/\//.test(input)) return fs.readFileSync(input, "utf8");
  const res = await fetch(input);
  if (!res.ok) throw new Error(input + ": HTTP " + res.status);
  return res.text();
}

readInput().then((src) => {
const ast = acorn.parse(src, { ecmaVersion: "latest" });
const text = (n) => src.slice(n.start, n.end);
const short = (n, max = 160) => {
  // same text for the minified and the beautified bundle
  const s = text(n).replace(/\s+/g, " ").replace(/ ?([{}()[\],;:=<>!|&+?]) ?/g, "$1").replace(/\b(return|typeof|case|in|of) (["'])/g, "$1$2");
  return s.length > max ? s.slice(0, max) + "…" : s;
};
const memberName = (n) =>
  n.type === "Identifier" ? n.name :
  n.type === "MemberExpression" && !n.computed ? (memberName(n.object) ? memberName(n.object) + "." + n.property.name : null) :
  n.type === "ThisExpression" ? "this" : null;

// a CoffeeScript class body: function(sup){ function Name(){} ... return ..., Name }
function classInfo(fn) {
  if (!fn || (fn.type !== "FunctionExpression") || fn.body.body.length === 0) return null;
  const decl = fn.body.body.find((s) => s.type === "FunctionDeclaration");
  if (!decl) return null;
  const ret = fn.body.body[fn.body.body.length - 1];
  if (ret.type !== "ReturnStatement" || !ret.argument) return null;
  const last = ret.argument.type === "SequenceExpression" ? ret.argument.expressions.at(-1) : ret.argument;
  if (last.type !== "Identifier" || last.name !== decl.id.name) return null;
  return { decl, ret };
}

const classes = [];

function collectAssignments(node, cb) {
  // flatten sequence expressions of assignments
  if (!node) return;
  if (node.type === "SequenceExpression") return node.expressions.forEach((e) => collectAssignments(e, cb));
  if (node.type === "AssignmentExpression") return cb(node);
}

function analyzeClass(target, call, fn, info) {
  const name = info.decl.id.name;
  const cls = {
    name: target,
    extends: call.arguments[0] ? memberName(call.arguments[0]) || short(call.arguments[0], 60) : null,
    methods: [],
    statics: [],
    opts: [],
  };
  if (!cls.extends) {
    walk.simple(info.ret, {
      CallExpression(c) {
        if (!cls.extends && c.callee.type === "Identifier" && c.arguments.length === 2 &&
            c.arguments[0].type === "Identifier" && c.arguments[0].name === name)
          cls.extends = memberName(c.arguments[1]);
      },
    });
  }
  const seen = new Set();
  const handle = (a) => {
    const l = memberName(a.left);
    if (!l) return;
    const r = a.right;
    let m;
    if ((m = l.match(new RegExp("^" + name.replace(/\$/g, "\\$") + "\\.prototype\\.(.+)$")))) {
      if (seen.has("p" + m[1])) return;
      seen.add("p" + m[1]);
      cls.methods.push({
        name: m[1],
        arity: r.type === "FunctionExpression" ? r.params.length : null,
        value: r.type === "FunctionExpression" ? null : short(r, 80),
        ...(r.type === "FunctionExpression" ? describeFn(r) : {}),
      });
      if (m[1] === "initOpts" && r.type === "FunctionExpression") cls.opts.push(...extractOpts(r));
    } else if ((m = l.match(new RegExp("^" + name.replace(/\$/g, "\\$") + "\\.(?!__super__)([^.]+)$")))) {
      if (seen.has("s" + m[1])) return;
      seen.add("s" + m[1]);
      cls.statics.push({
        name: m[1],
        arity: r.type === "FunctionExpression" ? r.params.length : null,
        value: r.type === "FunctionExpression" ? null : short(r, 100),
        ...(r.type === "FunctionExpression" ? describeFn(r) : {}),
      });
    }
  };
  for (const s of fn.body.body) {
    if (s.type === "ExpressionStatement") collectAssignments(s.expression, handle);
    if (s.type === "ReturnStatement" && s.argument) collectAssignments(s.argument, handle);
  }
  classes.push(cls);
}

const literal = (n) => {
  const t = text(n);
  return ({ "!0": "true", "!1": "false", "void 0": "undefined" })[t] ?? t;
};
const NOT_OPTS = new Set(["length", "replace", "split", "match", "indexOf", "push", "slice", "substr",
  "substring", "toLowerCase", "toUpperCase", "trim", "join", "map", "forEach", "filter", "startsWith", "endsWith"]);
const PROMISE_RE = /\.promise\(\)$|^CUI\.(resolvedPromise|rejectedPromise|when|whenAll|decide)\(|^ez5\.(api\.[a-z_]+|server)\(/;

// visit the function's own statements, not nested functions
function ownNodes(fn, visit) {
  (function rec(n) {
    if (!n || typeof n.type !== "string") return;
    visit(n);
    for (const k in n) {
      const v = n[k];
      if (Array.isArray(v)) v.forEach((x) => x && typeof x.type === "string" && !/Function/.test(x.type) && rec(x));
      else if (v && typeof v.type === "string" && !/Function/.test(v.type)) rec(v);
    }
  })(fn.body);
}

function describeFn(fn) {
  const d = {};
  const body = fn.body.body;
  if (body.length === 0) d.hook = true;
  const first = body[0];
  if (first && first.type === "ExpressionStatement" && /^CUI\.util\.assert\(!1,/.test(text(first.expression))) d.abstract = true;
  if (first && first.type === "ThrowStatement") d.abstract = true;
  if (body.length === 1 && /(unimplemented|needs to be implemented)/.test(text(body[0]))) d.abstract = true;
  if (body.length === 1 && body[0].type === "ReturnStatement" && body[0].argument) {
    const a = body[0].argument;
    if (a.type === "Literal" || (a.type === "UnaryExpression" && a.argument.type === "Literal") ||
        (a.type === "ArrayExpression" && a.elements.length === 0) || (a.type === "ObjectExpression" && a.properties.length === 0))
      d.returns = literal(a);
  }
  ownNodes(fn, (n) => {
    if (n.type !== "ReturnStatement" || !n.argument) return;
    const last = n.argument.type === "SequenceExpression" ? n.argument.expressions.at(-1) : n.argument;
    const t = text(last);
    if (PROMISE_RE.test(t) || (last.type === "CallExpression" && /\.promise$/.test(text(last.callee)))) d.promise = true;
  });
  // keys read from the first argument (p.key, p["key"], or a destructuring pattern)
  const p0 = fn.params[0];
  const keys = new Set();
  if (p0 && p0.type === "ObjectPattern") for (const q of p0.properties) q.key && keys.add(q.key.name || q.key.value);
  if (p0 && p0.type === "Identifier")
    walk.simple(fn.body, {
      MemberExpression(m) {
        if (m.object.type !== "Identifier" || m.object.name !== p0.name) return;
        if (!m.computed) keys.add(m.property.name);
        else if (m.property.type === "Literal" && typeof m.property.value === "string") keys.add(m.property.value);
      },
    });
  // members of strings and arrays mean the argument is not an options object
  if (![...keys].some((k) => NOT_OPTS.has(k)) && keys.size) d.reads = [...keys];
  // named options of the first argument
  walk.simple(fn, {
    CallExpression(c) {
      if (d.args || memberName(c.callee) !== "CUI.Element.readOpts") return;
      const o = c.arguments[2];
      if (!o || o.type !== "ObjectExpression") return;
      d.args = o.properties.filter((p) => p.type === "Property").map((p) => {
        const r = { name: p.key.name || p.key.value };
        if (p.value.type === "ObjectExpression")
          for (const q of p.value.properties) {
            const k = q.key && (q.key.name || q.key.value);
            if (k === "mandatory") r.mandatory = literal(q.value) === "true";
            if (k === "check") r.check = short(q.value, 60);
            if (k === "default") r.default = literal(q.value).length <= 8 ? literal(q.value) : short(q.value, 40);
          }
        return r;
      });
    },
  });
  return d;
}

function extractOpts(fn) {
  const out = [];
  walk.simple(fn, {
    CallExpression(c) {
      const cal = memberName(c.callee);
      if (!cal || !/\.addOpts$/.test(cal)) return;
      const o = c.arguments[0];
      if (!o || o.type !== "ObjectExpression") return;
      for (const p of o.properties) {
        if (p.type !== "Property") continue;
        const key = p.key.name || p.key.value;
        const d = { name: key };
        if (p.value.type === "ObjectExpression") {
          for (const q of p.value.properties) {
            const k = q.key && (q.key.name || q.key.value);
            if (k === "mandatory") d.mandatory = text(q.value) === "!0" || text(q.value) === "true";
            else if (k === "default") d.default = literal(q.value).length <= 8 ? literal(q.value) : short(q.value, 60);
            else if (k === "check") d.check = short(q.value, 120);
            else if (k === "deprecated") d.deprecated = short(q.value, 80);
          }
        }
        out.push(d);
      }
    },
  });
  return out;
}

walk.full(ast, (node) => {
  let call, target;
  if (node.type === "AssignmentExpression") { call = node.right; target = memberName(node.left); }
  else if (node.type === "VariableDeclarator") { call = node.init; target = node.id.name; }
  else return;
  if (!call || call.type !== "CallExpression" || !target) return;
  const fn = call.callee;
  const info = classInfo(fn);
  if (!info) return;
  analyzeClass(target, call, fn, info);
});

// dedupe classes by name (first wins) and drop local helpers with lowercase single-letter names
const unique = new Map();
for (const c of classes) if (!unique.has(c.name) && c.name.length > 1) unique.set(c.name, c);
const versionMatch = src.match(/FRONTEND_VERSION\s*=\s*"([^"]+)"/);
const api = { version: versionMatch ? versionMatch[1] : "unknown", classes: [...unique.values()] };
const version = api.version || "unknown";

const isPrivate = (n) => n.startsWith("_");
const fmtArgs = (args) =>
  "{" + args.map((a) => a.name + (a.mandatory ? "!" : "") + (a.check ? ": " + a.check.replace(/\|/g, "\\|") : "")).join(", ") + "}";

function fmtMethod(m, wrappers) {
  const args = m.args || wrappers.get(m.name);
  let s = "`" + m.name + "(" + (args ? "opts" : m.arity ? m.arity : "") + ")`";
  if (m.arity == null) s = "`" + m.name + "` = `" + m.value.replace(/`/g, "'") + "`";
  const notes = [];
  if (args) notes.push("opts " + fmtArgs(args));
  else if (m.arity > 1) notes.push(m.arity + " args");
  if (!args && m.reads) notes.push("reads " + m.reads.map((k) => "`" + k + "`").join(", ") + " of the first argument");
  if (m.hook) notes.push("hook, empty default");
  if (m.abstract) notes.push("abstract");
  if (m.returns !== undefined) notes.push("returns `" + m.returns + "`");
  if (m.promise) notes.push("Promise");
  return "- " + s + (notes.length ? " — " + notes.join("; ") : "");
}

function renderClass(c) {
  const out = [];
  out.push("## " + c.name, "");
  const meta = ["extends `" + (c.extends || "—") + "`"];
  out.push(meta.join(" · "), "");
  if (c.opts.length) {
    out.push("Options (`initOpts`, `!` = mandatory):", "");
    for (const o of c.opts) {
      const bits = [];
      if (o.check) bits.push("check `" + o.check.replace(/`/g, "'") + "`");
      if (o.default) bits.push("default `" + o.default.replace(/`/g, "'") + "`");
      if (o.deprecated) bits.push("deprecated");
      out.push("- `" + o.name + "`" + (o.mandatory ? "!" : "") + (bits.length ? " — " + bits.join("; ") : ""));
    }
    out.push("");
  }
  // __foo wrappers validate the arguments of the public foo
  const wrappers = new Map();
  for (const m of c.methods) if (isPrivate(m.name) && m.args) wrappers.set(m.name.replace(/^_+/, ""), m.args);
  const pub = c.methods.filter((m) => !isPrivate(m.name));
  if (pub.length) {
    out.push("Methods:", "");
    for (const m of pub) out.push(fmtMethod(m, wrappers));
    out.push("");
  }
  const st = c.statics.filter((m) => !isPrivate(m.name));
  if (st.length) {
    out.push("Static:", "");
    for (const m of st) out.push(fmtMethod(m, new Map()));
    out.push("");
  }
  return out.join("\n");
}

const classSections = api.classes.map((c) => ({ name: c.name, body: renderClass(c).replace(/^## .*\n/, "") }));
writeReference({ outDir, version, classes: classSections });
console.log("ez5 " + api.version + ": " + api.classes.length + " classes parsed -> " + outDir);
});
