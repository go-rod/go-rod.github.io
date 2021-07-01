# Context begrijpen

Voordat je Context begrijpt, zorg ervoor dat je [Goroutines](https://tour.golang.org/concurrency/1) en [Kanalen](https://tour.golang.org/concurrency/2) hebt geleerd. Context wordt vooral gebruikt voor het overdragen van contextinformatie tussen Goroutines, waaronder: annuleringssignaal, time-out, deadline, k-v, enz.

We hebben bijvoorbeeld een lang lopende functie `heartbeat` die elke seconde `tellen` afdrukt:

```go
pakket main

import (
    "fmt"
    "time"
)

func main() {
    heartbeat()
}

func heartbeat() {
    tick := time. ik(tijd. econd)

    voor {
        <-tick
        fmt. rintln("verslaat")
    }
}
```

Als we de hartenslag willen afbreken wanneer we op de enter-toets drukken, kunnen we als volgt coderen:

```go
func main() {
    stop := make(chan struct{})
    ga func() {
        fmt. canln()
        close(stop)
    }()

    heartbeat(stop)
}

grappige heartbeat(stop chan struct{}) {
    tick := tijd. ik(tijd. verbindt)

    voor {
        select {
        case <-tick:
        case <-stop:
            return
        }
        fmt. rintln("verslaat")
    }
}
```

Omdat dit soort code zo vaak gebruikt wordt, abstracte een helper pakket om ermee om te gaan, het heet [context](https://golang.org/pkg/context/). Als we Context gebruiken, wordt de code hierboven zoiets als dit:

```go
func main() {
    ctx, stop := context.WithCancel(context. ackground())
    ga func() {
        fmt. canln()
        stop()
    }()

    heartbeat(ctx)
}

grac heartbeat(ctx context. ontext) {
    tick := tijd. ik(tijd. econd)

    voor {
        select {
        case <-tick:
        case <-ctx. één():
            return
        }
        fmt. rintln("verslaat")
    }
}
```
