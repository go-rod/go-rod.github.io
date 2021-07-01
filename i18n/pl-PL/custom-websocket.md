# Dostosuj WebSocket

Przydatne, gdy chcesz proxy warstwa transportowa lub dostrajanie wydajności. Tutaj używamy `github.com/gorilla/websocket` jako przykładu, możesz owijać wszystkie libu, które chcesz.

```go
pakiet główny

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

    // Użyj własnej libi websocket jako warstwy transportowej dla JSON-RPC
    klienta := cdp. ew(u).Websocket(&MyWebSocket{})

    p := rod.New().Client(client). ustConnect().MustPage("http://example.com")

    fmt.Println(p.MustInfo().Title)
}

// MyWebSocket imimplementuje cdp.WebSocketable interfejs
var _ cdp. ebSocketable = &MyWebSocket{}

type MyWebSocket struct {
    conn *websocket.Conn
}

func (ws *MyWebSocket) Connect(kontekst ctx. błąd ontext, ciąg URL, nagłówek http.Header) {
    dialer := *websocket. efaultDialer
    dialer.WriteBufferSize = 2 * 1024 * 1024 / 2MB

    conn, _, err := dialer. ialContext(ctx, url, header)
    ws. onn = conn

    return err
}

func (ws *MyWebSocket) Send(b []byte) błąd {
    return ws. onn.WriteMessage(websocket. extMessage, b)
}

func (ws *MyWebSocket) Read() []bajt, error) {
    _, data, err := ws. onn.ReadMessage()
    zwraca dane, err
}
```
