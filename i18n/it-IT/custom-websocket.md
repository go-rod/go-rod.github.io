# Personalizza il WebSocket

Utile quando si desidera proxy del livello di trasporto o sintonizzare le prestazioni. Qui usiamo il `github.com/gorilla/websocket` come esempio, puoi avvolgere qualsiasi lib che vuoi.

```go
pacchetto main

import (
    "context"
    "fmt"
    "net/http"

    "github. om/go-rod/rod"
    "github. om/go-rod/rod/lib/cdp"
    "github.com/go-rod/rod/lib/launcher"
    "github. om/gorilla/websocket"
)

func main() {
    u := launcher.New(). ustLaunch()

    // Usa un lib di websocket personalizzato come livello di trasporto per JSON-RPC
    client := cdp. ew(u).Websocket(&MyWebSocket{})

    p := rod.New().Client(client). ustConnect().MustPage("http://example.com")

    fmt.Println(p.MustInfo().Title)
}

// MyWebSocket implementa l'interfaccia cdp.WebSocketable
var _ cdp. ebSocketable = &MyWebSocket{}

type MyWebSocket struct {
    conn *websocket.Conn
}

func (ws *MyWebSocket) Connect(ctx context). ontext, url string, header http.Header) error {
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
    dati restituiti, err
}
```
