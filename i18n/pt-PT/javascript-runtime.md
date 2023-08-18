# Runtime Javascript

Podemos usar Rod para avaliar o código de javascript aleatório na página. Tal como usá-lo para ler ou modificar o conteúdo HTML da página.

## Avaliar na página

Por exemplo, use `Page. Eval` para definir o valor global:

```go
page. MustEval(`() => window.a = {name: 'jack'}`)
```

We can use the arguments of the js function to receive golang variables, here's how we get the `key` and `data` from golang and set it to the page's window object `k`:

```go
chave := "a"
dado := mapa[string]string{"name": "jack"}
page. MustEval(`(k, val) => {
    janela[k] = val
}`, key, data)
```

Para obter o valor retornado do Eval:

```go
val := page. MustEval(`() => a`). Get("name"). Str()
fmt. Println(val) // output: jack
```

`Eval` only accepts js function, code like below won't work:

```go
page.MustEval(`a`) // will fail
```

## Eval on an element

`Element. Eval` is similar with `Page. Eval`, but with the `this` object set to the current element. For example, we have a `<button>Submit</button>` on the page, we can read or modify the element with JS:

```go
el := page. MustElement("button")
el. MustEval(`() => this.innerText = "Apply"`) // Modify the content
txt := el. MustEval(`() => this.innerText`). Str()
fmt. Println(txt) // output: Apply
```

## Expose Go functions to the page

We can use `Page. Expose` to expose callback functions to the page. For example, here we expose a function to help the page to calculate md5 hash:

```go
page. MustExpose("md5", func(g gson.JSON) (interface{}, error) {
    return md5. Sum([]byte(g. Str())), nil
})
```

Now the page can invoke this method on the window object:

```go
hash := page. MustEval(`() => window.md5("test")`). Str()
fmt. Println(hash)
```

Here's another example to get button click event on the page:

```go
page. MustExpose("myClick", func(v gson.JSON) (interface{}, error) {
    fmt. Println("Clicked")
    return nil, nil
})
```

Call the 'myClick' method when a button is clicked:

```go
page. MustElement("button"). MustEval(`() => this.onclick = myClick`)
```
