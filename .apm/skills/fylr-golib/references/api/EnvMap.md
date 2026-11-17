# EnvMap

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
type EnvMap map[string]string
```

Source: `env.go`

## GetEnv

```go
func GetEnv(re string) EnvMap
```

Source: `env.go`

GetEnv returns the os environment. Skips values not matching the prefix regexp
re.

## EnvMap.Env

```go
func (em EnvMap) Env() (env []string)
```

Source: `env.go`

Env reassembles EnvMap to Env

