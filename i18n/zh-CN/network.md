# 网络

## Cookies

`rod.Browser` and `rod.Page` 都有几种帮助方法来设置或获取 cookie。

## 劫持请求

你可以使用 Rod 劫持任何 HTTP 或 HTTPS 流量。

劫持一个请求的全过程：

```text
   浏览器 --请求-> rod ---> 服务器 ---> rod --响应-> 浏览器
```

当浏览器想要向服务器发送请求时，它会先把请求发给 Rod，然后 Rod 作为代理，把请求发送给实际的服务器，并把响应返回给浏览器。 `--请求->` 和 `--响应->` 是可以篡改的部分。

例如，我们可以这样替换对文件 `test.js` 的请求的返回：

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

更多信息，见[劫持相关的单元测试](https://github.com/go-rod/rod/blob/master/hijack_test.go)

## 节流

您可以通过节流网络来模拟和测试慢网络：

```go
    page.EnableDomain(proto.NetworkEnable{})

    proto.NetworkEmulateNetworkConditions{
        Offline:            false,
        Latency:            300,
        DownloadThroughput: 100,
        UploadThroughput:   50,
        ConnectionType:     proto.NetworkConnectionTypeCellular2g,
    }.Call(page)
```
