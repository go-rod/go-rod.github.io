# Entender o contexto

Antes de entender o Contexto, certifique-se de ter aprendido [Goroutines](https://tour.golang.org/concurrency/1) e [Canais](https://tour.golang.org/concurrency/2). O contexto é usado principalmente para transferir informações de contexto entre Goroutines, incluindo: sinal de cancelamento, tempo limite, prazo-limite, k-v, etc.

Por exemplo, temos uma função de longo prazo `heartbeat` que imprime `batida` a cada segundo:

```go
pacote principal

importação (
    "fmt"
    "time"
)

func main() {
    heartbeat()
}

func heartbeat() {
    tick := time. espessar(hora. econd)

    por {
        <-tick
        fmt. rintln("batida")
    }
}
```

Se quisermos abortar o pulso sempre que pressionarmos a tecla entrar, podemos programar assim:

```go
func main() {
    stop := make(chan struct{})
    go func() {
        fmt. canln()
        fecha(para)
    }()

    heartbeat(stop)
}

func heartbeat(pare chan struct{}) {
    tick := time. espessar(hora. econd)

    de {
        select {
        caso <-tick:
        caso <-stop:
            return
        }
        fmt. rintln("batida")
    }
}
```

Como esse tipo de código é tão frequentemente usado, Golang abstraiu um pacote auxiliar para lidar com ele, é chamado de [Contexto](https://golang.org/pkg/context/). Se utilizarmos Contexto, o código acima será algo como isto:

```go
func main() {
    ctx, stop := context.WithCancel(contexto. ackground())
    go func() {
        fmt. canln()
        stop()
    }()

    heartbeat(ctx)
}

func heartbeat(ctx context. ontext) {
    tick := time. espessar(hora. econd)

    for {
        select {
        case <-tick:
        case <-ctx. um():
            retornos
        }
        mt. rintln("batida")
    }
}
```
