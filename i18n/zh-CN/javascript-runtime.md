# JavaScript 运行时

我们可以使用 Rod 在页面上执行任意 JavaScript 代码。 例如用它来读取或修改页面的 HTML 内容。

## 在页面上 eval

例如，使用 `Page.Eval` 设置全局变量：

```go
page.MustEval(`window.a = {name: 'jack'}`)
```

我们可以使用 js 函数来把值作为 json 参数传递：

```go
key := "a"
data := map[string]string{"name": "jack"}
page.MustEval(`(k, val) => {
    window[k] = val
}`, key, data)
```

从 Eval 获取返回值：

```go
val := page.MustEval(`a`).Get("name").Str()
fmt.Println(val) // output: jack
```

## Define a global function

The `Page.Evaluate` method will execute the function if its outmost is a function definition.

For example, the `test` function below will be executed immediately, it will not be treated as an function definition:

```go
page.MustEval(`function test() { alert('ok') }`)

page.MustEval(`test()`) // panic with test not defined
```

To define the global function `test` you can code like this, because the outmost is an assignment, not a function definition:

```go
page.MustEval(`test = function () { alert('ok') }`)

page.MustEval(`test()`)
```

## Eval on an element

`Element.Eval` is similar with `Page.Eval`, but with the `this` object set to the current element. For example, we have a `<button>Submit</button>` on the page, we can read or modify the element with JS:

```go
el := page.MustElement("button")
el.MustEval(`this.innerText = "Apply"`) // Modify the content
txt := el.MustEval(`this.innerText`).Str()
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
hash := page.MustEval(`window.md5("test")`).Str()
```
