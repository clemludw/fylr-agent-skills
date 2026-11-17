// Generates the golib API reference of the fylr-golib skill from the golib module source.
//
// golib has no published API reference and no release tags. The version is pinned in
// golib.version (a pseudo-version). Run from this folder:
//
//	go run .              # the pinned version (reproducible)
//	go run . latest       # newest version; writes the resolved pseudo-version to golib.version
//	go run . <commit>     # a specific commit or pseudo-version; also updates golib.version
//	go run . <ver> <dir>  # write to another directory
//
// Output: <dir>/index.md (one line per exported name) and <dir>/api/<Name>.md (one file per
// exported function or type, methods and constructors included). The api/ folder is emptied first,
// so names removed from golib disappear.
package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"go/ast"
	"go/doc"
	"go/parser"
	"go/printer"
	"go/token"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

const (
	modulePath  = "github.com/programmfabrik/golib"
	versionFile = "golib.version"
)

func main() {
	pinned, err := os.ReadFile(versionFile)
	if err != nil {
		fail(fmt.Errorf("read %s (run from scripts/golib-api): %w", versionFile, err))
	}
	version := strings.TrimSpace(string(pinned))
	explicit := len(os.Args) > 1
	if explicit {
		version = os.Args[1]
	}
	outDir := "../../.apm/skills/fylr-golib/references"
	if len(os.Args) > 2 {
		outDir = os.Args[2]
	}

	dir, resolved, err := download(version)
	if err != nil {
		fail(err)
	}
	fset := token.NewFileSet()
	pkg, all, err := parsePackage(fset, dir)
	if err != nil {
		fail(err)
	}

	g := &gen{fset: fset, pkg: pkg, version: resolved, unexported: map[string]*doc.Type{}, files: map[string]*bytes.Buffer{}}
	for _, t := range all.Types {
		if !ast.IsExported(t.Name) {
			g.unexported[t.Name] = t
		}
	}
	g.write()

	apiDir := filepath.Join(outDir, "api")
	if err := os.RemoveAll(apiDir); err != nil {
		fail(err)
	}
	if err := os.MkdirAll(apiDir, 0o755); err != nil {
		fail(err)
	}
	for name, b := range g.files {
		if err := os.WriteFile(filepath.Join(apiDir, name+".md"), b.Bytes(), 0o644); err != nil {
			fail(err)
		}
	}
	if err := os.WriteFile(filepath.Join(outDir, "index.md"), g.index.Bytes(), 0o644); err != nil {
		fail(err)
	}
	if old := filepath.Join(outDir, "api.md"); fileExists(old) {
		_ = os.Remove(old)
	}
	if explicit {
		if err := os.WriteFile(versionFile, []byte(resolved+"\n"), 0o644); err != nil {
			fail(err)
		}
	}
	fmt.Printf("%s: %s, %d functions, %d types, %d files\n", outDir, resolved, len(pkg.Funcs), len(pkg.Types), len(g.files))
}

func fileExists(p string) bool {
	_, err := os.Stat(p)
	return err == nil
}

func fail(err error) {
	fmt.Fprintln(os.Stderr, err)
	os.Exit(1)
}

// download fetches the module into the module cache and returns its directory and version.
func download(version string) (dir, resolved string, err error) {
	cmd := exec.Command("go", "mod", "download", "-json", modulePath+"@"+version)
	cmd.Stderr = os.Stderr
	out, err := cmd.Output()
	if err != nil {
		return "", "", fmt.Errorf("go mod download: %w", err)
	}
	var m struct{ Dir, Version, Error string }
	if err := json.Unmarshal(out, &m); err != nil {
		return "", "", err
	}
	if m.Error != "" {
		return "", "", fmt.Errorf("go mod download: %s", m.Error)
	}
	return m.Dir, m.Version, nil
}

// parsePackage returns the exported API and, to document what exported functions return, all
// declarations.
func parsePackage(fset *token.FileSet, dir string) (pkg, all *doc.Package, err error) {
	pkgs, err := parser.ParseDir(fset, dir, func(fi os.FileInfo) bool {
		return !strings.HasSuffix(fi.Name(), "_test.go")
	}, parser.ParseComments)
	if err != nil {
		return nil, nil, err
	}
	p, ok := pkgs["golib"]
	if !ok {
		return nil, nil, fmt.Errorf("%s: no package golib", dir)
	}
	// doc.New modifies the AST, so parse once per mode
	pAll, err := parser.ParseDir(fset, dir, func(fi os.FileInfo) bool {
		return !strings.HasSuffix(fi.Name(), "_test.go")
	}, parser.ParseComments)
	if err != nil {
		return nil, nil, err
	}
	return doc.New(p, modulePath, 0), doc.New(pAll["golib"], modulePath, doc.AllDecls), nil
}

type gen struct {
	fset       *token.FileSet
	pkg        *doc.Package
	version    string
	unexported map[string]*doc.Type
	buf        *bytes.Buffer // current api/<Name>.md
	files      map[string]*bytes.Buffer
	index      bytes.Buffer
}

