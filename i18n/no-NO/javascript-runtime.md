# Javascript Runtime

Vi kan bruke Rod til å evaluere tilfeldig javascript-kode på siden. Slik som bruk den for å lese eller endre HTML-innholdet på siden.

## Evaluering på siden

For eksempel bruk `Side.Eval` for å angi global verdi:

```go
page.MustEval(`() => window.a = {name: 'jack'}`)
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
