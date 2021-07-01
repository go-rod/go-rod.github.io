# Eventos

Eventos são ações ou ocorrências que acontecem no navegador que você está controlando, sobre o qual o navegador lhe conta para que você possa responder a eles de alguma forma se desejar. Tal como quando deixamos a página navegar para uma nova URL, podemos assinar os eventos para saber quando a navegação está completa ou quando a página é renderizada.

## Aguarde um evento uma vez

Vamos tentar navegar para uma página e esperar até que a rede da página esteja quase inativa:

```go
func main() {
    página := rod.New().MustConnect().MustPage()

    wait := page.MustWaitNavigation()
    page.MustNavigate("https://www.wikipedia.org/")
    wait()
}
```

Usamos a `MustWaitNavigation` para assinar o evento ocioso da rede. A razão pela qual a assinatura é antes da navegação não depois é porque o código para acionar a navegação vai levar tempo para executar, durante esse tempo o evento pode já ter acontecido. Após o `dever navegar` chamamos a função `espera` para bloquear o código até o próximo evento de espera da rede.

Cajado fornece muitos outros auxiliares de eventos, todos os nomes das funções são prefixados com `MustWait` ou `Wait`.

## Obter detalhes do evento

Alguns tipos de evento carregam detalhes sobre o próprio evento. Como vamos navegar para uma URL e usar o evento para obter o código de status de resposta da requisição de navegação:

```go
func main() {
    página := rod.New().MustConnect().MustPage()

    e := proto.NetworkResponseReceived{}
    espere := page.WaitEvent(&e)
    page.MustNavigate("https://www.wikipedia.org/
    wait()

    fmt.Println(e.Response.Status)
}
```

## Manipular vários eventos

Se você quiser lidar com todos os eventos de um tipo, tal como escutar por todos os eventos da saída do console da página, nós podemos fazer algo parecido com isto:

```go
go page.EachEvent(func(e *proto.RuntimeConsoleAPICalled) {
    fmt.Println(page.MustObjectsToJSON(e.Args))
})()
```

Para inscrever vários tipos de eventos ao mesmo tempo, como assinar `RuntimeConsoleAPIChamado` e `PageLoadEventFired`:

```go
go page.EachEvent(func(e *proto.RuntimeConsoleAPICalled) {
    fmt.Println(page.MustObjectsToJSON(e.Args))
}, func(e *proto.PageLoadEventFired) {
    fmt.Println("loaded")
})()
```

## Parar a assinatura

Qualquer função no Cajado que possa ser cancelada com o contexto [](context-and-timeout.md), não é especial para eventos. Além disso, você também pode parar o evento, retornando verdadeiro do manipulador de eventos, por exemplo:

```go
espe:= page.EachEvent(func(e *proto.PageLoadEventFired) (stop bool) {
    return true
})
page.MustNavigate("https://example.com")
wait()
```

Se não retornarmos verdadeiro, a espera continuará esperando pelos eventos `PageLoadEventred` e bloqueará o programa para sempre. Isso é realmente o código de como `page.WaitEvent` funciona.

## Eventos disponíveis

Todos os tipos de evento implementam a interface do `proto.Event` , você pode usá-la para encontrar todos os eventos. Geralmente, o IDE será filtrado automaticamente pela interface. Assim como nós queremos ver todos os eventos sob o domínio da Página, podemos criar um objeto de página vazio e usar o `WaitEvent(proto. vent)` para listar e filtrar todos os tipos de eventos, como a imagem abaixo:

![eventos-lista](event-list.png)

Você também pode usar este [site](https://chromedevtools.github.io/devtools-protocol/tot/Page) para navegar pelos eventos.
