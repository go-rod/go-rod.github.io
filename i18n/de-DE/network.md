# Netzwerk

## Hijack Anfragen

Sie können Rod benutzen, um jeden HTTP- oder HTTPS-Verkehr zu entführen.

Der gesamte Prozess der Entführung einer Anfrage:

```text
   browser --req-> rod ---> server ---> rod --res-> Browser
```

When the browser wants to send a request to a server, it will send the request to Rod first, then Rod will act like a proxy to send the request to the actual server and return the response to the browser. Die `--req->` und `--res->` sind die Teile, die geändert werden können.

Zum Beispiel, um eine Datei `test.js` Antwort vom Server zu ersetzen, können wir so etwas tun:

```go
browser := rod.New().MustConnect()

router := browser.HijackRequests()

router.MustAdd("*/test.js", func(ctx *rod.Hijack) {
    ctx.MustLoadResponse()
    ctx.Response.SetBody(`console. og("js Datei ersetzt")`)
})

router.Run()

Seite := browser.MustPage("https://test.com/")

// Hijack Anfragen im Rahmen einer Seite
page.HijackRequests()
```

Weitere Informationen findest du in den [Hijack Tests](https://github.com/go-rod/rod/blob/master/hijack_test.go)
