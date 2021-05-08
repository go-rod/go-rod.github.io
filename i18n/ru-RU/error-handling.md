# Обработка ошибок

В предыдущих главах мы видели много `Должен` предопределенных методов, таких как `MustNavigate`, `MustElement`и т.д. Они имеют не префиксные версии, такие как `Навигация`, `Элемент`и т.д. Главное отличие между ними — то, как они обрабатывают ошибки. Они имеют не префиксные версии, такие как `Навигация`, `Элемент`и т.д. Главное отличие между ними — то, как они обрабатывают ошибки. Для Rod это не особенно, вы можете найти его в стандартной библиотеке [regex.MustCompile](https://golang.org/pkg/regexp/#MustCompile).

Методы, такие как `MustNavigate` и `MustElement` обычно используются в примере кода или быстрого написания. Они полезны для таких рабочих мест, как тестирование дыма, мониторинг участков, сквозной тест и т.д. Работы с большим количеством неопределенностей, таких как веб-скрапления, непрефиксная версия будет лучше выбора. Работы с большим количеством неопределенностей, таких как веб-скрапления, непрефиксная версия будет лучше выбора.

Префиксная версия - это только непрефиксная версия, завернутая проверкой ошибок. Вот исходный код `MustElement`, так как вы можете видеть его просто назовите элемент `Элемент` с несколькими дополнительными линиями в панику если err не `nl`:

```go
func (p *Page) MustElement(селекторы ...string) *Element {
    el, err := p.Element(selectors...)
    if err != nil {
        panic(err)
    }
    return el
}
    if err != nil {
        panic(err)
    }
    return el
}
```

## Получить значение ошибки

Два блока кода ниже почти делают одно и то же в двух стилях.

Стиль ниже - это стандартный способ обработки ошибок:

```go
страница := rod.New().MustConnect().MustPage("https://example.com")

el, err := page. lement("а")
если err ! nil {
    handleError(err)
    return
}
html, err := el. TML()
if err != nil {
    handleError(err)
    return
}
fmt.Println(html)
```

Мы можем использовать `rod.Try` , чтобы перехватить ошибку из `Must` prefixed methods `MustElement` и `MustHTML`. Стиль ниже обычно заканчивается меньше кода, но также может уловить дополнительные ошибки:

```go
страница := rod.New().MustConnect().MustPage("https://example.com")

err := rod.Try(func() {
    fmt.Println(page.MustElement("a").MustHTML())
})
handleError(err)
```

## Проверьте тип ошибки

Мы используем стандартный способ Go, чтобы проверить типы ошибок, без магии.

`handleError` в приведенном выше коде может выглядеть так:

```go
func handleError(err error) {
    var evalErr *rod.ErrEval
    if errors.Is(err, context. eadlineExceeded) { // timeout error
        fmt.Println("timeout err")
    } else if errors. s(err, &evalErr) { // eval error
        fmt.Println(evalErr. ineNumber)
    } else if err != nil {
        fmt. rintln("cannot handle", err)
    }
}
```
