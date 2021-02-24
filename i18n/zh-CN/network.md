# 网络

你可以使用 Rod 劫持任何 HTTP 或 HTTPS 流量。

劫持一个请求的全过程：

```text
   浏览器 --请求-> rod ---> 服务器 ---> rod --响应-> 浏览器
```

当浏览器想要向服务器发送请求时，它会先把请求发给 Rod，然后 Rod 作为代理，把请求发送给实际的服务器，并把响应返回给浏览器。 `--请求->` 和 `--响应->` 是可以修改的部分。

例如，我们可以这样替换 js 文件 `test.js`：

```go
browser := rod.New().MustConnect()

router := browser.HijackRequests()

router.MustAdd("https://test.com/test.js", func(ctx *rod.Hijack) {
    ctx.MustLoadResponse()
    ctx.Response.SetBody(`console.log("js replaced")`)
})

go router.Run()

browser.MustPage("https://test.com/")
```

更多信息，见[劫持相关的单元测试](https://github.com/go-rod/rod/blob/master/hijack_test.go)

[下一章](/page-resources/README.md)
