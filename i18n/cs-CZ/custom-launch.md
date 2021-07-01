# Vlastní spuštění prohlížeče

## Připojit k běžícímu prohlížeči

Najděte cestu ke spuštění vašeho prohlížeče, například při spuštění macOS:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --remote-debugging-port=9222
```

Vytvoří něco podobného:

```txt
DevTools naslouchání na ws://127.0.1:9222/devtools/browser/4dcf09f2-ba2b-463a-8ff5-90d27c6cc913
```

Výše uvedené `ws://127.0.0.1:9222/devtools/browser/4dcf09f2-ba2b-463a-8ff5-90d27c6cc913` je rozhraní pro ovládání prohlížeče:

```go
balíček main

import (
    "github.com/go-rod/rod"
)

func main() {
    u := "ws://127.0.0.1:9222/devtools/browser/4dcf09f2-ba2b-463a-8ff5-90d27c6cc913"
    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

## Hlib spouštěče

Protože je výše uvedený pracovní postup tak často používán, abstraktujeme `spouštěč` lib pro zjednodušení spuštění prohlížečů. Například automaticky stahovat nebo vyhledávat spustitelný soubor prohlížeče, přidat nebo smazat argumenty příkazového řádku prohlížeče, atd.

Výše uvedené ruční spuštění a kód se tedy stane:

```go
func main() {
    u := launcher.New().Bin("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome").MustLaunch()
    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

Můžeme použít pomocnou funkci `launcher.LookPath` pro cestu ke spuštění prohlížeče, výše uvedený kód je stejný jako:

```go
func main() {
    cesta, _ := launcher.LookPath()
    u := launcher.New().Bin(path).MustLaunch()
    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

Pokud není nastavena `ControlURL` , `MustConnect` automaticky spustí `launcher.New().MustLaunch()`. Ve výchozím nastavení se spouštěč automaticky stáhne a použije staticky upravený prohlížeč tak, aby byl konzistentní s chováním. Takže můžete zjednodušit výše uvedený kód do:

```go
func main() {
    rod.New().MustConnect().MustPage("https://example.com")
}
```

## Přidat nebo odebrat možnosti

Můžete použít `Set` a `Delete` pro změnu argumentů spuštění prohlížeče (vlajky):

```go
balík main

import (
    "github.com/go-rod/rod"
    "github.com/go-rod/rod/lib/launcher"
)

func main() {
    u := launcher.New().
        Set("user-data-dir", "path").
        Nastavení (bezhlavé).
        Smazat("--bezhlavé").
        MustLaunch()

    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

Jak vidíte z výše `--` prefix je nepovinný, například `bezhlavý` a `--headless` jsou stejné.

Protože možnosti jako `user-data-dir`, `proxy-server`, `bezhlavá` jsou tak často používány, přidali jsme k nim nějaké pomocníky, takže výše uvedený kód může být takhle:

```go
func main() {
    u := launcher.New().
        UserDataDir("cesta").
        Bezhlav(true).
        Bezhlav(false).
        MustLaunch()

    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

Zde jsou dostupné příznaky: [odkaz](https://peter.sh/experiments/chromium-command-line-switches).

Přečtěte si API doc pro více informací: [odkaz](https://pkg.go.dev/github.com/go-rod/rod/lib/launcher#Launcher).

## Dálkově spravovat spouštěč

Pro systém vrakování výroby obvykle oddělíme škrabáky a prohlížeče do různých uskupení, aby mohly být měřeny odděleně. Režim poskytuje modul `spouštěč.Manager` pro vzdálenou správu spouštěče. S ní můžeme vzdáleně spustit prohlížeč s vlastními indikátory spuštění systému. Příklad, který ho použije, je [zde](https://github.com/go-rod/rod/blob/master/lib/launcher/rod-manager/main.go).

Protože je velmi těžké na některé distribuce linuxu správně nainstalovat chróm, Rod poskytuje obraz doku, aby byl konzistentní křížové platformy. Zde je příklad k použití:

1. Spusťte obraz tyčinky `spuštění doku -p 7317:7317 ghcr.io/go-rod/rod`

2. Otevřete jiný terminál a spusťte kód jako je tento [příklad](https://github.com/go-rod/rod/blob/master/lib/examples/launch-managed/main.go)

Obrázek je [naladěný](https://github.com/go-rod/rod/blob/master/lib/docker/Dockerfile) pro snímky obrazovky a písma mezi populárními přírodními jazyky. Každý kontejner může spustit více prohlížečů najednou.

## Uživatelský režim :id=uživatelský režim

Když se přihlásíte do svého účtu github a chcete znovu použít přihlašovací relaci pro automatizační úlohu. Můžete použít `launcher.NewUserMode` pro spuštění svého běžného uživatelského prohlížeče. Rod bude stejně jako rozšíření prohlížeče:

```go
wsURL := launcher.NewUserMode().MustLaunch()
prohlížeč := rod.New().ControlURL(wsURL).MustConnect().NoDefaultDevice()
```

Zde je podrobnější příklad: [kód příklad](https://github.com/go-rod/rod/blob/master/lib/examples/use-rod-like-chrome-extension/main.go).

## Nízké rozhraní API

Pokud chcete ovládat každý krok procesu spuštění, například vypněte automatické stahování a použijte výchozí prohlížeč systému, zkontrolujte [příklad souboru](https://github.com/go-rod/rod/blob/master/lib/launcher/example_test.go).
