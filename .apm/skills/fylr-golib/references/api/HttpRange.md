# HttpRange

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
type HttpRange struct {
	Start, Length int64
}
```

Source: `range_header.go`

HttpRange specifies the byte range to be sent to the client.

## ParseRange

```go
func ParseRange(s string, size int64) ([]HttpRange, error)
```

Source: `range_header.go`

parseRange parses a Range header string as per RFC 7233. errNoOverlap is
returned if none of the ranges overlap.

## HttpRange.ContentRange

```go
func (r HttpRange) ContentRange(size int64) string
```

Source: `range_header.go`

## HttpRange.MimeHeader

```go
func (r HttpRange) MimeHeader(contentType string, size int64) textproto.MIMEHeader
```

Source: `range_header.go`

