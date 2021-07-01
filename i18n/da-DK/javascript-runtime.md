# Javascript Runtime

Vi kan bruge Rod til at evaluere tilfældig javascript kode på siden. Såsom bruge det til at læse eller ændre HTML-indholdet på siden.

## Eval på siden

For eksempel brug `Page.Eval` til at angive den globale værdi:

```go
side.MustEval(`window.a = {name: 'jack'}`)
```

Vi kan bruge en js-funktion til at videregive værdien som json-argumenter:

```go
key := "a"
data := map[string]streng{"name": "jack"}
page.MustEval(`(k, val) => {
    vindue[k] = val
}`, nøgle, data)
```

For at få den returnerede værdi fra Eval:

```go
val := page.MustEval(`a`).Get("name").Str()
fmt.Println(val) // Publikation: jack
```

## Definér en global funktion

The `Page.Evaluate` method will execute the function if its outermost is a function definition.

For eksempel vil funktionen `test` nedenfor blive udført med det samme, det vil ikke blive behandlet som en funktionsdefinition:

```go
page.MustEval(`function test() { alert('ok') }`)

page.MustEval(`test()`) // panik med test ikke defineret
```

For at definere den globale funktion `test` kan du kode på denne måde, fordi den yderste periferi er en opgave, ikke en funktionsdefinition:

```go
page.MustEval(`test = funktion () { alert('ok') }`)

page.MustEval(`test()`)
```

## Eval på et element

`Element.Eval` er ens med `Page.Eval`, men med `dette` objekt sat til det aktuelle element. For eksempel har vi en `<button>Send</button>` på siden, vi kan læse eller ændre elementet med JS:

```go
el := page.MustElement("knap")
el.MustEval(`this.innerText = "Apply"`) // Ændr indholdet
txt := el.MustEval(`this.innerText`).Str()
fmt.Println(txt) // output: Anvend
```

## Udsæt Gå funktioner til siden

Vi kan bruge `Page.Expose` til at udsætte tilbagekald funktioner til siden. For eksempel her vi udsætte en funktion til at hjælpe siden til beregne md5 hash:

```go
page.MustExpose("md5", func(g gson.JSON) (interface{}, error) {
    returnerer md5.Sum([]byte(g.Str())), nul
})
```

Nu kan siden påberåbe sig denne metode på vinduet objekt:

```go
hash := page.MustEval(`window.md5 ("test")`).Str()
```
