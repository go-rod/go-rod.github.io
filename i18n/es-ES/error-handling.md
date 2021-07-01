# Manejo de errores

En los capítulos anteriores, hemos visto muchos métodos prefijados de `Must` como `MustNavigate`, `MustElement`, etc. Todos tienen versiones no prefijadas como `Navegar`, `Elemento`, etc. La principal diferencia entre ellos es cómo manejan errores. No es especial para Rod, puede encontrarlo en la biblioteca estándar como [regex.MustCompile](https://golang.org/pkg/regexp/#MustCompile).

Los métodos como `MustNavigate` y `MustElement` se utilizan comúnmente en código de ejemplo o script rápido. Son útiles para trabajos como pruebas de humo, monitoreo del sitio, pruebas de extremo a extremo, etc. Trabajos con mucha incertidumbre, como la eliminación de web, la versión no prefijada será una mejor opción.

La versión prefijada es sólo la versión no prefijada envuelta con un comprobador de errores. Aquí está el código fuente del `MustElement`, como puedes verlo, simplemente llama al elemento `` con varias líneas adicionales al elemento </code> si el error no es `nil`:

```go
func (p *Page) MustElement(selectors ...string) *Elemento {
    el, err := p.Element(selectors...)
    if err != nil {
        panic(err)
    }
    return el
}
```

## Obtener el valor de error

Los dos bloques de código a continuación están haciendo casi lo mismo en dos estilos.

El siguiente estilo es la forma estándar de Go's para manejar errores:

```go
page := rod.New().MustConnect().MustPage("https://example.com")

el, err := page. lement("a")
if err ! nil {
    handleError(err)
    return
}
html, err := el. TML()
if err != nil {
    handleError(err)
    return
}
fmt.Println(html)
```

Podemos usar `rod.Try` para capturar el error de los métodos prefijados `Must` `MustElement` y `MustHTML`. El siguiente estilo generalmente terminará en menos código, pero también puede captar errores adicionales:

```go
page := rod.New().MustConnect().MustPage("https://example.com")

err := rod.Try(func() {
    fmt.Println(page.MustElement("a").MustHTML())
})
handleError(err) 

```

## Compruebe el tipo de error

Utilizamos la forma estándar de Go's para comprobar los tipos de error, sin magia.

El `handleError` en el código anterior puede verse como:

```go
func handleError(err error) {
    var evalErr *rod.ErrEval
    if errors.Is(err, context. eadlineExceeded) { // error de timeout
        fmt.Println("timeout err")
    } else if errors. s(err, &evalErr) { // Error
        fmt.Println(evalErr. ineNumber)
    } else if err != nil {
        fmt. rintln("cannot handle", err)
    }
}
```
