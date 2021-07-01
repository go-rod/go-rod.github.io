# Input

Rod предоставляет множество методов моделирования человеческих вводов, таких как мышь или клавиатура.

## Клик мыши

Чтобы симулировать мышь нажмите на элемент:

```go
// left click
page.MustElement("button").MustClick()

// right click
page.MustElement("button").Click(proto.InputMouseButtonRight)
```

## Text input

Для моделирования ввода:

```go
el := page.MustElement(`[type="text"]`)
el.MustInput("Jack")

fmt.Println(el.MustText()) // используйте MustText для получения текста
```

## Удалить текст из ввода

Просто симулируйте то, как человек делает это, выделите весь текст и замените его пустой строкой:

```go
page.MustElement(`[type="text"]`).MustSelectAllText().MustInput("")
```

Вы можете использовать `SelectText` для замены части текста.

## Ввод времени

The supported input types are [date](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date), [datetime-local](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local), [month](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/month), and [time](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time).

```go
page.MustElement(`[type="date"]`).MustInputTime(time.Now())
```

## Флажок

Просто кликните на него как человека:

```go
el := page.MustElement(`[type="checkbox"]`)

// проверьте, если не отмечено
if !el.MustProperty("checked").Bool() {
    el.MustClick()
}
```

## Выберите опции

Выберите параметры в [`<select>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select).

Код, указанный ниже, выберет варианты, которые содержат текст "B" или "C":

```go
page.MustElement("select").MustSelect("B", "C")
```

Вы также можете использовать регулярные выражения или css селектор для выбора параметров:

```go
page.MustElement("select").Select([]string{`^B$`}, true, rod.SelectorTypeRegex)

// устанавливаем false как снять выделение
page.MustElement("select").Select([]string{`[value="c"]`}, false, rod.SelectorTypeCSSSector)
```

## Установка файлов

Используйте `SetFiles` для установки файлов для [ввода файла](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file):

```go
pag.MustElement(`[type=file]`).MustSetFiles("a.jpg", "b.pdf")
```

## Мышь, клавиатура и касание

Вы также можете использовать `page.Mouse`, `page.Keyboard`или `page.Touch` для симуляции низкоуровневых входов. Например, вы можете искать модульный тест для перетаскивания, чтобы научиться симулировать перетаскивание.
