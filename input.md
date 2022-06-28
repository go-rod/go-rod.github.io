# Input

Rod provides lots of methods to simulate human inputs, such as the mouse click or keyboard press.

## Mouse click

To simulate the mouse click an element:

```go
// left click
page.MustElement("button").MustClick()

// right click
_ = page.MustElement("button").Click(proto.InputMouseButtonRight)
```

## Text input

To simulate the input:

```go
el := page.MustElement(`[type="text"]`)
el.MustInput("Jack")

fmt.Println(el.MustText()) // use MustText to get the text
```

## Remove text from an input

Just simulate how a human does it, select all the text and replace it with an empty string:

```go
page.MustElement(`[type="text"]`).MustSelectAllText().MustInput("")
```

You can use `SelectText` to replace a part of the text.

## Time input

The supported input types are [date](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date),
[datetime-local](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local),
[month](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/month),
and [time](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time).

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

You can also use the `page.Mouse`, `page.Keyboard`, or `page.Touch` to simulate low-level inputs.
Such as you can search the unit test for dragging to learn how to simulate dragging.
