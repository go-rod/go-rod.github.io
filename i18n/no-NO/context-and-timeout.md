# Kontekst og tidsavbrudd

I Golang, bruker vi vanligvis [kontekst](https://golang.org/pkg/context/) for å avbryte langtidsdrevne oppgaver. Rod bruker Kontekst for å håndtere kanselleringer for IO-blokkerende operasjoner, de fleste ganger er tidsavbrudd. Du må være spesielt oppmerksom på dem.

Hvis du ikke er kjent med kontekst, vennligst les [Understand-kontekst](understand-context.md) først.

## Avbestilling

For eksempel, koden nedenfor skaper en tom side og naviger den til "github.com":

```go
page := rod.New().MustConnect().MustPage()
page.MustNavigate("http://github.com")
```

Forvent at vi vil avbryte `MustNavigat` hvis det tar mer enn 2 sekunder. I Rod kan vi gjøre noe slik:

```go
siden := rod.New().MustConnect().MustPage()

ctx, avbryt := konext.WithCancel(context.Background())
WithAvbryt := page.Context(ctx)

gå funksjon() {
    tid. leep(2 * time.Second)
    cancel()
}()

pageWithCancel.MustNavigate("http://github.com") // vil bli avbrutt etter 2 sekunder
```

Vi bruker `side.Context` for å lage en grunn klone av `side`. Når vi kaller `Avbryt`, vil operasjonene utløst av `pageWithCancel` avbrytes, Det kan være en operasjon, ikke bare `MustNavigat`. Opprinnelsen `side` vil ikke bli påvirket, hvis vi bruker den for å ringe operasjoner vil de ikke bli kansellert.

Denne stilen er ikke spesiell for ras, du kan finne lignende APIer som [Request.WithContext](https://golang.org/pkg/net/http/#Request.WithContext) i standard biblioteket.

Fordi `side WithCancel` og `side` er uavhengige av hverandre, handlinger utløst av `side` påvirkes ikke av kanselleringen:

```go
side.MustNavigate("http://github.com") // vil ikke bli avbrutt etter 2 sekunder
```

## Tidsavbrudd

Koden over er bare en måte å tidsavkke en operasjon på. I Golang, er tidsavbrudd vanligvis bare et spesielt tilfelle av kansellering. Fordi det er så nyttig, har vi opprettet en hjelpemiddel for å gjøre det samme over det kalles `tidsavbrudd`så koden ovenfor kan reduseres som nedenfor:

```go
side := rod.New().MustConnect().MustPage()
page.Timeout(2 * time.Second).MustNavigate("http://github.com")
```

`siden. Tidsavbrudd (2 * tid.Second)` er den forrige `siden Avbryt`. Ikke bare `Side`, `Nettleser` og `Element` har de samme hjelpere i konteksten.

## Tidsavbrudd oppdaget

Hvordan vet jeg om en operasjon er tidsavbrutt eller ikke? I Golang, er timeout vanligvis en type feil. Det er ikke spesielt for Rod. For koden ovenfor kan vi gjøre dette for å oppdage tid:

```go
siden := rod.New().MustConnect().MustPage()

err := rod.Try(func() {
    page.Timeout(2 * time.Second).MustNavigate("http://github.com")
})
hvis feil. s(err, kontekst. eadlineExceeded) {
    // kode for tidsavbruddfeil
} ellers hvis err! nil {
    // kode for andre feiltyper
}
```

Her bruker vi `rod.Try` for å pakke inn funksjonen som kan kaste en tidsavbruddfeil.

Vi vil snakke mer om feil ved [feilhåndtering](error-handling.md).
