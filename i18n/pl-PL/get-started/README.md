# Zacznij od Moda

## Wymagania

[Golang](https://golang.org/) jest jedynym wymogiem, nie musisz nawet nic wiedzieć o HTML.

Jeśli nigdy nie używałeś Golang, [zainstaluj](https://golang.org/doc/install) i możesz go opanować w godzinach: [Zwiedzaj](https://tour.golang.org/welcome).

## Pierwszy program

Użyjmy Rod aby otworzyć stronę i zrobić zrzut ekranu, najpierw utwórz plik "main.go" z zawartością poniżej:

```go
pakiet główny

import "github.com/go-rod/rod"

func main() {
    page := rod.New().MustConnect().MustPage("https://www.wikipedia.org/")
    page.MustWaitLoad().MustScreenshot("a.png")
}
```

`rod.New` tworzy obiekt przeglądarki, `MustConnect` uruchamia i łączy się z przeglądarką. `MustPage` tworzy obiekt strony, to jest jak karta strony w przeglądarce. `Mmust WaitLoad` czeka na stronę w pełni załadowaną. `Zrzut ekranu` robi zrzut ekranu strony.

Utwórz moduł:

```bash
idź plv -w GOPROXY=https://goproxy.io,direct
idź mod init learn-rod
idź mod tidy
```

Uruchom moduł:

```bash
uruchom .
```

Program wyśle zrzut ekranu "a.png" jak poniżej:

![pierwszy program](first-program.png)

## Zobacz, co jest pod kapturem

Dla starszych deweloperów możesz pominąć wszystkie i przeczytać ten plik: [link](https://github.com/go-rod/rod/blob/master/examples_test.go).

Domyślnie Rod wyłączy interfejs przeglądarki, aby zmaksymalizować wydajność. Jednak opracowując zadanie automatyzacji, zazwyczaj bardziej dbamy o łatwość debugowania. Rod zapewnia wiele rozwiązań, które pomogą Ci debugować kod.

Utwórzmy plik konfiguracyjny ".rod" w bieżącym katalogu roboczym. Treść to:

```txt
pokaż
```

Oznacza to "pokazanie interfejsu użytkownika przeglądarki na pierwszym planie". Zanim znowu uruchomimy moduł, dołącz `time.Sleep(czas). nasza)` na końcu kodu, aby nie było zbyt szybko dla naszych oczu na złapanie, kod "main. o" zostaje:

```go
pakiet główny

import (
    "time"

    "github.com/go-rod/rod"
)

func main() {
    page := rod.New().MustConnect().MustPage("https://www.wikipedia.org/")
    page.MustWaitLoad().MustScreenshot("a.png")
    time.Sleep(time.Hour)
}
```

Jeśli znowu uruchomisz moduł, powinieneś zobaczyć przeglądarkę taką:

![pokaż](show.png)

Naciśnij [CTRL + C](https://en.wikipedia.org/wiki/Control-C) na klawiaturze, aby zatrzymać program.

## Wprowadź i kliknij

Zautomatyzujmy stronę internetową, aby wyszukać słowo kluczowe "Ziemi". Strona internetowa może mieć wiele pól lub przycisków, musimy poinformować program, który chcesz manipulować. Zazwyczaj używamy [narzędzi devtool](https://developers.google.com/web/tools/chrome-devtools/) , aby pomóc nam zlokalizować element, nad którym chcemy sterować. dodajmy nową konfigurację do pliku ".rod", aby włączyć narzędzia devtools, teraz staje się:

```txt
show
devtools
```

Uruchom "główny". o" ponownie, przenieś myszkę do pola wejściowego i kliknij prawym przyciskiem myszy nad nim, zobaczysz menu kontekstowe, a następnie kliknij "sprawdź":

![sprawdź](inspect.png)

Powinieneś zobaczyć `<wprowadź id="Szukaj wpisu` jak poniżej:

![input](input.png)

Kliknij prawym przyciskiem myszy, aby skopiować selektor [css](css-selector.md) jak obraz powyżej. Zawartość twojego schowka będzie "#searchInput". Użyjemy go do zlokalizowania elementu , aby wprowadzić słowo kluczowe. Teraz "main.go":

```go
główny pakiet

import (
    "time"

    "github. om/go-rod/rod"
)

func main() {
    page := rod.New().MustConnect().MustPage("https://www.wikipedia. rg/").MustWindowFullscreen()

    page.MustElement("#searchInput").MustInput("earth")

    page.MustWaitLoad().MustScreenshot("a.png")
    time.Sleep(time.Hour)
}
```

`MustWindowFullscreen` zmienia rozmiar okna przeglądarki, aby ułatwić debugowanie. Używamy `Element obowiązkowy` i selektora, który skopiowaliśmy z panelu narzędzi devtools , aby uzyskać element, który chcemy modyfikować. `Element muszący` będzie automatycznie czekał na pojawienie się elementu, więc nie musimy przed nim używać `MustWayload`. Następnie nazywamy `MustInput` , aby wprowadzić do niego słowo kluczowe "Ziemi". Jeśli uruchomisz ponownie "main.go", powinieneś zobaczyć wynik wygląda jak poniżej:

![po wejściu](after-input.png)

Podobnie jak w polu wejściowym, kliknij prawym przyciskiem wyszukiwania , aby skopiować selektor dla nich:

![szukaj btn](search-btn.png)

![selektor wyszukiwania](search-btn-selector.png)

Następnie dodaj kod, aby kliknąć przycisk wyszukiwania, teraz "main.go" wygląda jako:

```go
pakiet główny

import "github.com/go-rod/rod"

func main() {
    page := rod.New().MustConnect().MustPage("https://www.wikipedia.org/").MustWindowFullscreen()

    page.MustElement("#searchInput").MustInput("earth")
    page.MustElement("#search-form > fieldset > button").MustClick()

    page.MustWaitLoad().MustScreenshot("a.png")
}
```

Jeśli ponownie uruchomimy moduł, "a.png" pokaże wynik wyszukiwania:

![Strona Ziemi](earth-page.png)

## Wolne ruchy i wizualne ślady

Zautomatyzowane operacje są zbyt szybkie, aby ludzkie oczy mogły złapać, aby je debugować, zazwyczaj włącz konfiguracje wolnoruchu i wizualnych śladów, zaktualizujmy ". od" plik:

```txt
pokaż
spowalnia = 1s
śledzenie
```

Następnie uruchom ponownie moduł, teraz każde działanie będzie czekać 1 sekundę przed jego wykonaniem. Na stronie zobaczysz ślad debugowania generowany przez Rod jak poniżej:

![ślad](trace.png)

Jak widzisz na przycisku wyszukiwania, Rod utworzy kursora myszy.

Na konsoli zobaczysz logi śladów jak poniżej:

```txt
[rod] 2020/11/11 11:11:11 [eval] {"js":"rod.element","params":["#searchInput"]}
[rod] 2020/11/11 11:11:11 [eval] {"js":"rod.visible","this":"input#searchInput"}
[rod] 2020/11/11 11:11:11 [input] scroll into view
[rod] 2020/11/11 11:11:11 [input] input earth
[rod] 2020/11/11 11:11:11 [eval] {"js":"rod.element","params":["#search-form > fieldset > button"]}
[rod] 2020/11/11 11:11:11 [eval] {"js":"rod.visible","this":"button.pure-button.pure-button-primary-progressive"}
[rod] 2020/11/11 11:11:11 [input] scroll into view
[rod] 2020/11/11 11:11:11 [input] left click
```

## Poza plikiem ".rod"

„” nie" plik jest tylko skrótem dla niektórych powszechnie używanych API, możesz go również ręcznie ustawić w kodzie, taki jak "wolny", kod ustawiony jako `pręta. ew().SlowMotion(2 * time.Second)`. Możesz również użyć zmiennej środowiskowej, aby ją ustawić, np. na Mac lub Linux: `rod=show go main.go`.

## Pobierz treść tekstu

Rod zapewnia wiele przydatnych metod pobierania zawartości ze strony.

Spróbujmy uzyskać opis Ziemi, użyj tej samej techniki, którą poprzednio używaliśmy do skopiowania selektora z Narzędzi Devtools:

![tekst get-text](get-text.png)

Metodą, którą stosujemy jest `Mmust Text`, oto pełny kod:

```go
główny pakiet

import (
    "fmt"

    "github. om/go-rod/rod"
)

func main() {
    page := rod. ew().MustConnect().MustPage("https://www.wikipedia.org/")

    page.MustElement("#searchInput"). ustInput("ziemia")
    page.MustElement("#search-form > fieldset > button").MustClick()

    el := strona. ustElement("#mw-content-text > div.mw-parser-output > p:nth-child(6)")
    fmt.Println(el.MustText())
}
```

Jeśli uruchomimy ponownie moduł, powinniśmy zobaczyć dane wyjściowe konsoli jako:

```txt
Ziemia jest trzecią planetą z słońca i jedynym obiektem astronomicznym znanym jako żywo.
...
```

## Pobierz zawartość obrazu

Tak samo jak w przypadku tekstu, możemy również pobrać obrazy ze strony, pobierzmy selektor obrazu Ziemi i użyj `MustResource` , aby pobrać plik binarny obrazu:

![get-image](get-image.png)

Pełny kod to:

```go
pakiet główny

import (
    "github.com/go-rod/rod"
    "github. om/go-rod/rod/lib/utils"
)

func main() {
    page := rod. ew().MustConnect().MustPage("https://www.wikipedia.org/")

    page.MustElement("#searchInput").MustInput("Ziemi")
    strony. ustElement("#search-form > fieldset > button").MustClick()

    el := page.MustElement("#mw-content-text > div.mw-parser-output > tablet. nfobox > tbody > tr:nth-child(1) > td > a > img")
    _ = utils. utputFile("b.png", el.MustResource())
}
```

Plik wyjściowy "b.png" powinien być:

![Ziemia](earth.png)
