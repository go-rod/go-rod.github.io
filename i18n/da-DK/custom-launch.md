# Brugerdefineret Browserstart

## Opret forbindelse til en kørende browser

Find den eksekverbare sti til din browser, såsom på macOS kørsel:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --remote-debugging-port=9222
```

Det vil output noget i retning af:

```txt
DevTools lytter på ws://127.0.0.1:9222/devtools/browser/4dcf09f2-ba2b-463a-8ff5-90d27c6cc913
```

Ovenstående `ws://127.0.0.1:9222/devtools/browser/4dcf09f2-ba2b-463a-8ff5-90d27c6cc913` er grænsefladen til at styre browseren:

```go
pakke main

import (
    "github.com/go-rod/rod"
)

func main() {
    u := "ws://127.0.0.1:9222/devtools/browser/4dcf09f2-ba2b-463a-8ff5-90d27c6cc913"
    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

## Launcher lib

Fordi ovenstående arbejdsgang er så ofte brugt, vi abstrakt en `launcher` lib for at forenkle lanceringen af browsere. Såsom automatisk downloade eller søge efter browseren eksekverbare, tilføje eller slette browseren eksekverbare kommandolinjeargumenter, osv.

Så ovenstående manuel lancering og kode bliver:

```go
func main() {
    u:= launcher.Ny().Bin("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome").MustLaunch()
    rod.Ny().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

Vi kan bruge hjælperfunktionen `launcher.LookPath` til at få browseren eksekverbar sti, ovenstående kode er den samme som:

```go
func main() {
    sti, _ := launcher.LookPath()
    u := launcher.New().Bin(sti).MustLaunch()
    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

Hvis `ControlURL` ikke er angivet, vil `MustConnect` køre `launcher.Ny().MustLaunch()` automatisk. Som standard vil launcher automatisk downloade og bruge en statisk versioneret browser, så browseren adfærd er konsekvent. Så du kan forenkle ovenstående kode i:

```go
func main() {
    rod.New().MustConnect().MustPage("https://example.com")
}
```

## Tilføj eller fjern indstillinger

Du kan bruge `Set` og `Slet` til at ændre browserens start argumenter (flag):

```go
pakke main

import (
    "github.com/go-rod/rod"
    "github.com/go-rod/rod/lib/launcher"
)

func main() {
    u := launcher.New().
        Sæt ("user-data-dir", "path").
        Sæt ("headless").
        Sletter ("-- headless").
        MustLaunch()

    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

Som du kan se fra oven, er præfikset `--` valgfri, såsom `headless` og `--headless` de samme.

Fordi indstillinger som `user-data-dir`, `proxy-server`, `headless` bruges så ofte, vi har tilføjet nogle hjælpere til dem, så ovenstående kode kan blive sådan her:

```go
func main() {
    u: = launcher.Ny().
        UserDataDir ("sti").
        Hovedløse (sand).
        Hovedløse (falske).
        MustLaunch()

    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

Her er de tilgængelige flag: [link](https://peter.sh/experiments/chromium-command-line-switches).

Læs API-doc for mere info: [link](https://pkg.go.dev/github.com/go-rod/rod/lib/launcher#Launcher).

## Fjernstyring af launcheren

Til produktion skrabning system, normalt, vil vi adskille skrabere og browsere i forskellige klynger, så de kan skalere separat. Rod leverer modulet `launcher.Manager` til fjernstyring af launcheren. Med det kan vi eksternt starte en browser med brugerdefinerede lancering flag. Eksemplet til at bruge det er [her](https://github.com/go-rod/rod/blob/master/lib/launcher/rod-manager/main.go).

Fordi det er meget svært at installere krom korrekt på nogle linux distributioner, Rod giver et docker billede for at gøre det konsekvent cross platforme. Her er et eksempel til at bruge det:

1. Kør stangbilledet `docker run -p 7317:7317 ghcr.io/go-rod/rod`

2. Åbn en anden terminal og kør kode som dette [eksempel](https://github.com/go-rod/rod/blob/master/lib/examples/launch-managed/main.go)

Billedet er [tunet](https://github.com/go-rod/rod/blob/master/lib/docker/Dockerfile) til skærmbilleder og skrifttyper blandt populære naturlige sprog. Hver beholder kan starte flere browsere på samme tid.

## Brugertilstand :id=user-mode

Når du logger ind på din github konto, og du ønsker at genbruge login sessionen til automatisering opgave. Du kan bruge `launcher.NewUserMode` til at starte din almindelige brugerbrowser. Stang vil være ligesom en browserudvidelse:

```go
wsURL := launcher.NewUserMode().MustLaunch()
browser := rod.New().ControlURL(wsURL).MustConnect().NoDefaultDevice()
```

Her er et mere detaljeret eksempel: [kode eksempel](https://github.com/go-rod/rod/blob/master/lib/examples/use-rod-like-chrome-extension/main.go).

## Lavt Niveau API

Hvis du ønsker at styre hvert trin i startprocessen, såsom deaktivere auto-download og bruge systemets standardbrowser, tjek [eksempelfilen](https://github.com/go-rod/rod/blob/master/lib/launcher/example_test.go).
