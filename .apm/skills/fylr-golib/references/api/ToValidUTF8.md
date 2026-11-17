# ToValidUTF8

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
func ToValidUTF8(s string, replacement rune) string
```

Source: `string.go`

ToValidUTF8 checks and converts a string to valid UTF-8, replacing invalid
characters. It iterates over the string, and for each rune that is identified as
invalid (RuneError), it replaces it with the specified 'replacement' rune.

