# MatchBasicAuth

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
func MatchBasicAuth(auth string, basicAuth map[string]string) bool
```

Source: `MatchBasicAuth.go`

MatchBasicAuth checks if a request contains credentials matched in basicAuth
map. "auth" is the http request header Authorization It returns true if matched,
false otherwise. If basicAuth is empty, this check returns true.

