# Int64Unique

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
type Int64Unique struct {
	Ids []int64
	// contains filtered or unexported fields
}
```

Source: `int_unique.go`

## NewInt64Unique

```go
func NewInt64Unique() *Int64Unique
```

Source: `int_unique.go`

## Int64Unique.Add

```go
func (m *Int64Unique) Add(ids ...int64)
```

Source: `int_unique.go`

## Int64Unique.Contains

```go
func (m *Int64Unique) Contains(id int64) bool
```

Source: `int_unique.go`

## Int64Unique.Count

```go
func (m *Int64Unique) Count() int
```

Source: `int_unique.go`

## Int64Unique.MarshalJSON

```go
func (m *Int64Unique) MarshalJSON() ([]byte, error)
```

Source: `int_unique.go`

## Int64Unique.Remove

```go
func (m *Int64Unique) Remove(ids ...int64) (n int)
```

Source: `int_unique.go`

