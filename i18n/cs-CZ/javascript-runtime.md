# Javascript běh

K vyhodnocení náhodného javascriptu kódu na stránce můžeme použít prut. Např. používejte jej ke čtení nebo změně obsahu HTML stránky.

## Eval na stránce

Pro nastavení globální hodnoty použijte například `Page.Eval`:

```go
page.MustEval(`() => window.a = {name: 'jack'}`)
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
val := page.MustEval(`() => a`).Get("name").Str()
fmt.Println(val) // output: jack
```

## Eval on an element

`Element.Eval` is similar with `Page.Eval`, but with the `this` object set to the current element. For example, we have a `<button>Submit</button>` on the page, we can read or modify the element with JS:

```go
el := page.MustElement("button")
el.MustEval(`() => this.innerText = "Apply"`) // Modify the content
txt := el.MustEval(`() => this.innerText`).Str()
fmt.Println(txt) // output: Apply
```

## Expose Go functions to the page

We can use `Page.Expose` to expose callback functions to the page. For example, here we expose a function to help the page to calculate md5 hash:

```go
page.MustExpose("md5", func(g gson.JSON) (interface{}, error) {
    return md5.Sum([]byte(g.Str())), nil
})
```

Now the page can invoke this method on the window object:

```go
hash := page.MustEval(`() => window.md5("test")`).Str()
```
