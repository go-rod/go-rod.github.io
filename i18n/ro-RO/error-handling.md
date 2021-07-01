# Gestionare erori

În capitolele anterioare, am văzut o mulțime de `Trebuie` metode prestabilite precum `MustNavigate`, `MustElement`, etc. Toți au versiuni care nu sunt prefixe, cum ar fi `Navigați`, `Element`, etc. Principala diferență dintre ele este cum se ocupă de erori. Nu este special pentru Rod, îl poți găsi în biblioteca standard ca [regex.MustCompile](https://golang.org/pkg/regexp/#MustCompile).

Metodele precum `MustNavigate` și `MustElement` sunt utilizate în mod obișnuit ca exemplu de cod sau scriere rapidă. Acestea sunt utile pentru locuri de muncă precum testarea fumatului, monitorizarea la fața locului, testarea de la un capăt la altul etc. Locurile de muncă cu multă incertitudine, cum ar fi dezmembrarea internetului, versiunea neprefixă va fi o alegere mai bună.

Versiunea prefixată este doar versiunea care nu este prefixată împachetată cu un verificator de erori. Iată codul sursă al `MustElement`, după cum puteți vedea, apelează elementul `` cu mai multe linii în plus pentru panică în cazul în care eroarea nu este `numai`:

```go
func (p *Pagina) MustElement(selectori ...șir) *Element {
    el, err := p.Element(selectors...)
    if err != nil {
        panic(eroare)
    }
    return el
}
```

## Obțineți valoarea de eroare

Cele două blocuri de cod de mai jos aproape fac același lucru în două stiluri.

Stilul de mai jos este modul standard de abordare a erorilor:

```go
pagina := rod.New().MustConnect().MustPage("https://example.com")

el, err := page. lement("a")
dacă erau! nil {
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

Putem folosi `roz.Încercaţi` pentru a prinde eroarea din `Trebuie` metode prestabilite `MustElement` şi `MustHTML`. Stilul de mai jos va ajunge de obicei în cod mai mic, dar poate de asemenea să captureze erori suplimentare:

```go
pagina := rod.New().MustConnect().MustPage("https://example.com")

err := rod.Try(func() {
    fmt.Println(page.MustElement("a").MustHTML())
})
handleError(err)
```

## Verifică tipul de eroare

Folosim metoda standard a lui Go, pentru a verifica tipurile de erori, fără magie.

`handleError` în codul de mai sus poate arăta astfel:

```go
func handleError(err error) {
    var evalErr *rod.ErrEval
    if errors.Is(err, context. eadlineExceeded) { // timeout error
        fmt.Println("timeout err")
    } altfel dacă erori. s(err, &evalErr) { // eval error
        fmt.Println(evalErr. ineNumber)
    } altfel dacă ero!= nil {
        fmt. rintln("cannot handle", eroare)
    }
}
```
