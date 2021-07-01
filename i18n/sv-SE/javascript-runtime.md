# Javascript körtid

Vi kan använda Rod för att utvärdera slumpmässig javascript kod på sidan. Som att använda den för att läsa eller ändra HTML-innehållet på sidan.

## Eval på sidan

Använd till exempel `Page.Eval` för att ange globalt värde:

```go
sida.MustEval(`window.a = {name: 'jack'}`)
```

Vi kan använda en js-funktion för att passera värde som json-argument:

```go
nyckel := "a"
data := karta[string]string{"name": "jack"}
sida.MustEval(`(k, val) => {
    fönster[k] = val
}`, nyckel, data)
```

För att få tillbaka värdet från Eval:

```go
val := sida.MustEval(`a`).Get("namn").Str()
fmt.Println(val) // utdata: jack
```

## Definiera en global funktion

Metoden `Page.Evaluate` kommer att utföra funktionen om dess yttersta är en funktionsdefinition.

Till exempel, funktionen `test` nedan kommer att köras omedelbart, det kommer inte att behandlas som en funktionsdefinition:

```go
page.MustEval(`function test() { alert('ok') }`)

page.MustEval(`test()`) // panik med test inte definierad
```

För att definiera den globala funktionen `test` kan du koda så här, eftersom det yttersta är en uppgift, inte en funktionsdefinition:

```go
page.MustEval(`test = funktion () { alert('ok') }`)

page.MustEval(`test()`)
```

## Eval på ett element

`Element.Eval` är liknande med `Page.Eval`, men med `detta` objekt satt till det aktuella elementet. Till exempel har vi en `<button>Skicka</button>` på sidan, vi kan läsa eller ändra elementet med JS:

```go
el := page.MustElement("button")
el.MustEval(`this.innerText = "Apply"`) // Modifiera innehållet
txt := el.MustEval(`this.innerText`).Str()
fmt.Println(txt) // output: Apply
```

## Exponera Go funktioner för sidan

Vi kan använda `Page.Expose` för att exponera callback-funktioner på sidan. Till exempel, här utsätter vi en funktion för att hjälpa sidan att beräkna md5 hash:

```go
page.MustExpose("md5", func(g gson.JSON) (interface{}, error) {
    return md5.Sum([]byte(g.Str())), nil
})
```

Nu kan sidan åberopa denna metod på fönsterobjektet:

```go
hash := sida.MustEval(`window.md5("test")`).Str()
```
