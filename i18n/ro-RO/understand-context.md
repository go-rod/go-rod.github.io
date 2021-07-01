# Înțelege contextul

Înainte de a înțelege contextul, asigură-te că ai învățat [Goroutine](https://tour.golang.org/concurrency/1) și [Canale](https://tour.golang.org/concurrency/2). Contextul este utilizat în principal pentru a transfera informații contextuale între Goroutines, inclusiv: semnal de anulare, termen-limită, k-v etc.

De exemplu, avem o funcţie `bătăi cardiace pe termen lung` care printează `bate` în fiecare secundă:

```go
main

import (
    "fmt"
    "time"
)

func main() {
    heartbeat()
}

func heartbeat() {
    tick := time. ick(ora). al doilea)

    pentru {
        <-tick
        fmt. rintln("beat")
    }
}
```

Dacă vrem să abandonăm bătăile inimii ori de câte ori apăsăm tasta de introducere, putem programa astfel:

```go
func main() {
    stop := make(chan struct{})
    go func() {
        fmt. canln()
        close(stop)
    }()

    ritm cardiac (stop)
}

bătăi func ale inimii (stop chan struct{}) {
    tick := time. ick(ora). al doilea)

    pentru {
        select {
        case <-tick:
        case <-stop:
            return
        }
        fmt. rintln("beat")
    }
}
```

Deoarece acest tip de cod este folosit atât de des, Golang a abstractizat un pachet de ajutor pentru a-l gestiona, se numește [Context](https://golang.org/pkg/context/). Dacă folosim contextul, codul de mai sus va deveni ceva de genul:

```go
func main() {
    ctx, stop := context.WithCancel(context. ackground())
    mergi func() {
        fmt. canln()
        opri()
    }()

    bătăi cardiace (ctx)
}

bătăi func (ctx context. ontext) {
    tick := time. ick(ora). al doilea)

    pentru {
        select {
        case <-tick:
        case <-ctx. una():
            return
        }
        fmt. rintln("beat")
    }
}
```
