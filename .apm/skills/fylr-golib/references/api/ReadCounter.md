# ReadCounter

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
type ReadCounter struct {
	io.Reader
	// contains filtered or unexported fields
}
```

Source: `_reader_count.go`

It simply forwards the Read() call, while displaying the results from individual
calls to it.

## NewReadCounter

```go
func NewReadCounter(prefix string, reader io.Reader) *ReadCounter
```

Source: `_reader_count.go`

## ReadCounter.Read

```go
func (pt *ReadCounter) Read(p []byte) (int, error)
```

Source: `_reader_count.go`

Read 'overrides' the underlying io.Reader's Read method. This is the one that
will be called by io.Copy(). We simply use it to keep track of byte counts and
then forward the call.

