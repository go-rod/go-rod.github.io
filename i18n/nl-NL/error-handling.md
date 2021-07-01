# Fout bij afhandelen

In de vorige hoofdstukken hebben we een heleboel `moet` vaste methoden als `MustNavigate`, `MustElement`, etc. gezien. Ze hebben allemaal niet-vooraf gefixeerde versies zoals `Navigeren`, `Element`, enz. Het grootste verschil tussen hen is hoe ze fouten behandelen. Het is niet speciaal voor Rod, u vindt het in de standaard bibliotheek zoals [regex.MustCompile](https://golang.org/pkg/regexp/#MustCompile).

De methoden zoals `MustNavigate` en `MustElement` worden vaak gebruikt in voorbeeld code of quick scripting. Ze zijn nuttig voor taken zoals rookproeven, toezicht houden op locaties, end-to-end testen, enzovoort. Banen met veel onzekerheid, zoals webscraping, zullen een betere keuze zijn.

De geprefixeerde versie is alleen de niet-prefixeerde versie verpakt met een foutchecker. Hier is de broncode van het `MustElement`, omdat je alleen het `element` kunt aanroepen met verschillende extra regels om in paniek te raken als err niet `nil`:

```go
func (p *Page) MustElement(selectors ...string) *Element {
    el, err := p.Element(selectors...)
    if err != nil {
        panic(err)
    }
    retourneer op
}
```

## Haal de foutwaarde op

De twee codeblokken hieronder doen bijna hetzelfde in twee stijlen.

De onderstaande stijl is de standaardmanier om fouten te behandelen:

```go
pagina := rod.New().MustConnect().MustPage("https://example.com")

el, err := pagina. lement("a")
als gr ! nil {
    handleError(err)
    return
}
html, err := el. TML()
als err != nil {
    handleError(err)
    return
}
fmt.Println(html)
```

We kunnen gebruik maken van `rod.Probeer` om de fout op te vangen van de `Moet` geavanceerde methoden `MustElement` en `MustHTML`. De onderstaande stijl eindigt meestal in minder code, maar kan ook extra fouten opvatten:

```go
pagina := rod.New().MustConnect().MustPage("https://example.com")

err := rod.Try(func() {
    fmt.Println(page.MustElement("a").MustHTML())
})
handleError(err)
```

## Controleer het fouttype

We gebruiken Go's standaardmanier om foutentypes te controleren, geen magie.

De `handleError` in de bovenstaande code kan er als volgt uitzien:

```go
func handleError(err error) {
    var evalErr *rod.ErrEval
    if errors.Is(err, context. eadlineExceeded) { // timeout error
        fmt.Println("timeout err")
    } anders als er fouten zijn. s(err, &evalErr) { // eval error
        fmt.Println(evalErr. ineNumber)
    } anders als gr != nil {
        fmt. rintln("kan niet afhandelen", err)
    }
}
```
