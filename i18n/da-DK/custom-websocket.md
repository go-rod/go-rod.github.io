# Tilpas WebSocket

Nyttigt, når du ønsker at proxy transport lag eller tune ydeevnen. Her bruger vi `github.com/gorilla/websocket` som eksempel, du kan pakke enhver lib du ønsker.

```go
package main

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
    u:= launcher.Ny(). ustLaunch ()

    // Brug en brugerdefineret websocket lib som transportlag for JSON-RPC
    klient := cdp. ew(u).Websocket(&MyWebSocket{})

    p := rod.New().Client(klient). ustConnect().MustPage("http://example.com")

    fmt.Println(p.MustInfo().Title)
}

// MyWebSocket implementerer cdp.WebSocketable interface
var _ cdp. ebSocketable = &MyWebSocket{}

type MyWebSocket struct {
    conn *websocket.Conn
}

func (ws *MyWebSocket) Connect(ctx context. ontext, url string, header http.Header) error {
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
    returdata, err
}
```
