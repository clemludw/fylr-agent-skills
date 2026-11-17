# SanitizeBaseName

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
func SanitizeBaseName(fileName string) string
```

Source: `filename.go`

SanitizeBaseName mirrors the Java one-liner: • trims to 255 runes • keeps bad
chars by swapping them for '_' (underscore)

