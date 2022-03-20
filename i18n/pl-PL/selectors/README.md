# Wybór

Pręt zapewnia mnóstwo metod, aby uzyskać elementy. Ich nazwy są prefiksowane `Element obowiązkowy` lub `Element`. Jeśli używasz IDE po wpisaniu `Element`, zobaczysz wszystkie dostępne selektory takie jak poniżej:

![selektory ide-](ide-selectors.png)

Jeśli najeździesz kursorem nad metodą, zobaczysz dok, jak poniżej:

![ide-doc](ide-doc.png)

Zazwyczaj potrzebujesz tylko pewnej podstawowej wiedzy o [selektorze CSS](css-selector) , aby wykonać zadanie automatyzacji, które chcesz wykonać. W pozostałej dokumentacji użyjemy tylko selektora CSS aby uzyskać elementy ze strony.

## Według treści tekstowych

Użyj `ElementR` , aby dopasować elementy do określonej zawartości tekstu, np. wybierz wyszukiwanie w zrzucie ekranu poniżej:

![pasujący tekst](match-text.png)

```go
page.MustElementR("input", "Search or jump")
page.MustElementR("input", "/click/i") // użyj niewrażliwej na wielkość liter flagi "i"
```

Ponieważ używamy [js regex](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp), nie musimy pasować do całego kontekstu tekstowego. Tekst do dopasowania jest tym, co faktycznie widzisz na stronie internetowej, a nie na kodzie źródłowym, porównaj 1 i 2 na zrzucie ekranu poniżej. Możesz użyć pomocnika `kopiuj` w Narzędziach Devtools, aby skopiować tekst do schowka (zobacz 4):

![kopiuj-tekst](copy-text.png)

## Według XPath

Selektor CSS jest zalecanym sposobem na elementy selektora, takie jak nie możesz użyć XPath do wybrania [renderowanego tekstu](https://stackoverflow.com/questions/51992258/xpath-to-find-pseudo-element-after-in-side-a-div-element-with-out-any-content/51993454). Ale czasami XPath może być przydatny dla programistów pochodzących z innych języków. Użyj `ElementX` dla XPath:

```go
page.MustElementX("//h2")
```

## Według Javascript

Jeśli masz złożone zapytanie lub chcesz użyć silnika zapytania wysokiego poziomu, takiego jak [jQuery](https://jquery.com/):

```go
page.MustElementByJS(`() => jQuery('option:selected')[0]`)
```

W rzeczywistości, jeśli sprawdzasz kod źródłowy innych selektorów, takich jak `Element` lub `Element`, wszystkie opierają się na `ElementByJS`, i `ElementByJS` jest oparte na `stronie. wartość`, aby uzyskać więcej informacji na temat oceny js, sprawdź [Javascript Runtime](/javascript-runtime.md). Zazwyczaj używasz `ElementByJS` do tworzenia własnego selektora do rozszerzenia Rod.

## Wybierz listę elementów

Nazwy metod uzyskiwania wielu elementów są poprzedzone `Elementami obowiązkowymi` lub `Elementami`. Jedną z kluczowych różnic między jednym selektorem a wieloselektorem jest jeden selektor poczeka, aż pojawi się element . Jeśli selektor wielofunkcyjny niczego nie znajdzie, natychmiast zwróci pustą listę.

## Drzewo elementu Poligonu

Istnieją również niektóre poręczne selektory do wyboru elementów wewnątrz lub wokół elementu, na przykład `Mmust rodzic`, `Mmust Next`, `Mustous`itd.

Oto przykład jak używamy różnych selektorów do pobierania treści ze strony:

```go
// Na niesamowitej stronie, odnalezienie określonej sekcji sekcje
// i pobranie powiązanych projektów ze strony.
func main() {
    page := rod.New().MustConnect().MustPage("https://github.com/avelino/awesome-go")

    sekcja := page.MustElementR("p", "Selenium i narzędzia do kontroli przeglądarki"). ustNext()

    // uzyskaj elementy podrzędne elementu
    projektów := sekcja. ustElements("li")

    dla _, projektu := projekt {
        link := projekt. dziennik ustElement("a")
        rintf(
            "project %s (%s): '%s'",
            link. link ustText(),
            . projekt ustProperty("href"),
            . ustText(),
        )
    }
}
```

## Pobierz elementy z ramek

Na przykład chcemy pobrać przycisk z zagnieżdżonych ramek:

![iframy](iframes.png)

Kod będzie wyglądał jako:

```go
frame01 := page.MustElement("iframe").MustFrame()
iframe02 := iframe01.MustElement("iframe").MustFrame()
frame02.MustElement("button")
```

## Szukaj elementów

Jest jeszcze jeden potężny pomocnik do zdobycia elementów, `Mmust Search`. Jest mniej precyzyjne niż wyżej wymienione selektory, ale jest przydatne, jeśli chcesz uzyskać elementy z głęboko zagnieżdżonych ramek lub cieni.

Funkcja jest taka sama jak [Devtools' Search for nodes](https://developers.google.com/web/tools/chrome-devtools/dom#search), możesz użyć tego aby dowiedzieć się, jakie słowo kluczowe użyć do wybrania elementu, który chcesz, jak zrzut ekranu poniżej:

![szukaj](search.png)

Aby uzyskać ten sam element z [Pobierz elementy z ramek iframes](#get-elements-from-iframes)możemy po prostu kodować tak:

```go
page.MustSearch("przycisk")
```

## Selektory wyścigów

Róg zachęca do automatyzacji bez snu w celu ograniczenia płatków. Gdy akcja ma wiele wyników, nie używamy snu, aby poczekać aż strona przekierowuje lub ustąpi. Na przykład, kiedy logujemy się na stronę, hasło może być niepoprawne, chcemy poradzić sobie z sukcesem i porażką oddzielnie. Powinniśmy unikać kodu jak poniżej:

```go
func main() {
    page := rod.New().MustConnect().MustPage("https://leetcode.com/accounts/login/")

    page.MustElement("#id_login").MustInput("username")
    page.MustElement("#id_password").MustInput("hasło").MustPress(input.Enter)

    time.Sleep(10 * time.Second) // Proszę unikać użycia czasu.Sleep!

    if page.MustHas(". av-user-icon-base") {
        // drukuj nazwę użytkownika po udanym zalogowaniu
        fmt. rintln(*el.MustAttribute("title"))
    } else jeśli stronie. ustHas("[data-cy=sign-in-error]") {
        // kiedy nieprawidłowa nazwa użytkownika lub hasło
        fmt. rintln(el.MustText())
    }
}
```

Zamiast tego powinniśmy kodować tak:

```go
func main() {
    page := rod.New().MustConnect().MustPage("https://leetcode.com/accounts/login/")

    page.MustElement("#id_login").MustInput("username")
    strony. ustElement("#id_password").MustInput("password").MustPress(input.Enter)

    // Będzie kontynuował ankiety, dopóki jeden selektor nie znajdzie strony
    dopasowanej.Race().Element(". av-user-icon-base").MustHandle(func(e *rod. lement) {
        // wydrukuj nazwę użytkownika po udanym logowaniu
        fmt. rintln(*e.MustAttribute("title"))
    }). lement("[data-cy=sign-in-error]").Wymagana obsługa (funk(e *rod. lement) {
        // gdy nieprawidłowa nazwa użytkownika lub hasło
        panic(e. ustText())
    }).MustDo()
}
```
