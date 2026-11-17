# StringMatcher

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
type StringMatcher map[string]bool
```

Source: `string_matcher.go`

## StringMatcher.Append

```go
func (sm *StringMatcher) Append(ss ...string)
```

Source: `string_matcher.go`

## StringMatcher.Match

```go
func (sm StringMatcher) Match(s string) bool
```

Source: `string_matcher.go`

## StringMatcher.SortedKeys

```go
func (sm StringMatcher) SortedKeys() (sorted []string)
```

Source: `string_matcher.go`

