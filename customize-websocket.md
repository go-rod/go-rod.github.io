# Customize the WebSocket

Useful when you want to proxy the transport layer or tune the performance.
Here we use the `github.com/gorilla/websocket` as an example, you can wrap any lib you like.

```go
package main

import (
	"context"
	"fmt"
	"net/http"

	"github.com/go-rod/rod"
	"github.com/go-rod/rod/lib/cdp"
	"github.com/go-rod/rod/lib/launcher"
	"github.com/gorilla/websocket"
)

func main() {
	u := launcher.New().MustLaunch()

	// Use a custom websocket lib as the transport layer for JSON-RPC
	client := cdp.New(u).Websocket(&MyWebSocket{})

	p := rod.New().Client(client).MustConnect().MustPage("http://example.com")

	fmt.Println(p.MustInfo().Title)
}

// MyWebSocket implements the cdp.WebSocketable interface
var _ cdp.WebSocketable = &MyWebSocket{}

type MyWebSocket struct {
	conn *websocket.Conn
}

func (ws *MyWebSocket) Connect(ctx context.Context, url string, header http.Header) error {
	dialer := *websocket.DefaultDialer
	dialer.WriteBufferSize = 2 * 1024 * 1024 // 2MB

	conn, _, err := dialer.DialContext(ctx, url, header)
	ws.conn = conn

	return err
}

func (ws *MyWebSocket) Send(b []byte) error {
	return ws.conn.WriteMessage(websocket.TextMessage, b)
}

func (ws *MyWebSocket) Read() ([]byte, error) {
	_, data, err := ws.conn.ReadMessage()
	return data, err
}
```

[Next Chapter](/css-selector.md)
