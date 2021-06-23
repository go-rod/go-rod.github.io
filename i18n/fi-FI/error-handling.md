# Virhe Käsittelyssä

Edellisissä luvuissa olemme nähneet paljon `Täytyy` ennalta määriteltyjä menetelmiä, kuten `MustNavigate`, `MustElement`, jne. Niissä kaikissa on ei-ennalta kiinnitettyjä versioita, kuten `Navigoi`, `Elementti`, jne. Tärkein ero niiden välillä on, miten ne käsittelevät virheitä. Se ei ole erityisen Rod, voit löytää sen standardi kirjastossa kuten [regex.MustCompile](https://golang.org/pkg/regexp/#MustCompile).

Menetelmät, kuten `MustNavigate` ja `MustElement` ovat yleisesti käytössä esimerkiksi koodissa tai nopeassa skriptissä. Ne ovat hyödyllisiä esimerkiksi savutestauksessa, paikan seurannassa, päästä päähän -testissä jne. Työpaikat, joissa on paljon epävarmuutta, kuten web-romutus, ennalta määrätty versio on parempi valinta.

Ennakkoon kiinnitetty versio on vain ei-ennalta kiinnitetty versio kääritty virheiden tarkistaja. Tässä on lähdekoodi `MustElement`, kuten näet, se vain soittaa `elementin` kanssa useita ylimääräisiä rivejä paniikkia, jos err ei ole `nol`:

```go
func (p *sivu) MustElement(selectors ...string) *Element {
    el, err := p.Element(selectors...)
    jos err != nil {
        panic(err)
    }
    palauta el
}
```

## Hanki virhearvo

Alla olevat kaksi koodilohkoa tekevät lähes saman asian kahdessa tyylissä.

Alla oleva tyyli on Go:n vakiomuotoinen tapa käsitellä virheitä:

```go
sivu := rod.New().MustConnect().MustPage("https://example.com")

el, err := sivu. lement("a")
jos err ! nil {
    handleError(err)
    paluu
}
html, err := el. TML()
jos err != nil {
    handleError(err)
    paluu
}
fmt.Println(html)
```

Voimme käyttää `rod.Yritä` saalis virhe `Must` prefixed menetelmiä `MustElement` ja `MustHTML`. Alla oleva tyyli päätyy yleensä vähemmän koodia, mutta se voi myös saalis ylimääräisiä virheitä:

```go
sivu := rod.New().MustConnect().MustPage("https://example.com")

err := rod.Try(func() {
    fmt.Println(page.MustElement("a").MustHTML())
})
handleError(err)
```

## Tarkista virheen tyyppi

Käytämme Go: n vakiotapaa tarkistaa virhetyypit, ei taikuutta.

Edellä olevassa koodissa oleva `käsivirhe` voi näyttää:

```go
func handleError(err error) {
    var evalErr *rod.ErrEval
    if errors.Is(err, context. eadlineExceeded) { // timeout virhe
        fmt.Println ("timeout err")
    } muuten jos virheitä. s(err, &evalErr) { // eval virhe
        fmt.Println(evalErr. numero)
    } muu jos err != nil {
        fmt. rintln ("ei voi käsitellä", virhe)
    }
}
```
