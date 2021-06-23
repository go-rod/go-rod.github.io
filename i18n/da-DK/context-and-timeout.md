# Kontekst og tidsudløb

I Golang, bruger vi normalt [Kontekst](https://golang.org/pkg/context/) til at afbryde langvarige opgaver. Rod bruger Kontekst til at håndtere annulleringer for IO-blokerende operationer, de fleste gange er det timeout. Du skal være særlig opmærksom på dem.

Hvis du ikke er fortrolig med Kontekst, så læs venligst [Forstå Kontekst](understand-context.md) først.

## Annullering

For eksempel opretter koden nedenfor en blank side og navigerer den til "github.com":

```go
page := rod.New().MustConnect().MustPage()
page.MustNavigate("http://github.com")
```

Antag nu, at vi ønsker at annullere `MustNavigate` , hvis det tager mere end 2 sekunder. I Rod kan vi gøre sådan noget:

```go
page := rod.New().MustConnect().MustPage()

ctx, cancel := context.WithCancel(context.Background())
pageWithCancel := page.Context(ctx)

go func() {
    time. leep(2 * time.Second)
    cancel()
}()

pageWithCancel.MustNavigate ("http://github.com") // annulleres efter 2 sekunder
```

Vi bruger `siden.Kontekst` til at oprette en overfladisk klon af `siden`. Når vi ringer til `annuller`, vil handlingerne udløst af `pageWithCancel` blive annulleret, det kan være enhver operation, ikke kun `MustNavigate`. Oprindelsen `side` vil ikke blive påvirket, hvis vi bruger den til at kalde operationer, de ikke vil blive annulleret.

Denne stil er ikke særlig for Rod, du kan finde lignende API'er som [Request.WithContext](https://golang.org/pkg/net/http/#Request.WithContext) i standard biblioteket.

Fordi `pageWithCancel` og `side` er uafhængige af hinanden, operationer udløst af `side` vil ikke blive påvirket af annullering:

```go
page.MustNavigate ("http://github.com") // vil ikke blive annulleret efter 2 sekunder
```

## Timeout

Koden ovenfor er bare en måde at tidsgrænse en operation. I Golang, timeout er normalt bare et særligt tilfælde af aflysning. Fordi det er så nyttigt, vi skabte en hjælper til at gøre det samme ovenfor det hedder `Timeout`, så koden ovenfor kan reduceres som nedenfor:

```go
Side := rod.Ny().MustConnect().MustPage()
page.Timeout(2 * time.Second).MustNavigate("http://github.com")
```

The `page.Timeout(2 * time.Second)` is the previous `pageWithCancel`. Ikke kun `Side`, `Browser` og `Element` har også de samme konteksthjælpere.

## Opdag timeout

Hvordan ved jeg, om en operation er udløbet, eller ej? I Golang, timeout er normalt en form for fejl. Det er ikke specielt for Rod. For koden ovenfor kan vi gøre dette for at opdage timeout:

```go
page := rod.New().MustConnect().MustPage()

err := rod.Try(func() {
    page.Timeout(2 * time.Second).MustNavigate("http://github.com")
})
if errors. s(err, context. eadlineExceeded) {
    // kode for timeout fejl
} ellers hvis err ! nil {
    // kode for andre typer fejl
}
```

Her bruger vi `rod.Prøv` at ombryde den funktion, der kan smide en timeout fejl.

Vi vil snakke mere om fejl aflevering på [Error Handling](error-handling.md).
