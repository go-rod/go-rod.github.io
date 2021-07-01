# Začněte s prutem

## Požadavky

[Golang](https://golang.org/) je jediným požadavkem, ani nemusíte vědět nic o HTML.

Pokud jste Golang nikdy nepoužívali, [nainstalujte ho](https://golang.org/doc/install) a můžete ho zvládnout v hodinách: [prohlídka Go](https://tour.golang.org/welcome).

## První program

Pojďme použít pro otevření stránky a pořízení snímku obrazovky, nejprve vytvořte soubor "main.go" s níže uvedeným obsahem:

```go
balíček main

import "github.com/go-rod/rod"

func main() {
    page := rod.New().MustConnect().MustPage("https://www.wikipedia.org/")
    page.MustWaitLoad().MustScreenshot("a.png")
}
```

`rod.New` vytvoří objekt prohlížeče, `MustConnect` spustí a připojí se k prohlížeči. `MustPage` vytváří objekt stránky, je to jako záložka stránky v prohlížeči. `MustWaitLoad` čeká na celou stránku. `MustScreenshot` pořídí snímek stránky.

Vytvořit modul:

```bash
go env -w GOPROXY=https://goproxy.io,direct
go mod init learn-rod
go mod tidy
```

Spustit modul:

```bash
běžet .
```

Program vypíše snímek obrazovky "a.png" jako níže uvedený obrázek:

![První program](first-program.png)

## Podívejte se, co je pod kapotou

Pro vysoce postavené vývojáře můžete přeskočit všechny a přečíst si tento soubor: [odkaz](https://github.com/go-rod/rod/blob/master/examples_test.go).

Ve výchozím nastavení přepínač vypne uživatelské rozhraní prohlížeče, aby maximalizoval výkon. Při vývoji automatizačního úkolu se však obvykle více staráme o snadnost ladění. Rod poskytuje spoustu řešení, která vám pomohou ladit kód.

Vytvořme konfigurační soubor ".rod" v aktuálním pracovním adresáři. Obsah je:

```txt
ukázat
```

Znamená to "zobrazit uživatelské rozhraní prohlížeče na popředí". Než znovu spustíme modul, pojďme připojit `time.Sleep(čas). naše)` na konec kódu tak, aby nebyl příliš rychlý na to, aby ho naše oči chytily, kód "main. o" se nyní stává:

```go
balíček main

import (
    "time"

    "github.com/go-rod/rod"
)

func main() {
    page := rod.New().MustConnect().MustConnect().MustPage("https://www.wikipedia.org/")
    page.MustWaitLoad().MustScreenshot("a.png")
    time.Sleep(time.Hour)
}
```

Pokud znovu spustíte modul, měli byste vidět tento prohlížeč:

![ukázat](show.png)

Stiskněte [CTRL + C](https://en.wikipedia.org/wiki/Control-C) na klávesnici pro zastavení programu.

## Vstup a kliknutí

Pojďme webové stránky automaticky vyhledat klíčové slovo "Zemi". Webová stránka může obsahovat mnoho vstupních polí nebo tlačítek, potřebujeme říct programu, který má manipulovat. Obvykle používáme [Devtools](https://developers.google.com/web/tools/chrome-devtools/) , abychom nám pomohli najít prvek, který chceme ovládat. pojďme připojit novou konfiguraci k souboru ".rod", který umožní Devtools, nyní se stává:

```txt
show
devtools
```

Spustit "main. o" znovu, přesuňte myší do vstupního pole a klepněte pravým tlačítkem nad ním, uvidíte kontextové menu a poté klikněte na "Inkoust":

![zkontrolovat](inspect.png)

Měl bys vidět `<vstup id="searchInput` jako níže:

![input](input.png)

Kliknutím pravým tlačítkem myši zkopírujete [css selektor](css-selector.md) jako výše uvedený obrázek. Obsah na vaší schránce bude "#searchInput". Použijeme ji k nalezení prvku pro zadání klíčového slova. Nyní se stává "main.go":

```go
package main

import (
    "time"

    "github.com/go-rod/rod"
)

func main() {
    page := rod.New().MustConnect().MustPage("https://www.wikipedia.org/").MustWindowFullscreen()

    page.MustElement("#searchInput").MustInput("earth")

    page.MustWaitLoad().MustScreenshot("a.png")
    time.Sleep(time.Hour)
}
```

`MustWindowFullscreen` změní velikost okna prohlížeče, aby bylo snazší ladit. Používáme `MustElement` a selektor, který jsme zkopírovali z Devtools panelu , abychom získali prvek, se kterým chceme manipulovat. `MustElement` bude automaticky čekat, až se prvek objeví, proto nepotřebujeme použít `MustWaitLoad` před ním. Pak nazýváme `MustInput` , aby do něj vložil klíčové slovo "Zemi". Pokud se znovu objeví "main.go", uvidíte, že výsledek vypadá níže:

![po vstupu](after-input.png)

Podobné vstupnímu poli pojďme pravým tlačítkem myši vyhledat zkopírovat selektor:

![vyhledávací btn](search-btn.png)

![selektor hledání](search-btn-selector.png)

Poté přidejte kód pro kliknutí na tlačítko hledání, nyní vypadá "main.go":

```go
balíček main

import "github.com/go-rod/rod"

func main() {
    page := rod.New().MustConnect().MustPage("https://www.wikipedia.org/").MustWindowFullscreen()

    page.MustElement("#searchInput").MustInput("earth")
    page.MustElement("#search-form > fieldset > button").MustClick()

    page.MustWaitLoad().MustScreenshot("a.png")
}
```

Pokud modul obnovíme, "a.png" zobrazí výsledek vyhledávání:

![zemská stránka](earth-page.png)

## Zpomalený pohyb a vizuální stopa

Automatizované operace jsou příliš rychlé na to, aby se člověk mohl chytit, pro ladění je obvykle povolujeme nastavení zpomalující a vizuální stopy, pojďme aktualizovat ". od" soubor:

```txt
zobrazit
slow=1s
stopu
```

Pak znovu modul spustit, nyní každá akce bude čekat 1 sekundu před jeho provedením. Na stránce uvidíte trasu ladění generovanou čárkou jako níže:

![stopa](trace.png)

Jak vidíte na tlačítku vyhledávání, prut vytvoří skvělý kurzor myši.

Na konzoli uvidíte protokol jako níže:

```txt
[rod] 2020/11/11 11:11:11 [eval] {"js":"rod.element","params":["#searchInput"]}
[rod] 2020/11/11 11:11:11 [eval] {"js":"rod. izibilní“, this":"input#searchInput"}
[rod] 2020/11/11 11:11:11 [input] přejít do view
[rod] 2020/11/11 11:11:11:11 [input] vstupní země
[rod] 2020/11/11 11:11:11 [eval] {"js":"rod. lement","params":["#search-form > fieldset > button"]}
[rod] 2020/11/11 11:11:11:11 [eval] {"js":"rod.visible","tohle":"button.pure-button. ure-button-primary progresive"}
[rod] 2020/11/11 11:11:11 [input] přejít k zobrazení
[rod] 2020/11/11 11:11:11 [input] klikněte levým tlačítkem
```

## Jiný než soubor ".rod"

„“. od" soubor je jen zkratka pro některé běžně používané API, můžete je také ručně nastavit v kódu, jako "pomalý", kód pro nastavení je jako `tyč. ew().SlowMotion(2 * čas.second)`. Můžete také použít proměnnou prostředí pro její nastavení, například na Mac nebo Linuxu: `rod=show go main.go`.

## Získat textový obsah

Bůh poskytuje spoustu šikovných metod pro načtení obsahu ze stránky.

Pojďme se pokusit získat popis Země, použít stejnou techniku, jakou jsme dříve použili pro kopírování selektoru z Devtoolů:

![get-text](get-text.png)

Metoda, kterou používáme, je `MustText`, zde je jeho úplný kód:

```go
hlavní

import balíčku (
    "fmt"

    "github. om/go-rod/rod"
)

func main() {
    page := rod. ew().MustConnect().MustPage("https://www.wikipedia.org/")

    page.MustElement("#searchInput"). ustInput("earth")
    page.MustElement("#search-form > fieldset > button").MustClick()

    el := page. ustElement("#mw-content-text > div.mw-parser-output > p:nth-child (6)")
    fmt.Println(el.MustText())
}
```

Pokud modul obnovíme, měli bychom vidět výstupy konzoly jako:

```txt
Země je třetí planeta ze slunce a jediný astronomický objekt, o kterém je známo, že má život.
...
```

## Získat obsah obrázku

Stejně jako získat text, můžeme také získat obrázky ze stránky, Pojďme získat selektor obrázku Země a použij `MustResource` k získání binární verze obrázku:

![get-image](get-image.png)

Celý kód je:

```go
hlavní

import (
    "github.com/go-rod/rod"
    "github. om/go-rod/rod/lib/utils"
)

func main() {
    page := rod. ew().MustConnect().MustPage("https://www.wikipedia.org/")

    page.MustElement("#searchInput").MustInput("earth")
    stránka. ustElement("#search-form > fieldset > button").MustClick()

    el := page.MustElement("#mw-content-text > div.mw-parser-výstup > tabulka. nfobox > ttělo > tr:dítě (1) > td > a > img")
    _ = užití. utputFile("b.png", el.MustResource())
}
```

Výstupní soubor "b.png" by měl být:

![Země](earth.png)
