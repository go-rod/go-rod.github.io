# Forstå Kontekst

Før du forstår Kontekst, skal du sørge for at have lært [Goroutines](https://tour.golang.org/concurrency/1) og [Kanaler](https://tour.golang.org/concurrency/2). Kontekst bruges primært til at overføre kontekstoplysninger mellem Goroutines, herunder: afbestillingssignal, timeout, deadline, k-v, etc.

For eksempel har vi en lang funktion `hjerteslag` , der udskriver `beat` hvert sekund:

```go
pakke main

import (
    "fmt"
    "time"
)

func main() {
    heartbeat()
}

func heartbeat() {
    tick := tid. ick(tid. Andet)

    for {
        <- kryds
        fmt. rintln ("beat")
    }
}
```

Hvis vi ønsker at afbryde hjerteslaget, når vi trykker på indtastningsnøglen, kan vi kode på denne måde:

```go
func main() {
    stop := make(chan struct{})
    go func() {
        fmt. canln()
        close(stop)
    }()

    hjerteslag(stop)
}

func heartbeat(stop chan struct{}) {
    tick := tid. ick(tid. econd)

    for {
        vælg {
        sag <-tick:
        sag <-stop:
            returnering
        }
        fmt. rintln ("beat")
    }
}
```

Fordi denne form for kode er så ofte brugt, Golang abstraheret en hjælpepakke til at håndtere det, det kaldes [Kontekst](https://golang.org/pkg/context/). Hvis vi bruger Kontekst, vil koden ovenfor blive til noget som dette:

```go
func main() {
    ctx, stop := context.WithCancel(context. ackground())
    go func() {
        fmt. canln()
        stop()
    }()

    heartbeat(ctx)
}

func heartbeat(ctx context. ontext) {
    kryds := tid. ick(tid. Andet)

    for {
        vælg {
        case <-tick:
        case <-ctx. én():
            retur
        }
        fmt. rintln ("beat")
    }
}
```
