# Tilpass WebSocket

Nyttig når du vil proxy transportlaget eller finjustere trekket. Her bruker vi `github.com/gorilla/websocket` som et eksempel, du kan pakke inn hvilket som helst lib du liker.

```go
pakkens viktigste

import (
    "kontekst"
    "fmt"
    "net/http"

    "github. om/go-gnager/gnager"
    "github. om/go-rod/rod/lib/cdp"
    "github.com/go-rod/rod/lib/launcher"
    "github. om/gorilla/websocket"
)

morsomme main() {
    u := launcher.New(). ustLaunch()

    // Bruk et egendefinert websocket lib som transportlaget for JSON-RPC
    klienten := cdp. ew(u).Websocket(&MyWebSocket{})

    p := rod.New().Client(client). ustConnect().MustPage("http://example.com")

    fmt.Println(p.MustInfo().Title)
}

// MyWebSocket implementerer cdp.WebSocketable interface
var _ cdp. ebocketable = &MyWebSocket{}

type MyWebSocket struct {
    conn *websocket.Conn
}

morsomme (ws *MyWebSocket) Connect(ctx context. ontext, url streng, tast http.Header) feil {
    dialer := *websocket. FraultDialer
    dialer.WriteBufferSize = 2 * 1024 * 1024 // 2MB

    conn, _, err := dialer. ialkontekst(ctx, nettadresse, hode)
    ws. onn = conn

    return err
}

moro (ws *MyWebSocket) Send(b []byte) feil {
    retur ws. onn.WriteMessage(websocket. extMessage, b)
}

morsomme (ws *MyWebSocket) Read() ([]byte, error) {
    _data, err := ws. onn.ReadMessage()
    return data, err
}
```
