# Javascript běh

K vyhodnocení náhodného javascriptu kódu na stránce můžeme použít prut. Např. používejte jej ke čtení nebo změně obsahu HTML stránky.

## Eval na stránce

Pro nastavení globální hodnoty použijte například `Page.Eval`:

```go
page.MustEval(`window.a = {name: 'jack'}`)
```

Můžeme použít funkci js k převedení hodnoty jako argumenty json:

```go
klíč := "a"
data := mapa[string]string{"name": "jack"}
page.MustEval(`(k, val) => {
    okno[k] = val
}`, klíč, data)
```

Pro získání vrácené hodnoty z Eval:

```go
val := page.MustEval(`a`).Get("name").Str()
fmt.Println(val) // výstup: jack
```

## Definovat globální funkci

Metoda `Page.Evaluate` spustí funkci, pokud je její nejvzdálenější definicí funkce.

Například funkce `test` níže bude spuštěna okamžitě, nebude považována za definici funkce:

```go
page.MustEval(`function test() { alert('ok') }`)

page.MustEval(`test()`// panic s nedefinovaným testem
```

Pro definování globální funkce `test` můžete takto kódovat, protože nejvzdálenější je zadání, ne definice funkce:

```go
page.MustEval(`test = funkce () { alert('ok') }`)

page.MustEval(`test()`)
```

## Eval na prvku

`Element.Eval` je podobný `Page.Eval`, ale s objektem `tohoto` nastaveným na aktuální prvek. Například máme na stránce `<button>Odeslat</button>` , můžeme si přečíst nebo upravit prvek pomocí JS:

```go
el := page.MustElement("button")
el.MustEval(`this.innerText = "Apply"`) // Modify the content
txt := el.MustEval(`this.innerText`).Str()
fmt.Println(txt) // output: Použít
```

## Zveřejnit funkce Go na stránku

Můžeme použít `Page.Expose` k vystavení funkcí zpětného volání stránce. Například, zde vystavujeme funkci, která pomůže stránce vypočítat md5 hash:

```go
page.MustExpose("md5", func(g gson.JSON) (interface{}, error) {
    return md5.Sum([]byte(g.Str())), nil
})
```

Nyní může stránka vyvolat tuto metodu na objekt okna:

```go
hash := page.MustEval(`window.md5("test")`).Str()
```
