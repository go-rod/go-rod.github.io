# Personalizează WebSocket

Util atunci când doriţi să înlocuiţi nivelul de transport sau să reglaţi performanţa. Aici folosim `github.com/gorilla/websocket` ca exemplu, poți îngloba orice lib vrei.

```go
import main

(
    "context"
    "fmt"
    "net/http"

    "github. om/go-rod/rod"
    "github. om/go-rod/rod/lib/cdp"
    "github.com/go-rod/rod/lib/launcher"
    "github. om/gorilla/websocket"
)

func main() {
    u := launcher.New().

    // Folosește un lib websocket personalizat ca strat de transport pentru clientul JSON-RPC
    := cdp. ew(u).Websocket(&MyWebSocket{})

    p := rod.New().Client(client). ustConnect().MustPage("http://example.com")

    fmt.Println(p.MustInfo().Title)
}

// MyWebSocket implementează interfața cdp.WebSocketable
var _ cdp. ebSocketable = &MyWebSocket{}

tip MyWebSocket struct {
    conn *websocket.Conn
}

func (ws *MyWebSocket) Connect(ctx context. eroarea ontext, şirul url, header http.Header) {
    dialer := *websocket. efaultDialer
    dialer.WriteBufferSize = 2 * 1024 * 1024 // 2MB

    conn, _, err := dialer. ialContext(ctx, url, header)
    ws. onn = conn

    return err
}

func (ws *MyWebSocket) Send(b []byte) error {
    return ws. onn.ScrieMessage(websocket. extMessage, b)
}

func (ws *MyWebSocket) Read() ([]byte, eroare) {
    _, data, err := ws. onn.ReadMessage()
    date de returnare, err
}
```
