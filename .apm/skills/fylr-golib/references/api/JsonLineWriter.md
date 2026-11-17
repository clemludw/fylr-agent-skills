# JsonLineWriter

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
type JsonLineWriter struct {
	// contains filtered or unexported fields
}
```

Source: `line_writer.go`

JsonLineWriter implements io.Writer and send the data to an Encoder whenever a
newline is written After each newline a "," is send to the underlying Writer

## NewJsonLineWriter

```go
func NewJsonLineWriter(w io.Writer, enc *json.Encoder) *JsonLineWriter
```

Source: `line_writer.go`

NewLineWriter encodes each newline as JSON followed by a ","

## JsonLineWriter.Flush

```go
func (lw JsonLineWriter) Flush() (err error)
```

Source: `line_writer.go`

## JsonLineWriter.Write

```go
func (lw JsonLineWriter) Write(data []byte) (n int, err error)
```

Source: `line_writer.go`

