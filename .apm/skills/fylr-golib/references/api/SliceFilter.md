# SliceFilter

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
func SliceFilter[T ~[]E, E any](t T, keep func(E) bool) (t2 T)
```

Source: `slices.go`

