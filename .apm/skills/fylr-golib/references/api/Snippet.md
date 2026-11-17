# Snippet

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
func Snippet(bts []byte, lineNo, plusMinus int) (snipped []byte)
```

Source: `snippet.go`

Snippet returns lines from lineNo-plusMinus to lineNo+plusMinus, prefixed with
the line number

