# Languages

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
type Languages []Language
```

Source: `lang.go`

## NewLanguages

```go
func NewLanguages(tags []language.Tag) Languages
```

Source: `lang.go`

## Languages.Contains

```go
func (lgs Languages) Contains(lang string) bool
```

Source: `lang.go`

## Languages.Strings

```go
func (lgs Languages) Strings() []string
```

Source: `lang.go`

## Languages.Tags

```go
func (lgs Languages) Tags() []language.Tag
```

Source: `lang.go`

