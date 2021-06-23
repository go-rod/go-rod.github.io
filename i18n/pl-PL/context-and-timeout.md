# Kontekst i limit czasu

W Golang, zazwyczaj używamy [kontekstu](https://golang.org/pkg/context/) do przerwania długotrwale działających zadań. Rod używa kontekstu do obsługi odwołań operacji blokowania IO, najczęściej gdy przekroczono limit czasu. Należy zwrócić na nie szczególną uwagę.

Jeśli nie znasz kontekstu, najpierw przeczytaj [Kontekst rozumienia](understand-context.md).

## Anulowanie

Na przykład, poniższy kod tworzy pustą stronę i przenosi ją do "github.com":

```go
page := rod.New().MustConnect().MustPage()
page.MustNavigate("http://github.com")
```

Teraz przypuszczamy, że chcemy anulować `MustNavigate` , jeśli zajmie to więcej niż 2 sekundy. W Rogu możemy zrobić coś takiego:

```go
strona := rod.New().MustConnect().MustPage()

ctx, cancel := context.WithCancel(context.Background())
pageWithCancel := page.Context(ctx)

idź func() {
    czas. leep(2 * time.Second)
    cancel()
}()

pageWithCancel.MustNavigate("http://github.com") // zostanie anulowane po 2 sekundach
```

Używamy `page.Context` , aby utworzyć płytki klon `strony`. Za każdym razem, gdy zadzwonimy na `anuluj`, operacje wyzwalane przez `stronęWithCancel` zostaną anulowane, może to być każda operacja, nie tylko `MustNavigate`. Strona źródłowa `` nie zostanie zmieniona, jeśli używamy jej do wywołania operacji, nie zostaną one anulowane.

Ten styl nie jest specjalny dla Rod, można znaleźć podobne API takie jak [Request.WithContext](https://golang.org/pkg/net/http/#Request.WithContext) w standardowej bibliotece.

Ponieważ `pageWithCancel` i `strona` są od siebie niezależne, Operacje uruchamiane przez stronę `` nie będą miały wpływu na anulowanie:

```go
page.MustNavigate("http://github.com") // nie zostanie anulowany po 2 sekundach
```

## Limit czasu

Powyższy kod jest tylko sposobem na przekroczenie limitu czasu. W Golang, limit czasu jest zwykle tylko szczególnym przypadkiem odwołania. Ponieważ jest to tak przydatne, stworzyliśmy pomocnika, aby zrobić to samo powyżej, nazywa się `Timeout`, więc powyższy kod może być zmniejszony jak poniżej:

```go
strona := rod.New().MustConnect().MustPage()
page.Timeout(2 * time.Second).MustNavigate("http://github.com")
```

`page.Timeout(2 * time.Second)` jest poprzednią `stronąWithCancel`. Nie tylko `Strona`, `Przeglądarka` i `Element` mają również tych samych pomocników kontekstowych.

## Wykrywanie limitu czasu

Skąd mogę wiedzieć, czy operacja jest przekroczona, czy nie? W Golang, limit czasu jest zwykle rodzajem błędu. To nie jest specjalne dla Rod. Dla powyższego kodu możemy to zrobić, aby wykryć limit czasu:

```go
strona := rod.New().MustConnect().MustPage()

err := rod.Try(func() {
    page.Timeout(2 * time.Second).MustNavigate("http://github.com")
})
w przypadku błędów. s(err, kontekst). eadlineExceeded) {
    // code for timeout error
} else if err ! nil {
    // kod dla innych rodzajów błędu
}
```

Tutaj używamy `rod.Spróbuj` , aby zawijać funkcję, która może spowodować przekroczenie limitu czasu.

Będziemy rozmawiać więcej o obsłudze błędów na [Obsługa błędów](error-handling.md).
