# Understand Context

Before understanding Context, make sure you have learned [Goroutines](https://tour.golang.org/concurrency/1) and [Channels](https://tour.golang.org/concurrency/2). Context is mainly used to transfer context information between Goroutines, including: cancellation signal, timeout, deadline, k-v, etc.

For example, we have a long-running function `heartbeat` that prints `beat` every second:

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    heartbeat()
}

func heartbeat() {
    tick := time.Tick(time.Second)

    for {
        <-tick
        fmt.Println("beat")
    }
}
```

If we want to abort the heartbeat whenever we press the enter key, we may code like this:

```go
func main() {
    stop := make(chan struct{})
    go func() {
        fmt.Scanln()
        close(stop)
    }()

    heartbeat(stop)
}

func heartbeat(stop chan struct{}) {
    tick := time.Tick(time.Second)

    for {
        select {
        case <-tick:
        case <-stop:
            return
        }
        fmt.Println("beat")
    }
}
```

Because this kind of code is so often used, Golang abstracted a helper package to handle it, it's called [Context](https://golang.org/pkg/context/). If we use Context, the code above will become something like this:

```go
func main() {
    ctx, stop := context.WithCancel(context.Background())
    go func() {
        fmt.Scanln()
        stop()
    }()

    heartbeat(ctx)
}

func heartbeat(ctx context.Context) {
    tick := time.Tick(time.Second)

    for {
        select {
        case <-tick:
        case <-ctx.Done():
            return
        }
        fmt.Println("beat")
    }
}
```