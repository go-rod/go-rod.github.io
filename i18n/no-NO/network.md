# Nettverk

## Forespørsler om hierarkisk

Du kan bruke Rod til å skjule hvilken som helst HTTP eller HTTPS trafikk.

Hele prosessen med å fjerne én forespørsel:

```text
   nettleser --req-> rod ---> server ---> rod --res-> nettleser
```

Når nettleseren ønsker å sende en forespørsel til en server, vil den sende forespørselen til Rod først, deretter vil Rod oppføre seg som en proxy for å sende forespørselen til den faktiske serveren og returnere svaret til nettleseren. `--req->` og `--s ->` er delene som kan endres.

For eksempel for å erstatte en fil `test.js` svar fra serveren kan vi gjøre noe slik:

```go
nettleser := rod.New().MustConnect()

router := browser.HijackRequests()

router.MustAdd("*/test.js", funksjoner (ctx *rod.Hijack) {
    ctx.MustLoadResponse()
    ctx.Response.SetBody(`konsoll. og(«js fil erstattet»)
})

gå router.Run()

side := browser.MustPage("https://test.com/")

// Hijack forespørsler under omfanget for en side
page.HijackRequests()
```

For mer informasjon, sjekk [hijack-tester](https://github.com/go-rod/rod/blob/master/hijack_test.go)
