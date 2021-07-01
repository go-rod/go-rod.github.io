# Настройка WebSocket

Полезно, когда вы хотите прокси транспортный слой или настроить производительность. Здесь мы используем `github.com/gorilla/websocket` в качестве примера вы можете обернуть любую lib вам нравится.

```go
пакет основного

импорта (
    "context"
    "fmt"
    "net/http"

    "github". om/go-rod/rod"
    "github. om/go-rod/rod/lib/cdp"
    "github.com/go-rod/rod/lib/launcher"
    "github. om/gorilla/websocket"
)

func main() {
    u := launcher.New(). ustLaunch()

    // Используем пользовательские websocket lib в качестве транспортного слоя для JSON-RPC
    клиента := cdp. ew(u).Websocket(&MyWebSocket{})

    p := rod.New().Client(client). ustConnect().MustPage("http://example.com")

    fmt.Println(p.MustInfo().Title)
}

// MyWebSocket реализует cdp.WebSocketable интерфейс
var _ cdp. ebSocketable = &MyWebSocket{}

тип MyWebSocket struct {
    conn *websocket.Conn
}

func (ws *MyWebSocket) Connect(ctx context. ontext, url string, заголовок http.Header) ошибка {
    dialer := *websocket. efaultDialer
    dialer.WriteBufferSize = 2 * 1024 * 1024 // 2MB

    conn, _, err := dialer. ialContext(ctx, url, header)
    ws. onn = conn

    return err
}

func (ws *MyWebSocket) Send(b []byte) error {
    return ws. onn.WriteMessage(websocket. extMessage, b)
}

func (ws *MyWebSocket) Read() ([]byte, error) {
    _, data, err := ws. onn.ReadMessage()
    возвращаемых данных, err
}
```
