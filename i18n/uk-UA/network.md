# Мережа

## Cookies

The `rod.Browser` and `rod.Page` both has several helper methods for setting or getting cookies.

## Hijack requests

You can use Rod to hijack any HTTP or HTTPS traffic.

The entire process of hijacking one request:

```text
   браузер --req-> жорстка ---> сервер ---> rod --res-> браузер
```

When the browser wants to send a request to a server, it will send the request to Rod first, then Rod will act like a proxy to send the request to the actual server and return the response to the browser. The `--req->` and `--res->` are the parts that can be modified.

For example, to replace a file `test.js` response from the server we can do something like this:

```go
Браузер := rod.New().MustConnect()

маршрутизатор := browser.HijackRequests()

router.MustAdd("*/test.js", func(ctx *rod.Hijack) {
    ctx.MustLoadResponse()
    ctx.Response.Response.SetBody(`console. og("js файл замінено")`)
})

go router.Run()

сторінка := browser.MustPage("https://test.com/")

// Hijack запитів під областю сторінки
page.HijackRequests()
```

For more info check the [hijack tests](https://github.com/go-rod/rod/blob/master/hijack_test.go)

## Throttling

You can throttle the network to simulate and test the slow network effect on your tests:

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
