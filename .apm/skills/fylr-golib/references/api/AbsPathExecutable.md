# AbsPathExecutable

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
func AbsPathExecutable(p string) (string, error)
```

Source: `file.go`

AbsPathExecutable prefixes p with the path to the currently running executable
if p is not absolute.

