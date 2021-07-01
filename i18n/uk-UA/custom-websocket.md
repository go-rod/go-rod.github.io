# Налаштування WebSocket

Корисно, коли ви хочете проксувати транспортний шар або налаштувати продуктивність. Тут ми використовуємо вже `github.com/gorilla/websocket` як приклад, ви можете обернути будь-яку кубу, яка вам подобається.

```go
пакет головний

імпорт (
    "context"
    "fmt"
    "net/http"

    "github. om/go-rod/rod"
    "github. om/go-rod/rod/lib/cdp"
    "github.com/go-rod/rod/lib/launcher"
    "github. om/gorilla/websocket
)

func main() {
    u := launcher.New(). ustLaunch()

    // Використовуйте власний websocket lib як транспортний шар для JSON-RPC
    клієнт := cdp. ew(u).Websocket(&MyWebSocket{})

    p := rod.New().Client(клієнт). ustConnect().MustPage("http://example.com")

    fmt.Println(p.MustInfo().Title)
}

// MyWebSocket реалізує cdp.WebSocketable UI
var _ cdp. ebSocketable = &MyWebSocket{}

тип MyWebSocket struct {
    conn *websocket.Conn
}

фунти (ws *MyWebSocket) Connect(ctx контекст. ontext, url рядка, заголовок http.Header) помилка {
    dialer := *webсокет. efaultDialer
    dialer.WriteBufferSize = 2 * 1024 * 1024 * 1024 *

    conn, _, err := dialer. ialContext(ctx, url, header)
    ws. onn = conn

    return err
}

функ (ws *MyWebSocket) Send(b []byte) помилка {
    return ws. onn.WriteMessage(webсокет. extMessage, b)
}

func (ws *MyWebSocket) Read() ([]byte, error) {
    _, data, err := ws. onn.ReadMessage()
    даних для повернення, err
}
```
