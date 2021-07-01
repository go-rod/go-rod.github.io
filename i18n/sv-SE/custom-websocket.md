# Anpassa WebSocket

Användbart när du vill proxy transportlagret eller trimma prestandan. Här använder vi `github.com/gorilla/websocket` som exempel, du kan svepa vilken lib du vill.

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
    u := launcher.New(). ustLaunch()

    // Använd en anpassad websocket lib som transportlager för JSON-RPC
    klient := cdp. ew(u).Websocket(&MyWebSocket{})

    p := rod.New().Klient(klient). ustConnect().MustPage("http://example.com")

    fmt.Println(p.MustInfo().Titel)
}

// MyWebSocket implementerar cdp.WebSocketable interface
var _ cdp. ebSocketable = &MyWebSocket{}

type MyWebSocket struct {
    conn *websocket.Conn
}

func (ws *MyWebSocket) Connect(ctx context. ontext, urlsträng, header http.Header) fel {
    ringer := *websocket. efaultDialer
    dialer.WriteBufferSize = 2 * 1024 * 1024 // 2MB

    conn, _, err := dialer. ialContext(ctx, url, header)
    ws. onn = conn

    return err
}

func (ws *MyWebSocket) Send(b []byte) fel {
    returnera ws. onn.WriteMessage(websocket. extMessage, b)
}

func (ws *MyWebSocket) Read() ([]byte, fel) {
    _, data, err := ws. onn.ReadMessage()
    returnera data, err
}
```
