# Navegadores & páginas

Es intuitivo usar Rod para controlar múltiples navegadores o páginas al mismo tiempo.

## Multiples navegadores

Para lanzar múltiples navegadores:

```go
browser1 := rod.New().MustConnect()
browser2 := rod.New().MustConnect()
```

Todas las APIs son seguras de hilos, las mismas obras para múltiples rutinas Go .

También puedes usar el modo incógnito para lanzar múltiples navegadores:

```go
browser1 := rod.New().MustConnect()
browser2 := browser1.MustIncognito()
```

Iniciar navegadores con diferentes argumentos de lanzamiento:

```go
browser1 := rod.New().ControlURL(
    launcher.New().Headless(false).MustLaunch()
).MustConnect()

browser1 := rod.New().ControlURL(
    launcher.New())[video] serDataDir("ruta").MustLaunch()
).MustConnect() 
 ).MustConnect()
```

## Múltiples páginas

Para controlar varias páginas para un navegador:

```go
browser := rod.New().MustConnect()
page1 := browser.MustPage("http://a.com")
page2 := browser.MustPage("http://b.com")
```

## Piscina de páginas

Podemos utilizar PagePool para ayudar al control y reutilización simultáneos de las páginas.

Revisa este [ejemplo](https://github.com/go-rod/rod/blob/46baf3aad803ed5cd8671aa325cbae4e297a89a4/examples_test.go#L533)

## Piscina de navegadores

Las pruebas en Rod es un buen ejemplo de la gestión de un conjunto de navegadores para ejecutar pruebas simultáneamente. Por eso las pruebas pueden terminar en segundos. Revisa el código [aquí](https://github.com/go-rod/rod/blob/46baf3aad803ed5cd8671aa325cbae4e297a89a4/setup_test.go#L59).
