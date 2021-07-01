# Input

Rod proporciona muchos métodos para simular entradas humanas, como el clic del ratón o la pulsación del teclado.

## Clic del ratón

Para simular el ratón haga clic en un elemento:

```go
// left click
page.MustElement("button").MustClick()

// right click
page.MustElement("button").Click(proto.InputMouseButtonRight)
```

## Text input

Para simular la entrada:

```go
el := page.MustElement(`[type="text"]`)
el.MustInput("Jack")

fmt.Println(el.MustText()) // usa MustText para obtener el texto
```

## Eliminar texto de una entrada

Simplemente simula cómo lo hace un humano, selecciona todo el texto y reemplázalo con una cadena vacía:

```go
page.MustElement(`[type="text"]`).MustSelectAllText().MustInput("")
```

Puede usar `SelectText` para reemplazar una parte del texto.

## Hora de entrada

Los tipos de entrada soportados son [date](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date), [datetime-local](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local), [month](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/month), y [hora](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time).

```go
page.MustElement(`[type="date"]`).MustInputTime(time.Now())
```

## Casilla

Simplemente haz clic en él como un humano:

```go
el := page.MustElement(`[type="checkbox"]`)

// verificarlo si no está marcado
if !el.MustProperty("checked").Bool() {
    el.MustClick()
}
```

## Seleccionar opciones

Selecciona opciones en [`<select>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select).

El siguiente código seleccionará las opciones que contengan el texto "B" o "C":

```go
page.MustElement("select").MustSelect("B", "C")
```

También puede utilizar el selector regex o css para seleccionar opciones:

```go
page.MustElement("select").Select([]string{`^B$`}, true, rod.SelectorTypeRegex)

// establece false para deseleccionar
page.MustElement("select").Select([]string{`[value="c"]`}, false, rod.SelectorTypeCSSector)
```

## Definir archivos

Utilice `SetFiles` para establecer archivos para la [entrada de archivo](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file):

```go
pag.MustElement(`[type=file]`).MustSetFiles("a.jpg", "b.pdf")
```

## Ratón, teclado y toque

También puede utilizar el `page.Mouse`, `page.Keyboard`, o `page.Touch` para simular entradas de bajo nivel. Tal como se puede buscar en la prueba unitaria para arrastrar para aprender a simular el arrastre.
