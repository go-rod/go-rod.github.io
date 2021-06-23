# Context en time-out

In Golang, gebruiken we meestal [Context](https://golang.org/pkg/context/) om langlopende taken af te breken. Rod gebruikt Context om annuleringen voor IO-blokkeringsoperaties af te handelen, meestal is het tijd voor een time-out. Je moet er speciale aandacht aan besteden.

Als u niet bekend bent met Context, lees dan [Context begrijpen](understand-context.md) eerst.

## Annulering

De onderstaande code maakt bijvoorbeeld een lege pagina en navigeert deze naar de "github.com":

```go
page := rod.New().MustConnect().MustPage()
page.MustNavigate("http://github.com")
```

Stel dat we de `MustNavigeren` willen annuleren als het langer dan 2 seconden duurt. In Rod kunnen we zoiets doen:

```go
pagina := rod.New().MustConnect().MustPage()

ctx, annuleer := context.WithCancel(context.Background())
pageWithCancel := page.Context(ctx)

ga func() {
    tijd. leep(2 * time.Second)
    cancel()
}()

pageWithCancel.MustNavigate("http://github.com") // zal na 2 seconden worden geannuleerd
```

We gebruiken de `page.Context` om een ondiepe kloon van de `pagina` te maken. Wanneer we de `annuleren`aanroepen, worden de bewerkingen geactiveerd door de `pagina WithCancel` geannuleerd, het kan elke handeling zijn, niet alleen `MustNavigatie`. De oorsprong van `pagina` wordt niet beïnvloed, als we deze gebruiken om te bellen dan zullen ze niet worden geannuleerd.

Deze stijl is niet speciaal voor Rod, u kunt vergelijkbare API's vinden zoals [Request.WithContext](https://golang.org/pkg/net/http/#Request.WithContext) in de standaard bibliotheek.

Omdat `pageWithCancel` en `pagina` onafhankelijk van elkaar zijn, operaties die door `pagina` worden geactiveerd worden niet beïnvloed door de annulering:

```go
page.MustNavigate("http://github.com") // zal niet worden geannuleerd na 2 seconden
```

## Time-out

De code hierboven is slechts een manier om een operatie te vertragen. In Golang is time-out meestal slechts een bijzonder geval van annulering. Omdat het zo nuttig is, hebben we een helper gemaakt om bovenstaande dingen te doen, het heet `Timeout`, dus de code hierboven kan worden gereduceerd als hieronder:

```go
pagina := rod.New().MustConnect().MustPage()
page.Timeout(2 * time.Second).MustNavigate("http://github.com")
```

De `page.Timeout(2 * tijd.Twee)` is de vorige `paginaWithCancel`. Niet alleen `pagina`, `Browser` en `Element` hebben ook dezelfde context helpers.

## Detecteer time-out

Hoe weet ik of een operatie een time-out heeft gekregen of niet? In Golang is time-out meestal een type fout. Het is niet speciaal voor Rod. Voor de code hierboven kunnen we dit doen om de time-out te detecteren:

```go
pagina := rod.New().MustConnect().MustPage()

err := rod.Try(func() {
    page.Timeout(2 * time.Second).MustNavigate("http://github.com")
})
als fouten. s(err, context. eadlineExceeded) {
    // code voor timeout error
} anders als het niet klopt! nil {
    // code voor andere soorten fouten
}
```

Hier gebruiken we `rod.Probeer` om de functie die een timeout error kan weggooien.

We zullen meer praten over het verwerken van fouten bij [Error verwerking](error-handling.md).
