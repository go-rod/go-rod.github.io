# Javascript Runtime

Vi kan bruke Rod til å evaluere tilfeldig javascript-kode på siden. Slik som bruk den for å lese eller endre HTML-innholdet på siden.

## Evaluering på siden

For eksempel bruk `Side.Eval` for å angi global verdi:

```go
side.MustEval(`window.a = {name: 'jack'}`)
```

Vi kan bruke en js-funksjon for å inngi verdi som json-argumenter:

```go
nøkkel := "a"
data := kart[string]streng{"name": "jack"}
side.MustEval(`(k, val) => {
    vindu[k] = val
}`, nøkkel, data)
```

For å få den returnerte verdien fra Eval:

```go
val := page.MustEval(`a`).Get("name").Str()
fmt.Println(val) // output: jekkbar
```

## Definer en global funksjon

`Side.Evaluer` -metoden vil utføre funksjonen hvis dens ytterste er en funksjonsdefinisjon.

Funksjonen `test` nedenfor vil for eksempel bli utført umiddelbart, og den vil ikke bli behandlet som funksjons-definisjon:

```go
page.MustEval(`function test() { alert('ok') }`)

page.MustEval(`test()`) // panic med test som ikke er definert
```

For å definere den globale funksjonen `test` kan du kode som dette, fordi det ytterste er en tildeling, ikke en funksjonsdefinisjon:

```go
page.MustEval(`test = funksjon () { alert('ok') }`)

page.MustEval(`test()`)
```

## Eval på et element

`Element.Eval` er lik med `Side.Eval`, men med `dette objektet` satt til det gjeldende elementet. For eksempel har vi et `<button>Send</button>` på siden, vi kan lese eller endre elementet ved hjelp av JS:

```go
el := page.MustElement("button")
el.MustEval(`this.innerText = "Apply"`) // endre innholdet
txt := el.MustEval(`this.innerText`).Str()
fmt.Println(txt) // output: Anven:
```

## Eksponer Gå funksjoner til siden

Vi kan bruke `Side.Expose` for å utsette tilbakeringingsfunksjoner til siden. Her utvider vi for eksempel en funksjon som hjelper siden til beregner md5 hash:

```go
page.MustExpose("md5", funksjoner (g gson.JSON) (interface{}, error) {
    return md5.Sum([]byte(g.Str()), nil
})
```

Nå kan siden påberope seg denne metoden i vindusobjektet:

```go
hash := page.MustEval(`window.md5("test")`).Str()
```
