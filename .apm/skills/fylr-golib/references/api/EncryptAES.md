# EncryptAES

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
func EncryptAES(text, secretKey string) (cryptedText string, err error)
```

Source: `crypt_aes.go`

EncryptAES encrypts text to cryptedText using the secretKey. The secretKey must
be exactly 32 bytes long. cryptedText is base64 encoded.

