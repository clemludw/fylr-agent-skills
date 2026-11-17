# MimeTypeReader

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
func MimeTypeReader(input io.Reader) (mimeType string, recycled io.Reader, err error)
```

Source: `mime_type_reader.go`

MimeTypeReader returns the MIME type of input and a new reader containing the
whole data from input.

