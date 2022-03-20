# Javascript Runtime

Мы можем использовать Rod для оценки случайного кода javascript на странице. Например, использовать его для чтения или изменения HTML содержимого страницы.

## Оценка на странице

Например, используйте `Page.Eval` , чтобы установить глобальное значение:

```go
page.MustEval(`() => window.a = {name: 'jack'}`)
```

Мы можем использовать функцию js для передачи значения в качестве аргументов json:

```go
key := "a"
данных := map[string]string{"name": "jack"}
page.MustEval(`(k, val) => {
    window[k] = val
}`, key, data)
```

Для получения возвращаемого значения от Eval:

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
