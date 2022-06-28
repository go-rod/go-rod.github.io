# Emulação

Rod fornece várias maneiras de imitar o ambiente para as páginas.

## Dispositivos

Para definir o viewport, user-agent, orientação, etc. ao mesmo tempo para uma página, você pode usar os dispositivos predefinidos:

```go
page.MustEmulate(dispositivos.IPhone6or7or8Plus)
```

Ou defina seu próprio dispositivo:

```go
page.MustEmulate(dispositivos. evice{
  Título: "iPhone 4",
  Capacidades: []string{"touch", "mobile"},
  UserAgent: "Mozilla/5. (iPhone; CPU iPhone OS 7_1_2 como Mac OS X)",
  Aceite Idioma: "en",
  tela: dispositivos. creen{
    DevicePixelRatio: 2,
    Horizontal: dispositivos. creenSize{
      Width:  480,
      Height: 320,
    },
    Vertical: dispositivos.Tamanho da tela{
      Width:  320,
      Height: 480,
    },
  },
})
```

Verifique o código-fonte dos dispositivos predefinidos, os campos devem auto-explicar-se.

Você também pode definir o dispositivo padrão para todas as páginas usando [Browser.DefaultDevice](https://pkg.go.dev/github.com/go-rod/rod#Browser.DefaultDevice).

A emulação está ativada por padrão (usando os dispositivos [. aptopWithMDPIScreen](https://github.com/go-rod/rod/blob/bc44c39c9b4352c15d00bef6f6a1071205d2c388/lib/devices/list.go#L616) device), que substitui algumas das configurações padrão do navegador, o que é melhor em termos de coerência (ou seja, ajuda a reproduzir testes).

Você pode desativar o recurso de emulação do dispositivo passando o dispositivo especial _Limpe_ no `Browser.DefaultDevice`.

```go
browser.DefaultDevice(devices.Clear)
```

Ou você pode apenas usar o [Browser.NoDefaultDevice](https://pkg.go.dev/github.com/go-rod/rod#Browser.NoDefaultDevice) ajudante.

## Agente de usuário

Se você deseja especificar um user-agent para uma página específica, use [Page.SetUserAgent](https://pkg.go.dev/github.com/go-rod/rod#Page.SetUserAgent).

## Visualizar

Se você deseja especificar a janela de visualização para uma página específica, use [Page.SetViewport](https://pkg.go.dev/github.com/go-rod/rod#Page.SetViewport).

## Localidade e fuso horário

Você pode usar o env de lançamento para definir para todas as páginas:

```go
u := launcher.New().Env(append(os.Environ(), "TZ=America/New_York")...).MustLaunch()
rod.New().ControlURL(u).MustConnect()
```

Ou você pode usar [EmulationSetTimezoneOverride](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetTimezoneOverride) ou [EmulationSetLocaleOverride](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetLocaleOverride) para definir para uma página específica:

```go
page := browser.MustPage()
_ = proto.EmulationSetTimezoneOverride{TimezoneID: "America/New_York"}.Call(page)
```

## Permissões

Usar [BrowserGrantPermissions](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#BrowserGrantPermissions)

## Localização

Usar [EmulationSetGeolocationOverride](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetGeolocationOverride)

## Esquema de cores e mídia

Use [EmulationSetEmulatedMedia](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetEmulatedMedia)

```go
page := browser.MustPage()
_ = proto.EmulationSetEmulatedMedia{
    Media: "screen",
    Features: []*proto.EmulationMediaFeature{
        {Name: "prefers-color-scheme", Value: "dark"},
    },
}.Call(page)
```

## Impedir detecção de bots

Normalmente é melhor deixar o navegador sem cabeça completamente transparente para a página, para que a página não possa dizer se é controlado por um humano ou robô. Em alguns casos, uma página poderia usar o js do cliente para detectar se a página é controlada por um humano ou um robô, tal web WebGL, WebDriver, ou cabeçalhos http para solicitação. Você pode criar uma tampa de js para ocultar todos os rastros ou apenas usar [furtividade](https://github.com/go-rod/stealth)lib : [code example](https://github.com/go-rod/stealth/blob/master/examples_test.go).

Se a biblioteca `furtiva` não funcionar para você, você poderá apenas abrir o navegador regular com o `launcher. ewUserMode`: [Modo de usuário](custom-launch.md?id=user-mode).

Você pode usar ferramentas como [https://bot.sannysoft.com](https://bot.sannysoft.com) para testar sua configuração.

## Impressão digital do navegador

A impressão digital do navegador não é detecção de bot. Ele usa vários truques para coletar atributos únicos do navegador para identificar navegadores. O site pode utilizá-lo para acompanhar os usuários mesmo quando eles não estão conectados, também é amplamente utilizado para marcar arranjos sem cabeça. Por exemplo, usuários diferentes geralmente instalam fontes diferentes em seu sistema operacional, podemos usar isso para distinguir usuários diferentes. Outro exemplo seria usar a tela para renderizar texto, usuários diferentes geralmente terão GPUs diferentes, drivers gráficos, ou SOs, todos afetarão o resultado da imagem renderizada.

Geralmente, você pode iniciar várias instâncias de navegador para ter diferentes impressões digitais. Se você quiser usar um único navegador para salvar memória e CPU, você precisa substituir manualmente a API para tela de fontes, etc.

Você pode usar projetos de código aberto como [FingerprintJS](https://github.com/fingerprintjs/fingerprintjs/) para testar sua configuração.
