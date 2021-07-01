# Muokkaa WebSockettia

Hyödyllinen, kun haluat välittää kuljetustason tai virittää suorituskykyä. Täällä käytämme esimerkkinä `github.com/gorilla/websocket` , voit kääritä haluamasi libit.

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

    // Käytä mukautettua websocket lib kuljetuskerros JSON-RPC
    asiakas := cdp. ew(u).Websocket(&MyWebSocket{})

    p := rod.New().Client(asiakas). ustConnect().MustPage("http://example.com")

    fmt.Println(p.MustInfo().Title)
}

// MyWebSocket toteuttaa cdp.WebSocketable käyttöliittymän
var _ cdp. ebSocketable = &MyWebSocket{}

type MyWebSocket struct {
    conn *websocket.Conn
}

func (ws *MyWebSocket) Connect(ctx context. ontext, url string, header http.Header) virhe {
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
    _, data, err := ws. onn.lukuviesti()
    palautustiedot, err
}
```
