# Javascript Runtime

We kunnen Rod gebruiken om willekeurige javascript code op de pagina te evalueren. Zoals het gebruiken om de HTML-inhoud van de pagina te lezen of aan te passen.

## Zin op de pagina

Gebruik bijvoorbeeld `Page.Eval` om de globale waarde in te stellen:

```go
page.MustEval(`window.a = {name: 'jack'}`)
```

We kunnen een js-functie gebruiken om waarde door te geven als json argumenten:

```go
key := "a"
data := map[string]string{"name": "jack"}
page.MustEval(`(k, val) => {
    window[k] = val
}`, toets, data)
```

Om de geretourneerde waarde van Eval:

```go
vaal := page.MustEval(`a`).Get("name").Str()
fmt.Println(val) // uitvoer: jack
```

## Definieer een globale functie

De `Page.Evaluate` methode voert de functie uit als deze een functiedefinitie is.

Bijvoorbeeld, de `test` functie hieronder wordt onmiddellijk uitgevoerd, het zal niet worden behandeld als een functie-definitie:

```go
page.MustEval(`function test() { alert('ok') }`)

page.MustEval(`test()`) // paniek met test niet gedefinieerd
```

Om de globale functie `test` te definiëren, kun je deze coderen, omdat de ultraperifere functie een opdracht is en geen functiedefinitie:

```go
page.MustEval(`test = function () { alert('ok') }`)

page.MustEval(`test()`)
```

## Evaal op een element

`Element.Eval` is vergelijkbaar met `Page.Eval`, maar met het `dit` object ingesteld op het huidige element. We hebben bijvoorbeeld een `<button>Verzenden</button>` op de pagina, we kunnen het element lezen of wijzigen met JS:

```go
el := page.MustElement("knop")
el.MustEval(`this.innerText = "Apply"`) // Wijzig de inhoud
txt := el.MustEval(`this.innerText`).Str()
fmt.Println(txt) // output: Toepassen
```

## Go-functies blootstellen aan de pagina

We kunnen `Page.Expose` gebruiken om callback-functies bloot te stellen aan de pagina. Hier leggen we bijvoorbeeld een functie bloot om de pagina te helpen md5 hash te berekenen:

```go
page.MustExpose("md5", func(g gson.JSON) (interface{}, error) {
    return md5.Sum([]byte(g.Str())), nil
})
```

Nu kan de pagina deze methode aanroepen op het vensterobject:

```go
hash := page.MustEval(`window.md5("test").Str()
```
