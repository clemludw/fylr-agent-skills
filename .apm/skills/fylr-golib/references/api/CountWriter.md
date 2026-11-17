# CountWriter

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
type CountWriter struct {
	// contains filtered or unexported fields
}
```

Source: `count_writer.go`

## NewCountWriter

```go
func NewCountWriter() *CountWriter
```

Source: `count_writer.go`

## NewLimitCountWriter

```go
func NewLimitCountWriter(limit int64) *CountWriter
```

Source: `count_writer.go`

## CountWriter.Count

```go
func (cbw CountWriter) Count() int64
```

Source: `count_writer.go`

## CountWriter.Write

```go
func (cbw *CountWriter) Write(p []byte) (n int, err error)
```

Source: `count_writer.go`

