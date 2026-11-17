# MapKeys

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
func MapKeys[M ~map[K]V, K comparable, V any](src M) (keys []K)
```

Source: `map.go`

Keys returns all map keys

