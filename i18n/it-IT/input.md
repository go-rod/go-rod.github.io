# Input

Rod fornisce un sacco di metodi per simulare gli input umani, come il clic del mouse o la pressione della tastiera.

## Clic del mouse

Per simulare il mouse fai clic su un elemento:

```go
// left click
page.MustElement("button").MustClick()

// right click
page.MustElement("button").Click(proto.InputMouseButtonRight)
```

## Text input

Per simulare l'input:

```go
el := page.MustElement(`[type="text"]`)
el.MustInput("Jack")

fmt.Println(el.MustText()) // usa MustText per ottenere il testo
```

## Rimuovi testo da un input

Basta simulare come un umano lo fa, selezionare tutto il testo e sostituirlo con una stringa vuota:

```go
page.MustElement(`[type="text"]`).MustSelectAllText().MustInput("")
```

È possibile utilizzare `SelectText` per sostituire una parte del testo.

## Input orario

I tipi di input supportati sono [date](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date), [datetime-local](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local), [mese](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/month), e [tempo](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time).

```go
page.MustElement(`[type="date"]`).MustInputTime(time.Now())
```

## Checkbox

Basta cliccare come un umano:

```go
el := page.MustElement(`[type="checkbox"]`)

// controlla se non è stato controllato
se !el.MustProperty("checked").Bool() {
    el.MustClick()
}
```

## Seleziona opzioni

Seleziona le opzioni in [`<select>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select).

Il codice qui sotto selezionerà le opzioni che contengono il testo "B" o "C":

```go
page.MustElement("select").MustSelect("B", "C")
```

È inoltre possibile utilizzare il selettore regex o css per selezionare le opzioni:

```go
page.MustElement("select").Select([]string{`^B$`}, true, rod.SelectorTypeRegex)

// set false to deselect
page.MustElement("select").Select([]string{`[value="c"]`}, false, rod.SelectorTypeCSSSector)
```

## Imposta file

Usa `SetFiles` per impostare i file per il [file di input](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file):

```go
pag.MustElement(`[type=file]`).MustSetFiles("a.jpg", "b.pdf")
```

## Mouse, tastiera e tocco

È anche possibile utilizzare la pagina `page.Mouse`, `page.Tastiera`, o `page.Tocca` per simulare gli input di basso livello. Ad esempio è possibile cercare l'unità di prova per trascinare per imparare a simulare il trascinamento.
