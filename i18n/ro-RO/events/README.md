# Evenimente

Evenimentele sunt acțiuni sau apariții care se întâmplă în browser-ul pe care îl controlați despre care navigatorul vă spune ca să le puteți răspunde într-un fel dacă doriți. Cum ar fi atunci când lăsăm pagina să navigheze la un URL nou, ne putem abona la evenimente pentru a ști când navigarea este completă sau când pagina este redată.

## Așteptați un eveniment o dată

Să încercăm să navigăm la o pagină și să așteptăm până când rețeaua paginii este aproape inactivă:

```go
func main() {
    pagina := rod.New().MustConnect().MustPage()

    așteaptă := page.MustWaitNavigation()
    page.MustNavigate("https://www.wikipedia.org/")
    așteaptă()
}
```

Folosim `MustWaitNavigation` pentru a ne abona la evenimentul inactiv de rețea. Motivul pentru care abonamentul este înainte de navigare nu după este pentru că codul care declanșează navigarea va dura să fie executat, în acel moment evenimentul poate să fi avut deja loc. După `MustNavigate` noi numim funcția `așteptăm` pentru a bloca codul până când se întâmplă următorul eveniment de inactivitate a rețelei.

Rod oferă o mulțime de alți participanți la evenimente, numele funcțiilor sunt prestabilite cu `MustWait` sau `Așteptați`.

## Obține detaliile evenimentului

Unele tipuri de evenimente poartă detalii despre evenimentul în sine. Cum navigăm la un url și folosim evenimentul pentru a obține codul de stare al cererii de navigare:

```go
func main() {
    pagina := rod.New().MustConnect().MustPage()

    e := proto.NetworkResponseReceived{}
    așteaptă := page.WaitEvent(&e)
    page.MustNavigate("https://www.wikipedia.org/")
    wait()

    fmt.Println(e.Response.Status)
}
```

## Manipulează evenimente multiple

Dacă doriţi să gestionaţi toate evenimentele de un tip, cum ar fi ascultarea tuturor evenimentelor din consola de ieșire a paginii, putem face ceva de genul:

```go
mergi page.EachEvent(func(e *proto.RuntimeConsoleAPICalled) {
    fmt.Println(page.MustObjectsToJSON(e.Args))
})()
```

Pentru a vă abona mai multe tipuri de evenimente în același timp, cum ar fi abonarea `RuntimeConsoleAPICalled` și `PageLoadEventFired`:

```go
go page.EachEvent(func(e *proto.RuntimeConsoleAPICalled) {
    fmt.Println(page.MustObjectsToJSON(e.Args))
}, func(e *proto.PageLoadEventFired) {
    fmt.Println("încărcat")
})()
```

## Oprește abonamentul

Orice funcție din Sir care blocurile pot fi anulate cu contextul [](context-and-timeout.md), nu este specială pentru evenimente. În plus, puteți opri evenimentul și returnând adevărat de la gestionarul de evenimente, de exemplu:

```go
așteaptă := page.EachEvent(func(e *proto.PageLoadEventFired) (stop bool) {
    return true
})
page.MustNavigate("https://example.com")
așteaptă()
```

Dacă nu returnăm adevărat, așteptarea va continua să aștepte evenimentele `PageLoadEventFired` și să blocheze programul pentru totdeauna. Acesta este de fapt codul modului în care `page.WaitEvent` funcționează.

## Evenimente disponibile

Toate tipurile de evenimente implementează interfața `proto.Event` , o poți folosi pentru a găsi toate evenimentele. De obicei, ID-ul se va filtra automat după interfață. Cum vrem să vedem toate evenimentele din domeniul paginii, putem crea un obiect de pagină gol și să folosim `WaitEvent(proto. vent)` pentru a lista și filtra toate tipurile de evenimente precum captura de ecran de mai jos:

![listă de evenimente](event-list.png)

De asemenea, poți folosi acest [site](https://chromedevtools.github.io/devtools-protocol/tot/Page) pentru a răsfoi evenimentele.
