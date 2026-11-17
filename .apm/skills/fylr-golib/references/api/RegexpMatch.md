# RegexpMatch

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
func RegexpMatch(regex string, m map[string]string) (retK, retV string)
```

Source: `regexp_match.go`

RegexpMatch uses regexp to match the first key found in m. It returns the key
and value found.

