# Håndtering Af Fejl

I de foregående kapitler har vi set en masse `Skal` præfikserede metoder som `MustNavigate`, `MustElement`osv. De har alle ikke-præfikserede versioner som `Naviger`, `Element`, etc. Den væsentligste forskel mellem dem er, hvordan de håndterer fejl. Det er ikke specielt til Rod, du kan finde det i standard biblioteket som [regex.MustCompile](https://golang.org/pkg/regexp/#MustCompile).

Metoderne som `MustNavigate` og `MustElement` er almindeligt anvendt i eksempel kode eller hurtig scripting. De er nyttige for job som røg test, site overvågning, end-to-end test, etc. Jobs med masser af usikkerhed, såsom web-skrabning, vil den ikke-forudfastsatte version være et bedre valg.

Den præfikserede version er kun den ikke-præfikserede version pakket ind med en fejl checker. Her er kildekoden til `MustElement`, som du kan se det bare kalder `Element` med flere ekstra linjer til panik, hvis fejl ikke er `nul`:

```go
func (p *Page) MustElement(selectors ...string) *Element {
    el, err: = p.Element(selectors...)
    if err != nil {
        panic(err)
    }
    returnér el
}
```

## Hent fejlværdien

De to kodeblokke nedenfor gør næsten det samme i to stilarter.

Stilen nedenfor er Go's standard måde at håndtere fejl:

```go
side := rod.Ny().MustConnect().MustPage("https://example.com")

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

Vi kan bruge `stav.Prøv` for at fange fejlen fra `Skal` præfikserede metoder `MustElement` og `MustHTML`. Stilen nedenfor vil normalt ender i mindre kode, men det kan også fange ekstra fejl:

```go
Side := rod.Ny().MustConnect().MustPage("https://example.com")

err := rod.Try(func() {
    fmt.Println(page.MustElement("a").MustHTML())
})
handleError(err)
```

## Tjek fejltypen

Vi bruger Go's standard måde at kontrollere fejltyper, ingen magi.

The `handleError` in the above code may look like:

```go
func handleError(err error) {
    var evalErr *rod.ErrEval
    if errors.Is(err, context. eadlineExceeded) { // timeout fejl
        fmt.Println ("timeout err")
    } ellers hvis fejl. s(err, &evalErr) { // eval fejl
        fmt.Println(evalErr. ineNumber)
    } ellers hvis err != nil {
        fmt. rintln ("kan ikke styre", err)
    }
}
```
