# Input

Rod gir mange metoder for å simulere menneskelige innspill, for eksempel museklikk eller tastatur trykk.

## Trykk museknapp

Klikk et element for å simulere musen:

```go
// left click
page.MustElement("button").MustClick()

// right click
page.MustElement("button").Click(proto.InputMouseButtonRight)
```

## Text input

For å simulere inndataen:

```go
el := page.MustElement(`[type="text"]`)
el.MustInput("Jack")

fmt.Println(el.MustText()) // bruk MustText for å få teksten
```

## Fjern tekst fra et inndata

Bare simuler hvordan et menneske gjør det, velg all teksten og erstatt den med en tom streng:

```go
page.MustElement(`[type="text"]`).MustSelectAllText().MustInput("")
```

Du kan bruke `Velgetekst` for å erstatte en del av teksten.

## Tid inngang

De støttede inndatatypene er [date](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date), [datetime-local](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local), [måned](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/month), og [tid](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time).

```go
page.MustElement(`[type="date"]`).MustInputTime(time.Now())
```

## Avmerkingsboks

Bare klikk på det som et menneske:

```go
el := page.MustElement(`[type="checkbox"]`)

// sjekk det om det ikke er merket
hvis !el.MustProperty("checked").Bool() {
    el.MustClick()

```

## Velg alternativer

Velg alternativer i [`<select>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select).

Koden nedenfor vil velge alternativer som inneholder tekst "B" eller "C":

```go
side.MustElement("select").MustSelect("B", "C")
```

Du kan også bruke regex eller css-velger for å velge alternativer:

```go
page.MustElement("select").Select([]string{`^B$`}, true, rod.SelectorTypeRegex)

// sett falsk til å velge bort
side.MustElement("select").Select([]string{`[value="c"]`}, false, rod.SelectorTypeCSSSector)
```

## Angi filer

Bruk `SettFiler` for å angi filer for [filen som er skrevet inn](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file):

```go
pag.MustElement(`[type=file]`).MustSetFiles("a.jpg", "b.pdf")
```

## Mus, tastatur og berøring

Du kan også bruke `side.Mouse`, `side. Tastatur`, eller `side.Trykk` for å simulere forslag på lavt nivå. Slik som du kan søke etter enhetsprøve for å dra for å lære å simulere drakt.
