# Obsługa błędów

W poprzednich rozdziałach widzieliśmy mnóstwo z `musi` prefikcyjnych metod, takich jak `MustNavigate`, `Mmust Elementment`, itp. Wszystkie mają niepredefiniowane wersje takie jak `Nawigacja`, `Element`itp. Główna różnica między nimi polega na tym, jak radzą sobie z błędami. Nie jest to specjalne dla Rod, możesz go znaleźć w standardowej bibliotece, takiej jak [regex.MustCompile](https://golang.org/pkg/regexp/#MustCompile).

Metody takie jak `MustNavigate` i `Mmust Element` są powszechnie używane w przykładowym kodzie lub szybkim skryptowaniu. Są one przydatne w takich miejscach pracy, jak badanie dymu, monitorowanie miejsca, badanie typu end-to-end itp. Najlepszym wyborem będzie praca z dużą niepewnością, na przykład złomowanie stron internetowych.

Wersja prefixowa jest tylko wersją nieprefikcyjną zawiniętą z walidatorem błędów. Oto kod źródłowy `MustElement`, ponieważ widzisz, tylko wywołuje `Element` z kilkoma dodatkowymi wierszami do paniki, jeśli err nie jest `nil`

```go
func (p *Strona) MustElement(selectors ...string) *Element {
    el, err := p.Element(selectors...)
    if err != nil {
        panic(err)
    }
    return el
}
```

## Pobierz wartość błędu

Dwa poniższe bloki kodu niemal robią to samo w dwóch stylach.

Poniższy styl to standardowy sposób obsługi błędów:

```go
strona := rod.New().MustConnect().MustPage("https://example.com")

el, err := strona. lement("a")
jeśli zer! nil {
    handleError(err)
    return
}
html, err := el. TML()
jeśli err != nil {
    handleError(err)
    return
}
fmt.Println(html)
```

Możemy użyć `rod.Spróbuj` złapać błąd z `Mmust` prefixed methods `Mmust Elementment` and `Mmust HTML`. Poniższy styl zazwyczaj znajdzie się w mniejszej liczbie kodów, ale może również zawierać dodatkowe błędy:

```go
strona := rod.New().MustConnect().MustPage("https://example.com")

err := rod.Try(func() {
    fmt.Println(page.MustElement("a").MustHTML())
})
handleError(err)
```

## Sprawdź typ błędu

Używamy standardowego sposobu na sprawdzanie typów błędów, bez magii.

`handleError` w powyższym kodzie może wyglądać tak:

```go
func handleError(err error) {
    var evalErr *rod.ErrEval
    if errors.Is(err, context eadlineExceeded) { // limit czasu
        fmt.Println("timeout err")
    } else jeśli błędy. s(err, &evalErr) { // eval error
        fmt.Println(evalErr. ineNumber)
    } else if err != nil {
        fmt. rintln("cannot handle", err)
    }
}
```
