# Fehler beim Umgang

In den vorhergehenden Kapiteln haben wir viele `Muss` vordefinierte Methoden wie `MustNavigate`, `MustElement`, etc. sehen. Sie alle haben nicht voreingestellte Versionen wie `Navigieren`, `Element`, etc. Der Hauptunterschied zwischen ihnen ist, wie sie mit Fehlern umgehen. Es ist nicht besonders für Rod, du findest es in der Standardbibliothek wie [regex.MustCompile](https://golang.org/pkg/regexp/#MustCompile).

Die Methoden wie `MustNavigate` und `MustElement` werden häufig im Beispielcode oder im Schnellskript verwendet. Sie sind nützlich für Jobs wie Smoke Testing, Site-Monitoring, End-to-End-Test etc. Jobs mit vielen Unsicherheiten, wie Web-Scraping, die nicht vordefinierte Version wird eine bessere Wahl.

Die Prefix-Version ist nur die nicht-prefixierte Version, die mit einem Fehlerprüfer verpackt ist. Hier ist der Quellcode des `MustElement`, wie Sie es sehen können, ruft nur das `Element` mit mehreren zusätzlichen Zeilen zur Panik auf, wenn Fehler nicht `nil` ist:

```go
func (p *Seite) MustElement(Selektoren ...string) *Element {
    el, err := p.Element(selectors...)
    if err != nil {
        panic(err)
    }
    return el
}
```

## Fehlerwert abrufen

Die zwei folgenden Code-Blöcke machen fast dasselbe in zwei Stile.

Der folgende Stil ist die Standardmethode zum Umgang mit Fehlern:

```go
Seite := rod.New().MustConnect().MustPage("https://example.com")

el, err := Seite. lement("a")
wenn err ! nil {
    handleError(err)
    return
}
html, err := el. TML()
if err != nil {
    handleError(err)
    return
}
fmt.Println(html)
```

Wir können `roten. Versuchen Sie` den Fehler von den `Muss` vorfixierte Methoden `MustElement` und `MustHTML` zu fangen. Der folgende Stil wird normalerweise in weniger Code enden, aber er kann auch zusätzliche Fehler aufzeichnen:

```go
Seite := rod.New().MustConnect().MustPage("https://example.com")

err := rod.Try(func() {
    fmt.Println(page.MustElement("a").MustHTML())
})
handleError(err)
```

## Überprüfen Sie den Fehlertyp

Wir verwenden Go's Standard-Methode, um Fehlertypen zu überprüfen, keine Magie.

Der `HandleError` im obigen Code kann aussehen:

```go
func handleError(err error) {
    var evalErr *rod.ErrEval
    if errors.Is(err, context). eadlineExceeded) { // Timeout-Fehler
        fmt.Println("timeout err")
    } Sonst, wenn Fehler. s(err, &evalErr) { // eval error
        fmt.Println(evalErr. ineNumber)
    } else if err != nil {
        fmt. rintln("cannot handle", err)
    }
}
```
