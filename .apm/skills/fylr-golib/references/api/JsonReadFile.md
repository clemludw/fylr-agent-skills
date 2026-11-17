# JsonReadFile

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
func JsonReadFile(fn string, v interface{}) (int64, error)
```

Source: `json.go`

Reads the given file into the given value If the filename ends in ".gz",
it is opened using the gzip library. Returns the bytes read (unzipped)

