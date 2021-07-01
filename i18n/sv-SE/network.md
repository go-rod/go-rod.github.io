# Nätverk

## Begäran om kapning

Du kan använda Rod för att kapa någon HTTP eller HTTPS-trafik.

Hela processen att kapa en begäran:

```text
   webbläsare --req-> stav ---> server ---> stav --res-> webbläsare
```

När webbläsaren vill skicka en förfrågan till en server skickar den först begäran till Rod sedan Rod kommer att agera som en proxy för att skicka begäran till den faktiska servern och returnera svaret till webbläsaren. `--req->` och `--res->` är de delar som kan ändras.

Till exempel, för att ersätta en fil `test.js` svar från servern kan vi göra något så här:

```go
webbläsare := rod.New().MustConnect()

router := browser.HijackRequests()

router.MustAdd("*/test.js", func(ctx *rod.Hijack) {
    ctx.MustLoadResponse()
    ctx.Response.SetBody(`console. og("js-fil ersatt")`)
})

gå router.Run()

sida := browser.MustPage("https://test.com/")

// Hijack förfrågningar under en sida
sida.HijackRequests()
```

För mer information se [kapningstesten](https://github.com/go-rod/rod/blob/master/hijack_test.go)
