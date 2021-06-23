# Anpassad Browser Launch

## Anslut till en webbläsare som körs

Hitta den körbara sökvägen för din webbläsare, till exempel på macOS run:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --remote-debugging-port=9222
```

Det kommer att mata ut något som:

```txt
DevTools lyssnar på ws://127.0.0.1:9222/devtools/browser/4dcf09f2-ba2b-463a-8ff5-90d27c6cc913
```

Ovanstående `ws://127.0.0.1:9222/devtools/browser/4dcf09f2-ba2b-463a-8ff5-90d27c6cc913` är gränssnittet för att styra webbläsaren:

```go
package main

import (
    "github.com/go-rod/rod"
)

func main() {
    u := "ws://127.0.0.1:9222/devtools/browser/4dcf09f2-ba2b-463a-8ff5-90d27c6cc913"
    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

## launchern lib

Eftersom ovanstående arbetsflöde används så ofta, abstraherar vi en `launcher` lib för att förenkla lanseringen av webbläsare. Såsom automatiskt ladda ner eller söka efter webbläsaren körbar, lägga till eller ta bort webbläsare körbara kommandoradsargument, etc.

Så ovanstående manuell lansering och kod blir:

```go
func main() {
    u := launcher.New().Bin("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome").MustLaunch()
    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

Vi kan använda hjälpfunktionen `launcher.LookPath` för att få webbläsaren körbar sökväg, ovanstående kod är densamma som:

```go
func main() {
    path, _ := launcher.LookPath()
    u: = launcher.New().Bin(path).MustLaunch()
    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

Om `ControlURL` inte är inställd, kommer `MustConnect` att köra `launcher.New().MustLaunch()` automatiskt. Som standard kommer launcher automatiskt ladda ner och använda en statiskt versionerad webbläsare så att webbläsarens beteende är konsekvent. Så du kan förenkla ovanstående kod till:

```go
func main() {
    rod.New().MustConnect().MustPage("https://example.com")
}
```

## Lägg till eller ta bort alternativ

Du kan använda `Set` och `Ta bort` för att ändra webbläsarens startargument (flaggor):

```go
package main

import (
    "github.com/go-rod/rod"
    "github.com/go-rod/rod/lib/launcher"
)

func main() {
    u := launcher.New().
        Set("användardata-dir", "sökväg").
        Set("headless").
        Ta bort ("--headless").
        MustLaunch()

    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

Som du kan se ovanifrån är prefixet `--` valfritt, såsom `huvudlösa` och `--huvudlösa` är desamma.

Eftersom alternativ som `användardata-dir`, `proxy-server`, `huvudlösa` används så ofta, vi lade till några hjälpare för dem, så ovanstående kod kan bli så här:

```go
func main() {
    u := launcher.New().
        UserDataDir("path").
        Huvudlöshet (sant).
        Huvudlös (falsk).
        MustLaunch()

    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

Här är de tillgängliga flaggorna: [länk](https://peter.sh/experiments/chromium-command-line-switches).

Läs API-dokumentet för mer info: [länk](https://pkg.go.dev/github.com/go-rod/rod/lib/launcher#Launcher).

## Hantera launchern på distans

För produktionsskrapning brukar vi separera skrapor och webbläsare i olika kluster så att de kan skala separat. Rod tillhandahåller modulen `launcher.Manager` för att hantera launchern på distans. Med det kan vi på distans starta en webbläsare med anpassade lanseringsflaggor. Exemplet att använda det är [här](https://github.com/go-rod/rod/blob/master/lib/launcher/rod-manager/main.go).

Eftersom det är mycket svårt att installera krom korrekt på vissa Linux-distributioner, Rod ger en dockeravbildning för att göra det enhetliga cross plattformar. Här är ett exempel för att använda det:

1. Kör stavbilden `dockningsstation kör -p 7317:7317 ghcr.io/go-rod/rod`

2. Öppna en annan terminal och kör kod som detta [exempel](https://github.com/go-rod/rod/blob/master/lib/examples/launch-managed/main.go)

Bilden är [tuned](https://github.com/go-rod/rod/blob/master/lib/docker/Dockerfile) för skärmdumpar och typsnitt bland populära naturliga språk. Varje behållare kan starta flera webbläsare samtidigt.

## Användarläge :id=user-mode

När du loggar in på ditt github konto, och du vill återanvända inloggningssessionen för automatisering uppgift. Du kan använda `launcher.NewUserMode` för att starta din vanliga webbläsare. Rod kommer att vara precis som ett webbläsartillägg:

```go
wsURL := launcher.NewUserMode().MustLaunch()
browser := rod.New().ControlURL(wsURL).MustConnect().NoDefaultDevice()
```

Här är ett mer detaljerat exempel: [kodexempel](https://github.com/go-rod/rod/blob/master/lib/examples/use-rod-like-chrome-extension/main.go).

## API på låg nivå

Om du vill styra varje steg i startprocessen, såsom inaktivera automatisk nedladdning och använda systemets standardwebbläsare, kontrollera exempelfilen [](https://github.com/go-rod/rod/blob/master/lib/launcher/example_test.go).
