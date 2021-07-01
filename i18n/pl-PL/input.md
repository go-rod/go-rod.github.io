# Input

Rod zapewnia wiele metod do symulacji danych wejściowych ludzi, takich jak kliknięcie myszy lub naciśnięcie klawiatury.

## Kliknięcie myszy

Aby symulować myszę, kliknij element:

```go
// left click
page.MustElement("button").MustClick()

// right click
page.MustElement("button").Click(proto.InputMouseButtonRight)
```

## Text input

Aby symulować dane wejściowe:

```go
el := page.MustElement(`[type="text"]`)
el.MustInput("Jack")

fmt.Println(el.MustText()) // użyj MustText aby uzyskać tekst
```

## Usuń tekst z wejścia

Wystarczy symulować jak człowiek to robi, wybrać cały tekst i zastąpić go pustym ciągiem znaków:

```go
page.MustElement(`[type="text"]`).MustSelectAllText().MustInput("")
```

Możesz użyć `SelectText` , aby zastąpić część tekstu.

## Czas wprowadzania

Obsługiwane typy danych wejściowych to [data](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date), [datetime local](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local), [month](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/month), i [time](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time).

```go
page.MustElement(`[type="date"]`).MustInputTime(time.Now())
```

## Pole wyboru

Wystarczy kliknąć jak człowiek:

```go
el := page.MustElement(`[type="checkbox"]`)

// sprawdź czy nie zaznaczono
jeśli !el.MustProperty("checked").Bool() {
    el.MustClick()
}
```

## Wybierz opcje

Wybierz opcje w [`<select>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select).

Poniższy kod wybierze opcje zawierające tekst "B" lub "C":

```go
page.MustElement("select").MustSelect("B", "C")
```

Możesz również użyć selektora regex lub css aby wybrać opcje:

```go
page.MustElement("select").Wybierz([]string{`^B$`}, true, rod.SelectorTypeRegex)

// ustaw false aby odznaczyć stronę
. MustElement("select").Wybierz ([]string{`[value="c"]`}, false, rod.SelectorTypeCSSSector)
```

## Ustaw pliki

Użyj `SetFiles` aby ustawić pliki dla [wprowadzania pliku](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file):

```go
pag.MustElement(`[type=file]`).MustSetFiles("a.jpg", "b.pdf")
```

## Mysz, klawiatura i dotyk

Możesz również użyć `page.Mouse`, `page.Keyboard`, lub `page.Dotknij` , aby symulować dane wejściowe o niskim poziomie. Taki jak możesz przeszukać test jednostki, aby dowiedzieć się, jak symulować przeciąganie.
