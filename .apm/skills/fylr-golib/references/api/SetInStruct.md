# SetInStruct

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
func SetInStruct(
	setMap map[string]string,
	sep string,
	eq func(string) string,
	data interface{},
) (valuesSet []string, err error)
```

Source: `env.go`

SetInStruct uses setMap to set value in passed data. The keys take the form of
PREFIX_KEY KEYs are split by sep and compared with struct members using the eq
func the passed data

