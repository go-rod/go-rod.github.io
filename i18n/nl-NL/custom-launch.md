# Aangepaste browser starten

## Verbinding maken met een actieve browser

Zoek het uitvoerbare pad van uw browser, zoals op macOS draait

```bash
"/Applicaties/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --remote-debugging-port=9222
```

Het zal iets opleveren zoals:

```txt
DevTools die luisteren op ws://127.0.0.1:9222/devtools/browser/4dcf09f2-ba2b-463a-8ff5-90d27c6cc913
```

Bovenstaande `ws://127.0.0.1:9222/devtools/browser/4dcf09f2-ba2b-463a-8ff5-90d27c6cc913` is de interface om de browser te besturen:

```go
Pakket main

import (
    "github.com/go-rod/rod
)

func main() {
    u := "ws://127.0.0.1:9222/devtools/browser/4dcf09f2-ba2b-463a-8ff5-90d27c6cc913"
    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

## De launcher lib

Omdat de bovenstaande workflow zo vaak wordt gebruikt, abstract een `launcher` lib om het starten van browsers te vereenvoudigen. Zoals automatisch downloaden of zoeken naar de browser uitvoerbaar, toevoegen of verwijderen van de browser uitvoerbare command-line argumenten, etc.

De bovenstaande handmatige lancering en code wordt dus:

```go
func main() {
    u := launcher.New().Bin("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome").MustLaunch()
    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

We kunnen de helperfunctie `launcher.LookPath` gebruiken om het browser uitvoerbare pad te krijgen, bovenstaande code is hetzelfde:

```go
func main() {
    path, _ := launcher.LookPath()
    u := launcher.New().Bin(path).MustLaunch()
    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

Als `ControlURL` niet is ingesteld, zal de `MustConnect` automatisch worden uitgevoerd `launcher.New().MustLaunch()` Standaard zal de launcher automatisch een statisch versie browser downloaden en gebruiken zodat het gedrag van de browser coherent is. Zo kunt u de bovenstaande code vereenvoudigen in:

```go
func main() {
    rod.New().MustConnect().MustPage("https://example.com")
}
```

## Opties toevoegen of verwijderen

U kunt de `Set` en `Delete` gebruiken om de browser opstart argumenten te wijzigen (vlaggen):

```go
Pakket main

import (
    "github.com/go-rod/rod
    "github.com/go-rod/rod/lib/launcher"
)

func main() {
    u := launcher.New().
        Set("user-data-dir", "path").
        Set("headless").
        Verwijderen("--headless").
        MustLaunch()

    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

Zoals je kan zien is het `--` voorvoegsel optioneel, zoals `headless` and `--headless` hetzelfde.

Omdat opties zoals `user-data-dir`, `proxy-server`, `headless` worden zo vaak gebruikt, we hebben enkele helpers voor hen toegevoegd, zodat de bovenstaande code als volgt kan worden:

```go
func main() {
    u := launcher.New().
        Dir("pad").
        Hoofdles(waar).
        Hoofdles(onwaar).
        MustLaunch()

    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

Hier zijn de beschikbare markeringen: [link](https://peter.sh/experiments/chromium-command-line-switches).

Lees de API doc voor meer informatie: [link](https://pkg.go.dev/github.com/go-rod/rod/lib/launcher#Launcher).

## De launcher op afstand beheren

Voor productie scraping systeem zullen we meestal de scrapers en browsers scheiden in verschillende clusters, zodat ze afzonderlijk kunnen schalen. Rod biedt de module `launcher.Manager` aan om de launcher op afstand te beheren. Hiermee kunnen we op afstand een browser starten met aangepaste opstart vlaggen. Het voorbeeld dat gebruikt moet worden is [hier](https://github.com/go-rod/rod/blob/master/lib/launcher/rod-manager/main.go).

Omdat het erg moeilijk is om chroom correct te installeren bij sommige linux distributies, Rod biedt een docker afbeelding om het consistente cross platforms te maken. Hier is een voorbeeld om het te gebruiken:

1. Voer de staaf afbeelding uit `docker run -p 7317:7317 ghcr.io/go-rod/std`

2. Open een andere terminal en voer code uit zoals dit [voorbeeld](https://github.com/go-rod/rod/blob/master/lib/examples/launch-managed/main.go)

De afbeelding wordt [aangepast](https://github.com/go-rod/rod/blob/master/lib/docker/Dockerfile) voor screenshots en lettertypen onder de populaire natuurlijke talen. Elke container kan meerdere browsers tegelijkertijd lanceren.

## Gebruiker-modus :id=user-mode

Wanneer je inlogt op je github account en je wilt de login sessie opnieuw gebruiken voor automatiseringtaak. U kunt de `launcher.NewUserMode` gebruiken om uw normale gebruikersbrowser te starten. Rod wordt net als een browserextensie:

```go
wsURL := launcher.NewUserMode().MustLaunch()
browser := rod.New().ControlURL(wsURL).MustConnect().NoDefaultDevice()
```

Hier is een meer gedetailleerd voorbeeld: [code voorbeeld](https://github.com/go-rod/rod/blob/master/lib/examples/use-rod-like-chrome-extension/main.go).

## API op laag niveau

Als u elke stap van het starten wilt beheren, zoals uitschakelen van de auto-download en gebruik de standaard browser van het systeem, controleer het [voorbeeldbestand](https://github.com/go-rod/rod/blob/master/lib/launcher/example_test.go).
