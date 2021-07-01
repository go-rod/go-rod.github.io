# Red

## Solicitudes de Hijack

Puede usar Rod para secuestrar cualquier tráfico HTTP o HTTPS.

Todo el proceso de secuestro de una solicitud:

```text
   browser --req-> rod ---> server ---> rod --res-> navegador
```

Cuando el navegador quiere enviar una solicitud a un servidor, enviará la solicitud a Rod primero, entonces Rod actuará como un proxy para enviar la solicitud al servidor actual y devolver la respuesta al navegador. El `--req->` y `--res->` son las partes que pueden ser modificadas.

Por ejemplo, para reemplazar un archivo `test.js` respuesta desde el servidor podemos hacer algo así:

```go
browser := rod.New().MustConnect()

router := browser.HijackRequests()

router.MustAdd("*/test.js", func(ctx *rod.Hijack) {
    ctx.MustLoadResponse()
    ctx.Response.SetBody(`console. og("js file rereemplazed")`)
})

go router.Run()

page := browser.MustPage("https://test.com/")

// Hijack requests bajo el ámbito de una página
page.HijackRequests()
```

Para más información, consulta las [pruebas de secuestro](https://github.com/go-rod/rod/blob/master/hijack_test.go)
