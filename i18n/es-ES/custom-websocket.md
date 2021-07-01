# Personalizar el WebSocket

Útil cuando desea reemplazar la capa de transporte o ajustar el rendimiento. Aquí usamos el `github.com/gorilla/websocket` como ejemplo, puedes envolver cualquier librería que te guste.

```go
paquete principal

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

    // Usar una librería websocket personalizada como la capa de transporte para JSON-RPC
    cliente := cdp. ew(u).Websocket(&MyWebSocket{})

    p := rod.New().Client(client). ustConnect().MustPage("http://example.com")

    fmt.Println(p.MustInfo().Title)
}

// MyWebSocket implementa la interfaz cdp.WebSocketable
var _ cdp. ebSocketable = &MyWebSocket{}

type MyWebSocket struct {
    conn *websocket.Conn
}

func (ws *MyWebSocket) Connect(ctx contexto. ontext, url string, header http.Header) error {
    dialer := *websocket. efaultDialer
    dialer.WriteBufferSize = 2 * 1024 * 1024 // 2MB

    conn, _, err := dialer. ialContext(ctx, url, cabeza)
    ws. onn = conn

    return err
}

func (ws *MyWebSocket) Enviar(b []byte) error {
    return ws. onn.WriteMessage(websocket. extMessage, b)
}

func (ws *MyWebSocket) Read() ([]byte, error) {
    _, data, err := ws. onn.ReadMessage()
    return data, err
}
```
