# Pln

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
func Pln(s string, args ...interface{})
```

Source: `golib.go`

Pln output s + args to os.Stderr. fmt.Sprintf is used unless args are omitted.

