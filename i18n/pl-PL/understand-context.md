# Zrozumienie kontekstu

Przed zrozumieniem kontekstu, upewnij się, że nauczyłeś się [Goroutines](https://tour.golang.org/concurrency/1) i [Kanały](https://tour.golang.org/concurrency/2). Kontekst wykorzystywany jest głównie do przekazywania informacji kontekstowych między Goroutinami, w tym: sygnał anulowania, czas trwania, termin, k-v itp.

Na przykład mamy długotrwającą funkcję `bicie serca` , która drukuje `bicie` co sekundę:

```go
pakiet główny

import (
    "fmt"
    "time"
)

func main() {
    heartbeat()
}

func heartbeat() {
    tick := czas. ick(czas). econd)

    dla {
        <-tick
        fmt. rintln("beat")
    }
}
```

Jeśli chcemy przerwać bicie serca za każdym razem, gdy naciśniemy klawisz enter możemy kodować tak:

```go
func main() {
    stop := make(chan struct{})
    idź func() {
        fmt. canln()
        close(stop)
    }()

    heartbeat(stop)
}

func heartbeat(stop chan struct{}) {
    tick := czas. ick(czas). econd)

    dla {
        wybierz {
        case <-tick:
        case <-stop:
            return
        }
        fmt. rintln("beat")
    }
}
```

Ponieważ ten rodzaj kodu jest tak często używany, Golang abstrakował pakiet pomocniczy do obsługi tego programu, nazywa się [Kontekst](https://golang.org/pkg/context/). Jeśli używamy kontekstu, powyższy kod stanie się czymś takim:

```go
func main() {
    ctx, stop := context.WithCancel(context ackground())
    idź func() {
        fmt. canln()
        stop()
    }()

    heartbeat(ctx)
}

pogrzebowe serce (kontekst ctx). ontext) {
    tick := czas. ick(czas). econd)

    dla {
        wybierz {
        przypadek <-tick:
        przypadek <-ctx. jedny():
            return
        }
        fmt. rintln("beat")
    }
}
```
