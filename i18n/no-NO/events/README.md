# Hendelser

Hendelser er handlinger eller hendelser som skjer i nettleseren du kontrollerer, som nettleseren forteller deg om så du kan svare på dem om ønskelig. Som når vi lar siden navigere til en ny URL, vi kan abonnere hendelsene for å vite når navigasjonen er fullført eller når siden gjengis.

## Vent på en hendelse en gang

La oss prøve å navigere til en side og vente til nettverket på siden er nesten uferdig:

```go
func main() {
    side := rod.New().MustConnect().MustPage()

    wait := page.MustWaitNavigation()
    page.MustNavigate("https://www.wikipedia.org/")
    wait()
}
```

Vi bruker `MustWaitNavigation` for å abonnere på inaktiv nettverkshendelse. Grunnen til at abonnementet er før navigasjonen ikke etter er fordi koden som utløser navigasjon vil ta tid å utføre, i løpet av den tiden kan hendelsen allerede ha skjedd. Etter `MustNavigate` ringer vi `vente` funksjonen for å blokkere koden til neste nettverkets uvirkelige hendelse skjer.

Torsk gir mange andre hendelseshjelpere, funksjonsnavnene er alle med prefikset `MustWait` eller `Vent`.

## Få hendelsesdetaljer

Noen hendelsestyper bærer detaljer om selve arrangementet. Slik som vi navigerer til en URL og bruker hendelsen for å få svarstatuskoden til navigasjon forespørsel:

```go
func main() {
    side := rod.New().MustConnect().MustPage()

    e := proto.NetworkResponseReceived{}
    vent := page.WaitEvent(&e)
    page.MustNavigate("https://www.wikipedia.org/")
    wait()

    fmt.Println(e.Response.Status)

```

## Håndter flere hendelser

Hvis du vil håndtere alle hendelser av en type, slik som å lytte til alle hendelser på konsolluten, kan vi gjøre noe slik:

```go
gå side.EachEvent(funk(e *proto.RuntimeConsoleAPICalled) {
    fmt.Println(page.MustObjectsToJSON(e.Args))
})()
```

For å abonnere flere hendelsestyper på samme tid, slik som å abonnere `RuntimeConsoleAPICalled` and `PageLoadEventFired`:

```go
go page.EachEvent(funk.RuntimeConsoleAPICalled) {
    fmt.Println(page.MustObjectsToJSON(e.Args))
}, funksjoner (e *proto.PageLoadEventFired) {
    fmt.Println("loaded")
})()
```

## Avslutt abonnement

Enhver funksjon i Rod som blokker kan avbrytes med [kontekst](context-and-timeout.md), er ikke spesielt for hendelser. I tillegg kan du også stoppe arrangementet ved å returnere sann fra håndtereren av arrangementet, for eksempel:

```go
vent := page.EachEvent(funk(e *proto.PageLoadEventFired) (stop bool) {
    return true
})
page.MustNavigate("https://example.com")
wait()
```

Hvis vi ikke returnerer sann, vil vent vente på `PageLoadEventFired` hendelsene og blokkere programmet for alltid. Dette er faktisk koden til hvordan `side.WaitEvent` fungerer.

## Tilgjengelige hendelser

Alle hendelsestyper implementerer `proto.Event` grensesnittet, du kan bruke det til å finne alle hendelser. Vanligvis vil IDE filtrere automatisk etter grensesnittet. Som vi ønsker å se alle hendelsene under sidens domene, vi kan opprette et tomt sideobjekt og bruke `WaitEvent(proto. Hjelp)` å liste opp og filtrere alle hendelsestypene som skjermbildet nedenfor:

![hendelseliste](event-list.png)

Du kan også bruke dette [nettstedet](https://chromedevtools.github.io/devtools-protocol/tot/Page) for å bla gjennom hendelsene.
