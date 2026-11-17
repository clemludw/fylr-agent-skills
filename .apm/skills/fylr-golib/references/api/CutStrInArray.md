# CutStrInArray

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
func CutStrInArray(arr []string, l int, suffix string) (arr2 []string)
```

Source: `string.go`

CutStrInArray cuts each string inside the given array to the given length and
adds the suffix is the string was cut. It also replaces newlines with ⏎ in the
string

