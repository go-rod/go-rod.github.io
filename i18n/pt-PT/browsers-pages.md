# Navegadores & Páginas

É intuitivo usar Rod para controlar vários navegadores ou páginas ao mesmo tempo.

## Vários navegadores

Para iniciar vários navegadores:

```go
browser1 := rod.New().MustConnect()
browser2 := rod.New().MustConnect()
```

Todas as APIs são seguras em threads, as mesmas obras para várias rotinas.

Você também pode usar o modo anônimo para iniciar vários navegadores:

```go
browser1 := rod.New().MustConnect()
browser2 := browser1.MustIncognito()
```

Inicie navegadores com diferentes argumentos de lançamento:

```go
browser1 := rod.New().ControlURL(
    launcher.New().Headless(false).MustLaunch()
).MustConnect()

browser1 := rod.New().ControlURL(
    launcher.New().UserDataDir("path").MustLaunch()
).MustConnect()
```

## Várias páginas

Para controlar várias páginas de um navegador:

```go
navegador := rod.New().MustConnect()
page1 := browser.MustPage("http://a.com")
page2 := browser.MustPage("http://b.com")
```

## Potencializar página

Podemos usar a PagePool para ajudar simultaneamente a controlar e reutilizar páginas.

Confira este [exemplo](https://github.com/go-rod/rod/blob/46baf3aad803ed5cd8671aa325cbae4e297a89a4/examples_test.go#L533)

## Conjunto de navegadores

Os testes em Rod é um bom exemplo de como gerenciar um pool de navegadores para executar testes simultaneamente. É por isso que os testes podem terminar em segundos. Verifique o código [aqui](https://github.com/go-rod/rod/blob/46baf3aad803ed5cd8671aa325cbae4e297a89a4/setup_test.go#L59).
