# Int64Intersect

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
func Int64Intersect(a, b []int64) (aOnly, bOnly, both []int64)
```

Source: `int.go`

Int64Intersect intersects a and b. It returns three slices, 1. items only in a,
2. items only in b, 3. items in both.

