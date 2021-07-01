# Javascript Runtime

Podemos usar Rod para evaluar código javascript aleatorio en la página. Tal como usarlo para leer o modificar el contenido HTML de la página.

## Evento en la página

Por ejemplo, utilice `Page.Eval` para establecer el valor global:

```go
page.MustEval(`window.a = {name: 'jack'}`)
```

Podemos usar una función js para pasar el valor como argumentos json:

```go
key := "a"
data := map[string]string{"name": "jack"}
page.MustEval(`(k, val) => {
    window[k] = val
}`, key, data)
```

Para obtener el valor devuelto de Eval:

```go
val := page.MustEval(`a`).Get("name").Str()
fmt.Println(val) // salida: jack
```

## Definir una función global

El método `Page.Evaluate` ejecutará la función si su ultraperiférica es una definición de función.

Por ejemplo, la función `test` a continuación se ejecutará inmediatamente, no será tratada como una definición de función:

```go
page.MustEval(`function test() { alert('ok') }`)

page.MustEval(`test()`) // Con prueba no definida
```

Para definir la función global `test` se puede codificar de este modo, porque la función ultraperiférica es una asignación, no una definición de función:

```go
page.MustEval(`test = function () { alert('ok') }`)

page.MustEval(`test()`)
```

## Evento en un elemento

`Element.Eval` es similar con `Page.Eval`, pero con el `este` objeto establecido en el elemento actual. Por ejemplo, tenemos un `<button>Enviar</button>` en la página, podemos leer o modificar el elemento con JS:

```go
el := page.MustElement("button")
el.MustEval(`this.innerText = "Apply"`) // Modifica el contenido
txt := el.MustEval(`this.innerText`).Str()
fmt.Println(txt) // Salida: Aplicar
```

## Exponer funciones de Ir a la página

Podemos usar `Page.Expose` para exponer las funciones de callback a la página. Por ejemplo, aquí exponemos una función para ayudar a la página a calcular hash md5:

```go
page.MustExpose("md5", func(g gson.JSON) (interface{}, error) {
    return md5.Sum([]byte(g.Str())), nil
})
```

Ahora la página puede invocar este método en el objeto ventana:

```go
hash := page.MustEval(`window.md5("test")`).Str()
```
