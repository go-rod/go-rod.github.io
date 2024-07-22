# Contexto e Tempo Limite

Em Golang, geralmente usamos o [Contexto](https://golang.org/pkg/context/) para abortar tarefas de longa duração. Rod usa o Contexto para lidar com cancelamentos para operações de bloqueio de IO, na maioria das vezes é tempo limite. Você precisa prestar especial atenção a eles.

Se você não estiver familiarizado com o Contexto, leia primeiro o [Contexto de Entendimento](understand-context.md).

## Cancelamento

Por exemplo, o código abaixo cria uma página em branco e a navega até o "github.com":

```go
page := rod. New(). MustConnect(). MustPage()
page. MustNavigate("http://github.com")
```

Agora, suponha que queiramos cancelar o `MustNavigate` se demorar mais de 2 segundos. No Cajado podemos fazer algo como isto:

```go
page := rod. New(). MustConnect(). MustPage()

ctx, cancel := context. WithCancel(context. Background())
pageWithCancel := page. Context(ctx)

go func() {
    time. Sleep(2 * time. Second)
    cancel()
}()

// The 2 lines below share the same context, they will be canceled after 2 seconds in total
pageWithCancel. MustNavigate("http://github.com") 
pageWithCancel.  
```

Usamos o `page. Context` para criar um clone superficial da página ``. Whenever we call the `cancel`, all the sub operations triggered by the `pageWithCancel` will be canceled, it can be any operation, not just `MustNavigate`. A página `de origem` não será afetada, se usarmos para chamar operações, elas não serão canceladas.

Este estilo não é especial para Varda, pode encontrar APIs semelhantes a [Request. WithContext](https://golang.org/pkg/net/http/#Request.WithContext) na biblioteca padrão.

Porque `pageWithCancel` e `página` são independentes uma da outra. operações desencadeadas pela página `` não serão afetadas pelo cancelamento:

```go
page. MustNavigate("http://github.com") // não será cancelado após 2 segundos
```

## Tempo esgotado

O código acima é apenas uma maneira de expirar uma operação. Em Golang, o tempo limite normalmente é apenas um caso especial de cancelamento. Por ser tão útil, nós criamos um auxiliar para fazer a mesma coisa acima, é chamado de `Tempo limite`, então o código acima pode ser reduzido como abaixo:

```go
página := rod. New(). MustConnect(). MustPage()
page. Timeout(2 * time. Second). MustNavigate("http://github.com")
```

O `page. Timeout(2 * vez. Segundo)` é a `página anterior, WithCancel`. Não apenas `Páginas`, `Navegador` e `Elemento` também têm os mesmos auxiliares de contexto.

## Cancel timeout

If you want to keep using the same instance after some operation, you can use the `Page. CancelTimeout` helper to cancel the timeout:

```go
page.
    Timeout(2 * time. Second). MustElement("a").
    CancelTimeout().
    MustElement("b") // This line won't be affected by the 2 seconds timeout.
```

## Detect timeout

How do I know if an operation is timed out or not? In Golang, timeout is usually a type of error. It's not special for Rod. For the code above we can do this to detect timeout:

```go
page := rod. New(). MustConnect(). MustPage()

err := rod. Try(func() {
    page. Timeout(2 * time. Second). MustNavigate("http://github.com")
})
if errors. Is(err, context. DeadlineExceeded) {
    fmt. Println("timeout error")
} else if err != nil {
    fmt. Println("other types of error")
}
```

Here we use `rod. Try` to wrap the function that may throw a timeout error.

We will talk more about error handing at [Error Handling](error-handling.md).
