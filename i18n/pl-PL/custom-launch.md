# Własne uruchomienie przeglądarki

## Połącz z uruchomioną przeglądarką

Znajdź ścieżkę wykonywalną przeglądarki, taką jak na macOS:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --remote-debugging-port=9222
```

Będzie to wyjście czegoś takego:

```txt
DevTools nasłuchujący ws://127.0.0.1:9222/devtools/browser/4dcf09f2-ba2b-463a-8ff5-90d27c6cc913
```

Powyższe `ws://127.0.0.1:9222/devtools/browser/4dcf09f2-ba2b-463a-8ff5-90d27c6cc913` jest interfejsem do kontrolowania przeglądarki:

```go
pakiet główny

import (
    "github.com/go-rod/rod"
)

func main() {
    u := "ws://127.0.0.1:9222/devtools/browser/4dcf09f2-ba2b-463a-8ff5-90d27c6cc913"
    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

## Pulpit launchera

Ponieważ powyższy przepływ pracy jest często używany, abstraktujemy `launcher` lib, aby uprościć uruchamianie przeglądarki. Takie jak automatyczne pobieranie lub wyszukiwanie pliku wykonywalnego przeglądarki, dodaj lub usuń argumenty wiersza polecenia wykonywalnego przeglądarki itp.

Tak więc powyższe ręczne uruchomienie i kod są następujące:

```go
func main() {
    u := launcher.New().Bin("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome").MustLaunch()
    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

Możemy użyć funkcji pomocniczej `launcher.LookPath` , aby pobrać ścieżkę wykonywalną przeglądarki, powyższy kod jest taki sam:

```go
func main() {
    path, _ := launcher.LookPath()
    u := launcher.New().Bin(path).MustLaunch()
    rod.New().ControlURL(u).MustConnect().MustConnect().MustPage("https://example.com")
}
```

Jeśli `ControlURL` nie jest ustawiony, `MustConnect` uruchomi `launcher.New().MustLaunch()` automatycznie. Domyślnie launcher automatycznie pobierze i użyje przeglądarki statycznie, aby zachowanie przeglądarki było spójne. Możesz zatem uprościć powyższy kod do:

```go
func main() {
    rod.New().MustConnect().MustPage("https://example.com")
}
```

## Dodaj lub usuń opcje

Możesz użyć `Set` i `Delete` , aby zmodyfikować argumenty uruchamiania przeglądarki (flagi):

```go
pakiet główny

import (
    "github.com/go-rod/rod"
    "github.com/go-rod/rod/lib/launcher"
)

func main() {
    u := launcher.New().
        Ustawienie ("user-data-dir", "ścieżka").
        Ustawienie ("headless").
        Usuń("--headless").
        MustLaunch()

    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

Jak widzisz powyżej prefiksu `--` jest opcjonalny, takie jak `bez głowy` i `--headless` są takie same.

Ponieważ opcje takie jak `user-data-dir`, `proxy-server`, `bezgłowne` są często używane, dodaliśmy dla nich pomocników, więc powyższy kod może stać się w następujący sposób:

```go
func main() {
    u := launcher.New().
        UserDataDir("ścieżka").
        Bezczołowo (prawda).
        Bezgłowy (fałsz).
        MustLaunch()

    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

Oto dostępne flagi: [link](https://peter.sh/experiments/chromium-command-line-switches).

Przeczytaj dokument API, aby uzyskać więcej informacji: [link](https://pkg.go.dev/github.com/go-rod/rod/lib/launcher#Launcher).

## Zdalnie zarządzaj launchrem

W odniesieniu do systemu złomowania produkcji zazwyczaj rozdzielimy zgarniaki i przeglądarki na różne klastry, tak aby mogły być skalowane oddzielnie. Rod dostarcza moduł `launcher.Manager` do zdalnego zarządzania launcherem. Dzięki temu możemy zdalnie uruchomić przeglądarkę z niestandardowymi flagami uruchamiania. Przykład do użycia to [tutaj](https://github.com/go-rod/rod/blob/master/lib/launcher/rod-manager/main.go).

Ponieważ bardzo trudno jest zainstalować chrom poprawnie na niektórych dystrybucjach linuksu, Rod dostarcza obraz dockera, aby stał się on spójny między platformami. Oto przykład do użycia:

1. Uruchom obrazek pręta `docker run -p 7317:7317 ghcr.io/go-rod/rod`

2. Otwórz kolejny terminal i uruchom kod taki jak ten [przykład](https://github.com/go-rod/rod/blob/master/lib/examples/launch-managed/main.go)

Obraz jest [dostosowany](https://github.com/go-rod/rod/blob/master/lib/docker/Dockerfile) do zrzutów ekranu i czcionek w popularnych językach naturalnych. Każdy kontener może uruchamiać wiele przeglądarek jednocześnie.

## Tryb użytkownika :id = tryb użytkownika

Po zalogowaniu się na swoje konto github i chcesz ponownie użyć sesji logowania do zadania automatyzacji. Możesz użyć `launcher.NewUserMode` , aby uruchomić swoją zwykłą przeglądarkę. Rod będzie jak rozszerzenie przeglądarki:

```go
wsURL := launcher.NewUserMode().MustLaunch()
przeglądarka := rod.New().ControlURL(wsURL).MustConnect().NoDefaultDevice()
```

Oto bardziej szczegółowy przykład: [przykład kodu](https://github.com/go-rod/rod/blob/master/lib/examples/use-rod-like-chrome-extension/main.go).

## API niskiego poziomu

Jeśli chcesz sterować każdym etapem procesu uruchamiania, np. wyłączyć automatyczne pobieranie i użyć domyślnej przeglądarki systemu, sprawdź [przykładowy plik](https://github.com/go-rod/rod/blob/master/lib/launcher/example_test.go).
