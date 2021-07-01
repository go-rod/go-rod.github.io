# Контекст та час очікування

В Голанзі, зазвичай ми використовуємо [контекст](https://golang.org/pkg/context/) для переривання тривалих завдань. Род використовує контекст для обробки скасувань блокування IO операцій, зазвичай, час очікування. Тобі потрібно приділяти їм особливу увагу.

Якщо Ви не знайомі з контекстом, будь ласка, спочатку прочитайте [Understand Context](understand-context.md).

## Скасування

Наприклад, наведений нижче код створює пусту сторінку і переходить на неї на "github.com":

```go
page := rod.New().MustConnect().MustPage()
page.MustNavigate("http://github.com")
```

Тепер, припустимо, що ми хочемо скасувати `Мостова навігація` якщо вона займатиме більше 2 секунд. В конструкторі ми можемо зробити щось на зразок:

```go
Сторінка:= rod.New().MustConnect().MustPage()

ctx, cancel := context.Background())
pageWithCancel := page.Context(ctx)

go func() {
    time. leep(2 * time.Second)
    cancel()
}()

pageWithCancel.MustNavigate("http://github.com") // буде скасовано через 2 секунди
```

We use the `page.Context` to create a shallow clone of the `page`. Кожного разу, коли ми викликаємо `скасувати`, операції викликані `pageWithCancel` буде скасовано, це може бути будь-яка операція, не просто `MustNavigate`. Походження `сторінка` не впливає, якщо ми використаємо її для виклику операцій, вони не будуть скасовані.

Цей стиль не є особливим для Rod, ви можете знайти схожі API-інтерфейси, такі як [Request.Context](https://golang.org/pkg/net/http/#Request.WithContext) у стандартній бібліотеці.

Оскільки `pageWithCancel` та `page` незалежні один від одного, операції, викликані `сторінкою` не будуть впливати на скасування:

```go
page.MustNavigate("http://github.com") // не буде скасовано через 2 секунди
```

## Тайм-аут

Код вище - це просто спосіб зробити тайм-аут операції. В Голанзі, тайм-аут зазвичай є лише особливим випадком скасування. Оскільки це настільки корисно, ми створили помічника так само, як вище, він називається `Тайм-аут`, тому код вище можна зменшити так:

```go
Сторінка := rod.New().MustConnect().MustPage()
page.Timeout(2 * time.Second).MustNavigate("http://github.com")
```

`page.Timeout(2 * time.Second)` є попередньою `pageWithCancel`. Не тільки `Сторінка`, `Браузер` та `елемент` також мають однакових помічників для контексту.

## Визначити тайм-аут

Як мені знати, чи закінчується операція чи ні? Зазвичай в Голланзі, тайм-аут - це помилка типу. Прозорість не особлива. Для коду вище ми можемо це зробити, щоб виявити тайм-аут:

```go
page := rod.New().MustConnect().MustPage()

err := rod.Try(func() {
    page.Timeout(2 * time.Second).MustNavigate("http://github.com")
})
if errors.Is(err, context.DeadlineExceeded) {
    // code for timeout error
} else if err != nil {
    // code for other types of error
}
```

Тут ми використовуємо `rod.Спробуйте` для обгортання функції, яка може викликати помилку очікування.

Ми поговоримо більше про обробку помилок [при обробці помилок](error-handling.md).
