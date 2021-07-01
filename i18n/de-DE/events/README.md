# Ereignisse

Events are actions or occurrences that happen in the browser you are controlling, which the browser tells you about so you can respond to them in some way if desired. Such as when we let the page to navigate to a new URL, we can subscribe the events to know when the navigation is complete or when the page is rendered.

## Warte einmal auf ein Ereignis

Lass uns versuchen, zu einer Seite zu navigieren und warten, bis das Netzwerk der Seite fast untätig ist:

```go
func main() {
    Seite := rod.New().MustConnect().MustPage()

    warten := page.MustWaitNavigation()
    page.MustNavigate("https://www.wikipedia.org/")
    wait()
}
```

Wir verwenden die `MustWaitNavigation` um das Netz-Leerlauf-Ereignis zu abonnieren. The reason why the subscription is before the navigation not after is because the code to trigger navigation will take time to execute, during that time the event may have already happened. Nach dem `MustNavigate` rufen wir die `Warte` Funktion auf, um den Code zu blockieren, bis das nächste Netzwerk-Leerlaufereignis eintritt.

Rod bietet viele andere Event-Helfer, die Funktionsnamen sind alle mit `MustWait` oder `Wait` vorangestellt.

## Details zum Event abrufen

Einige Eventtypen tragen Details über das Ereignis selbst. Such as we navigate to a url and use the event to get the response status code of the navigation request:

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

## Mehrere Ereignisse bearbeiten

If you want to handle all events of a type, such as listen for all events of the page's console output, we can do something like this:

```go
go page.EachEvent(func(e *proto.RuntimeConsoleAPICalled) {
    fmt.Println(page.MustObjectsToJSON(e.Args))
})()
```

Um mehrere Ereignistypen gleichzeitig zu abonnieren, wie zum Beispiel `RuntimeConsoleAPICalled` und `PageLoadEventFired`:

```go
go page.EachEvent(func(e *proto.RuntimeConsoleAPICalled) {
    fmt.Println(page.MustObjectsToJSON(e.Args))
}, func(e *proto.PageLoadEventFired) {
    fmt.Println("loaded")
})()
```

## Abonnement stoppen

Any function in Rod that blocks can be canceled with the [context](context-and-timeout.md), it's not special for events. Außerdem können Sie das Ereignis auch stoppen, indem Sie true aus dem Ereignis-Handler zurückgeben, zum Beispiel:

```go
warten := page.EachEvent(func(e *proto.PageLoadEventFired) {
    return true
})
page.MustNavigate("https://example.com")
wait() 

```

Wenn wir nicht richtig zurückkehren, wartet das Warten weiter auf die `PageLoadEventFired` Ereignisse und blockiert das Programm für immer. Dies ist eigentlich der Code, wie `page.WaitEvent` funktioniert.

## Verfügbare Termine

Alle Event-Typen implementieren den `Prototyp.Event` Interface, mit dem Sie alle Events finden können. Normalerweise wird die IDE automatisch nach der Schnittstelle filtern. Such as we want to see all the events under the Page domain, we can create an empty page object and use the `WaitEvent(proto.Event)` to list and filter all the event types like the screenshot below:

![eventliste](event-list.png)

You can also use this [site](https://chromedevtools.github.io/devtools-protocol/tot/Page) to browse the events.
