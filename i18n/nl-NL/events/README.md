# Evenementen

Gebeurtenissen zijn acties of gebeurtenissen die gebeuren in de browser die u controleert, waar de browser je over vertelt, zodat je op de een of andere manier op kunt reageren, indien gewenst. Bijvoorbeeld wanneer we de pagina laten navigeren naar een nieuwe URL, we kunnen events abonneren op weten wanneer de navigatie voltooid is of wanneer de pagina wordt weergegeven.

## Wacht eens op een gebeurtenis

Laten we proberen naar een pagina te navigeren en wachten tot het netwerk van de pagina bijna leeg is:

```go
func main() {
    pagina := rod.New().MustConnect().MustPage()

    wacht := page.MustWaitNavigation()
    page.MustNavigate("https://www.wikipedia.org/")
    wait()
}
```

We gebruiken het `MustWaitNavigation` om het netwerk inactieve event te abonneren. De reden waarom het abonnement voor de navigatie is en niet daarna omdat de code voor het activeren van navigatie de tijd zal nemen om uit te voeren, tijdens die periode kan de gebeurtenis al hebben plaatsgevonden. Na de `MoustNavigatie` roepen we de `wacht` functie op om de code te blokkeren totdat het volgende netwerk inactief is.

Staaf biedt veel andere eventhelpers, de functienamen zijn allemaal voorafgegaan door `MosterWait` of `Wachten`.

## Haal de evenement details op

Sommige afspraaktypes bevatten details over de gebeurtenis zelf. Zoals we navigeer naar een url en gebruik de gebeurtenis om de response status code van de navigatie te krijgen:

```go
func main() {
    pagina := rod.New().MustConnect().MustPage()

    e := proto.NetworkResponseResponseved{}
    wacht := page.WaitEvent(&e)
    page.MustNavigate("https://www.wikipedia.org/")
    wait()

    fmt.Println(e.Response.Status)
}
```

## Meerdere gebeurtenissen afhandelen

Als je alle gebeurtenissen van een type wilt afhandelen, zoals luisteren voor alle gebeurtenissen van de console output van de pagina, we kunnen zoiets doen:

```go
ga page.EachEvent(func(e *proto.RuntimeConsoleAPICalled) {
    fmt.Println(page.MustObjectsToJSON(e.Args))
})()
```

Om meerdere event types tegelijkertijd te abonneren, zoals het abonneren `RuntimeConsoleAPICalled` en `PageLoadEventFired`:

```go
go page.EachEvent(func(e *proto.RuntimeConsoleAPICalled) {
    fmt.Println(page.MustObjectsToJSON(e.Args))
}, func(e *proto.PageLoadEventFired) {
    fmt.Println("geladeerd)
})()
```

## Stop het abonnement

Elke functie in Rod die blokken kunnen worden geannuleerd met de [context](context-and-timeout.md), is niet speciaal voor gebeurtenissen. Overigens, kunt u ook stoppen met het evenement door de event handler terug te geven, bijvoorbeeld:

```go
wait := page.EachEvent(functie (e *proto.PageLoadEventFired) (stop bool) {
    return true
})
page.MustNavigate("https://example.com")
wait()
```

Als we niet waar, zal de wacht blijven wachten op de `PageLoadEventFired` events en het programma voor altijd blokkeren. Dit is eigenlijk de code van hoe `page.WaitEvent` werkt.

## Beschikbare evenementen

Alle event types implementeren de `proto.Event` interface, u kunt het gebruiken om alle evenementen te vinden. Meestal wordt de IDE automatisch door de interface gefilterd. Zo willen we alle gebeurtenissen onder het pagina-domein zien, we kunnen een leeg pagina-object maken en de `WaitEvent(proto gebruiken. vent)` om alle gebeurtenistypes zoals de onderstaande schermafbeelding weer te geven en te filteren:

![evenementen-lijst](event-list.png)

U kunt deze [site](https://chromedevtools.github.io/devtools-protocol/tot/Page) ook gebruiken om de gebeurtenissen te bekijken.
