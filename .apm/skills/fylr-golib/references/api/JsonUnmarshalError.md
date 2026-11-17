# JsonUnmarshalError

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
type JsonUnmarshalError struct {
	// contains filtered or unexported fields
}
```

Source: `json_error.go`

## NewJsonUnmarshalError

```go
func NewJsonUnmarshalError(err error, sourceType, targetType, targetPropertyName string) JsonUnmarshalError
```

Source: `json_error.go`

NewJsonUnmarshalError returns a new JsonUnmarshalError The original error is
stored together with the source type and target type If no property name is
available it is given as an empty string

## JsonUnmarshalError.Error

```go
func (jue JsonUnmarshalError) Error() string
```

Source: `json_error.go`

Error returns the original error message

## JsonUnmarshalError.SourceType

```go
func (jue *JsonUnmarshalError) SourceType() string
```

Source: `json_error.go`

SourceType returns the type which could not be unmarshaled

## JsonUnmarshalError.TargetPropertyName

```go
func (jue *JsonUnmarshalError) TargetPropertyName() string
```

Source: `json_error.go`

TargetPropertyName returns the name of the property the source type could not be
unmarshaled into

## JsonUnmarshalError.TargetType

```go
func (jue *JsonUnmarshalError) TargetType() string
```

Source: `json_error.go`

TargetType returns the type the source type could not be unmarshaled into

