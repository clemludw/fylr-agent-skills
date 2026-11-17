# IOWriter

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
type IOWriter func([]byte) (int, error)
```

Source: `io_writer.go`

## IOWriter.Write

```go
func (iow IOWriter) Write(bts []byte) (n int, err error)
```

Source: `io_writer.go`

