# Händelser

Händelser är åtgärder eller händelser som händer i webbläsaren du kontrollerar, som webbläsaren berättar om så att du kan svara på dem på något sätt om så önskas. Som när vi låter sidan att navigera till en ny URL, vi kan prenumerera på händelserna för att veta när navigeringen är klar eller när sidan är renderad.

## Vänta på en händelse en gång

Låt oss försöka navigera till en sida och vänta tills nätverket av sidan är nästan tomrum:

```go
func main() {
    sida := rod.New().MustConnect().MustPage()

    vänta := page.MustWaitNavigation()
    sida.MustNavigate("https://www.wikipedia.org/")
    wait()
}
```

Vi använder `MustWaitNavigation` för att prenumerera på nätverkets tomgång. Anledningen till att prenumerationen är innan navigeringen inte är efter är att koden för att trigga navigering tar tid att köra, under den tiden kan händelsen redan ha hänt. Efter `MustNavigera` anropar vi `vänta` funktionen att blockera koden tills nästa nätverk tomgång hänt.

Rod ger massor av andra händelsehjälpare, funktionsnamnen är alla prefixade med `MustWait` eller `Vänta`.

## Få information om evenemanget

Vissa evenemangstyper bär information om själva evenemanget. Såsom vi navigerar till en webbadress och använda händelsen för att få svarsstatuskoden för navigationsbegäran:

```go
func main() {
    page := rod.New().MustConnect().MustPage()

    e := proto.NetworkResponseReceived{}
    vänta := page.WaitEvent(&e)
    page.MustNavigate("https://www.wikipedia.org/")
    wait()

    fmt.Println(e.Response.Status)
}
```

## Hantera flera händelser

Om du vill hantera alla händelser av en typ, som att lyssna på alla händelser i sidans konsolutgång, kan vi göra något så här:

```go
go page.EachEvent(func(e *proto.RuntimeConsoleAPICalled) {
    fmt.Println(page.MustObjectsToJSON(e.Args))
})()
```

För att prenumerera flera händelsetyper samtidigt, som till exempel subscribe `RuntimeConsoleAPICalled` och `PageLoadEventFired`:

```go
go page.EachEvent(func(e *proto.RuntimeConsoleAPICalled) {
    fmt.Println(page.MustObjectsToJSON(e.Args))
}, func(e *proto.PageLoadEventFired) {
    fmt.Println("laddade")
})()
```

## Avsluta prenumerationen

Alla funktioner i Rod som block kan avbrytas med [-kontext](context-and-timeout.md), det är inte speciellt för händelser. Dessutom kan du också stoppa händelsen genom att returnera sant från händelsehanteraren, till exempel:

```go
vänta := page.EachEvent(func(e *proto.PageLoadEventFired) (stop bool) {
    return true
})
page.MustNavigate("https://example.com")
wait()
```

Om vi inte kommer tillbaka sant, kommer väntan att vänta på `PageLoadEventFired` händelser och blockera programmet för evigt. Detta är faktiskt koden för hur `sida.WaitEvent` fungerar.

## Tillgängliga händelser

Alla händelsetyper implementerar `proto.Event` gränssnittet, kan du använda det för att hitta alla händelser. Vanligtvis kommer IDE filtrera med gränssnittet automatiskt. Som vi vill se alla händelser under sidan domänen, vi kan skapa ett tomt sidobjekt och använda `WaitEvent(proto. vent)` för att lista och filtrera alla händelsetyper som skärmdumpen nedan:

![händelselista](event-list.png)

Du kan också använda denna [webbplats](https://chromedevtools.github.io/devtools-protocol/tot/Page) för att bläddra bland händelserna.
