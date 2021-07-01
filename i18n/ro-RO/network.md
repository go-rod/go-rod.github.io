# Rețea

## Cereri de antijack

Puteți folosi Rod pentru a deturna orice trafic HTTP sau HTTPS.

Întregul proces de deturnare a unei cereri:

```text
   browser --req-> rod ---> server ---> tir --res-> browser
```

Când browser-ul dorește să trimită o cerere către un server, acesta va trimite mai întâi solicitarea pentru sunet, apoi Rod va acționa ca un proxy pentru a trimite solicitarea către serverul actual și pentru a returna răspunsul la browser. `--req->` și `--res->` sunt părțile care pot fi modificate.

De exemplu, pentru a înlocui răspunsul `test.js` de la server, putem face ceva de genul acesta:

```go
browser := rod.New().MustConnect()

router := browser.HijackRequests()

router.MustAdd("*/test.js", func(ctx *rod.Hijack) {
    ctx.MustLoadResponse()
    ctx.Response.Setody(`console. og("js file înlocuit")`)
})

mergi router.Run()

pagina := browser.MustPage("https://test.com/")

// Hijack cereri sub acoperirea paginii
page.HijackRequests()
```

Pentru mai multe informații, verificați [testele hijack](https://github.com/go-rod/rod/blob/master/hijack_test.go)
