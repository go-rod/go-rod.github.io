# Input

Тяга надає багато методів симуляції введення людини, наприклад, натискання миші або натискання клавіатури.

## Натискання мишею

Для імітації миші натисніть елемент:

```go
// left click
page.MustElement("button").MustClick()

// right click
page.MustElement("button").Click(proto.InputMouseButtonRight)
```

## Text input

Для імітації вводу:

```go
el := page.MustElement(`[type="text"]`)
el.MustInput("Джек")

fmt.Println(el.MustText()) // використовуйте MustText для отримання тексту
```

## Видалити текст із вхідних даних

Просто імітуйте як людина робить це, виділіть весь текст і замініть його порожнім рядком:

```go
page.MustElement(`[type="text"]`).MustSelectAllText().MustInput("")
```

Ви можете використовувати `вибрати текст` , щоб замінити частину тексту.

## Введення

Підтримувані типи вводу це [дата](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date), [дата-локальна](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local), [місяць](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/month), і [час](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time).

```go
page.MustElement(`[type="date"]`).MustInputTime(time.Now())
```

## Прапорець

Просто клацніть по ньому як людині:

```go
el := page.MustElement(`[type="checkbox"]`)

// перевірте, чи не відмічено
якщо !el.MustProperty("checked").Bool() {
    el.MustClick()

```

## Виберіть опції

Виберіть параметри [`<select>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select).

Нижче наведений код ви можете вибрати параметри, які містять текст "B" або "C":

```go
page.MustElement("select").MustSelect("B", "C")
```

Ви також можете використовувати регулярний вираз, або css селектор для вибору:

```go
page.MustElement("select").Select([]string{`^B$`}, true, rod.SelectorTypeRegex)

// встановлює хибність для вибору
сторінки
сторінки.MustElement("select").Select([]string{`[value="c"]`}, false, rod.SelectorTypeCSSSect)
```

## Встановити файли

Використовувати `Встановити файли` для [введення файлу](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file):

```go
pag.MustElement(`[type=file]`).MustSetFiles("a.jpg", "b.pdf")
```

## Миша, клавіатура та дотик

Ви також можете використовувати `сторінку`. `сторінку`. </code> або `сторінку.Торкніться` , щоб симулювати вхідні дані з низьким рівнем рівня. Такі, як ви можете шукати одиницю випробування перетягування, щоб дізнатися, як симулювати перетягування.
