# Προσαρμογή WebSocket

Χρήσιμο όταν θέλετε να proxy το στρώμα μεταφοράς ή να ρυθμίσετε την απόδοση. Εδώ χρησιμοποιούμε το `github.com/gorilla/websocket` ως παράδειγμα, μπορείτε να τυλίξετε όποια lib θέλετε.

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

    // Χρησιμοποιήστε ένα προσαρμοσμένο websocket lib ως στρώμα μεταφοράς για JSON-RPC
    client := cdp. ew(u).Websocket(&MyWebSocket{})

    p := rod.New().Client(client). ustConnect().MustPage ("http://example.com")

    fmt.Println(p.MustInfo().Title)
}

// Το MyWebSocket υλοποιεί το cdp.WebSocketable interface
var _ cdp. ebSocketable = &MyWebSocket{}

τύπος MyWebSocket struct {
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
    _, δεδομένα, err := ws. onn.ReadMessage()
    return data, err
}
```
