# Rete

## Richieste di dirottamento

È possibile utilizzare Rod per dirottare qualsiasi traffico HTTP o HTTPS.

L'intero processo di dirottamento di una richiesta:

```text
   browser --req-> rod ---> server ---> rod --res-> browser
```

Quando il browser vuole inviare una richiesta a un server, invierà la richiesta a Rod prima, quindi Rod agirà come un proxy per inviare la richiesta al server effettivo e restituire la risposta al browser. Le parti `--req->` e `--res->` sono le parti che possono essere modificate.

Ad esempio, per sostituire un file `test.js` risposta dal server possiamo fare qualcosa come questo:

```go
browser := rod.New().MustConnect()

router := browser.HijackRequests()

router.MustAdd("*/test.js", func(ctx *rod.Hijack) {
    ctx.MustLoadResponse()
    ctx.Response.SetBody(`console. og("js file replaced")`)
})

go router.Run()

page := browser.MustPage("https://test.com/")

// Richieste di Hijack nell'ambito di una pagina
page.HijackRequests()
```

Per ulteriori informazioni controlla i [test di dirottamento](https://github.com/go-rod/rod/blob/master/hijack_test.go)
