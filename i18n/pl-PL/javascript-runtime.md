# Czas uruchomienia Javascript

Możemy użyć Rod do oceny losowego kodu javascript na stronie. Używaj go do odczytywania lub modyfikowania zawartości HTML strony.

## Eval na stronie

Na przykład użyj `strony .Eval` aby ustawić wartość globalną:

```go
page.MustEval(`window.a = {name: 'jack'}`)
```

Możemy użyć funkcji js do przekazania wartości jako argumentów jsona:

```go
klucz := "a"
dane: = ciąg[string]mapy{"name": "jack"}
page.MustEval(`(k, val) => {
    okno[k] = val
}`, klucz, dane)
```

Aby uzyskać zwróconą wartość z Eval:

```go
val := page.MustEval(`a`).Get("name").Str()
fmt.Println(val) // wyjści: jack
```

## Zdefiniuj funkcję globalną

Metoda `Page.Evaluate` wykona funkcję, jeśli jej najbardziej wysunięta na zewnątrz jest definicją funkcji.

Na przykład poniższa `test` zostanie wykonana natychmiast, nie będzie traktowana jako definicja funkcji:

```go
page.MustEval(`function test() { alert('ok') }`)

page.MustEval(`test()`) // panika z testem nie zdefiniowanym
```

Aby zdefiniować funkcję globalną `test` możesz kodować w ten sposób, ponieważ najbardziej oddalone jest przypisaniem, a nie definicja funkcji:

```go
page.MustEval(`test = function () { alert('ok') }`)

page.MustEval(`test()`)
```

## Eval na elemencie

`Element.Eval` jest podobny z `Strona.Eval`, ale z `tym` obiektem ustawionym na bieżący element. Na przykład mamy `<button>Prześlij</button>` na stronie, możemy przeczytać lub zmodyfikować element z JS:

```go
el := page.MustElement("button")
el.MustEval(`this.innerText = "Apply"`) // Modyfikuj zawartość
txt := el.MustEval(`this.innerText`).Str()
fmt.Println(txt) // output: Zastosuj
```

## Udostępnij funkcje Go na stronie

Możemy użyć `Strona.Podejmij` aby ujawnić funkcje wywołania zwrotnego na stronie. Na przykład tutaj wystawiamy funkcję, która pomoże stronie obliczyć hash:

```go
page.MustExpose("md5", func(g gson.JSON) (interface{}, error) {
    return md5.Sum([]byte(g.Str())), nil
})
```

Teraz strona może wywołać tę metodę na obiekcie okna:

```go
hash := page.MustEval(`window.md5("test")`).Str()
```
