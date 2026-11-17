# HttpRedirect

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
func HttpRedirect(rw http.ResponseWriter, req *http.Request, url string, code int)
```

Source: `redirect.go`

Uses stdlib http.Redirect but sets cache header

