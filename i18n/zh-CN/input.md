# 输入

Rod 提供了很多方法来模拟人工输入，比如鼠标点击或者键盘按键。

## 鼠标点击

模拟鼠标点击一个元素：

```go
// 左击
page.MustElement("button").MustClick()

// 右击
page.MustElement("button").Click(proto.InputMouseButtonRight)
```

## 文本输入

模拟输入：

```go
el := page.MustElement(`[type="text"]`)
el.MustInput("Jack")

fmt.Println(el.MustText()) // 使用 MustText 来获取文本
```

## 删除输入框中的文本

模拟人的行为即可。选中所有文本，用一个空字符串替换：

```go
page.MustElement(`[type="text"]`).MustSelectAllText().MustInput("")
```

可以使用 `SelectText` 替换部分文本。

## 时间输入

支持的输入类型有 [date](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date)、[datetime-local](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local)、[month](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/month) 和 [time](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time)。

```go
page.MustElement(`[type="date"]`).MustInputTime(time.Now())
```

## 输入按键组合

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
page.MustElement("select").Select([]string{`^B$`}, true, rod.SelectorTypeRegex)

// set false to deselect
page.MustElement("select").Select([]string{`[value="c"]`}, false, rod.SelectorTypeCSSSector)
```

## Set files

Use `SetFiles` to set files for the [file input](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file):

```go
pag.MustElement(`[type=file]`).MustSetFiles("a.jpg", "b.pdf")
```

## Mouse, keyboard, and touch

You can also use the `page.Mouse`, `page.Keyboard`, or `page.Touch` to simulate low-level inputs. Such as you can search the unit test for dragging to learn how to simulate dragging.
