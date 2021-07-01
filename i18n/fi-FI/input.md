# Input

Rod tarjoaa paljon menetelmiä simuloida ihmisen syötteitä, kuten hiiren napsautus tai näppäimistön painallus.

## Hiiren napsautus

Napsauta hiiren simulointia varten elementtiä:

```go
// left click
page.MustElement("button").MustClick()

// right click
page.MustElement("button").Click(proto.InputMouseButtonRight)
```

## Text input

Simuloidaksesi syötteen:

```go
el := page.MustElement(`[type="text"]`)
el.MustInput("Jack")

fmt.Println(el.mustText()) // käytä MustTextia saadaksesi tekstin
```

## Poista teksti syötteestä

Vain simuloida miten ihminen sen tekee, valitse kaikki teksti ja korvaa sen tyhjällä merkkijonolla:

```go
sivu.MustElement(`[type="text"]`).MustSelectAllText().MustInput("")
```

Voit käyttää `SelectText` korvataksesi osan tekstistä.

## Ajan syöttö

Tuetut syöttötyypit ovat [päivämäärä](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date), [datetime-local](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local), [kuukausi](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/month), ja [aika](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time).

```go
sivu.MustElement(`[type="date"]`).MustInputTime(time.Now())
```

## Valintaruutu

Klikkaa vain sitä kuin ihmistä:

```go
el := sivu.MustElement(`[type="checkbox"]`)

// tarkista se jos ei ole tarkistettu
jos !el.MustProperty("checked").Bool() {
    el.MustClick()
}
```

## Valitse vaihtoehdot

Valitse vaihtoehdot [`<select>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select).

Alla oleva koodi valitsee vaihtoehdot, jotka sisältävät tekstin "B" tai "C":

```go
sivu.MustElement("valinta").MustSelect("B", "C")
```

Voit myös käyttää regex tai css valitsin valita vaihtoehtoja:

```go
page.MustElement("select").Select([]string{`^B$`}, true, rod.SelectorTypeRegex)

// aseta väärä valinta
sivulle.MustElement("select").Select([]string{`[value="c"]`}, false, rod.SelectorTypeCSSSector)
```

## Aseta tiedostot

Käytä `AsetFiles` asettaaksesi tiedostoja [tiedostolle](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file):

```go
pag.MustElement(`[type=file]`).MustSetFiles("a.jpg", "b.pdf")
```

## Hiiri, näppäimistö ja kosketus

Voit myös käyttää `sivua.Hiiri`, `sivu.Näppäimistö`, tai `sivu.Kosketa` simuloidaksesi matalan tason tuloja. Kuten voit etsiä yksikön testi vetämällä oppia simuloida vedon.
