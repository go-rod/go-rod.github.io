# Contexto de Sub-stand

Antes de entender Context, asegúrate de haber aprendido [Goroutines](https://tour.golang.org/concurrency/1) y [Canales](https://tour.golang.org/concurrency/2). El contexto se utiliza principalmente para transferir información contextual entre Goroutines, incluyendo: señal de cancelación, tiempo de espera, fecha límite, k-v, etc.

Por ejemplo, tenemos una función de larga duración `latido cardíaco` que imprime `latir` cada segundo:

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
    tick := tiempo. ick(tiempo. segundo)

    for {
        <-tick
        fmt. rintln("batido")
    }
}
```

Si queremos abortar el latido cardiaco cada vez que pulsamos la tecla Intro, podemos codificar así:

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
    tick := time. ick(tiempo. segundo)

    for {
        select {
        case <-tick:
        case <-stop:
            return
        }
        fmt. rintln("batido")
    }
}
```

Debido a que este tipo de código se utiliza con tanta frecuencia, Golang abstrajo un paquete ayudante para manejarlo, se llama [Contexto](https://golang.org/pkg/context/). Si usamos Context, el código anterior se convertirá en algo como esto:

```go
func main() {
    ctx, stop := context.WithCancel(contexto. ackground())
    go func() {
        fmt. canln()
        stop()
    }()

    heartbeat(ctx)
}

func heartbeat(ctx contexto. ontext) {
    tick := hora. ick(tiempo. segundo)

    for {
        select {
        case <-tick:
        case <-ctx. uno():
            return
        }
        fmt. rintln("batido")
    }
}
```
