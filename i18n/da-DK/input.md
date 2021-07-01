# Input

Rod giver masser af metoder til at simulere menneskelige indgange, såsom museklik eller tastatur presse.

## Klik på musen

Klik på et element for at simulere musen:

```go
// left click
page.MustElement("button").MustClick()

// right click
page.MustElement("button").Click(proto.InputMouseButtonRight)
```

## Text input

For at simulere input:

```go
el := page.MustElement(`[type="text"]`)
el.MustInput("Jack")

fmt.Println(el.MustText()) // brug MustText for at få teksten
```

## Fjern tekst fra et input

Bare simulere, hvordan et menneske gør det, skal du vælge al teksten og erstatte den med en tom streng:

```go
page.MustElement(`[type="tekst"]`).MustSelectAllText().MustInput("")
```

Du kan bruge `SelectText` til at erstatte en del af teksten.

## Tid input

De understøttede inputtyper er [dato](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date), [datetime-local](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local), [måned](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/month), og [tid](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time).

```go
side.MustElement(`[type="dato"]`).MustInputTime(tid.Now())
```

## Afkrydsningsfelt

Bare klik på det som et menneske:

```go
el := page.MustElement(`[type="checkbox"]`)

// check it if not checked
if !el.MustProperty("checked").Bool() {
    el.MustClick()
}
```

## Vælg indstillinger

Vælg indstillinger i [`<select>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select).

Koden nedenfor vil vælge indstillinger, der indeholder tekst "B" eller "C":

```go
page.MustElement("select").MustSelect("B", "C")
```

Du kan også bruge regex eller css selector til at vælge muligheder:

```go
page.MustElement("select").Select([]string{`^B$`}, true, rod.SelectorTypeRegex)

// sæt false til at fravælge
side.MustElement("select").Select([]string{`[value="c"]`}, false, rod.SelectorTypeCSSSector)
```

## Angiv filer

Brug `SetFiles` til at angive filer for [filens input](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file):

```go
pag.MustElement(`[type=file]`).MustSetFiles("a.jpg", "b.pdf")
```

## Mus,tastatur og berøring

Du kan også bruge `page.Mouse`, `side.Keyboard`eller `side.Tryk` for at simulere input på lavt niveau. Såsom du kan søge i enhedstesten for at trække for at lære, hvordan man simulerer træk.
