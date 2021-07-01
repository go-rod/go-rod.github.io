# Personalizar o WebSocket

Útil quando você deseja proxy a camada de transporte ou ajustar o desempenho. Aqui, usamos o `github.com/gorilla/websocket` como um exemplo, você pode encapsular qualquer lib que quiser.

```go
pacote principal

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

    // Use uma biblioteca de websocket personalizada como camada de transporte para JSON-RPC
    cliente := cdp. ew(u).Websocket(&MyWebSocket{})

    p := rod.New().Cliente(Cliente). ustConnect().MustPage("http://example.com")

    fmt.Println(p.MustInfo().Title)
}

// MyWebSocket implementa a interface cdp.WebSocketable
var _ cdp. ebSocketable = &MyWebSocket{}

type MyWebSocket struct {
    conn *websocket.Conn
}

func (ws *MyWebSocket) Connect(ctx context . ontext, url string, header http.Header) error {
    dialer := *websocket. efaultDialer
    dialer.WriteBufferSize = 2 * 1024 * 1024 // 2MB

    conn, _, err := discador. ialContext(ctx, url, header)
    ws. onn = conn

    return err
}

função(ws *MyWebSocket) Send(b []byte) erro {
    return ws. onn.WriteMessage(websocket. extMessage, b)
}

função(ws *MyWebSocket) Read() ([]byte, error) {
    _, data, err := ws. onn.ReadMessage()
    dados de devolução, errr
}
```
