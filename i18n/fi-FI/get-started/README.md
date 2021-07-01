# Aloita sauvan avulla

## Vaatimukset

[Golang](https://golang.org/) on ainoa vaatimus, sinun ei tarvitse edes tietää mitään HTML:stä.

Jos et ole koskaan käyttänyt Golangia, [asenna](https://golang.org/doc/install) se ja voit hallita sitä tunneissa: [A tour of Go](https://tour.golang.org/welcome).

## Ensimmäinen ohjelma

Käytetään sauvaa avaamaan sivu ja ottamaan siitä kuvakaappaus, ensin luo "main.go"-tiedosto, jonka sisältö on alla:

```go
paketin pääasiallinen

tuonti "github.com/go-rod/rod"

func main() {
    page := rod.New().MustConnect().MustPage("https://www.wikipedia.org/")
    sivu.MustWaitLoad().MustScreenshot("a.png")
}
```

The `rod.New` creates a browser object, the `MustConnect` launches and connects to a browser. The `MustPage` luo sivun objektin, se on kuin sivun välilehti selaimessa. The `MustWaitLoad` odottaa sivun olevan täysin ladattu. The `MustScreenshot` ottaa kuvakaappauksen sivulta.

Luo moduuli:

```bash
go env -w GOPROXY=https://goproxy.io,direct
go mod init learn-rod
go mod sidy
```

Suorita moduuli:

```bash
go run .
```

Ohjelma tuottaa kuvakaappauksen "a.png", kuten alla:

![ensimmäinen ohjelma](first-program.png)

## Katso, mitä on alla huppu

Vanhempien kehittäjien kohdalla voit ohittaa kaikki ja lukea tämän tiedoston: [linkki](https://github.com/go-rod/rod/blob/master/examples_test.go).

Oletuksena Rod poistaa selaimen käyttöliittymän käytöstä maksimoidakseen suorituskyvyn. Mutta kun kehitämme automaatiotehtävää me yleensä välitämme enemmän helppous vianetsintä. Rod tarjoaa paljon ratkaisuja, joiden avulla voit korjata koodin.

Luodaan ".rod"- asetustiedosto nykyisen työhakemiston alle. Sisältö on:

```txt
näytä
```

Se tarkoittaa "näytä selaimen käyttöliittymä etualalla". Ennen kuin teemme moduulin uudestaan, liitämme `aikaa.Nuku (aika). me)` koodin loppuun asti niin, että se ei ole liian nopea silmiemme kiinni sitä, koodi on "tärkeä. o" nyt tulee:

```go
package main

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

Jos käytät moduulia uudelleen, sinun pitäisi nähdä selain näin:

![näytä](show.png)

Paina [CTRL + C](https://en.wikipedia.org/wiki/Control-C) näppäimistöllä pysäyttääksesi ohjelman.

## Syöte ja napsauta

Automatisoidaan sivusto etsimään avainsanaa "maa". Sivustolla voi olla monia kenttiä tai painikkeita, meidän on kerrottava ohjelmalle mitä manipuloidaan. Yleensä käytämme [Devtools](https://developers.google.com/web/tools/chrome-devtools/) auttaaksemme meitä löytämään elementin, jota haluamme hallita. liitetään uusi config tiedostoon ".rod" jotta Devtools, nyt se tulee:

```txt
show
devtools
```

Suorita "tärkein. o" taas siirrä hiiren syöttökenttään ja napsauta hiiren kakkospainikkeella sen yläpuolella, näet kontekstivalikon ja napsauta sitten "inspect":

![tarkasta](inspect.png)

Sinun pitäisi nähdä `<tulo id="searchInput` kuten alla:

![input](input.png)

Napsauta hiiren oikealla painikkeella kopioidaksesi [css valitsin](css-selector.md) kuten yllä oleva kuva. Sisältö leikepöydälle tulee olemaan "#searchInput". Käytämme sitä löytääksemme -elementin syöttääksemme avainsanan. Nyt "main.go" tulee:

```go
package main

import (
    "time"

    "github. om/go-rod/rod"
)

func main() {
    page := rod.New().MustConnect().MustPage("https://www.wikipedia. rg/").MustWindowFullscreen()

    sivu.MustElement("#searchInput").MustInput("maa")

    sivu.MustWaitLoad().MustScreenshot("a.png")
    time.Sleep(time.Hour)
}
```

The `MustWindowFullscreen` kokoaa selainikkunan kokoon, jotta vianetsintä olisi helpompaa. Käytämme `MustElement` ja kopioimaamme valitsinta Devtools paneelista saadaksemme elementin, jota haluamme manipuloida. The `MustElement` will automatically wait until the element appears, so we need to use `MustWaitLoad` before it. Sitten kutsumme `MustInput` syöttämään avainsanan "maa" siihen. Jos uudelleen "main.go", sinun pitäisi nähdä tulos näyttää alla:

![jälkikäteen](after-input.png)

Samoin kuin syötekentässä napsautetaan hiiren kakkospainikkeella hakua kopioimaan valitsin sen varten:

![haku-btn](search-btn.png)

![search-btn-valitsin](search-btn-selector.png)

Sitten lisää koodi napsauttamalla hakupainiketta, nyt "main.go" näyttää kuin:

```go
package main

import "github.com/go-rod/rod"

func main() {
    page := rod.New().MustConnect().MustPage("https://www.wikipedia.org/").MustWindowFullscreen()

    page.MustElement("#searchInput").MustInput("earth")
    page.MustElement("#search-form > fieldset > button").MustClick()

    page.MustWaitLoad().MustScreenshot("a.png")
}
```

Jos me uudelleen moduuli, "a.png" näyttää hakutuloksen:

![maan päällä](earth-page.png)

## Hidas liike ja visuaalinen jälki

Automatisoidut toiminnot ovat liian nopeita ihmisen silmien kiinni, debug niitä me yleensä mahdollistaa hidas-motion ja visuaalinen jäljitys configs, päivitetään ". od" tiedosto:

```txt
näytä
slow=1s
jälki
```

Sitten uudelleen moduuli, nyt jokainen toiminto nyt odottaa 1 sekunnin ennen sen suorittamista. Sivulla, näet Rod tuottaman debug jäljen kuten alla:

![jälki](trace.png)

Kuten näet hakupainikkeessa, Rod luo hiiren hiiren kohdistimen (mock mouse cursor).

Konsolilla näet jäljityslogin, kuten alla:

```txt
[rod] 2020/11/11 11:11:11 [eval] {"js":"rod.element","params":["#searchInput"]}
[rod] 2020/11/11 11:11:11 [eval] {"js":"rod. näkyvä", this":"input#searchInput"}
[rod] 2020/11/11 11:11:11 [input] vieritä näkymään
[rod] 2020/11/11 11:11:11 [input] syöttää maapallon
[rod] 2020/11/11 11:11:11 [eval] {"js":"rod. lement","params":["#search-form > fieldset > button"]}
[rod] 2020/11/11 11:11:11 [eval] {"js":"rod.visible","this":"button.pure-button. ure-nappi-etu-progressiivinen"}
[rod] 2020/11/11 11:11:11 [input] vieritä näkymään
[rod] 2020/11/11 11:11:11 [input] vasemmalla klikkauksella
```

## Muu kuin ".rod" tiedosto

The ". od" tiedosto on vain pikanäppäin joillekin yleisesti käytetylle APIlle, voit myös määrittää ne manuaalisesti, kuten "hidas", sen asettama koodi on kuin `sauva. ew().SlowMotion(2 * aikaa.Sekunti)`. Voit myös käyttää ympäristömuuttujaa asettaaksesi sen, kuten Macissa tai Linuxissa: `rod=show main.go`.

## Hae tekstin sisältö

Rod tarjoaa paljon käteviä menetelmiä noutaa sisältö sivulta.

Yritetään saada kuvaus maapallosta, käyttää samaa tekniikkaa, jota olemme aiemmin käyttäneet kopioidaksemme valitsin Devtools:

![get-teksti](get-text.png)

Käyttämämme menetelmä on `MustText`, tässä on sen koko koodi:

```go
paketin tärkein

tuonti (
    "fmt"

    "github. om/go-rod/rod"
)

func main() {
    sivu := sauva. ew().MustConnect().MustPage("https://www.wikipedia.org/")

    page.MustElement("#searchInput"). ustInput("maa")
    sivu.MustElement("#search-form > fieldset > painike").MustClick()

    el := sivu. ustElement("#mw-content-text > div.mw-parser-output > p:nth-child(6)")
    fmt.Println(el.MustText())
}
```

Jos me uudelleen moduuli, meidän pitäisi nähdä konsoli tuotokset jotain:

```txt
Maa on kolmas planeetta auringosta ja ainoa tähtitieteellinen esine, joka tunnetaan Satama elämä.
...
```

## Hae kuvan sisältö

Sama kuin saada tekstiä, voimme myös saada kuvia sivulta, Saadaan maapallon kuvan valitsin ja käytä `MustResource` saadaksesi kuvan binäärin:

![get-image](get-image.png)

Koko koodi on:

```go
paketin tärkeimmät

tuonti (
    "github.com/go-rod/rod"
    "github. om/go-rod/rod/lib/utils"
)

func main() {
    sivu := sauva. ew().MustConnect().MustPage("https://www.wikipedia.org/")

    sivu.MustElement("#searchInput").MustInput("earth")
    sivu. ustElement("#search-form > fieldset > button").MustClick()

    el := sivu.MustElement("#mw-content-text > div.mw-parser-output > table. nfobox > tbody > tr:nth-child(1) > td > a > img")
    _ = utils. utputFile-("b.png", el.MustResource())
}
```

Tulostustiedoston "b.png" pitäisi olla:

![maa](earth.png)
