# Netwerk

## Hijack verzoeken

U kunt Rod gebruiken om HTTP of HTTPS verkeer te kapen.

Het hele proces van het kapen van een verzoek:

```text
   browser --req-> rod ---> server ---> rod --res-> browser
```

Wanneer de browser een verzoek naar een server wil sturen, stuurt het het verzoek eerst naar Rod. dan gedraagt Rod zich als een proxy om de aanvraag naar de werkelijke server te sturen en het antwoord terug te sturen naar de browser. De `--req->` and `--res->` zijn de onderdelen die kunnen worden gewijzigd.

Bijvoorbeeld, om een bestand `test.js` van de server te vervangen, kunnen we zoiets doen:

```go
browser := rod.New().MustConnect()

router := browser.HijackRequests()

router.MustAdd("*/test.js", func(ctx *rod.Hijack) {
    ctx.MustLoadResponse()
    ctx.Response.SetBody(`console. og("js file replaced")`)
})

go router.Run()

page := browser.MustPage("https://test.com/")

// Hijack requests onder het bereik van een pagina
page.HijackRequests()
```

Voor meer info bekijk de [kapack tests](https://github.com/go-rod/rod/blob/master/hijack_test.go)
