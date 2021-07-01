# تخصيص WebSocket

مفيد عندما تريد البروكسي طبقة النقل أو ضبط الأداء. هنا نستخدم `github.com/gorilla/websocket` كمثال، يمكنك أن تلف أي كوب تحب.

```go
استيراد الحزمة الرئيسية

(
    "سياق"
    "fmt"
    "net/http"

    "github. om/go-drod/ard"
    "github. om/go-rod/rod/lib/cdp"
    "github.com/go-rod/rod/lib/launcher"
    "github. om/gorilla/websocket"
)

func main() {
    u := launcher.New. ustLaunch()

    // استخدم كلمة ويب مخصصة كطبقة نقل لـ JSON-RPC
    العميل := cdp. ew(u).Websocket(&MyWebSocket{})

    p:= rod.New().Client(العميل). ustConnect().MustPage("http://example.com")

    fmt.Println(p.MustInfo().Title)
}

// MyWebSocket يستخدم واجهة cdp.WebSocketable
var _ cdp. ebSocketable = &MyWebSocket{}

من نوع MyWebSocket struct {
    conn *websocket.Conn
}

func (ws *MyWebSocket) Connect(سياق tx). على النص، سلسلة عنوان url، خطأ في الترويسة http.header)
    الاتصال := *websocket. faultDialer
    اتصال هاتفي.WriteBufferSsize = 2 * 1024 * 1024 /2MB

    conn, _, err := الاتصال الهاتفي. ialContext(ctx, url, header)
    w. onn = conn

    Reerr
}

func (ws *MyWebSocket) Send(b []byte) error
    Rew. onn.WriteMessage(websocket. تمديد الرسالة, b)
}

مربع (ws *MyWebSocket) قراءة () ([]byte, error) {
    _, data , err := ws. onn.ReadMessage()
    Redata، err
}
```
