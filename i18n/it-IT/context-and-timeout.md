# Contesto e Timeout

In Golang, di solito usiamo [Contesto](https://golang.org/pkg/context/) per interrompere le attività di lunga durata. Rod utilizza il Contesto per gestire le cancellazioni per le operazioni di blocco IO, la maggior parte delle volte è timeout. Ha bisogno di prestare particolare attenzione a loro.

Se non hai familiarità con il Contesto, leggi prima [Capisci il contesto](understand-context.md).

## Annullamento

Ad esempio, il codice qui sotto crea una pagina vuota e la naviga al "github.com":

```go
page := rod.New().MustConnect().MustPage()
page.MustNavigate("http://github.com")
```

Ora, supponiamo di voler annullare il `MustNavigate` se ci vogliono più di 2 secondi. In Rod possiamo fare qualcosa del genere:

```go
page := rod.New().MustConnect().MustPage()

ctx, cancel := context.WithCancel(context.Background())
pageWithCancel := page.Context(ctx)

go func() {
    time. leep(2 * time.Second)
    cancel()
}()

pageWithCancel.MustNavigate("http://github.com") // verrà annullato dopo 2 secondi
```

Usiamo la `page.Context` per creare un clone superficiale della `pagina`. Ogni volta che chiamiamo `annulla`, le operazioni attivate dalla `paginaWithCancel` verranno annullate, può essere qualsiasi operazione, non solo `MustNavigate`. La pagina di origine `` non sarà influenzata, se lo usiamo per chiamare le operazioni che non verranno annullate.

Questo stile non è speciale per Rod, puoi trovare API simili come [Richiesta.Contesto](https://golang.org/pkg/net/http/#Request.WithContext) nella libreria standard.

Perché `pageWithAnnulla` e `pagina` sono indipendenti l'uno dall'altro, le operazioni attivate dalla pagina `` non saranno influenzate dalla cancellazione:

```go
page.MustNavigate("http://github.com") // non verrà annullato dopo 2 secondi
```

## Timeout

Il codice qui sopra è solo un modo per timeout di un'operazione. In Golang, il timeout è di solito solo un caso speciale di cancellazione. Perché è così utile, abbiamo creato un aiutante per fare la stessa cosa sopra, è chiamato `Timeout`, quindi il codice qui sopra può essere ridotto come di seguito:

```go
page := rod.New().MustConnect().MustPage()
page.Timeout(2 * time.Second).MustNavigate("http://github.com")
```

La `page.Timeout(2 * time.Second)` è la precedente `paginaWithCancel`. Non solo `Page`, `Browser` e `Element` hanno anche lo stesso contesto aiutanti.

## Rileva timeout

Come faccio a sapere se un'operazione è scaduta o no? In Golang, il timeout è di solito un tipo di errore. Non è speciale per Rod. Per il codice qui sopra possiamo fare questo per rilevare timeout:

```go
page := rod.New().MustConnect().MustPage()

err := rod.Try(func() {
    page.Timeout(2 * time.Second).MustNavigate("http://github.com")
})
if errors. s(err, contesto. eadlineExceeded) {
    // code for timeout error
} else if err ! nil {
    // code for other types of error
}
```

Qui usiamo `rod.Try` per avvolgere la funzione che può lanciare un errore di timeout.

Parleremo di più sulla gestione degli errori su [Gestione degli errori](error-handling.md).
