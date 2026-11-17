# SortStrNumeric

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
func SortStrNumeric(lang language.Tag, s string) string
```

Source: `string.go`

SortStrNumeric works like SortStr with collate.Numeric set, using a cached
collator. collate.New is expensive, so the collators are pooled per language.

