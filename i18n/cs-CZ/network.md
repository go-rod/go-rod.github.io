# Síť

## Žádosti o úklon

Můžete použít Rod k uchytí libovolného HTTP nebo HTTPS provozu.

Celý proces únosu jednoho požadavku:

```text
   browser --req-> rod ---> server ---> rod --res-> prohlížeč
```

Pokud chce prohlížeč odeslat žádost na server, nejprve zašle požadavek na mod, pak se Rod bude chovat jako proxy pro odeslání požadavku na skutečný server a vrácení odpovědi prohlížeči. The `--req->` and `--res->` are the parts that can be modified.

Například, pro nahrazení souboru `test.js` odpovědi ze serveru můžeme udělat něco podobně:

```go
prohlížeč := rod.New().MustConnect()

router := browser.HijackRequests()

router.MustAdd("*/test.js", func(ctx *rod.Hijack) {
    ctx.MustLoadResponse()
    ctx.Response.SetBody(`console. og("js file replaced")`)
})

go router.Run()

page := browser.MustPage("https://test.com/")

// Hijack požadavky v rozsahu stránky
page.HijackRequests()
```

Pro více informací se podívejte na [ústav](https://github.com/go-rod/rod/blob/master/hijack_test.go)
