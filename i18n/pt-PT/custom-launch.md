# Iniciar Navegador Personalizado

## Conectar a um navegador em execução

Encontre o caminho executável do seu navegador, como no macOS executado:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --remote-debugging-port=9222
```

Isso irá produzir algo como:

```txt
DevTools escutando em ws://127.0.0.1:9222/devtools/browser/4dcf09f2-ba2b-463a-8ff5-90d27c6cc913
```

O acima `ws://127.0.0.1:9222/devtools/browser/4dcf09f2-ba2b-463a-8ff5-90d27c6cc913` é a interface para controlar o navegador:

```go
pacote principal

import (
    "github.com/go-rod/rod"
)

func main() {
    u := "ws://127.0.0.1:9222/devtools/browser/4dcf09f2-ba2b-463a-8ff5-90d27c6cc913"
    rod. New(). ControlURL(u). MustConnect(). MustPage("https://example.com")
}
```

## O launcher lib

Uma vez que o fluxo de trabalho acima é tão frequentemente usado, abstraimos um `launcher` lib para simplificar a inicialização de navegadores. Tal como o download automático ou a pesquisa pelo navegador executável, adicione ou exclua os argumentos executáveis da linha de comando do navegador, etc.

Portanto, o código e a inicialização manual acima se tornam:

```go
func main() {
    u := launcher. New(). Bin("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"). MustLaunch()
    rod. New(). ControlURL(u). MustConnect(). MustPage("https://example.com")
}
```

Podemos usar a função auxiliar `launcher. LookPath` para obter o caminho do executável do navegador, o código acima é o mesmo como:

```go
func main() {
    caminho, _ := launcher. LookPath()
    u := launcher. New(). Bin(path). MustLaunch()
    rod. New(). ControlURL(u). MustConnect(). MustPage("https://example.com")
}
```

Se o `ControlURL` não estiver definido, o `MustConnect` executará automaticamente o `launcher. New(). MustLaunch`. Por padrão, o launcher fará o download e usará automaticamente um navegador versionado estaticamente para que o comportamento do navegador seja consistente. Então você pode simplificar o código acima em:

```go
func main() {
    rod. New(). MustConnect(). MustPage("https://example.com")
}
```

## Adicionar ou remover opções

Você pode usar a `Definir` e `Apagar` para modificar os argumentos de lançamento do navegador (bandeiras):

```go
pacote principal

import (
    "github.com/go-rod/rod"
    "github.com/go-rod/rod/lib/launcher"
)

func main() {
    u := launcher. New().
        Definir("user-data-dir", "path").
        Set("headless").
        Deletar("--headless").
        MustLaunch()

    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

Como você pode ver acima o prefixo `--` é opcional, como `headless` e `--headless` são os mesmos.

Como `user-data-dir`, `proxy-server`, `headless` são tão frequentemente utilizados, nós adicionamos alguns auxiliares para eles, então o código acima pode se tornar assim:

```go
func main() {
    u := launcher. New().
        UserDataDir("caminho").
        Headless(true).
        Não-interna(falso).
        MustLaunch()

    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

Aqui estão as bandeiras disponíveis: [link](https://peter.sh/experiments/chromium-command-line-switches).

Leia o documento de API para mais informações: [link](https://pkg.go.dev/github.com/go-rod/rod/lib/launcher#Launcher).

## Remotely manage the launcher :id=remotely-manage-the-launcher

Para o sistema de remoção de produção, usualmente, vamos separar os sucatas e navegadores em diferentes clusters para que eles possam escalar separadamente. Rod fornece o módulo `launcher. Manager` para gerenciar o launcher remotamente. Com isso, podemos iniciar um navegador remotamente com bandeiras de inicialização personalizadas. O exemplo a ser usado é [aqui](https://github.com/go-rod/rod/blob/master/lib/launcher/rod-manager/main.go).

Por ser muito difícil instalar o crómio corretamente em algumas distribuições linux, Rod fornece uma imagem docker para torná-lo uma plataforma cruzada consistente. Aqui está um exemplo para usá-lo:

1. Execute a imagem da vara `docker run -p 7317:7317 ghcr.io/go-rod/rod`

2. Abra outro terminal e execute um código como este [exemplo](https://github.com/go-rod/rod/blob/master/lib/examples/launch-managed/main.go)

A imagem está [ajustada](https://github.com/go-rod/rod/blob/master/lib/docker/Dockerfile) para capturas de tela e fontes entre os idiomas naturais populares. Cada contêiner pode executar vários navegadores ao mesmo tempo.

## Modo de usuário :id=user-mode

Quando você faz login na sua conta do github e deseja reutilizar a sessão de login para tarefa de automação. Você pode usar o `launcher. NewUserMode` para iniciar seu navegador normal. Cajado será como uma extensão de navegador:

```go
wsURL := launcher. NewUserMode(). MustLaunch()
rod. New(). ControlURL(wsURL). MustConnect(). NoDefaultDevice()
```

Aqui está um exemplo mais detalhado: [exemplo de código](https://github.com/go-rod/rod/blob/master/lib/examples/use-rod-like-chrome-extension/main.go).

## API de nível baixo

Se você deseja controlar cada etapa do processo de inicialização, como desativar o download automático e usar o navegador padrão do sistema, verifique o [arquivo de exemplo](https://github.com/go-rod/rod/blob/master/lib/launcher/example_test.go).
