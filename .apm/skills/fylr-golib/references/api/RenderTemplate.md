# RenderTemplate

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
func RenderTemplate(in []byte, funcMap template.FuncMap, data interface{}) (out []byte, err error)
```

Source: `template.go`

RenderTemplate takes bytes and executes it and returns the rendered bytes

