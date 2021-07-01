# Netværk

## Hijack anmodninger

Du kan bruge Rod til at kapre enhver HTTP eller HTTPS-trafik.

Hele processen med kapring en anmodning:

```text
   browser --req-> stang ---> server ---> stang --res-> browser
```

Når browseren ønsker at sende en anmodning til en server, vil det sende anmodningen til Rod først, så vil Rod handle som en proxy til at sende anmodningen til den faktiske server og returnere svaret til browseren. Den `--req->` og `--res->` er de dele, der kan ændres.

For eksempel for at erstatte en fil `test.js` svar fra serveren kan vi gøre noget som dette:

```go
browser := rod.New().MustConnect()

router := browser.HijackRequests()

router.MustAdd("*/test.js", func(ctx *rod.Hijack) {
    ctx.MustLoadResponse()
    ctx.Response.SetBody(`console. og("js file replaced")`)
})

go router.Run()

page := browser.MustPage("https://test.com/")

// Hijack requests under the scope of a page
page.HijackRequests()
```

For mere information, tjek de [kapre tests](https://github.com/go-rod/rod/blob/master/hijack_test.go)
