# Ymmärrä Konteksti

Ennen kuin ymmärrät Kontekstin, varmista, että olet oppinut [Goroutines](https://tour.golang.org/concurrency/1) ja [Kanavat](https://tour.golang.org/concurrency/2). Kontekstiä käytetään pääasiassa kontekstitietojen siirtämiseen Goroutiinien välillä, mukaan lukien peruutussignaali, aikakatkaisu, määräaika, k-v jne.

Meillä on esimerkiksi pitkäaikainen toiminto `sydämen syke` , joka tulostaa `voittaa` joka sekunti:

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
    tick := time. ick(aika). econd)

    for {
        <-tick
        fmt. rintln ("beat")
    }
}
```

Jos haluamme keskeyttää sydämensykkeen aina kun painamme syötölle avainta, voimme koodata näin:

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
    tick := time. ick(aika). econd)

    for {
        select {
        case <-tick:
        case <-stop:
            return
        }
        fmt. rintln ("beat")
    }
}
```

Koska tällaista koodia käytetään niin usein, Golang abstracted apupaketin käsitellä sitä, sitä kutsutaan [Konteksti](https://golang.org/pkg/context/). Jos käytämme Contextia, ylläolevasta koodista tulee jotain tällaista:

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
    rasti := aika. ick(aika). econd)

    for {
        select {
        case <-tick:
        case <-ctx. one():
            paluu
        }
        fmt. rintln ("beat")
    }
}
```
