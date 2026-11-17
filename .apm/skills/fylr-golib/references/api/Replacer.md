# Replacer

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
type Replacer struct {
	EmptyKeys []*regexp.Regexp // regexp to match empty key
	// contains filtered or unexported fields
}
```

Source: `replacer.go`

## Replacer.AddEmptyKeyReplacer

```go
func (rep *Replacer) AddEmptyKeyReplacer(regexps ...string)
```

Source: `replacer.go`

AddEmptyKeyReplacer adds all regexps as empty key replacers. It replaces
matching parts of the string with "" when Replace is called. The regexp are
cached in this package and never expire.

## Replacer.Debug

```go
func (rep Replacer) Debug() (ss []string)
```

Source: `replacer.go`

## Replacer.Dump

```go
func (rep Replacer) Dump()
```

Source: `replacer.go`

## Replacer.IntOrReplace

```go
func (rep *Replacer) IntOrReplace(v any) (int64, error)
```

Source: `replacer.go`

IntOrReplace replaces v if it is a string and parses it as int64. If v already
is an int, an int64 is returned. If the string (after replacements) cannot be
parsed as int64, an error is returned.

## Replacer.Repl

```go
func (rep Replacer) Repl() map[string]string
```

Source: `replacer.go`

## Replacer.Replace

```go
func (rep *Replacer) Replace(s string) string
```

Source: `replacer.go`

## Replacer.Set

```go
func (rep *Replacer) Set(key, value string)
```

Source: `replacer.go`

## Replacer.SetInt

```go
func (rep *Replacer) SetInt(key string, value int)
```

Source: `replacer.go`

## Replacer.SetInt64

```go
func (rep *Replacer) SetInt64(key string, value int64)
```

Source: `replacer.go`

