# DecryptAES

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
func DecryptAES(cryptedText, secretKey string) (text string, err error)
```

Source: `crypt_aes.go`

DecryptAES takes a base64 encoded cryptedText and decrypt it to text using
provided secretKey. The secretKey must be exactly 32 bytes long. cryptedText is
base64 encoded.

