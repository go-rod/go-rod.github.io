# Eventi

Gli eventi sono azioni o occorrenze che accadono nel browser che stai controllando, che il browser ti dice in modo da poter rispondere in qualche modo se lo desideri. Come quando lasciamo che la pagina si sposti verso un nuovo URL, possiamo iscriverci agli eventi per sapere quando la navigazione è completa o quando la pagina è visualizzata.

## Attendere un evento una volta

Cerchiamo di navigare a una pagina e aspettare che la rete della pagina sia quasi inattiva:

```go
func main() {
    page := rod.New().MustConnect().MustPage()

    wait := page.MustWaitNavigation()
    page.MustNavigate("https://www.wikipedia.org/")
    wait()
}
```

Usiamo la `MustWaitNavigation` per sottoscrivere l'evento inattivo della rete. Il motivo per cui l'abbonamento è prima della navigazione non dopo è perché il codice per attivare la navigazione richiederà tempo per eseguire, durante quel periodo l'evento può essere già accaduto. Dopo il `MustNavigate` chiamiamo la funzione `attendi` per bloccare il codice fino al prossimo evento inattivo di rete.

Rod fornisce un sacco di altri aiutanti di eventi, i nomi delle funzioni sono tutti prefissi con `MustWait` o `Attendere`.

## Ottieni i dettagli dell'evento

Alcuni tipi di eventi portano dettagli sull'evento stesso. Come ci spostiamo ad un url e usiamo l'evento per ottenere il codice di stato di risposta della richiesta di navigazione:

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

## Gestisci eventi multipli

Se si desidera gestire tutti gli eventi di un tipo, come ascoltare tutti gli eventi dell'output della console della pagina, possiamo fare qualcosa di simile:

```go
go page.EachEvent(func(e *proto.RuntimeConsoleAPICalled) {
    fmt.Println(page.MustObjectsToJSON(e.Args))
})()
```

Per sottoscrivere più tipi di eventi allo stesso tempo, come iscriversi `RuntimeConsoleAPICalled` e `PageLoadEventFired`:

```go
go page.EachEvent(func(e *proto.RuntimeConsoleAPICalled) {
    fmt.Println(page.MustObjectsToJSON(e.Args))
}, func(e *proto.PageLoadEventFired) {
    fmt.Println("loaded")
})()
```

## Ferma l'abbonamento

Qualsiasi funzione in Rod che i blocchi possono essere annullati con il [context](context-and-timeout.md), non è speciale per gli eventi. Inoltre, è anche possibile interrompere l'evento restituendo vero dal gestore eventi, per esempio:

```go
wait := page.EachEvent(func(e *proto.PageLoadEventFired) (stop bool) {
    return true
})
page.MustNavigate("https://example.com")
wait()
```

Se non torniamo true, l'attesa continuerà ad aspettare gli eventi `PageLoadEventFired` e bloccherà il programma per sempre. Questo è in realtà il codice di come funziona `page.WaitEvent`.

## Eventi disponibili

Tutti i tipi di eventi implementa l'interfaccia `proto.Event` , puoi usarla per trovare tutti gli eventi. Di solito, l'IDE filtrerà automaticamente per l'interfaccia. Come vogliamo vedere tutti gli eventi nel dominio Pagina, possiamo creare un oggetto di pagina vuoto e utilizzare `WaitEvent(proto. vent)` per elencare e filtrare tutti i tipi di eventi come lo screenshot qui sotto:

![event-list](event-list.png)

Puoi anche utilizzare questo [sito](https://chromedevtools.github.io/devtools-protocol/tot/Page) per sfogliare gli eventi.
