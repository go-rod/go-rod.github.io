# Runtime Javascript

Podemos usar Rod para avaliar o código de javascript aleatório na página. Tal como usá-lo para ler ou modificar o conteúdo HTML da página.

## Avaliar na página

Por exemplo, use `Page.Eval` para definir o valor global:

```go
page.MustEval(`window.a = {name: 'jack'}`)
```

Podemos usar uma função js para passar valor como argumentos json:

```go
chave := "a"
dado := mapa[string]string{"name": "jack"}
page.MustEval(`(k, val) => {
    janela[k] = val
}`, key, data)
```

Para obter o valor retornado do Eval:

```go
val := page.MustEval(`a`).Get("nome").Str()
fmt.Println(val) // saída: jack
```

## Definir uma função global

O método `Page.Evaluate` executará a função se sua periferia for uma definição de função.

Por exemplo, a função `test` abaixo será executada imediatamente, ela não será tratada como uma definição de função:

```go
page.MustEval(`function test() { alert('ok') }`)

page.MustEval(`test()`) // pânico com teste não definido
```

Para definir a função global `teste` você pode programar desse jeito, pois a função mais remota é uma atribuição, não uma definição de função:

```go
page.MustEval(`test = function () { alert('ok') }`)

page.MustEval(`test()`)
```

## Avaliar um elemento

`Element.Eval` é similar com `Page.Eval`, mas com o `esse` objeto definido para o elemento atual. Por exemplo, temos um `<button>Submeter</button>` na página, nós podemos ler ou modificar o elemento com JS:

```go
el := page.MustElement("button")
el.MustEval(`this.innerText = "Apply"`) // Modifique o conteúdo
txt := el.MustEval(`this.innerText`).Str()
ft.Println(txt) // output: Aplicar
```

## Expor funções Ir para a página

Podemos usar `Page.Expose` para expor funções de callback à página. Por exemplo, aqui nós expomos uma função para ajudar a página calcular md5 hash:

```go
page.MustExpose("md5", func(g gson.JSON) (interface{}, error) {
    return md5.Sum([]byte(g.Str())), nil
})
```

Agora a página pode invocar esse método no objeto da janela:

```go
hash := page.MustEval(`window.md5("test")`).Str()
```
