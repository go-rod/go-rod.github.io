# Comece com Rod

## Requisitos

[Golang](https://golang.org/) é o único requisito, você nem precisa saber nada sobre HTML.

Se você nunca usou o Golang, [instale-o](https://golang.org/doc/install) e você pode dominá-lo em horas: [Um tour of Go](https://tour.golang.org/welcome).

## Primeiro programa

Vamos utilizar Rod para abrir uma página e tirar uma captura de tela dela, primeiro, crie um arquivo "main.go" com o conteúdo abaixo:

```go
package main

import "github.com/go-rod/rod"

func main() {
    page := rod.New().MustConnect().MustPage("https://www.wikipedia.org/")
    page.MustWaitStable().MustScreenshot("a.png")
}
```

O `rod. New` cria um objeto de navegador, o `MustConnect` abre e se conecta a um navegador. O `MustPage` cria um objeto de página, é como uma aba de página no navegador. O <0>MustWaitStable</0> espera até que a página raramente mude. O `Deve Screenshot` tira uma captura de tela da página.

Criar um módulo:

```bash
go env -w GOPROXY=https://goproxy.io,direct
go mod init learn-rod
go mod tidy
```

Executar o módulo:

```bash
vá correr .
```

O programa será criado "a.png" como o exemplo abaixo:

![primeiro programa](first-program.png)

## Veja o que está sob o capuz

Para desenvolvedores principais, você pode pular todos e ler este arquivo: [link](https://github.com/go-rod/rod/blob/master/examples_test.go).

Por padrão, o Rod desativará a interface do navegador para maximizar o desempenho. Mas ao desenvolver uma tarefa de automação, geralmente nos preocupamos mais com a facilidade de depuração. Rod fornece muitos auxiliares para fazer a sua experiência de depuração ser ótima.

Antes de executarmos o módulo novamente, vamos modificar o código um pouco para facilitar a depuração:

```go
package main

import (
    "time"

    "github.com/go-rod/rod"
)

func main() {
    page := rod.New().NoDefaultDevice().MustConnect().MustPage("https://www.wikipedia.org/")
    page.MustWindowFullscreen()
    page.MustWaitStable().MustScreenshot("a.png")
    time.Sleep(time.Hour)
}
```

O `NoDefaultDevice` e `MustWindowFullscreen` maximizam a janela de visualização da página e do navegador para torná mais confortável a visão geral da página. We added `time. Sleep(time. Hour)` at the end the code so that it won't be too fast for our eyes to catch it before the program exits.

Vamos executar o módulo novamente com a flag de linha de comando `-rod`:

```bash
go run . -rod=show
```

A opção `mostrar` significa "mostrar a interface do usuário do navegador em primeiro plano". Agora você deve ver um navegador como este:

![show](show.png)

Para interromper o programa, vamos voltar para o terminal e pressionar [CTRL + C](https://en.wikipedia.org/wiki/Control-C) no teclado.

## Insira e clique

Vamos automatizar o site para pesquisar a palavra-chave "earth". Um site pode ter muitos campos de entrada ou botões, precisamos informar ao programa qual campo deve ser manipulado. Usually, we use [Devtools](https://developers.google.com/web/tools/chrome-devtools/) to help us locate the element we want to control. Vamos adicionar uma nova configuração à flag  <0>-rod</0> para habilitar o Devtools, agora o comando fica assim:

```bash
go run . -rod=show,devtools
```

Run the command above, move your mouse to the input field and right-click above it, you will see the context menu, then click the "inspect":

![inspect](inspect.png)

Você deverá ver o `<input id="searchInput` como abaixo:

![input](input.png)

Clique com o botão direito para copiar o seletor [css](css-selector.md) como a imagem acima. The content on your clipboard will be "#searchInput". We will use it to locate the element to input the keyword. Agora o "main.go" ficou assim:

```go
package main

import (
    "time"

    "github.com/go-rod/rod"
)

func main() {
    browser := rod.New().MustConnect().NoDefaultDevice()
    page := browser.MustPage("https://www.wikipedia.org/").MustWindowFullscreen()

    page.MustElement("#searchInput").MustInput("earth")

    page.MustWaitStable().MustScreenshot("a.png")
    time.Sleep(time.Hour)
}
```

We use `MustElement` and the selector we copied from the Devtools panel to get the element we want to manipulate. O `MustElement` irá esperar automaticamente até que o elemento apareça, então não precisamos usar `MustWaitStable` antes dele. Em seguida, chamamos o `MustInput` para inserir a palavra-chave "earth" nele. If you rerun the "main.go", you should see the result looks like below:

![after-input](after-input.png)

Similar to the input field let's right-click the search button to copy the selector for it:

![search-btn](search-btn.png)

![search-btn-selector](search-btn-selector.png)

Em seguida, adicione código para clicar no botão de pesquisa, agora o "main.go" ficou assim:

```go
package main

import (
    "time"

    "github.com/go-rod/rod"
)

func main() {
    browser := rod.New().MustConnect().NoDefaultDevice()
    page := browser.MustPage("https://www.wikipedia.org/").MustWindowFullscreen()

    page.MustElement("#searchInput").MustInput("earth")
    page.MustElement("#search-form > fieldset > button").MustClick()

    page.MustWaitStable().MustScreenshot("a.png")
    time.Sleep(time.Hour)
}
```

Se reexecutarmos o módulo, o "a.png" mostrará o resultado da pesquisa:

![earth-page](earth-page.png)

## Câmera lenta e rastreamento visual

The automated operations are too fast for human eyes to catch, to debug them we usually enable the slow-motion and visual trace configs, let's update run the module with extra options:

```bash
go run . -rod="show,slow=1s,trace"
```

Agora, cada ação vai esperar 1 segundo antes da sua execução. Na página, você verá o log de depuração gerado pelo Rod como abaixo:

![trace](trace.png)

Como você pode ver no botão de busca, o Rod criará um cursor de mouse simulado.

No console você verá o log abaixo:

```txt
[rod] 2020/11/11 11:11:11 [eval] {"js":"rod.element","params":["#searchInput"]}
[rod] 2020/11/11 11:11:11 [eval] {"js":"rod. visível", this":"input#searchInput"}
[rod] 2020/11/11 11:11:11 [input] rolagem para ver
[rod] 2020/11/11 11:11:11 [input] entrada
[rod] 2020/11/11 11:11:11 [eval] {"js":"rod. lement","parâmetros":["#search-form > fieldset > button"]}
[rod] 2020/11/11 11:11 [eval] {"js":"rod.visible","this":"button.pure-button. botão ure-button-primary-progressive"}
[rod] 2020/11/11 11:11:11 [input] rolagem em vista
[rod] 2020/11/11 11:11:11 [input] clique esquerdo
```

## Além das opções de linha de comando

The the command line options is just a shortcut for some commonly used methods, you can also manually set them with code, such as the "slow", the code to set it is like `rod. New(). SlowMotion(2 * time. Second)`.

## Obter conteúdo de texto

Rod fornece muitos métodos úteis para recuperar o conteúdo da página.

Let's try to get the description of the Earth, use the same technique we previously used to copy the selector from the Devtools:

![get-text](get-text.png)

O método que usamos é `MustText`, aqui está o código completo dele:

```go
pacote principal

importação (
    "fmt"

    "github. um/go-rod/rod"
)

func main() {
    página := rod. ew(). MustConnect(). MustPage("https://www.wikipedia.org/")

    page. MustElement("#searchInput"). ustInput("earth")
    page. MustElement("#search-form > fieldset > button"). MustClick()

    el := page. ustElement("#mw-content-text > div.mw-parser-output > p:nth-child(6)")
    fmt. Println(el.
```

Se executarmos o módulo novamente, veremos que o console produz algo como:

```txt
A Terra é o terceiro planeta do Sol e o único objeto astronômico conhecido por abrigar a vida.
...
```

## Obter conteúdo da imagem

Same as get text, we can also get images from the page, let's get the selector of the Earth image and use `MustResource` to get the binary of the image:

![get-image](get-image.png)

O código completo é:

```go
pacote principal

import (
    "github.com/go-rod/rod"
    "github. om/go-rod/rod/lib/utils"
)

func main() {
    página: = rod. ew(). MustConnect(). MustPage("https://www.wikipedia.org/")

    page. MustElement("#searchInput"). MustInput("earth")
    página. ustElement("#search-form > fieldset > button"). MustClick()

    el := page. MustElement("#mw-content-text > div.mw-parser-output > tabela. nfobox > tbody > tr:nth-child(1) > td > a > img")
    _ = utils. utputFile("b.png", el. MustResource())
}
```

O arquivo de saída "b.png" deverá ser:

![earth](earth.png)
