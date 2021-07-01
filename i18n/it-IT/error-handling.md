# Gestione Degli Errori

Nei capitoli precedenti, abbiamo visto molti metodi `Must` prefissi come `MustNavigate`, `MustElement`, ecc. Tutti hanno versioni non prefisse come `Naviga`, `Elemento`, ecc. La differenza principale tra loro è come gestiscono gli errori. Non è speciale per Rod, puoi trovarlo nella libreria standard come [regex.MustCompile](https://golang.org/pkg/regexp/#MustCompile).

I metodi come `MustNavigate` e `MustElement` sono comunemente usati nel codice di esempio o nello script rapido. Sono utili per lavori come test di fumo, monitoraggio del sito, test end-to-end, ecc. I lavori con molta incertezza, come il web scraping, la versione non prefissa sarà una scelta migliore.

La versione prefissata è solo la versione non prefissa avvolta con un controllo di errore. Ecco il codice sorgente del `MustElement`, come si può vedere chiama solo l'elemento `` con diverse linee extra al panico se err non è `nil`:

```go
func (p *Page) MustElement(selectors ...string) *Element {
    el, err := p.Element(selectors...)
    if err != nil {
        panic(err)
    }
    return el
}
```

## Ottieni il valore di errore

I due blocchi di codice qui sotto stanno quasi facendo la stessa cosa in due stili.

Lo stile sottostante è il modo standard di Go per gestire gli errori:

```go
page := rod.New().MustConnect().MustPage("https://example.com")

el, err := page. lement("a")
if err ! nil {
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

Possiamo usare `rod.Try` to catch the error from the `Must` prefixed methods `MustElement` and `MustHTML`. Lo stile sottostante di solito finirà in meno codice, ma può anche catturare errori extra:

```go
page := rod.New().MustConnect().MustPage("https://example.com")

err := rod.Try(func() {
    fmt.Println(page.MustElement("a").MustHTML())
})
handleError(err)
```

## Controlla il tipo di errore

Usiamo il modo standard di Goper controllare i tipi di errore, nessuna magia.

Il `handleError` nel codice sopra potrebbe assomigliare:

```go
func handleError(err error) {
    var evalErr *rod.ErrEval
    if errors.Is(err, context). eadlineExceeded) { // timeout error
        fmt.Println("timeout err")
    } else if errors. s(err, &evalErr) { // eval error
        fmt.Println(evalErr. ineNumber)
    } else if err != nil {
        fmt. rintln("can't handle", err)
    }
}
```
