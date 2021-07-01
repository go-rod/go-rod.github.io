# Pochopit kontext

Před porozuměním kontextu, ujistěte se, že jste se naučili [Goroutines](https://tour.golang.org/concurrency/1) a [kanály](https://tour.golang.org/concurrency/2). Kontext se používá zejména k přenosu kontextových informací mezi Goroutiny, včetně signálu o zrušení, časového limitu, termínu, k-v, atd.

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
    tick := time. ick(čas). sekunda)

    pro {
        <-tick
        fmt. rintln("beat")
    }
}
```

Pokud chceme přerušit srdce, kdykoliv stiskneme klávesu enter klíč, můžeme kódovat takhle:

```go
func main() {
    stop := make(chan struct{})
    go func() {
        fmt. canln()
        close(stop)
    }()

    heartbeat(stop)
}

func heartbeat(stop chan struct{}) {
    tick := time. ick(čas). sekund

    for {
        select {
        case <-tick:
        case <-stop:
            return
        }
        fmt. rintln("beat")
    }
}
```

Protože je tento druh kódu tak často používán, Golang abstragoval pomocný balíček, je nazýván [Kontext](https://golang.org/pkg/context/). Pokud použijeme kontext, výše uvedený kód se stane něčím podobným:

```go
func main() {
    ctx, stop := context.WithCancel(kontext. ackground())
    go func() {
        fmt. canln()
        stop()
    }()

    heartbeat(ctx)
}

zábavné srdce (ctx kontext. ontext) {
    tick := time. ick(čas). sekund

    for {
        select {
        case <-tick:
        case <-ctx. jede():
            návrat
        }
        fmt. rintln("beat")
    }
}
```
