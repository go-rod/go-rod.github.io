# Feil ved håndtering

I de forrige kapitlene har vi sett mye `Must` prefixed methods like `MustNavigate`, `MustElement`, etc. De har alle ikke-faste versjoner som `Navigate`, `Element`, etc. Hovedforskjellen mellom dem er hvordan de håndterer feil. Det er ikke spesielt for Rod, du kan finne det i standardbiblioteket som [regex.MustCompile](https://golang.org/pkg/regexp/#MustCompile).

Metodene som `MustNavigate` og `Måleelement` er ofte brukt i eksempelkoden eller raskt skript. De er nyttige for jobber som røyktetthet, overvåking av sted, ende-til-ende-prøving osv. Jobber med masse usikkerhet, som nettskraping, vil bedre valgfrihet.

Forhåndsversjon er bare den uten prefikset versjonen pakket med en feilkontroller. Her er kildekoden til `Måleelement`, som du kan se det bare kaller `element` med flere ekstra linjer til panikk hvis err ikke er `null`:

```go
funk (p *Page) MustElement(selectors ...string) *Element {
    el, err := p.Element(selectors...)
    hvis err != nil {
        panic(err)

    returnere el
}
```

## Hent feilverdien

De to kodeblokkene nedenfor gjør nesten det samme i to stilarer.

Stilen under er en standard måte å håndtere feil på Go:

```go
side := rod.New().MustConnect().MustPage("https://example.com")

el, err := side. lement("a")
hvis err! nil {
    handleError(err)
    return
}
html, err := el. TML()
hvis err != nil {
    handleError(err)
    return
}
fmt.Println(html)
```

Vi kan bruke `rod.Try` for å fange feilen fra `Must` prefixed methods `MustElement` og `MustHTML`. Stilen nedenfor vil vanligvis ende opp i mindre kode, men det kan også fange ekstra feil:

```go
side := rod.New().MustConnect().MustPage("https://example.com")

err := rod.Try(func() {
    fmt.Println(page.MustElementa").MustHTML())
})
handleError(err)
```

## Kontroller feiltypen

Vi bruker Go's standardmåte for å sjekke feiltyper, ingen magi.

`håndteringsfeil` i koden ovenfor kan se slik ut:

```go
func handleError(err error) {
    var evalErr *rod.ErrEval
    hvis errors.Is(err, kontekst. eadlineExceeded) { // timeout
        fmt.Println("timeout err")
    } ellers hvis feil. s(err, &evalErr) { // eval error
        fmt.Println(evalErr. ineNumber)
    } ellers hvis err != nil {
        fmt. rintln("ikke kan handle", err)
    }
}
```
