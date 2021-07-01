# Mukautettu Selaimen Käynnistys

## Yhdistä käynnissä olevaan selaimeen

Etsi selaimesi tiedostopolku, kuten macOS:n ajon yhteydessä:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --remote-debugging-port=9222
```

Se tuottaa jotain kuten:

```txt
DevTools kuuntelee ws://127.0.0.1:9222/devtools/browser/4dcf09f2-ba2b-463a-8ff5-90d27c6cc913
```

Yllä olevat `ws://127.0.0.1:9222/devtools/browser/4dcf09f2-ba2b-463a-8ff5-90d27c6cc913` on selainta ohjaava käyttöliittymä:

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

## Käynnistäjän lib

Koska yllä olevaa työnkulkua käytetään niin usein, me abstrakti `launcher` lib yksinkertaistaa käynnistää selaimet. Kuten automaattisesti ladata tai etsiä selaimen suoritettava, lisätä tai poistaa selaimen suoritettavan komentorivin parametrit jne.

Joten edellä manuaalinen käynnistys ja koodi tulee:

```go
func main() {
    u := launcher.New().Bin ("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome").MustLaunch()
    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

Voimme käyttää aputoimintoa `launcher.LookPath` saadaksemme selaimen suoritettavan polun, yllä oleva koodi on sama:

```go
func main() {
    polku, _ := launcher.LookPath()
    u := launcher.New().Bin(path).MustLaunch()
    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")

```

Jos `ControlURL` ei ole asetettu, `MustConnect` suorittaa `launcher.New().MustLaunch()` automaattisesti. Oletuksena käynnistin lataa ja käyttää automaattisesti staattisesti versioitua selainta niin, että selain käyttäytyminen on johdonmukainen. Voit siis yksinkertaistaa edellä olevaa koodia:

```go
func main() {
    rod.New().MustConnect().MustPage("https://example.com")
}
```

## Lisää tai poista asetuksia

Voit käyttää `Aseta` ja `Poista` muokataksesi selaimen käynnistysargumentteja (liput):

```go
paketin tärkein

tuonti (
    "github.com/go-rod/rod"
    "github.com/go-rod/rod/lib/launcher"
)

func main() {
    u := launcher.New().
        Aseta ("käyttäjä-data-dir", "polku").
        Aseta ("headless").
        Poista("--headless").
        MustLaunch()

    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

Kuten näet yläpuolelta `--` etuliite on valinnainen, kuten `headless` ja `--headless` ovat samat.

Koska valinnat kuten `käyttäjän data-dir`, `välityspalvelin`, `Päättömiä` käytetään niin usein, lisäsimme niille auttajia, joten yllä olevasta koodista voi tulla näin:

```go
func main() {
    u := launcher.New().
        UserDataDir ("polku").
        Päätön (totta).
        Päätön (epätotta).
        MustLaunch()

    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

Tässä on saatavilla liput: [linkki](https://peter.sh/experiments/chromium-command-line-switches).

Lue API doc lisätietoja varten: [linkki](https://pkg.go.dev/github.com/go-rod/rod/lib/launcher#Launcher).

## Käynnistimen etähallinta

Tavallisesti me jaamme kaavinta ja selainet erilaisiin klustereihin niin, että ne voivat skaalata erikseen. Rod tarjoaa moduulin `launcher.Manager` hallita käynnistin etänä. Sen avulla voimme etänä käynnistää selaimen, jossa mukautettuja käynnistyslippuja. Esimerkki käyttää sitä on [täällä](https://github.com/go-rod/rod/blob/master/lib/launcher/rod-manager/main.go).

Koska se on erittäin vaikea asentaa kromi oikein joissakin linux jakeluihin, Rod tarjoaa telakka-kuva, jotta se johdonmukainen cross alustat. Tässä on esimerkki käyttää sitä:

1. Suorita sauvan kuva `telakka ajaa -p 7317:7317 ghcr.io/go-rod/rod`

2. Avaa toinen pääte ja suorita koodi kuten tässä [esimerkissä](https://github.com/go-rod/rod/blob/master/lib/examples/launch-managed/main.go)

Kuva on [viritetty](https://github.com/go-rod/rod/blob/master/lib/docker/Dockerfile) kuvakaappauksiin ja fontteihin suosittujen luonnollisten kielten joukossa. Jokainen säiliö voi käynnistää useita selaimia samanaikaisesti.

## Käyttäjätila :id=käyttäjän tila

Kun kirjaudut github-tilillesi, ja haluat käyttää uudelleen kirjautumisistuntoasi automaatiotehtäväksi. Voit käyttää `launcher.NewUserMode` käynnistääksesi säännöllisen selaimen. Koodi on aivan kuin selaimen laajennus:

```go
wsURL := launcher.NewUserMode().MustLaunch()
selain := rod.New().ControlURL(wsURL).MustConnect().NoDefaultLaite()
```

Tässä on yksityiskohtaisempi esimerkki: [koodi esimerkki](https://github.com/go-rod/rod/blob/master/lib/examples/use-rod-like-chrome-extension/main.go).

## Matalan Tason API

Jos haluat hallita käynnistysprosessin jokaista vaihetta, kuten poistaa automaattisen lataamisen käytöstä ja käyttää järjestelmän oletusselainta, tarkista [esimerkkitiedosto](https://github.com/go-rod/rod/blob/master/lib/launcher/example_test.go).