func (g *gen) p(format string, args ...any) {
	fmt.Fprintf(g.buf, format, args...)
}

func (g *gen) ix(format string, args ...any) {
	fmt.Fprintf(&g.index, format, args...)
}

// open starts api/<name>.md with its title and provenance line.
func (g *gen) open(name, title string) {
	g.buf = &bytes.Buffer{}
	g.files[name] = g.buf
	g.p("# %s\n\n", title)
	g.p("golib API. Generated from `%s` %s; do not edit by hand. Index: [index.md](../index.md).\n\n", modulePath, g.version)
}

// synopsis is the first sentence of a doc comment, for the index.
func (g *gen) synopsis(s string) string {
	s = strings.TrimSpace(g.pkg.Synopsis(s))
	if s == "" {
		return ""
	}
	return " — " + strings.ReplaceAll(s, "|", "\\|")
}

func (g *gen) write() {
	g.ix("# golib API index\n\n")
	g.ix("Generated from `%s` %s.\n", modulePath, g.version)
	g.ix("Regenerate with `cd scripts/golib-api && go run .` in the fylr-agents-skills repository; do not edit by hand.\n\n")
	g.ix("One package, imported as `golib`. Each exported function and type has its own file under\n")
	g.ix("`api/`; constructors and methods are in the file of their type (or of the function that\n")
	g.ix("returns an unexported type). Find a name here, then read only its file.\n\n")
	g.ix("Many doc comments are a single line: read the source (`go doc -src golib.<Name>` in the\n")
	g.ix("plugin module) before relying on a function.\n\n")

	if len(g.pkg.Consts)+len(g.pkg.Vars) > 0 {
		g.open("constants", "Constants and variables")
		for _, v := range append(g.pkg.Consts, g.pkg.Vars...) {
			g.values(v)
		}
		g.ix("- [Constants and variables](api/constants.md)\n\n")
	}

	g.ix("## Functions\n\n")
	for _, f := range g.pkg.Funcs {
		g.open(f.Name, f.Name)
		g.fn(f)
		g.returned(f)
		g.ix("- [%s](api/%s.md)%s\n", f.Name, f.Name, g.synopsis(f.Doc))
	}

	g.ix("\n## Types\n\n")
	for _, t := range g.pkg.Types {
		g.open(t.Name, t.Name)
		g.code(t.Decl)
		g.source(t.Decl)
		g.text(t.Doc)
		for _, v := range append(t.Consts, t.Vars...) {
			g.values(v)
		}
		var members []string
		for _, f := range t.Funcs {
			g.p("## %s\n\n", f.Name)
			g.fn(f)
			members = append(members, f.Name)
		}
		for _, f := range t.Methods {
			g.p("## %s.%s\n\n", t.Name, f.Name)
			g.fn(f)
			members = append(members, "."+f.Name)
		}
		line := fmt.Sprintf("- [%s](api/%s.md)%s", t.Name, t.Name, g.synopsis(t.Doc))
		if len(members) > 0 {
			line += " (" + strings.Join(members, ", ") + ")"
		}
		g.ix("%s\n", line)
	}
}

func (g *gen) fn(f *doc.Func) {
	decl := *f.Decl
	decl.Doc = nil
	decl.Body = nil
	g.code(&decl)
	g.source(f.Decl)
	g.text(f.Doc)
}

// returned documents the exported methods of unexported types that f returns; go doc hides them.
func (g *gen) returned(f *doc.Func) {
	if f.Decl.Type.Results == nil {
		return
	}
	for _, r := range f.Decl.Type.Results.List {
		typ := r.Type
		if star, ok := typ.(*ast.StarExpr); ok {
			typ = star.X
		}
		id, ok := typ.(*ast.Ident)
		if !ok {
			continue
		}
		t, ok := g.unexported[id.Name]
		if !ok {
			continue
		}
		for _, m := range t.Methods {
			if ast.IsExported(m.Name) {
				g.p("## %s.%s\n\n", t.Name, m.Name)
				g.fn(m)
			}
		}
	}
}

func (g *gen) values(v *doc.Value) {
	decl := *v.Decl
	decl.Doc = nil
	g.code(&decl)
	g.text(v.Doc)
}

func (g *gen) code(node ast.Node) {
	var b bytes.Buffer
	cfg := printer.Config{Mode: printer.UseSpaces | printer.TabIndent, Tabwidth: 4}
	if err := cfg.Fprint(&b, g.fset, node); err != nil {
		fail(err)
	}
	g.p("```go\n%s\n```\n\n", strings.TrimSpace(b.String()))
}

func (g *gen) source(node ast.Node) {
	g.p("Source: `%s`\n\n", filepath.Base(g.fset.Position(node.Pos()).Filename))
}

func (g *gen) text(s string) {
	s = strings.TrimSpace(string(g.pkg.Text(s)))
	if s != "" {
		g.p("%s\n\n", s)
	}
}
