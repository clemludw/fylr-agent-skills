# DebugValues

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
func DebugValues[T cmp.Ordered](list []T, length int) string
```

Source: `string.go`

DebugValues takes a slice of T and returns and ordered list each item
rendered in a comma separated list. If the list is longer than length bytes,
the rest of the slice is omitted and the output ends in ... With length <= 0,
the whole slice is rendered

