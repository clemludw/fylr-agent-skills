# ConcurrentManager

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
func ConcurrentManager(n int) *cmT
```

Source: `concurrent_manager.go`

ConcurrentManager is used to concurrently execute a func in n workers. If n is
<= 0, the number of CPUs is used.

## cmT.CombineErrors

```go
func (cm *cmT) CombineErrors() error
```

Source: `concurrent_manager.go`

CombineErrors returs an error containing all current errors combined. If no
errors are present, it returns <nil>

## cmT.Ordered

```go
func (cm *cmT) Ordered(runId int, f OrderedFunc)
```

Source: `concurrent_manager.go`

Synced executes f under a mutex. Use this to sync state which belongs to all
workers.

## cmT.Reset

```go
func (cm *cmT) Reset()
```

Source: `concurrent_manager.go`

Reset resets the manager to the

## cmT.Run

```go
func (cm *cmT) Run(f RunFunc) (runID int)
```

Source: `concurrent_manager.go`

Run executes f. Waits for a worker to be available. This should be called in
a Go routine. Panics are caught and can be retrieved when using cm.Error().
If the manager is in error state, Run returns an error

## cmT.Synced

```go
func (cm *cmT) Synced(f SyncedFunc) error
```

Source: `concurrent_manager.go`

Synced executes f under a mutex. Use this to sync state which belongs to all
workers.

## cmT.Wait

```go
func (cm *cmT) Wait() error
```

Source: `concurrent_manager.go`

Wait waits until all workers have finished. It returns an error if any of the
func "Run" calls returned an error or panicked. In case that no errors occurred,
Wait also call all functions registered with "Ordered" in the order of "Run"
execution. If an "Ordered" function returns an error, execution stops and Wait
returns that error. "Run" cannot be called after wait has been called.

## cmT.Workers

```go
func (cm *cmT) Workers() int
```

Source: `concurrent_manager.go`

Workers returns the number of workers

