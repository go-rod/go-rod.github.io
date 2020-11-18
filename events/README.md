# Events

Events are actions or occurrences that happen in the browser you are controlling,
which the browser tells you about so you can respond to them in some way if desired.
Such as when we let the page to navigate to a new URL, we can subscribe the events to know when
the navigation is complete or when the page is rendered.

## Wait for an event once

Let's try to navigate to a page and wait until the network of the page is almost idle:

```go
func main() {
	page := rod.New().MustConnect().MustPage("")

	wait := page.MustWaitNavigation()
	page.MustNavigate("https://www.wikipedia.org/")
	wait()
}
```

We use the `MustWaitNavigation` to subscribe the network idle event.
The reason why the subscription is before the navigation not after is because the code to trigger navigation will
take time to execute, during that time the event may have already happened.
After the `MustNavigate` we call the `wait` function to block the code until the next network idle event happens.

Rod provides lots of other event helpers, the function names are all prefixed with `MustWait` or `Wait`.

## Get the event details

Some event types carry details about the event itself. Such as we navigate to a url and use the event to get
the response status code of the navigation request:

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

If you want to handle all events of a type, such as listen for all events of the page's console output,
we can do something like this:

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

Any function in Rod that blocks can be canceled with the [context](context-and-timeout.md), it's not special for events.
Besides, you can also stop event by returning true from the event handler, for example:

```go
wait := page.EachEvent(func(e *proto.PageLoadEventFired) (stop bool) {
    return true
})
page.MustNavigate("https://example.com")
wait()
```

If we don't return true, the wait will keep waiting for the `PageLoadEventFired` events and block the program forever.
This is actually the code of how `page.WaitEvent` works.

## Available events

Usually, we use the IDE to list all the available events. Such as we want to see all the events under the Page domain,
we can create an empty page object and use the `WaitEvent` to list and filter all the event types:

![event-list](event-list.png)

[Next Chapter](/input.md)
