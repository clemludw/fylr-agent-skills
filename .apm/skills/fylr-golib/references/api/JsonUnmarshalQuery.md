# JsonUnmarshalQuery

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
func JsonUnmarshalQuery(qv url.Values, target any) (err error)
```

Source: `json.go`

JsonUnmarshalQuery unmarshals a query string into target. Only the first value
of each query key is used. The target is a struct where the json tags are used
to find the query key. The value is parsed according to the type of the target
struct field.

