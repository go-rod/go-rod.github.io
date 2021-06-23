# Обробка помилок

У попередніх розділах ми бачили багато `повинні` попередньо зафіксовані методи, такі як `Межа`, `MustElement`і т. д. У всіх них є не префіксні версії, як `Навігація`, `Елемент`і т.д. Головна відмінність між ними полягає в тому, як вони вирішують помилки. Це не спеціальний для Rod, це можна знайти у стандартній бібліотеці, як [regex.MustCompile](https://golang.org/pkg/regexp/#MustCompile).

Методи, такі як `Пульт` і `MustElement` зазвичай використовуються у коді або швидкому писемності. Вони корисні для таких завдань, як дикі тестування, моніторинг сайту наскрізний і т.д. Робочі місця з великою невизначеністю, такі як веб-скачування, нефіксована версія буде кращим вибором.

Префіксна версія - це просто непрефіксна версія, що згортається з перевіркою помилок. Ось вихідний код `MustElement`, як бачимо, це називає `елемент` з додатковими лініями на паніку, якщо ерр не `дорівнює`:

```go
func (p *Page) MustElement(selectors ...string) *Element {
    el, err := p.Element(selectors...)
    якщо err != nil {
        panic(err)
    }
    return el
}
```

## Отримати значення помилки

Два блоки коду розташовані внизу майже роблять одне і те ж саме в двох стилях.

Стиль внизу - стандартний спосіб обробки помилок:

```go
Сторінка := rod.New().MustConnect().MustPage("https://example.com")

el, err := сторінки. lement("a")
якщо ерр ! nil {
    handleError(err)
    return
}
html, err := el. TML()
, якщо err != nil {
    handleError(err)
    return
}
fmt.Println(html)
```

Ми можемо використовувати `rod.Спробуйте` щоб скористатися помилкою з `Обов'язково` попередньо фіксований метод `MustElement` та `MustHTML`. Нижченаведений стиль зазвичай завершиться менш кодом, але він може ловити додаткові помилки:

```go
page := rod.New().MustConnect().MustPage("https://example.com")

err := rod.Try(func() {
    fmt.Println(page.MustElement("a").MustHTML())
})
handleError(err)
```

## Перевірте тип помилки

Ми використовуємо стандартні способи перевірки типів помилок, без магії.

The `handleError` in the above code may look like:

```go
func handleError(err error) {
    var evalErr *rod.ErrEval
    , якщо errors.Is(err, context. eadlineExceed) { // Помилка
        fmt.Println("timeout err")
    else якщо помилки. s(err, &evalErr) { // рівна помилка
        fmt.Println(evalErr. ineNumber)
    } else якщо err != nil {
        fmt. rintln("не може обробити", помилка)
    }
}
```
