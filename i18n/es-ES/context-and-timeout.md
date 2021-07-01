# Contexto y tiempo de espera

En Golang, normalmente usamos [Contexto](https://golang.org/pkg/context/) para abortar tareas largas. Rod usa Context para manejar las cancelaciones para las operaciones de bloqueo de EI, la mayoría de las veces su tiempo de espera. Necesita prestar especial atención a ellos.

Si usted no está familiarizado con Context, por favor lea [Contexto de Subderstand](understand-context.md) primero.

## Cancelación

Por ejemplo, el siguiente código crea una página en blanco y la navega a "github.com":

```go
page := rod.New().MustConnect().MustPage()
page.MustNavigate("http://github.com")
```

Ahora, supongamos que queremos cancelar el `MustNavigate` si toma más de 2 segundos. En Rod podemos hacer algo así:

```go
page := rod.New().MustConnect().MustPage()

ctx, cancel := context.WithCancel(context.Background())
pageWithCancel := page.Context(ctx)

go func() {
    time. leep(2 * time.Segundd)
    cancel()
}()

pageWithCancel.MustNavigate("http://github.com") // será cancelado después de 2 segundos
```

Utilizamos la `page.Context` para crear un clon superficial de la `página`. Cada vez que llamemos al `cancel`, las operaciones desencadenadas por la página `pageWithCancel` serán canceladas, puede ser cualquier operación, no sólo `MustNavigate`. La página de origen `` no se verá afectada, si la usamos para llamar a operaciones no serán canceladas.

Este estilo no es especial para Rod, puedes encontrar APIs similares como [Request.WithContext](https://golang.org/pkg/net/http/#Request.WithContext) en la biblioteca estándar.

Porque `pageWithCancel` y `página` son independientes entre sí, las operaciones activadas por `página` no se verán afectadas por la cancelación:

```go
page.MustNavigate("http://github.com") // no será cancelado después de 2 segundos
```

## Tiempo agotado

El código anterior es sólo una manera de agotar una operación. En Golang, el tiempo de espera suele ser sólo un caso especial de cancelación. Debido a que es tan útil, hemos creado un ayudante para hacer lo mismo arriba se llama `Tiempo de espera`, por lo que el código anterior puede reducirse como a continuación:

```go
page := rod.New().MustConnect().MustPage()
page.Timeout(2 * time.secondd).MustNavigate("http://github.com")
```

El `page.Timeout(2 * time.Segundd)` es el anterior `pageWithCancel`. No solo `Página`, `Navegador` y `Elemento` también tienen los mismos ayudantes de contexto.

## Detectar tiempo de espera

¿Cómo sé si una operación está agotada o no? En Golang, el tiempo de espera suele ser un tipo de error. No es especial para Rod. Para el código anterior podemos hacer esto para detectar el tiempo de espera:

```go
page := rod.New().MustConnect().MustPage()

err := rod.Try(func() {
    page.Timeout(2 * time.secondd).MustNavigate("http://github.com")
})
si hay errores. s(err, contexto. eadlineExceeded) {
    // código para error de timeout
} else if err ! nil {
    // código para otros tipos de error
}
```

Aquí usamos `rod.Try` para envolver la función que puede arrojar un error de tiempo de espera.

Hablaremos más sobre la entrega de errores en [Manejo de errores](error-handling.md).
