# Start egen nettleser

## Koble til en løpende nettleser

Finn den kjørbare banen til nettleseren din, for eksempel på macOS kjøring:

```bash
"/Applikasjoner/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --remote-debugging-port=9222
```

Det vil vise noe som:

```txt
DevTools lytter på ws://127.0.0.1:9222/devtools/browser/4dcf09f2-ba2b-463a-8ff5-90d27c6cc913
```

The above `ws://127.0.0.0.1:9222/devtools/browser/4dcf09f2-ba2b-463a-8ff5-90d27c6cc913` er grensesnittet til å kontrollere nettleseren:

```go
pakkens viktigste

import (
    "ofimgo-rod/rod"
)

func main() {
    u := "ws://127.0.1:9222/devtools/browser/4dcf09f2-ba2b-463a-8ff5-90d27c6cc913"
    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")

```

## Launcher lib

Fordi arbeidsflyten over brukes er så ofte vi abstract a `launcher` lib for å forenkle lanseringen av nettlesere. Slik som det automatisk lastes ned eller søker etter nettleserens kjørbare, legg til eller slett nettleserens kjørbare kommando-linje-argumenter, osv.

Så ovennevnte manuell start og kode blir:

```go
func main() {
    u := launcher.New().Bin("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome").MustLaunch()
    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")

```

Vi kan bruke hjelper-funksjonen `launcher.LookPath` for å få nettleserens kjørbare bane, koden ovenfor er den samme som:

```go
func main() {
    path, _ := launcher.LookPath()
    u := launcher.New().Bin(path).MustLaunch()
    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

Hvis `ControlURL` ikke er satt, vil `MustConnect` kjøre `launcher.New().MustLaunch()` automatisk. Som standard vil startskjermbildet automatisk laste ned og bruke en statisk versjonert nettleser slik at nettleseren fungerer konsekvent. Så du kan forenkle ovennevnte kode til:

```go
func main() {
    rod.New().MustConnect().MustPage("https://example.com")

```

## Legge til eller fjerne alternativer

Du kan bruke `Sett` og `Slett` for å endre nettleserens startargumenter (flagger):

```go
pakkens viktigste

import (
    "github.com/go-rod/rod"
    "ocepgo-rod/lib/launcher"
)

morsomme main() {
    u := launcher.New().
        Set("user-data-dir", "path").
        Angi(headless").
        Slett(--headless").
        MustLaunch()

    rod.New().ControlURL(u).MustConnect().MustPage(https://example.com")

```

Som du ser ovenfra er `--` prefikset valgfri, for eksempel `headless` og `--headless` den samme.

Fordi valg som `user-data-dir`, `proxy-server`, `headless` er så ofte brukt, har vi lagt til noen hjelpere for dem, så koden ovenfor kan bli slik:

```go
morsomme main() {
    u := launcher.New().
        BrukerDataDir("sti").
        Hodetelefon(sann)
        Hodetelse(falsk).
        MustLaunch()

    rod.New().ControlURL(u).MustConnect().MustPage(https://example.com")

```

Her er de tilgjengelige flaggene: [link](https://peter.sh/experiments/chromium-command-line-switches).

Les API doc for mer informasjon: [link](https://pkg.go.dev/github.com/go-rod/rod/lib/launcher#Launcher).

## Remotely administrere launcheren

For produksjonsscraping vil vi vanligvis skille skraperne og nettleseren i forskjellige klynger slik at de kan skalere separat. Rod tilbyr modulen `launcher.Manager` for å administrere launcheren eksternt. Med den kan vi eksternt starte en nettleser med egendefinerte startflagg. Eksemplet for bruk er [her](https://github.com/go-rod/rod/blob/master/lib/launcher/rod-manager/main.go).

Fordi det er veldig vanskelig å installere krom riktig på noen linux distribusjoner, Rod gir et forankringsbilde som gjør det konsekvent kryssplattformer. Her er et eksempel som skal brukes:

1. Kjør stavbildet `docker kjører -p 7317:7317 ghcr.io/go/stang`

2. Åpne en annen terminal og kjør kode som dette [eksempelet](https://github.com/go-rod/rod/blob/master/lib/examples/launch-managed/main.go)

Bildet er [tuned](https://github.com/go-rod/rod/blob/master/lib/docker/Dockerfile) for skjermbilder og skrifter blant populære naturspråk. Hver beholder kan starte flere nettlesere samtidig.

## Brukermodus :id=user-mode

Når du logger inn på din github konto, ønsker du å bruke påloggingsøkten på nytt. Du kan bruke `launcher.NewUserMode` for å starte din vanlige brukernettleser. Torsk blir akkurat som en nettleserutvidelse:

```go
wsURL := launcher.NewUserMode().MustLaunch()
nettleser := rod.New().ControlURL(wsURL).MustConnect().NoDefaultDevice()
```

Her er et mer detaljert eksempel: [code example](https://github.com/go-rod/rod/blob/master/lib/examples/use-rod-like-chrome-extension/main.go).

## Lavnivå API

Hvis du vil kontrollere alle trinn i startprosessen, som for eksempel å deaktivere auto-nedlasting og bruke systemets standardnettleser, sjekk [eksempelfil](https://github.com/go-rod/rod/blob/master/lib/launcher/example_test.go).
