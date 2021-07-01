# Rede

## Solicitações de hijack

Você pode usar o Rod para sequestrar qualquer tráfego HTTP ou HTTPS.

Todo o processo de sequestro de uma solicitação:

```text
   navegador --req-> rod ---> servidor ---> rod --res-> navegador
```

Quando o navegador quiser enviar uma solicitação para um servidor, ele irá enviar a solicitação para Rod primeiro, então Rod atuará como um proxy para enviar a solicitação para o servidor real e retornar a resposta para o navegador. O `--req->` e `--res->` são as partes que podem ser modificadas.

Por exemplo, para substituir um arquivo `test.js` resposta do servidor, podemos fazer algo assim:

```go
browser := rod.New().MustConnect()

router := browser.HijackRequests()

router.MustAdd("*/test.js", func(ctx *rod.Hijack) {
    ctx.MustLoadResponse()
    ctx.Response.SetBody(`console. og("arquivo js substituído")`)
})

acesse o roteador.Run()

página: = browser.MustPage("https://test.com/")

// Hijack pedidos sob o escopo de uma página
page.HijackRequests()
```

Para mais informações verifique os testes de sequestro [](https://github.com/go-rod/rod/blob/master/hijack_test.go)
