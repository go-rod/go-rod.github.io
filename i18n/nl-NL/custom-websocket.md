# Pas de WebSocket aan

Handig wanneer u de transportlaag wilt proxiteren of de prestaties wilt afstemmen. Hier gebruiken we de `github.com/gorilla/websocket` als een voorbeeld, je kunt elke lib die je maar wilt omgeven.

```go
Pakket hoofd

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

    // Gebruik een aangepaste websocket lib als transportlaag voor JSON-RPC
    client := cdp. ew(u).Websocket(&MyWebSocket{})

    p := rod.New().Client(client). ustConnect().MustPage("http://example.com")

    fmt.Println(p.MustInfo().Title)
}

// MyWebSocket implementeert de cdp.WebSocketable interface
var _ cdp. ebSocketable = &MyWebSocket{}

type MyWebSocket struct {
    conn *websocket.Conn
}

func (ws *MyWebSocket) Connect(ctx context. ontext, url string, header http.Header) fout {
    dialer := *websocket. efaultDialer
    dialer.WriteBufferSize = 2 * 1024 * 1024 // 2MB

    conn, _, err := dialer. ialContext(ctx, url, header)
    ws. onn = conn

    return err
}

func (ws *MyWebSocket) Send(b []byte) fout {
    return ws. onn.WriteMessage(websocket. extMessage, b)
}

func (ws *MyWebSocket) Read() ([]byte, error) {
    _, data, err := ws. onn.ReadMessage()
    retourneert gegevens, err
}
```
