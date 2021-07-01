# Kontext verstehen

Bevor Sie Context verstehen, stellen Sie sicher, dass Sie [Goroutines](https://tour.golang.org/concurrency/1) und [Kanäle](https://tour.golang.org/concurrency/2) gelernt haben. Der Kontext wird hauptsächlich zur Übertragung von Kontextinformationen zwischen Goroutines verwendet, einschließlich: Annullierungssignal, Timeout, Fristsetzung, k-v, etc.

Zum Beispiel haben wir eine lange laufende Funktion `heart beat` die `ausdruckt` jede Sekunde:

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
    tickt := Zeit. ick(Zeit). econd)

    für {
        <-tick
        fmt. rintln("beat")
    }
}
```

Wenn wir den Herzschlag abbrechen wollen, wenn wir die Enter-Taste drücken, können wir so kodieren:

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
    tick := Zeit. ick(Zeit). econd)

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

Because this kind of code is so often used, Golang abstracted a helper package to handle it, it's called [Context](https://golang.org/pkg/context/). Wenn wir Context verwenden, wird der obige Code so etwas wie Folgendes werden:

```go
func main() {
    ctx, stop := context.WithCancel(context ackground())
    go func() {
        fmt. canln()
        stop()
    }()

    heartbeat(ctx)
}

func heartbeat(ctx context). ontext) {
    Häkchen := Zeit. ick(Zeit). econd)

    für {
        select {
        case <-tick:
        case <-ctx. one():
            return
        }
        fmt. rintln("beat")
    }
}
```
