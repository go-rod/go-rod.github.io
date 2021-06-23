# Contexto e Tempo Limite

Em Golang, geralmente usamos o [Contexto](https://golang.org/pkg/context/) para abortar tarefas de longa duração. Rod usa o Contexto para lidar com cancelamentos para operações de bloqueio de IO, na maioria das vezes é tempo limite. Você precisa prestar especial atenção a eles.

Se você não estiver familiarizado com o Contexto, leia primeiro o [Contexto de Entendimento](understand-context.md).

## Cancelamento

Por exemplo, o código abaixo cria uma página em branco e a navega até o "github.com":

```go
page := rod.New().MustConnect().MustPage()
page.MustNavigate("http://github.com")
```

Agora, suponha que queiramos cancelar o `MustNavigate` se demorar mais de 2 segundos. No Cajado podemos fazer algo como isto:

```go
página := rod.New().MustConnect().MustPage()

ctx, cancel := context.WithCancel(context.Background())
pageCancel:= page.Context(ctx)

go func() {
    vez. leep(2 * time.Segundo)
    cancel()
}()

pageWithCancel.MustNavigate("http://github.com") // será cancelada após 2 segundos
```

Usamos o `page.Context` para criar um clone superficial da página ``. Sempre que ligarmos para `cancelar`, as operações disparadas pela `páginaWithCancel` serão canceladas, pode ser qualquer operação, não apenas `MustNavigate`. A página `de origem` não será afetada, se usarmos para chamar operações, elas não serão canceladas.

Este estilo não é especial para Varda, pode encontrar APIs semelhantes a [Request.WithContext](https://golang.org/pkg/net/http/#Request.WithContext) na biblioteca padrão.

Porque `pageWithCancel` e `página` são independentes uma da outra. operações desencadeadas pela página `` não serão afetadas pelo cancelamento:

```go
page.MustNavigate("http://github.com") // não será cancelado após 2 segundos
```

## Tempo esgotado

O código acima é apenas uma maneira de expirar uma operação. Em Golang, o tempo limite normalmente é apenas um caso especial de cancelamento. Por ser tão útil, nós criamos um auxiliar para fazer a mesma coisa acima, é chamado de `Tempo limite`, então o código acima pode ser reduzido como abaixo:

```go
página := rod.New().MustConnect().MustPage()
page.Timeout(2 * time.Second).MustNavigate("http://github.com")
```

O `page.Timeout(2 * vez.Segundo)` é a `página anterior, WithCancel`. Não apenas `Páginas`, `Navegador` e `Elemento` também têm os mesmos auxiliares de contexto.

## Detectar tempo limite

Como eu sei se uma operação excede o tempo limite ou não? Em Golang, o tempo limite é geralmente um tipo de erro. Não é especial para a Vara. Para o código acima podemos fazer isso para detectar o tempo limite:

```go
página := rod.New().MustConnect().MustPage()

err := rod.Try(func() {
    page.Timeout(2 * time.Second).MustNavigate("http://github.com")
})
se erros. s(err, contexto. eadlineExceeded) {
    // código para erro de timeout
} else se err ! nil {
    // código para outros tipos de erro
}
```

Aqui usamos `rod.Tente` para encapsular a função que pode executar um erro de timeout.

Falaremos mais sobre a manipulação de erros em [Erro de tratamento](error-handling.md).
