# Verkko

## Hijack pyynnöt

Voit käyttää sauvaa kaappaamaan minkä tahansa HTTP- tai HTTPS-liikenteen.

Koko prosessi kaappaus yksi pyyntö:

```text
   selain --req-> sauva ---> palvelin ---> sauva --res-> selain
```

Kun selain haluaa lähettää pyynnön palvelimelle, se lähettää pyynnön Rod ensin, sitten Rod toimii kuten välityspalvelin, joka lähettää pyynnön varsinaiselle palvelimelle ja palauttaa vastauksen selaimeen. The `--req->` and `--res->` are the parts that can be modied.

Voit esimerkiksi korvata tiedoston `test.js` palvelimen vastauksen, voimme tehdä jotain tällaista:

```go
selain := rod.New().MustConnect()

reititin := selain.HijackRequests()

reititin.MustAdd("*/test.js", func(ctx *rod.Hijack) {
    ctx.MustLoadResponse()
    ctx.Response.SetBody(`console. og("js file replaced")`)
})

go router.Run()

page := browser.MustPage("https://test.com/")

// Hijack pyyntöjä sivun
laajuudessa.HijackRequests()
```

Lisätietoja varten tarkista [hijack testit](https://github.com/go-rod/rod/blob/master/hijack_test.go)
