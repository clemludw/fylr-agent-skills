# Localization

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
type Localization struct {
	Keys map[string]LocaValue
	// contains filtered or unexported fields
}
```

Source: `localization.go`

## NewLocalization

```go
func NewLocalization() *Localization
```

Source: `localization.go`

## Localization.Get

```go
func (l Localization) Get(locaKey string, langs []language.Tag) string
```

Source: `localization.go`

## Localization.GetLocaValue

```go
func (l Localization) GetLocaValue(key string) LocaValue
```

Source: `localization.go`

## Localization.GetLocaValueWithParams

```go
func (l Localization) GetLocaValueWithParams(key string, info LocaParams) (lv LocaValue)
```

Source: `localization.go`

GetLocaValue returns the loca value with all values replaced using the passed
info.

## Localization.GetWithParams

```go
func (l Localization) GetWithParams(key string, langs []language.Tag, info LocaParams) string
```

Source: `localization.go`

## Localization.Load

```go
func (loca Localization) Load(reader io.Reader) error
```

Source: `localization.go`

## Localization.Merge

```go
func (l1 Localization) Merge(l2 *Localization)
```

Source: `localization.go`

Merge l2 into l1, existing keys are overwritten

## Localization.SetDefaultLang

```go
func (l *Localization) SetDefaultLang(lang language.Tag) error
```

Source: `localization.go`

## Localization.ToApi

```go
func (l Localization) ToApi(lang string) map[string]map[string]string
```

Source: `localization.go`

ToApi returns an api compatible loca map for the given language

