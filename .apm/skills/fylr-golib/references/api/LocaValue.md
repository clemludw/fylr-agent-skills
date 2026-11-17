# LocaValue

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
type LocaValue map[string]string
```

Source: `loca_value.go`

## LocaValue.Best

```go
func (lv LocaValue) Best(prefLangs ...language.Tag) string
```

Source: `loca_value.go`

First returns first set lang, set in langs

## LocaValue.Copy

```go
func (lv LocaValue) Copy() LocaValue
```

Source: `loca_value.go`

## LocaValue.Fill

```go
func (lv LocaValue) Fill(prefLangs ...language.Tag) (lv2 LocaValue)
```

Source: `loca_value.go`

Fill returns the LocaValue with all languages filled out If a value is missing,
"Best" is used to fill it

## LocaValue.MarshalXML

```go
func (lv LocaValue) MarshalXML(enc *xml.Encoder, start xml.StartElement) error
```

Source: `loca_value.go`

## LocaValue.Scan

```go
func (lv *LocaValue) Scan(v interface{}) error
```

Source: `loca_value.go`

## LocaValue.TrimSpace

```go
func (lv LocaValue) TrimSpace() (lv2 LocaValue)
```

Source: `loca_value.go`

Trim removes all whitespace from set values and remove empty values entirely

## LocaValue.Value

```go
func (lv LocaValue) Value() (driver.Value, error)
```

Source: `loca_value.go`

