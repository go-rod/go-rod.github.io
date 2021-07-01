# Fel vid hantering

I de tidigare kapitlen har vi sett en hel del `Måste` prefixerade metoder som `MustNavigera`, `MustElement`, etc. De har alla icke-prefixade versioner som `Navigera`, `Element`, etc. Den största skillnaden mellan dem är hur de hanterar fel. Det är inte speciellt för Rod, du kan hitta det i standardbiblioteket som [regex.MustCompile](https://golang.org/pkg/regexp/#MustCompile).

Metoderna som `MustNavigera` och `MustElement` används ofta i exempelvis kod eller snabbskript. De är användbara för jobb som röktestning, platsövervakning, end-to-end-test, etc. Jobb med massor av osäkerhet, såsom webbskrapning, den icke-prefixade versionen kommer att vara ett bättre val.

Prefix-versionen är bara den icke-prefix-versionen insvept med en felkontroller. Här är källkoden för `MustElement`, som du kan se det bara kallar `Element` med flera extra rader till panik om fel inte är `nil`:

```go
func (p *sida) MustElement(selectors ...string) *Element {
    el, err := p.Element(selectors...)
    om err != nil {
        panic(err)
    }
    return el
}
```

## Hämta felvärdet

De två kodblocken nedan gör nästan samma sak i två stilar.

Stilen nedan är Go's standard sätt att hantera fel:

```go
sida := rod.New().MustConnect().MustPage("https://example.com")

el, err := sida. lement("a")
om fel! nil {
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

Vi kan använda `rod.Try` to catch the error from the `must` prefixed methods `MustElement` and `MustHTML`. Stilen nedan kommer vanligtvis att hamna i mindre kod, men det kan också fånga extra fel:

```go
sida := rod.New().MustConnect().MustPage("https://example.com")

err := rod.Try(func() {
    fmt.Println(page.MustElement("a").MustHTML())
})
handleError(err)
```

## Kontrollera typen av fel

Vi använder Go's standard sätt att kontrollera feltyper, ingen magi.

`HandleError` i ovanstående kod kan se ut som:

```go
func handleError(err error) {
    var evalErr *rod.ErrEval
    om fel.Is(err, context. eadlineExceeded) { // timeout error
        fmt.Println("timeout err")
    } annat om fel. s(err, &evalErr) { // eval error
        fmt.Println(evalErr. ineNumber)
    } annat om fel!= nil {
        fmt. rintln ("kan inte hanteras", err)
    }
}
```
