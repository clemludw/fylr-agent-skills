# PackZipFile

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
func PackZipFile(sourceDir, topLevelDir string, writeTo io.Writer) (err error)
```

Source: `zip.go`

PackZipFile packs all files from sourceDir as ZIP to writeTo. We pack all
filenames using /. On Windows, the \ in paths is replaced by /

