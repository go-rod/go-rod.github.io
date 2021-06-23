# Zpracování chyb

V předchozích kapitolách jsme viděli spoustu `Musí` prefixních metod, jako je `MustNavigate`, `MustElement`, atd. Všechny mají bezprefixní verze jako `Navigate`, `Element`, atd. Hlavní rozdíl mezi nimi spočívá v tom, jak řeší chyby. Není to speciální pro Rod, můžete jej najít ve standardní knihovně jako [regex.MustCompile](https://golang.org/pkg/regexp/#MustCompile).

Metody jako `MustNavigate` a `MustElement` se běžně používají například v kódu nebo rychlém skriptu. Jsou užitečné pro práce, jako jsou zkoušky kouře, monitorování lokalit, zkouška typu „end-to-end“ atd. Pracovní místa s velkou nejistotou, jako je škrábání webů, bude lepší volbou bezprefixní verze.

Předopravená verze je pouze neprefixovaná verze, která byla obalena kontrolou chyb. Here's the source code of the `MustElement`, as you can see it just calls the `Element` with several extra lines to panic if err is not `nil`:

```go
func (p *Page) MustElement(selectors ...string) *Element {
    el, err := p.Element(selectors...)
    if err != nil {
        panic(err)
    }
    return el
}
```

## Získat hodnotu chyby

Dva bloky kódu níže dělají téměř totéž ve dvou stylech.

Styl níže je standardní způsob, jak řešit chyby:

```go
stránka := rod.New().MustConnect().MustPage("https://example.com")

el, err := stránka. lement("a")
pokud je chybné! nil {
    handleError(err)
    return
}
html, err := el. TML()
pokud err != nil {
    handleError(err)
    return
}
fmt.Println(html)
```

Můžeme použít `rod.Zkus` chytit chybu z `musíš` prefixních metod `MustElement` a `MustHTML`. Níže uvedený styl obvykle skončí v menším kódu, ale může také chytit další chyby:

```go
page := rod.New().MustConnect().MustPage("https://example.com")

err := rod.Try(func() {
    fmt.Println(page.MustElement("a").MustHTML())
})
handleError(err)
```

## Zkontrolujte typ chyby

Používáme standardní způsob, jak zkontrolovat typy chyb, žádné kouzlo.

`handleError` ve výše uvedeném kódu může vypadat jako:

```go
func handleError(chyba chyby) {
    var evalErr *rod.ErrEval
    if errors.Is(err, kontext. eadlineExceeded) { // timeout error
        fmt.Println("timeout err")
    } jinak v případě chyb. s(err, &evalErr) { // eval error
        fmt.Println(evalErr. ineNumber)
    } else if err != nil {
        fmt. rintln("can't handle", err)
    }
}
```
