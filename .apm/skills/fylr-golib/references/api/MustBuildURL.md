# MustBuildURL

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
func MustBuildURL(u string, qv ...string) string
```

Source: `url.go`

MustBuildURL uses "u" as basis and adds given query values Query values must be
given as key1, value1, [key2, value2[, ...]] Panics if the URL is not parsable

