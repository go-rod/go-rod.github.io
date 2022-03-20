# Javascript körtid

Vi kan använda Rod för att utvärdera slumpmässig javascript kod på sidan. Som att använda den för att läsa eller ändra HTML-innehållet på sidan.

## Eval på sidan

Använd till exempel `Page.Eval` för att ange globalt värde:

```go
page.MustEval(`() => window.a = {name: 'jack'}`)
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
