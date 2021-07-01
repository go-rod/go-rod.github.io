# Input

Rod poskytuje spoustu metod simulace lidských vstupů, jako je stisknutí myši nebo stisknutí klávesnice.

## Kliknutí myší

Chcete-li simulovat myší, klepněte na prvek:

```go
// left click
page.MustElement("button").MustClick()

// right click
page.MustElement("button").Click(proto.InputMouseButtonRight)
```

## Text input

Možnost simulovat vstup:

```go
el := page.MustElement(`[type="text"]`)
el.MustInput("Jack")

fmt.Println(el.MustText()) // použijte MustText pro získání textu
```

## Odstranit text ze vstupu

Stačí simulovat, jak to člověk udělá, vyberte všechen text a nahradte jej prázdným řetězcem:

```go
page.MustElement(`[type="text"]`).MustSelectAllText().MustInput("")
```

Můžete použít `SelectText` k nahrazení části textu.

## Vstup času

Podporované typy vstupů jsou [datum](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date), [datetime-local](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local), [měsíc](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/month), a [time](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time).

```go
page.MustElement(`[type="date"]`).MustInputTime(time.Now())
```

## Zaškrtávací políčko

Stačí kliknout jako člověk:

```go
el := page.MustElement(`[type="checkbox"]`)

// check it if not checked
if !el.MustProperty("checked").Bool() {
    el.MustClick()
}
```

## Vybrat možnosti

Vyberte možnosti v [`<select>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select).

Níže uvedený kód vybere možnosti, které obsahují text "B" nebo "C":

```go
page.MustElement("select").MustSelect("B", "C")
```

Můžete také použít regex nebo css selektor pro výběr možností:

```go
page.MustElement("select").Select([]string{`^B$`}, true, rod.SelectorTypeRegex)

// set false to deselect
page.MustElement("select").Select([]string{`[value="c"]`}, false, rod.SelectorTypeCSSSector)
```

## Nastavit soubory

Pomocí `SetFiles` můžete nastavit soubory pro [vstup do souboru](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file):

```go
pag.MustElement(`[type=file]`).MustSetles("a.jpg", "b.pdf")
```

## Myší, klávesnice a dotyk

Můžete také použít `stránku.Mouse`, `stránku.Keyboard`nebo `stránku.Touch` k simulaci nízkých vstupů. Například můžete prohledat souhrnný test pro přetažení, abyste se naučili, jak simulovat přetažení.
