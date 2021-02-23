# 事件

事件是在你控制的浏览器中发生的动作或事件，浏览器会告诉你这些事件，这样你就可以在需要的时候以某种方式响应它们。 例如，当我们让页面导航到一个新的 URL 时，我们可以订阅事件来知道导航何时完成或者页面何时呈现。

## 等待一次事件

让我们尝试导航到一个页面，并等待，直到该页面的网络几乎是空闲的：

```go
func main() {
    page := rod.New().MustConnect().MustPage("")

    wait := page.MustWaitNavigation()
    page.MustNavigate("https://www.wikipedia.org/")
    wait()
}
```

我们使用 `MustWaitNavigation` 来订阅网络空闲事件。 在导航之前订阅而不是在导航之后，是因为触发导航的代码需要时间来执行，在此期间事件可能已经发生。 After the `MustNavigate` we call the `wait` function to block the code until the next network idle event happens.

Rod provides lots of other event helpers, the function names are all prefixed with `MustWait` or `Wait`.

## Get the event details

Some event types carry details about the event itself. Such as we navigate to a url and use the event to get the response status code of the navigation request:

```go
func main() {
    page := rod.New().MustConnect().MustPage("")

    e := proto.NetworkResponseReceived{}
    wait := page.WaitEvent(&e)
    page.MustNavigate("https://www.wikipedia.org/")
    wait()

    fmt.Println(e.Response.Status)
}
```

## Handle multiple events

If you want to handle all events of a type, such as listen for all events of the page's console output, we can do something like this:

```go
go page.EachEvent(func(e *proto.RuntimeConsoleAPICalled) {
    fmt.Println(page.MustObjectsToJSON(e.Args))
})()
```

To subscribe multiple event types at the same time, such as subscribe `RuntimeConsoleAPICalled` and `PageLoadEventFired`:

```go
go page.EachEvent(func(e *proto.RuntimeConsoleAPICalled) {
    fmt.Println(page.MustObjectsToJSON(e.Args))
}, func(e *proto.PageLoadEventFired) {
    fmt.Println("loaded")
})()
```

## Stop the subscription

Any function in Rod that blocks can be canceled with the [context](context-and-timeout.md), it's not special for events. Besides, you can also stop event by returning true from the event handler, for example:

```go
wait := page.EachEvent(func(e *proto.PageLoadEventFired) (stop bool) {
    return true
})
page.MustNavigate("https://example.com")
wait()
```

If we don't return true, the wait will keep waiting for the `PageLoadEventFired` events and block the program forever. This is actually the code of how `page.WaitEvent` works.

## Available events

All event types implements the `proto.Event` interface, you can use it to find all events. Usually, the IDE will filter by the interface automatically. Such as we want to see all the events under the Page domain, we can create an empty page object and use the `WaitEvent(proto.Event)` to list and filter all the event types like the screenshot below:

![event-list](event-list.png)

You can also use this [site](https://chromedevtools.github.io/devtools-protocol/tot/Page) to browse the events.

[Next Chapter](/input.md)
