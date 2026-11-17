# RandStr

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
func RandStr(n int) string
```

Source: `rand.go`

RandStr creates a random string containg of n chars seed with
rand.Seed(time.Now().UnixNano())

