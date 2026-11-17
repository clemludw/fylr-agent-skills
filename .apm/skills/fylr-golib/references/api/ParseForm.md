# ParseForm

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
func ParseForm(req *http.Request) error
```

Source: `http_form.go`

ParseForm works like http.Request.ParseForm but additionally adds values
received in json format to request.Form

