# Förstå kontext

Innan du förstår kontext, se till att du har lärt dig [Goroutines](https://tour.golang.org/concurrency/1) och [Kanaler](https://tour.golang.org/concurrency/2). Sammanhanget används främst för att överföra kontextinformation mellan Goroutines, inklusive: avbeställningssignal, timeout, deadline, k-v, etc.

Till exempel har vi en långvarig funktion `hjärtslag` som skriver ut `slå` varje sekund:

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
    tick := time. ick(tid. ekond)

    för {
        <-tick
        fmt. rintln("beat")
    }
}
```

Om vi vill avbryta hjärtslag när vi trycker på enter nyckel, kan vi koda så här:

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
    tick := tid. ick(tid. econd)

    för {
        välj {
        fall <-tick:
        fall <-stop:
            returnera
        }
        fmt. rintln("beat")
    }
}
```

Eftersom den här typen av kod så ofta används abstraherade Golang ett hjälppaket för att hantera den, kallas det [Context](https://golang.org/pkg/context/). Om vi använder Context, kommer koden ovan att bli något så här:

```go
func main() {
    ctx, stop := context.WithCancel(context. ackground())
    go func() {
        fmt. canln()
        stop()
    }()

    hjärtslag(ctx)
}

func hjärtslag(ctx kontext. ontext) {
    tick := tid. ick(tid. econd)

    för {
        välj {
        fall <-tick:
        fall <-ctx. one():
            returnera
        }
        fmt. rintln("beat")
    }
}
```
