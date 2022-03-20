# Javascript Runtime

Vi kan bruge Rod til at evaluere tilfældig javascript kode på siden. Såsom bruge det til at læse eller ændre HTML-indholdet på siden.

## Eval på siden

For eksempel brug `Page.Eval` til at angive den globale værdi:

```go
page.MustEval(`() => window.a = {name: 'jack'}`)
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
