# Input

Rod ger massor av metoder för att simulera mänskliga ingångar, såsom musklick eller tangentbordspress.

## Klicka på musen

För att simulera musen klickar du på ett element:

```go
// left click
page.MustElement("button").MustClick()

// right click
page.MustElement("button").Click(proto.InputMouseButtonRight)
```

## Text input

Simulera inmatningen:

```go
el := page.MustElement(`[type="text"]`)
el.MustInput("Jack")

fmt.Println(el.MustText()) // Använd MustText för att få texten
```

## Ta bort text från en indata

Bara simulera hur en människa gör det, välj all text och ersätta den med en tom sträng:

```go
page.MustElement(`[type="text"]`).MustSelectAllText().MustInput("")
```

Du kan använda `SelectText` för att ersätta en del av texten.

## Tid inmatning

Indatatyperna som stöds är [datum](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date), [datetime-local](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local), [månad](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/month), och [tid](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time).

```go
page.MustElement(`[type="date"]`).MustInputTime(time.Now())
```

## Kryssruta

Klicka bara på den som en människa:

```go
el := sida.MustElement(`[type="checkbox"]`)

// kontrollera den om den inte är markerad
om !el.MustProperty("markerad").Bool() {
    el.MustClick()
}
```

## Välj alternativ

Välj alternativ i [`<select>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select).

Koden nedan kommer att välja alternativ som innehåller texten "B" eller "C":

```go
page.MustElement("select").MustSelect("B", "C")
```

Du kan också använda regex eller css-väljare för att välja alternativ:

```go
page.MustElement("select").Select([]string{`^B$`}, true, rod.SelectorTypeRegex)

// set false to deselect
page.MustElement("select").Select([]string{`[value="c"]`}, false, rod.SelectorTypeCSSSector)
```

## Ställ in filer

Använd `SetFiles` för att ställa in filer för filen [](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file):

```go
pag.MustElement(`[type=file]`).MustSetFiles("a.jpg", "b.pdf")
```

## Mus, tangentbord och tryck på

Du kan också använda `-sidan.Mus`, `sidan.Tangentbord`eller `sidan.Tryck på` för att simulera lågnivåingångar. Som du kan söka på enhetstestet för att dra för att lära dig att simulera dragning.
