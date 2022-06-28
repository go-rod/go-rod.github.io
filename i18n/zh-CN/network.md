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

_ = proto.NetworkEmulateNetworkConditions{
    Offline:            false,
    Latency:            300,
    DownloadThroughput: 100,
    UploadThroughput:   50,
    ConnectionType:     proto.NetworkConnectionTypeCellular2g,
}.Call(page)
```

## 阻止某些资源的加载

如果需要，您可以使用 `Page.HijackRequest` 屏蔽某些资源 (如图片或字体) 。

如果您想要改进页面加载时间，特别是当您在无头模式下运行时，这将是非常有用。 因为加载 字体 / css 上没意义。 下面示例：

```go
func main() {
    page := rod.New().MustConnect().MustPage("")

    router := page.HijackRequests()

    router.MustAdd("*.png", func(ctx *rod.Hijack) {
        // 你可以使用很多其他 enum 类型，比如 NetworkResourceTypeScript 用于 javascript
        // 这个例子里我们使用 NetworkResourceTypeImage 来阻止图片
        if ctx.Request.Type() == proto.NetworkResourceTypeImage {
            ctx.Response.Fail(proto.NetworkErrorReasonBlockedByClient)
            return
        }
        ctx.ContinueRequest(&proto.FetchContinueRequest{})
    })

    // 因为我们只劫持特定页面，即便不使用 "*" 也不会太多性能影响
    go router.Run()

    page.MustNavigate("https://github.com/").MustWaitLoad().MustScreenshot("")
}
```
