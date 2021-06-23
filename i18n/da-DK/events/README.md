# Begivenheder

Begivenheder er handlinger eller hændelser, der sker i den browser, du kontrollerer, som browseren fortæller dig om, så du kan reagere på dem på en eller anden måde, hvis det ønskes. Såsom, når vi lader siden til at navigere til en ny URL, vi kan abonnere på begivenheder for at vide, hvornår navigationen er færdig, eller hvornår siden er gengivet.

## Vent på en begivenhed én gang

Lad os prøve at navigere til en side og vente til netværket af siden er næsten inaktiv:

```go
func main() {
    side := rod.New().MustConnect().MustPage()

    vent := page.MustWaitNavigation()
    page.MustNavigate("https://www.wikipedia.org/")
    vent ()
}
```

Vi bruger `MustWaitNavigation` til at abonnere netværkets inaktiv begivenhed. Grunden til, at abonnementet er før navigationen ikke efter er, fordi koden til at udløse navigation vil tage tid til at udføre, i den periode kan hændelsen allerede være sket. Efter `MustNaviger` kalder vi `vente-funktionen` -funktionen for at blokere koden, indtil den næste netværks-tomgangs-begivenhed sker.

Rod giver masser af andre event hjælpere, funktionsnavne er alle præfikseret med `MustWait` eller `Vent`.

## Få oplysninger om begivenheden

Nogle begivenhedstyper indeholder oplysninger om selve begivenheden. Så, som vi navigere til en url og bruge begivenheden til at få svar-status koden for navigationsanmodningen:

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

## Håndter flere begivenheder

Hvis du ønsker at håndtere alle begivenheder af en type, såsom lytte til alle begivenheder på sidens konsol-output, vi kan gøre noget som dette:

```go
go page.EachEvent(func(e *proto.RuntimeConsoleAPICalled) {
    fmt.Println(page.MustObjectsToJSON(e.Args))
})()
```

For at abonnere flere begivenhedstyper samtidig, så som abonnement `RuntimeConsoleAPICalled` og `PageLoadEventFired`:

```go
go page.EachEvent(func(e *proto.RuntimeConsoleAPICalled) {
    fmt.Println(page.MustObjectsToJSON(e.Args))
}, func(e *proto.PageLoadEventFired) {
    fmt.Println ("loaded")
})()
```

## Stop abonnementet

Enhver funktion i Rod som blokke kan annulleres med [konteksten](context-and-timeout.md), det er ikke specielt for begivenheder. Desuden kan du også stoppe begivenheden ved at vende tilbage sandt fra event handler, for eksempel:

```go
vent := page.EachEvent(func(e *proto.PageLoadEventFired) (stop bool) {
    return true
})
page.MustNavigate ("https://example.com")
wait()
```

Hvis vi ikke returnerer sand, vil ventetiden blive ved med at vente på `PageLoadEventFired` begivenheder og blokere programmet for evigt. Dette er faktisk koden for hvordan `side.WaitEvent` virker.

## Tilgængelige begivenheder

Alle begivenhedstyper implementerer `proto.Event` interface, du kan bruge den til at finde alle begivenheder. Normalt vil IDE filtrere efter grænsefladen automatisk. Såsom vi ønsker at se alle begivenhederne under Sidedomænet, vi kan oprette et tomt sideobjekt og bruge `WaitEvent(proto. vent)` for at liste og filtrere alle begivenhedstyper som skærmaftrykket nedenfor:

![event-liste](event-list.png)

Du kan også bruge dette [websted](https://chromedevtools.github.io/devtools-protocol/tot/Page) til at gennemse begivenhederne.
