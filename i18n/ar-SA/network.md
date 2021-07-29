# الشبكة

## Cookies

The `rod.Browser` and `rod.Page` both has several helper methods for setting or getting cookies.

## Hijack requests

You can use Rod to hijack any HTTP or HTTPS traffic.

The entire process of hijacking one request:

```text
   المتصفح --req-> قضيب ---> خادم ---> قضيب --res-> المتصفح
```

When the browser wants to send a request to a server, it will send the request to Rod first, then Rod will act like a proxy to send the request to the actual server and return the response to the browser. The `--req->` and `--res->` are the parts that can be modified.

For example, to replace a file `test.js` response from the server we can do something like this:

```go
المتصفح := rod.New().MustConnect()

جهاز التوجيه := browser.Hijackrequests()

router.MustAdd("*/test.js", func(ctx *rod.Hijack) {
    ctx.MustLoadResponse()
    ctx.Response.SetBody(`console. og("ملف js تم تبديله")`)
})

اذهب إلى router.Run()

صفحة := browser.MustPage("https://test.com/")

// Hijack الطلبات تحت نطاق صفحة
page.Hijackrequests()
```

For more info check the [hijack tests](https://github.com/go-rod/rod/blob/master/hijack_test.go)
