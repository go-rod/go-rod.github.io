# Network

You can use Rod to hijack any HTTP or HTTPS traffic.

The entire process of hijacking one request:

```text
   browser --req-> rod ---> server ---> rod --res-> browser
```

When the browser wants to send a request to a server, it will send the request to Rod first, then Rod will act like a proxy to send the request to the actual server and return the response to the browser. The `--req->` and `--res->` are the parts that can be modified.

For example, to replace a js file `test.js` we can do something like this:

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

For more info check the [hijack tests](https://github.com/go-rod/rod/blob/master/hijack_test.go)

[Next Chapter](/page-resources/README.md)
