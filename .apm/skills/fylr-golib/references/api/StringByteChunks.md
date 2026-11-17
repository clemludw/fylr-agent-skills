# StringByteChunks

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
func StringByteChunks(s string, byteChunkSize int) (chunks []string)
```

Source: `string.go`

Split string s into byte chunks of a max size of chunkSize Each string returned
has a maximum length of byteChunkSize The split is UTF-8 safe. If byteChunkSize
is 0, no chunking is performed.

