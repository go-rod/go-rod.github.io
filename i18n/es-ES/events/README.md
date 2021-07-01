# Eventos

Los eventos son acciones o ocurrencias que ocurren en el navegador que está controlando, del que el navegador te informa para que puedas responder de alguna manera si lo deseas. Tal como cuando dejamos que la página vaya a una nueva URL, podemos suscribirnos a los eventos para saber cuando la navegación está completa o cuando la página es renderizada.

## Espere un evento una vez

Intentemos navegar a una página y esperar hasta que la red de la página esté casi inactiva:

```go
func main() {
    page := rod.New().MustConnect().MustPage()

    wait := page.MustWaitNavigation()
    page.MustNavigate("https://www.wikipedia.org/")
    wait()
}
```

Utilizamos la `MustWaitNavigation` para suscribir el evento inactivo de red. La razón por la que la suscripción está antes de la navegación no después es porque el código para activar la navegación tomará tiempo para ejecutarse, durante ese tiempo el evento ya ha ocurrido. Después de `MustNavigate` llamamos a la función `esperar` para bloquear el código hasta que ocurra el siguiente evento inactivo de red.

Rod proporciona muchos otros ayudantes de eventos, todos los nombres de función tienen prefijo `MustWait` o `Espere`.

## Obtener los detalles del evento

Algunos tipos de eventos llevan detalles sobre el evento en sí. Tal como navegamos a una url y usamos el evento para obtener el código de estado de respuesta de la solicitud de navegación:

```go
func main() {
    page := rod.New().MustConnect().MustPage()

    e := proto.NetworkResponseReceived{}
    wait := page.WaitEvent(&e)
    page.MustNavigate("https://www.wikipedia.org/")
    wait()

    fmt.Println(e.Response.Status)
}
```

## Manejar múltiples eventos

Si quieres manejar todos los eventos de un tipo, tales como escuchar todos los eventos de la salida de consola de la página, podemos hacer algo así:

```go
go page.EachEvent(func(e *proto.RuntimeConsoleAPICalled) {
    fmt.Println(page.MustObjectsToJSON(e.Args))
})()
```

Para suscribirse a varios tipos de eventos al mismo tiempo, como suscribirse `RuntimeConsoleAPICalled` y `PageLoadEventFired`:

```go
go page.EachEvent(func(e *proto.RuntimeConsoleAPICalled) {
    fmt.Println(page.MustObjectsToJSON(e.Args))
}, func(e *proto.PageLoadEventFired) {
    fmt.Println("loaded")
})()
```

## Detener la suscripción

Cualquier función en la Barra que pueda ser cancelada con el [contexto](context-and-timeout.md), no es especial para eventos. Además, también puede detener el evento retornando verdadero desde el gestor de eventos, por ejemplo:

```go
wait := page.EachEvent(func(e *proto.PageLoadEventFired) (stop bool) {
    return true
})
page.MustNavigate("https://example.com")
wait()
```

Si no volvemos verdadero, la espera seguirá esperando los eventos de `PageLoadEventDisparado` y bloqueará el programa para siempre. Este es en realidad el código de cómo funciona `page.WaitEvent`.

## Eventos disponibles

Todos los tipos de eventos implementan la interfaz `proto.Event` , puedes usarla para encontrar todos los eventos. Normalmente, el IDE se filtrará automáticamente por la interfaz. Tal como queremos ver todos los eventos bajo el dominio de Página, podemos crear un objeto de página vacío y utilizar el `WaitEvent(proto. vent)` para listar y filtrar todos los tipos de eventos como la captura de pantalla de abajo:

![lista de eventos](event-list.png)

También puede utilizar este [sitio](https://chromedevtools.github.io/devtools-protocol/tot/Page) para navegar por los eventos.
