# Subroute

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
func Subroute(req *http.Request) string
```

Source: `http_route.go`

Subroute returns the subroute form a Gorilla Mux Subrouter. It uses the escaped
form of the path, so a path like /files/he%2Fnk/more will keep the %2F.

