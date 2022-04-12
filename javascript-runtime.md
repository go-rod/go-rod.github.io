# Javascript Runtime

We can use Rod to evaluate random javascript code on the page. Such as use it to read or modify the HTML content of the page.

## Eval on the page

For example use `Page.Eval` to set global value:

```go
page.MustEval(`() => window.a = {name: 'jack'}`)
```

We can use a js function to pass value as json arguments:

```go
key := "a"
data := map[string]string{"name": "jack"}
page.MustEval(`(k, val) => {
    window[k] = val
}`, key, data)
```

To get the returned value from Eval:

```go
val := page.MustEval(`() => a`).Get("name").Str()
fmt.Println(val) // output: jack
```

## Eval on an element

`Element.Eval` is similar with `Page.Eval`, but with the `this` object set to the current element.
For example, we have a `<button>Submit</button>` on the page, we can read or modify the element with JS:

```go
el := page.MustElement("button")
el.MustEval(`() => this.innerText = "Apply"`) // Modify the content
txt := el.MustEval(`() => this.innerText`).Str()
fmt.Println(txt) // output: Apply
```

## Expose Go functions to the page

We can use `Page.Expose` to expose callback functions to the page. For example, here we expose a function to help the page to
calculate md5 hash:

```go
page.MustExpose("md5", func(g gson.JSON) (interface{}, error) {
    return md5.Sum([]byte(g.Str())), nil
})
```

Now the page can invoke this method on the window object:

```go
hash := page.MustEval(`() => window.md5("test")`).Str()
```

Here's another example to get button click event on the page:

```go
page.MustExpose("myClick", func(v gson.JSON) (interface{}, error) {
    fmt.Println("Clicked")
    return nil, nil
})
```

Call the 'myClick' method when a button is clicked:

```go
page.MustElement("button").MustEval(`() => this.onclick = myClick`)
```
