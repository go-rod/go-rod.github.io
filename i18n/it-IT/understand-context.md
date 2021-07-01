# Comprendere Il Contesto

Prima di comprendere il Contesto, assicurati di aver imparato [Goroutines](https://tour.golang.org/concurrency/1) e [Canali](https://tour.golang.org/concurrency/2). Il contesto è utilizzato principalmente per trasferire informazioni di contesto tra Goroutines, tra cui: segnale di cancellazione, timeout, scadenza, k-v, ecc.

Ad esempio, abbiamo una funzione di lungo periodo `battito cardiaco` che stampa `batte` ogni secondo:

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
    tick := time. ick(tempo. econd)

    for {
        <-tick
        fmt. rintln("beat")
    }
}
```

Se vogliamo interrompere il battito cardiaco ogni volta che premiamo il tasto Invio, possiamo programmare così:

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
    tick := time. ick(tempo. econd)

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

Poiché questo tipo di codice è così spesso utilizzato, Golang ha astratto un pacchetto helper per gestirlo, si chiama [Contesto](https://golang.org/pkg/context/). Se utilizziamo Context, il codice qui sopra diventerà qualcosa di simile:

```go
func main() {
    ctx, stop := context.WithCancel(context). ackground())
    go func() {
        fmt. canln()
        stop()
    }()

    heartbeat(ctx)
}

func heartbeat(ctx context. ontext) {
    tick := time. ick(tempo. econd)

    for {
        select {
        case <-tick:
        case <-ctx. uno():
            ritorno
        }
        fmt. rintln("beat")
    }
}
```
