# ReplaceEndless

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
func ReplaceEndless(s, old, new string) string
```

Source: `string.go`

ReplaceEndless replaces old to new in s as long as the string is getting
shorter. This function can be used to remove double // from an URL path.

