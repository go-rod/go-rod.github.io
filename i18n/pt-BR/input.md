# Input

Rod fornece muitos métodos para simular entradas humanas, como o clique do mouse ou o toque do teclado.

## Clique do Mouse

Para simular o mouse clique em um elemento:

```go
// left click
page.MustElement("button").MustClick()

// right click
page.MustElement("button").Click(proto.InputMouseButtonRight)
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

## Checkbox

Basta clicar nele como um humano:

```go
el := page.MustElement(`[type="checkbox"]`)

// verifique-o se não estiver marcado
se !el.MustProperty("verificado").Bool() {
    el.MustClick()
}
```

## Selecionar opções

Selecione as opções em [`<select>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select).

O código abaixo selecionará as opções que contêm o texto "B" ou "C":

```go
page.MustElement("select").MustSelect("B", "C")
```

Você também pode usar seletor regex ou css para selecionar opções:

```go
page.MustElement("select").Select([]string{`^B$`}, true, rod.SelectorTypeRegex)

// definiu como falso para desmarcar
page.MustElement("select").Select([]string{`[value="c"]`}, false, rod.SelectorTypeSSector)
```

## Definir arquivos

Use `SetFiles` para definir os arquivos para a entrada de arquivo [](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file):

```go
pag.MustElement(`[type=file]`).MustSetFiles("a.jpg", "b.pdf")
```

## Mouse, teclado e toque

Você também pode usar a `page.Mouse`, `page.Keyboard`, ou `page.Touch` para simular entradas de baixo nível. Tal como você pode pesquisar o teste de unidade por arrastar e aprender como simular arrastamento.
