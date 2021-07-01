# WebSocket anpassen

Nützlich, wenn Sie die Transport-Ebene proxy oder die Performance anpassen möchten. Hier verwenden wir den `github.com/gorilla/websocket` als Beispiel, du kannst jede lib verpacken, die dir gefällt.

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

    // Benutzen Sie eine benutzerdefinierte Websocket-Bibliothek als Transport-Layer für JSON-RPC
    client := cdp. ew(u).Websocket(&MyWebSocket{})

    p := rod.New().Client(client). ustConnect().MustPage("http://example.com")

    fmt.Println(p.MustInfo().Title)
}

// MyWebSocket implementiert die cdp.WebSocketable Schnittstelle
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
    Rückgabedaten, Fehler
}
```
