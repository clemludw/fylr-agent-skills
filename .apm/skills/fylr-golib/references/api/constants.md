# Constants and variables

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
var APITimeFormats = []string{
	"2006-01-02T15:04:05-0700",
	time.RFC3339,
}
```

```go
var Color = aurora.NewAurora(true)
```

```go
var ExtDisplayableInBrowser = []string{"jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"}
```

List of extensions a browser can display

```go
var LimitExceeded = errors.New("Limit exceeded")
```

