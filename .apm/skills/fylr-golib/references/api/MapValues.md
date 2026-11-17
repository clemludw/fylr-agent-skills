# MapValues

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
func MapValues(values []string, re string) (envMap map[string]string)
```

Source: `env.go`

MapValues returns the full set of variables optionally starting with matching
regexp "re"

