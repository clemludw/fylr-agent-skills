# WriterCounter

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
type WriterCounter struct {
	io.Writer
	// contains filtered or unexported fields
}
```

Source: `write_counter.go`

WriterCounter is counter for io.Writer

## NewWriterCounter

```go
func NewWriterCounter(w io.Writer) *WriterCounter
```

Source: `write_counter.go`

NewWriterCounter function create new WriterCounter

## WriterCounter.Count

```go
func (counter *WriterCounter) Count() int64
```

Source: `write_counter.go`

Count function return counted bytes

## WriterCounter.Write

```go
func (counter *WriterCounter) Write(buf []byte) (int, error)
```

Source: `write_counter.go`

