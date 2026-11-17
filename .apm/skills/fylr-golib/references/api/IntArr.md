# IntArr

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
type IntArr []int64
```

Source: `int_arr.go`

## IntArr.Add

```go
func (ic *IntArr) Add(i_s ...int64)
```

Source: `int_arr.go`

Add appends all given i to the Array.

## IntArr.AddUnique

```go
func (ic *IntArr) AddUnique(i_s ...int64)
```

Source: `int_arr.go`

AddUnique only adds if i is not in the Array yet

## IntArr.AvgInt64

```go
func (ia IntArr) AvgInt64() int64
```

Source: `int_arr.go`

## IntArr.Contains

```go
func (ic IntArr) Contains(i2 int64) bool
```

Source: `int_arr.go`

## IntArr.Diff

```go
func (ic1 IntArr) Diff(ic2 IntArr) IntDiffMap
```

Source: `int_arr.go`

Diff returns

	New: ints are in ic2 but not in ic1
	Same: ints are in ic1 and ic2
	Removed: ints are in ic1 but not in ic2

## IntArr.IndexOf

```go
func (ic IntArr) IndexOf(i2 int64) int
```

Source: `int_arr.go`

## IntArr.Join

```go
func (ia IntArr) Join(el string) string
```

Source: `int_arr.go`

Join returns int elements joined by "el". As a special case this returns
"<empty>" if the Array is empy.

## IntArr.Max

```go
func (ia IntArr) Max() int64
```

Source: `int_arr.go`

Max returns the biggest number in the array. 0 if the array is empty.

## IntArr.Min

```go
func (ia IntArr) Min() int64
```

Source: `int_arr.go`

Min returns the smallest number in the array. 0 if the array is empty.

## IntArr.Remove

```go
func (ic *IntArr) Remove(i_s ...int64)
```

Source: `int_arr.go`

Remove removes i_s from the array (if exist)

## IntArr.Sort

```go
func (ia IntArr) Sort() IntArr
```

Source: `int_arr.go`

## IntArr.StringArr

```go
func (ia IntArr) StringArr() []string
```

Source: `int_arr.go`

## IntArr.Sum

```go
func (ia IntArr) Sum() int64
```

Source: `int_arr.go`

