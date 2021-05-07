# Контекст и время ожидания

В Голанге мы обычно используем [Контекст](https://golang.org/pkg/context/) для отмены долговременных задач. Rod использует контекстный текст для отмены IO блокирующие операции, в большинстве случаев тайм-аут. Вы должны уделить им особое внимание.

Если вы не знакомы с контекстом, сначала прочитайте [Understand Context](understand-context.md).

## Отмена

Например, код ниже создает пустую страницу и переходит к "github.com":

```go
page := rod.New().MustConnect().MustPage()
page.MustNavigate("http://github.com")
```

Предположим, что мы хотим отменить `MustNavigate` , если это занимает более 2 секунд. На стержне мы можем сделать что-то вроде этого:

```go
страница := rod.New().MustConnect().MustPage()

ctx, cancel := context.WithCancel(context.Background())
pageWithCancel := page.Context(ctx)

go func() {
    time. leep(2 * time.Second)
    cancel()
}()

pageWithCancel.MustNavigate("http://github.com") // будет отменено через 2 секунды
```

Мы используем `page.Context` для создания мелкого клонирования `страницы`. Каждый раз, когда мы вызываем `отмену`, операции вызванные `отменой отмены` будут отменены, это может быть любая операция, а не просто `MustNavigate`. Происхождение `страницы` не пострадает, если мы используем её для вызова операций, они не будут отменены.

Этот стиль для Rod не является особенным, вы можете найти похожие API, такие как [Request.WithContext](https://golang.org/pkg/net/http/#Request.WithContext) в стандартной библиотеке.

Потому что `pageWithCancel` и `страница` не зависят друг от друга, операции, вызванные `страницей` не будут затронуты отменой:

```go
page.MustNavigate("http://github.com") // не будет отменен через 2 секунды
```

## Таймаут

Вышеприведенный код является всего лишь способом тайм-аута операции. В Голанге тайм-аут обычно является особым случаем отмены. Because it's so useful, we created a helper to do the same thing above, it's called `Timeout`, so the code above can be reduced like below:

```go
страница := rod.New().MustConnect().MustPage()
page.Timeout(2 * time.Second).MustNavigate("http://github.com")
```

`page.Timeout(2 * time.Second)` является предыдущей `pageWithel`. Не просто `страница`, `браузер` и `элемент` также имеют одни и те же контекстные помощники.

## Определить тайм-аут

Как узнать, есть ли время ожидания операции или нет? В Голанге тайм-аут обычно является типом ошибки. Это не особый для Rod. Для приведенного выше кода мы можем сделать это для определения таймаута:

```go
страница := rod.New().MustConnect().MustPage()

err := rod.Try(func() {
    page.Timeout(2 * time.Second).MustNavigate("http://github.com")
})
если ошибки. s(err, context. eadlineExceeded) {
    // code for timeout error
} else if err ! nil {
    // код для других типов ошибки
}
```

Здесь мы используем `rod.Try` , чтобы обернуть функцию, которая может вызвать ошибку таймаута.

Мы расскажем больше об ошибке на [Error Handling](error-handling.md).
