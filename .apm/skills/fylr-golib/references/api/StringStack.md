# StringStack

golib API. Generated from `github.com/programmfabrik/golib` v0.0.0-20261019120101-f1ce64360afa; do not edit by hand. Index: [index.md](../index.md).

```go
type StringStack []string
```

Source: `StringStack.go`

## StringStack.IsEmpty

```go
func (s StringStack) IsEmpty() bool
```

Source: `StringStack.go`

IsEmpty: check if stack is empty

## StringStack.Peek

```go
func (s *StringStack) Peek() string
```

Source: `StringStack.go`

Return the last element of the stack without removing it

## StringStack.Pop

```go
func (s *StringStack) Pop() string
```

Source: `StringStack.go`

Remove and return top element of stack. Return false if stack is empty.

## StringStack.Push

```go
func (s *StringStack) Push(str string)
```

Source: `StringStack.go`

Push a new value onto the stack

