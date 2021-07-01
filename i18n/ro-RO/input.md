# Input

Rod oferă o mulțime de metode de simulare a intrărilor umane, cum ar fi apăsarea mouse-ului sau tastatura.

## Clic pe mouse

Pentru a simula mouse-ul fă clic pe un element:

```go
// left click
page.MustElement("button").MustClick()

// right click
page.MustElement("button").Click(proto.InputMouseButtonRight)
```

## Text input

Pentru a simula intrarea:

```go
el := page.MustElement(`[type="text"]`)
el.MustInput("Jack")

fmt.Println(el.MustText()) // folosește MustText pentru a obține textul
```

## Elimină textul dintr-o intrare

Simulați doar cum face un om, selectați tot textul și înlocuiți-l cu un șir gol:

```go
page.MustElement(`[type="text"]`).MustSelectAllText().MustInput("")
```

Poți folosi `Selectare Text` pentru a înlocui o parte a textului.

## Intrare timp

Tipurile de intrare acceptate sunt data [](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date), [datetime-local](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local), [luna](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/month), şi ora [](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time).

```go
page.MustElement(`[type="date"]`).MustInputTime(time.Now())
```

## Casuta

Apasă pe el ca pe o om:

```go
el := page.MustElement(`[type="checkbox"]`)

// verifică dacă nu este verificat
dacă !el.MustProperty("checked").Bool() {
    el.MustClick()

```

## Selectează opțiuni

Selectați opțiunile din [`<select>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select).

Codul de mai jos va selecta opțiunile care conțin textul "B" sau "C":

```go
page.MustElement("select").MustSelect("B", "C")
```

Puteți, de asemenea, utiliza selectorul regex sau css pentru a selecta opțiuni:

```go
page.MustElement("select").Select([]string{`^B$`}, true, rod.SelectorTypeRegex)

// setat fals pentru a deselecta
page.MustElement("select").Select([]string{`[value="c"]`}, false, rod.SelectorTypeSSector)
```

## Setare fișiere

Folosește `SetFile-uri` pentru a seta fișiere pentru [intrarea fișierului](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file):

```go
pag.MustElement(`[type=file]`).MustSetFiles("a.jpg", "b.pdf")
```

## Șoareci, tastatură și atingeți

De asemenea, poți folosi `pagina.Mouse`, `page.Tastatură`, sau `page.Touch` pentru a simula intrări de nivel inferior. Cum poți căuta testul de unitate pentru a trage pentru a învăța cum să simulezi tragerea.
