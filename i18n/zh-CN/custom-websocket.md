# 自定义 WebSocket

如果你想要代理传输层或调整性能的话这会很有用。 这里我们使用 `github.com/gorilla/websocket` 作为示范，你可以包装任何喜欢的库。

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

    // 使用自定义 websocket 库作为 JSON-RPC 的传输层
    client := cdp.New(u).Websocket(&MyWebSocket{})

    p := rod.New().Client(client).MustConnect().MustPage("http://example.com")

    fmt.Println(p.MustInfo().Title)
}

// MyWebSocket 实现了 cdp.WebSocketable 接口
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

[下一章](/end-to-end-testing.md)
