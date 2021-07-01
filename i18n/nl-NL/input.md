# Input

Strijd biedt veel methodes om menselijke inputs te simuleren, zoals muisklik of toetsenbord drukken.

## Muis klik

Klik op een element om de muis te simuleren:

```go
// left click
page.MustElement("button").MustClick()

// right click
page.MustElement("button").Click(proto.InputMouseButtonRight)
```

## Text input

Om het invoerveld te simuleren:

```go
el := page.MustElement(`[type="text"]`)
el.MustInput("Jack")

fmt.Println(el.MustText()) // gebruik MustText om de tekst te krijgen
```

## Verwijder tekst uit een invoer

simuleren hoe een mens het doet, alle tekst selecteren en vervangen door een lege tekenreeks:

```go
page.MustElement(`[type="text"]`).MustSelectAllText().MustInput("")
```

U kunt `SelectText` gebruiken om een deel van de tekst te vervangen.

## Tijd invoer

The supported input types are [date](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date), [datetime-local](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local), [month](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/month), and [time](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time).

```go
page.MustElement(`[type="date"]`).MustInputTime(time.Now())
```

## Selectievakje

Klik er gewoon op als een mens:

```go
el := page.MustElement(`[type="checkbox"]`)

// controleer het als het niet is aangevinkt
als !el.MustProperty("checked").Bool() {
    el.MustClick()
}
```

## Selecteer opties

Selecteer opties in [`<select>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select).

De code hieronder zal opties selecteren die tekst "B" of "C" bevatten:

```go
page.MustElement("select").MustSelect("B", "C")
```

Je kunt ook regex of css selector gebruiken om opties te selecteren:

```go
page.MustElement("select").Select([]string{`^B$`}, true, rod.SelectorTypeRegex)

// zet false om
pagina te deselecteren.MustElement("select").Select([]string{`[value="c"]`}, false, rod.SelectorTypeSSector)
```

## Stel bestanden in

Gebruik `SetFiles` om bestanden in te stellen voor [bestandsinvoer](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file):

```go
pag.MustElement(`[type=file]`).MustSetFiles("a.jpg", "b.pdf")
```

## Muis, toetsenbord en aanraking

U kunt ook gebruik maken van de `page.Mouse`, `page.Keyboard`, of `page.Raak` aan om laag level invoeren te simuleren. Zoals je kunt zoeken naar de eenheidstest om te leren slepen hoe slepen kan worden gesimuleerd.
