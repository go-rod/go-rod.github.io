# 网络

## Cookies

The `rod.Browser` and `rod.Page` both has several helper methods for setting or getting cookies.

## Hijack requests

You can use Rod to hijack any HTTP or HTTPS traffic.

The entire process of hijacking one request:

```text
   浏览器 --请求-> rod ---> 服务器 ---> rod --响应-> 浏览器
```

When the browser wants to send a request to a server, it will send the request to Rod first, then Rod will act like a proxy to send the request to the actual server and return the response to the browser. The `--req->` and `--res->` are the parts that can be modified.

For example, to replace a file `test.js` response from the server we can do something like this:

```go
browser := rod.New().MustConnect()

router := browser.HijackRequests()

router.MustAdd("*/test.js", func(ctx *rod.Hijack) {
    ctx.MustLoadResponse()
    ctx.Response.SetBody(`console.log("js file replaced")`)
})

go router.Run()

page := browser.MustPage("https://test.com/")

// 仅劫持某个页面的请求
page.HijackRequests()
```

For more info check the [hijack tests](https://github.com/go-rod/rod/blob/master/hijack_test.go)
