# PadStr

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
func PadStr(s string, padWidth int) string
```

Source: `string.go`

PadStr returns string s filled to a length of padWidth. If s is longer than pw
string will be cut to the length. If padWidth <= 0 s will be returned unchanged.
The counting of characters is rune based. So "Ä" counts as one.

