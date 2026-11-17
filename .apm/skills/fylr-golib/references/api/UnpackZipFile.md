# UnpackZipFile

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
func UnpackZipFile(targetDir string, zipData io.Reader) (err error)
```

Source: `zip.go`

UnpackZipFile reads zipData and unpacks the contents of the zip into targetDir.
targetDir must exist.

