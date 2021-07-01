# Understå kontekst

Før du forstår sammenhengen, sørg for at du har lært [Goroutines](https://tour.golang.org/concurrency/1) og [kanaler](https://tour.golang.org/concurrency/2). Kontekst brukes hovedsakelig til å overføre kontekstinformasjon mellom Goroutiner, inkludert: kansellering signal, tidsfrist, tidsfrist, k-v, osv.

For eksempel har vi en langt løpende funksjon `hjerteslag` som skriver `slår` hvert andre:

```go
pakkens viktigste

import (
    "fmt"
    "time"
)

morsomme main() {
    heartbeat()
}

morsomme heartbeat() {
    tick := time. tykk(tid. econd)

    for {
        <-tick
        fmt. rintln("beat")
    }
}
```

Hvis vi vil avbryte hjerteslagene når vi trykker på nøkkelen, kan vi kode på måten:

```go
Morsomme main() {
    stop := make(chan struct{})
    go func() {
        fmt. canln()
        lukke(stopp)
    }()

    hjerte beat(stop)
}

morsomme hjerteslag (stopp chan struct{}) {
    tick := time. tykk(tid. econd)

    for {
        velg {
        tilfelle <-tick:
        tilfelle <-stopp:
            retur
        }
        fmt. rintln("beat")
    }
}
```

Fordi denne typen kode brukes er så ofte i bruk brukte Golang abstrakte hjelperepakken for å håndtere den, det kalles [Kontekst](https://golang.org/pkg/context/). Hvis vi bruker kontekst, vil koden ovenfor bli noe som dette:

```go
Morsomme main() {
    ctx, stopp := kontekst.WithCancel(kontekst. ackground())
    go func() {
        fmt. canln()
        stop()
    }()

    heartbeat(ctx)
}

morsom hjerte beatat(ctx context. ontext) {
    flått := tid. tykk(tid. econd)

    for {
        velg {
        tilfelle <-tick:
        tilfelle <-ctx. Én ():
            retur
        }
        fmt. rintln("beat")
    }
}
```
