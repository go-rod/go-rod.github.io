# Přizpůsobit WebSocket

Užitečné, pokud chcete proměnit transportní vrstvu nebo vylepšit výkon. Zde jako příklad použijeme `github.com/gorilla/websocket` můžete zabalit libovolné lib, které se vám líbí.

```go
balík hlavní

import (
    "kontext"
    "fmt"
    "net/http"

    "github. om/go-rod/tyčí"
    "github. om/go-rod/rod/lib/cdp"
    "github.com/go-rod/rod/lib/launcher"
    "github. om/gorilla/websocket"
)

func main() {
    u := launcher.New(). ustLaunch()

    // Použijte vlastní websocket lib jako transportní vrstvu pro JSON-RPC
    klient := cdp. ew(u).Websocket(&MyWebSocket{})

    p := rod.New().Client(client). ustConnect().MustPage("http://example.com")

    fmt.Println(p.MustInfo().Titul)
}

// MyWebSocket implementuje cdp.WebSocketable rozhraní
var _ cdp. ebSocketable = &MyWebSocket{}

type MyWebSocket struct {
    conn *websocket.Conn
}

func (ws *MyWebSocket) Connect(ctx kontext. ontext, url string, hlavička http.Header) chyba {
    dialer := *websocket. efaultDialer
    dialer.WriteBufferSize = 2 * 1024 * 1024 // 2MB

    conn, _, err := dialer. ialContext(ctx, url, hlavička)
    ws. onn = conn

    return err
}

func (ws *MyWebSocket) Send(b []byte) chyba {
    return ws. onn.WriteMessage(websocket. extMessage, b)
}

func (ws *MyWebSocket) Read() ([]byte, error) {
    _, data, err := ws. onn.ReadMessage()
    návratových dat, chybná
}
```
