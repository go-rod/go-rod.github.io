# Розуміння контексту

Перед розумінням контексту переконайтеся, що ви дізналися [Goroutines](https://tour.golang.org/concurrency/1) та [каналів](https://tour.golang.org/concurrency/2). Контекст в основному використовується для передачі інформації про контекст між Goroutins, в тому числі: скасування сигналу, тайм-аут, термін, k v, і т. д.

Наприклад, у нас є довга функція `heartbeat` , яка друкує `удар` кожні секунди:

```go
пакет головний

імпорт (
    "fmt"
    "time"
)

func main() {
    heartbeat()
}

func heartbeat() {
    tick := time. кік(час. econd)

    для {
        <-tick
        fmt. rintln("beat")
    }
}
```

Якщо ми хочемо відступити від серцебиття, коли ми натискаємо клавішу входу, ми можемо запрограмувати наступним чином:

```go
func main() {
    stop := make(chan struct{})
    go func() {
        fmt.Scanln()
        close(stop)
    }()

    heartbeat(stop)
}

func heartbeat(stop chan struct{}) {
    tick := time.Tick(time.Second)

    for {
        select {
        case <-tick:
        case <-stop:
            return
        }
        fmt.Println("beat")
    }
}
```

Адже такий код часто використовується, Голанг абстрагував допоміжний пакет, щоб обробляти його, він називається [контекст](https://golang.org/pkg/context/). Якщо ми використовуємо контекст, то наведений вище код стане чимось на зразок цього:

```go
func main() {
    ctx, stop := context.WithCancel(context. ackground())
    йти func() {
        fmt. canln()
        stop()
    }()

    heartbeat(ctx)
}

веселе серцебиття (ctx контекст. ontext) {
    tick := time. кік(час. econd)

    для {
        вибрати {
        випадок <-tick:
        регістр <-ctx. один):
            повертає
        }
        фут. rintln("beat")
    }
}
```
