# Iniciar Navegador personalizado

## Conectar a un navegador en ejecución

Encuentra la ruta ejecutable de tu navegador, como en ejecución de macOS:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --remote-debugging-port=9222
```

Producirá algo como:

```txt
DevTools escuchando en ws://127.0.0.1:9222/devtools/browser/4dcf09f2-ba2b-463a-8ff5-90d27c6cc913
```

Lo anterior `ws://127.0.0.1:9222/devtools/browser/4dcf09f2-ba2b-463a-8ff5-90d27c6cc913` es la interfaz para controlar el navegador:

```go
package main

import (
    "github.com/go-rod/rod"
)

func main() {
    u := "ws://127.0.0.1:9222/devtools/browser/4dcf09f2-ba2b-463a-8ff5-90d27c6cc913"
    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

## La librería del lanzador

Debido a que el flujo de trabajo anterior se utiliza con tanta frecuencia, abstracemos una librería de `launcher` para simplificar el lanzamiento de navegadores. Tal como descargar o buscar automáticamente el ejecutable del navegador, añadir o eliminar los argumentos de línea de comandos ejecutables del navegador, etc.

Así que el lanzamiento manual anterior y el código se hace:

```go
func main() {
    u := launcher.New().Bin("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome").MustLaunch()
    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

Podemos usar la función de ayuda `launcher.LookPath` para obtener la ruta ejecutable del navegador, el código anterior es el mismo que:

```go
func main() {
    path, _ := launcher.LookPath()
    u := launcher.New().Bin(path).MustLaunch()
    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

Si `ControlURL` no está definido, el `MustConnect` ejecutará `launcher.New().MustLaunch()` automáticamente. De forma predeterminada, el lanzador descargará y utilizará automáticamente un navegador versionado estáticamente para que el comportamiento del navegador sea consistente. Así que puedes simplificar el código anterior en:

```go
func main() {
    rod.New().MustConnect().MustPage("https://example.com")
}
```

## Añadir o eliminar opciones

Puede utilizar el `Set` y `Eliminar` para modificar los argumentos de inicio del navegador (banderas):

```go
paquete principal

import (
    "github.com/go-rod/rod"
    "github.com/go-rod/rod/lib/launcher"
)

func main() {
    u := launcher.New().
        Set("user-data-dir", "path").
        Set("sin cabeza").
        Eliminar("--headless").
        MustLaunch()

    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

Como puede ver desde arriba el prefijo `--` es opcional, como `sin encabezados` y `--headless` son los mismos.

Porque opciones como `user-data-dir`, `proxy-server`, `sin cabecera` se utilizan con tanta frecuencia, hemos añadido algunos ayudantes para ellos, así que el código anterior puede convertirse en así:

```go
func main() {
    u := launcher.New().
        UserDataDir("ruta").
        Sin cabeza (verdadero).
        Sin cabeza (falso).
        MustLaunch()

    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

Aquí están las banderas disponibles: [enlace](https://peter.sh/experiments/chromium-command-line-switches).

Lea el documento API para más información: [enlace](https://pkg.go.dev/github.com/go-rod/rod/lib/launcher#Launcher).

## Administrar el lanzador de forma remota

Para el sistema de desguace de producción, por lo general, separaremos los raspadores y los navegadores en diferentes clústers, para que puedan escalar por separado. Rod proporciona el módulo `launcher.Manager` para administrar el launcher de forma remota. Con él podemos lanzar de forma remota un navegador con banderas de lanzamiento personalizadas. El ejemplo para usarlo es [aquí](https://github.com/go-rod/rod/blob/master/lib/launcher/rod-manager/main.go).

Debido a que es muy difícil instalar chromium correctamente en algunas distribuciones de linux, Rod proporciona una imagen docker para que sea consistente entre plataformas. Aquí hay un ejemplo para usarlo:

1. Ejecuta la imagen de la barra `docker run -p 7317:7317 ghcr.io/go-rod/rod`

2. Abre otro terminal y ejecuta código como este [ejemplo](https://github.com/go-rod/rod/blob/master/lib/examples/launch-managed/main.go)

La imagen está [afinada](https://github.com/go-rod/rod/blob/master/lib/docker/Dockerfile) para capturas de pantalla y fuentes entre idiomas naturales populares. Cada contenedor puede lanzar múltiples navegadores al mismo tiempo.

## Modo usuario :id=user-mode

Cuando inicie sesión en su cuenta de github, y desea reutilizar la sesión de inicio de sesión para tareas de automatización. Puede utilizar el `launcher.NewUserMode` para iniciar su navegador de usuario normal. Rod será como una extensión del navegador:

```go
wsURL := launcher.NewUserMode().MustLaunch()
browser := rod.New().ControlURL(wsURL).MustConnect().NoDefaultDevice()
```

Aquí hay un ejemplo más detallado: [ejemplo de código](https://github.com/go-rod/rod/blob/master/lib/examples/use-rod-like-chrome-extension/main.go).

## API de bajo nivel

Si desea controlar cada paso del proceso de lanzamiento, como desactivar la autodescarga y utilizar el navegador predeterminado del sistema, revisa el archivo de ejemplo [](https://github.com/go-rod/rod/blob/master/lib/launcher/example_test.go).
