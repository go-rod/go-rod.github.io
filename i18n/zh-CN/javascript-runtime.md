# JavaScript 运行时

We can use Rod to evaluate random javascript code on the page. Such as use it to read or modify the HTML content of the page.

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
val := page.MustEval(`window.a`).Get("name").Str()
fmt.Println(val) // 输出：jack
```

## 在元素上 eval

`Element.Eval` 和 `Page.Eval` 类似，但是对于前者来说，`this` 对象代表当前元素。 For example, we have a `<button>Submit</button>` on the page, we can read or modify the element with JS:

```go
el := page.MustElement("button")
el.MustEval(`this.innerText = "Apply"`) // Modify the content
txt := el.MustEval(`this.innerText`).Str()
fmt.Println(txt) // output: Apply
```

## 将 Go 函数暴露给页面

我们使用 `Page.Expose` 来把回调函数暴露给页面。 例如，我们可以像这样暴露函数，来帮助页面计算 md5：

```go
page.MustExpose("md5", func(g gson.JSON) (interface{}, error) {
    return md5.Sum([]byte(g.Str())), nil
})
```

现在页面可以在 window 对象上调用这个方法：

```go
hash := page.MustEval(`window.md5("test")`).Str()
```

[下一章](/page-pool.md)
