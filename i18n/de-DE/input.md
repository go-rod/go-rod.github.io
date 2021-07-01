# Input

Rod bietet viele Methoden zur Simulation von menschlichen Eingängen, wie zum Beispiel Mausklick oder Tastendruck.

## Mausklick

Um die Maus zu simulieren, klicken Sie auf ein Element:

```go
// left click
page.MustElement("button").MustClick()

// right click
page.MustElement("button").Click(proto.InputMouseButtonRight)
```

## Text input

Um die Eingabe zu simulieren:

```go
el := page.MustElement(`[type="text"]`)
el.MustInput("Jack")

fmt.Println(el.MustText()) // MustText verwenden um den Text zu erhalten
```

## Text von einer Eingabe entfernen

Simulieren Sie einfach, wie ein Mensch es macht, wählen Sie den ganzen Text aus und ersetzen Sie ihn durch eine leere Zeichenkette:

```go
page.MustElement(`[type="text"]`).MustSelectAllText().MustInput("")
```

Sie können `SelectText` verwenden, um einen Teil des Textes zu ersetzen.

## Zeiteingabe

The supported input types are [date](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date), [datetime-local](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local), [month](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/month), and [time](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time).

```go
page.MustElement(`[type="date"]`).MustInputTime(time.Now())
```

## Checkbox

Klicke einfach wie ein Mensch:

```go
el := page.MustElement(`[type="checkbox"]`)

// // Prüfen Sie, ob nicht
aktiviert ist, wenn !el.MustProperty("checked").Bool() {
    el.MustClick()
}
```

## Optionen auswählen

Wählen Sie Optionen in [`<select>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select).

Der folgende Code wird Optionen auswählen, die den Text "B" oder "C" enthalten:

```go
page.MustElement("select").MustSelect("B", "C")
```

Sie können auch regex oder css-Selektor verwenden, um Optionen auszuwählen:

```go
page.MustElement("select").Select([]string{``^B$`}, true, rod.SelectorTypeRegex)

// false setzen um
page.MustElement("select").Select([]string{`[value="c"]`}, false, rod.SelectorTypeCSSSector)
```

## Dateien festlegen

Use `SetFiles` to set files for the [file input](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file):

```go
pag.MustElement(`[type=file]`).MustSetFiles("a.jpg", "b.pdf")
```

## Maus, Tastatur und Berühren

Sie können auch die `page.Maus`, `page.Keyboard`oder `page.Touch` verwenden, um niedrigstufige Eingaben zu simulieren. So können Sie den Einheitstest nach Ziehen durchsuchen, um zu lernen, wie man das Ziehen zu simulieren.
