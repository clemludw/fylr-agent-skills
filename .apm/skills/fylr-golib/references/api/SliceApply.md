# SliceApply

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
func SliceApply[T ~[]E, E any](t T, Fs ...func(E) E) (t2 T)
```

Source: `slice_apply.go`

SliceApply applies all functions Fs against all items in t and returns t2

