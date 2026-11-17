# Accept

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
type Accept struct {
	Type, SubType string
	Q             float64
	Params        map[string]string
}
```

Source: `accept.go`

Accept is a structure to represent a clause in an HTTP Accept Header.

## ParseAccept

```go
func ParseAccept(header string) []Accept
```

Source: `accept.go`

ParseAccept parses the given string as an Accept header as defined in
https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.1. Some rules are
only loosely applied and might not be as strict as defined in the RFC.

## Accept.Mediatype

```go
func (a Accept) Mediatype() string
```

Source: `accept.go`

