# События

Events are actions or occurrences that happen in the browser you are controlling, which the browser tells you about so you can respond to them in some way if desired. Such as when we let the page to navigate to a new URL, we can subscribe the events to know when the navigation is complete or when the page is rendered.

## Дождитесь события один раз

Давайте попробуем перейти к странице и подождите, пока сеть страницы почти не работает:

```go
func main() {
    страница := rod.New().MustConnect().MustPage()

    ждать := page.MustWaitNavigation()
    page.MustNavigate("https://www.wikipedia.org/")
    wait()
}
```

Мы используем `MustWaitNavigation` для подписки на событие простоя сети. The reason why the subscription is before the navigation not after is because the code to trigger navigation will take time to execute, during that time the event may have already happened. После `MustNavigate` мы вызываем функцию `ожидания` , чтобы заблокировать код до следующего случая простоя сети.

Rod предоставляет множество других помощников по событиям, все функции префикса с `MustWait` или `Подождите`.

## Получить детали события

Некоторые типы событий содержат подробную информацию о самом событии. Such as we navigate to a url and use the event to get the response status code of the navigation request:

```go
func main() {
    page := rod.New().MustConnect().MustPage()

    e := proto.NetworkResponseReceived{}
    wait := page.WaitEvent(&e)
    page.MustNavigate("https://www.wikipedia.org/")
    wait()

    fmt.Println(e.Response.Status)
}
```

## Обработка нескольких событий

If you want to handle all events of a type, such as listen for all events of the page's console output, we can do something like this:

```go
go page.EachEvent(func(e *proto.RuntimeConsoleAPICalled) {
    fmt.Println(page.MustObjectsToJSON(e.Args))
})()
```

Чтобы подписаться на несколько типов одновременно таких как подписаться `RuntimeConsoleAPICalled` и `PageLoadEventFired`:

```go
go page.EachEvent(func(e *proto.RuntimeConsoleAPICalled) {
    fmt.Println(page.MustObjectsToJSON(e.Args))
}, func(e *proto.PageLoadEventFired) {
    fmt.Println("loaded")
})()
```

## Остановить подписку

Любая функция на стержне, которую блоки могут быть отменены с помощью контекста [](context-and-timeout.md), это не особый для событий. Кроме того, вы можете остановить событие, возвращая истину из обработчика события, например:

```go
подождите := page.EachEvent(func(e *proto.PageLoadEventFired) (stop bool) {
    return true
})
page.MustNavigate("https://example.com")
wait()
```

Если мы не вернемся к истине, ожидание будет ждать событий `PageLoadEventFired` и навсегда блокировать программу. На самом деле это код `page.WaitEvent`.

## Доступные события

Все типы событий реализуют интерфейс `прото.Event` , вы можете использовать его для поиска всех событий. Обычно IDE будет автоматически фильтровать по интерфейсу. Such as we want to see all the events under the Page domain, we can create an empty page object and use the `WaitEvent(proto.Event)` to list and filter all the event types like the screenshot below:

![список событий](event-list.png)

Вы также можете использовать этот [сайт](https://chromedevtools.github.io/devtools-protocol/tot/Page) для просмотра событий.
