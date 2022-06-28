# Input

Rod fornece muitos métodos para simular entradas humanas, como o clique do mouse ou o toque do teclado.

## Clique do Mouse

Para simular o mouse clique em um elemento:

```go
// left click
page.MustElement("button").MustClick()

// right click
_ = page.MustElement("button").Click(proto.InputMouseButtonRight)
```

## Text input

Para simular a entrada:

```go
el := page.MustElement(`[type="text"]`)
el.MustInput("Jack")

fmt.Println(el.MustText()) // use MustText para obter o texto
```

## Remover texto de uma entrada

Simule como um humano o faz, selecione todo o texto e o substitua por uma string vazia:

```go
page.MustElement(`[type="text"]`).MustSelectAllText().MustInput("")
```

Você pode usar `SelectText` para substituir uma parte do texto.

## Entrada de tempo

Os tipos de entrada suportados são [data](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date), [data local](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local), [mês](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/month), e [hora](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time).

```go
page.MustElement(`[type="date"]`).MustInputTime(time.Now())
```

## Input key combinations

For example, the complete actions to input the uppercase 'a' like a human include:

1. press and hold a `Shift` key
1. press and release the `A` key
1. release the `Shift` key

You can use the `Page.KeyActions` or `Element.KeyActions` helpers to do it:

```go
page.KeyActions().Press(input.ShiftLeft).Type('A').MustDo()
```

The `KeyActions` helper will automatically release all pressed keys, here the `input.ShiftLeft` will be released automatically.

To simulate shortcuts input like `CTRL + Enter`, you can do like this:

```go
page.KeyActions().Press(input.ControlLeft).Type(input.Enter).MustDo()
```

## Checkbox

Just click it like a human:

```go
el := page.MustElement(`[type="checkbox"]`)

// check it if not checked
if !el.MustProperty("checked").Bool() {
    el.MustClick()
}
```

## Select options

Select options in [`<select>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select).

The code below will select options that contains text "B" or "C":

```go
page.MustElement("select").MustSelect("B", "C")
```

You can also use regex or css selector to select options:

```go
_ = page.MustElement("select").Select([]string{`^B$`}, true, rod.SelectorTypeRegex)

// set false to deselect
_ = page.MustElement("select").Select([]string{`[value="c"]`}, false, rod.SelectorTypeCSSSector)
```

## Set files

Use `SetFiles` to set files for the [file input](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file):

```go
page.MustElement(`[type=file]`).MustSetFiles("a.jpg", "b.pdf")
```

## Mouse, keyboard, and touch

You can also use the `page.Mouse`, `page.Keyboard`, or `page.Touch` to simulate low-level inputs. Such as you can search the unit test for dragging to learn how to simulate dragging.
