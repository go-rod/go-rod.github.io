# Kontext och Timeout

I Golang använder vi vanligtvis [Context](https://golang.org/pkg/context/) för att avbryta långvariga uppgifter. Rod använder kontext för att hantera avbokningar för IO blockering, de flesta gånger är det timeout. Du måste ägna särskild uppmärksamhet åt dem.

Om du inte är bekant med Context, läs [Förstå kontext](understand-context.md) först.

## Avbokning

Till exempel skapar koden nedan en tom sida och navigerar den till "github.com":

```go
page := rod.New().MustConnect().MustPage()
page.MustNavigate("http://github.com")
```

Anta att vi vill avbryta `MustNavigera` om det tar mer än 2 sekunder. I Rod kan vi göra något så här:

```go
sida := rod.New().MustConnect().MustPage()

ctx, cancel := context.WithCancel(context.Background())
pageWithCancel := page.Context(ctx)

go func() {
    time. leep(2 * time.Second)
    cancel()
}()

pageWithCancel.MustNavigate("http://github.com") // kommer att avbrytas efter 2 sekunder
```

Vi använder sidan `. kontext` för att skapa en ytlig klon av `sidan`. När vi ringer `avbryta`, operationerna utlöstes av `sidan WithCancel` kommer att avbrytas, det kan vara vilken operation som helst, inte bara `MåstNavigera`. Ursprungssidan `` kommer inte att påverkas, om vi använder den för att ringa operationer kommer de inte att avbrytas.

Denna stil är inte speciell för Rod, du kan hitta liknande API:er som [Request.WithContext](https://golang.org/pkg/net/http/#Request.WithContext) i standardbiblioteket.

Eftersom `pageWithCancel` och `sidan` är oberoende av varandra, operationer som utlöses av `sida` kommer inte att påverkas av annulleringen:

```go
page.MustNavigate("http://github.com") // kommer inte att avbrytas efter 2 sekunder
```

## Timeout

Koden ovan är bara ett sätt att timeout en operation. I Golang är timeout oftast bara ett specialfall av avbokning. Eftersom det är så användbart, skapade vi en hjälpare att göra samma sak ovan, den heter `Timeout`, så att koden ovan kan reduceras som nedan:

```go
sida := rod.New().MustConnect().MustPage()
page.Timeout(2 * time.Second).MustNavigate("http://github.com")
```

`page.Timeout(2 * time.Second)` är den föregående `pageWithCancel`. Inte bara `Page`, `Browser` och `Element` har också samma sammanhangshjälpare.

## Upptäck timeout

Hur vet jag om en operation är tidsinställd eller inte? I Golang är timeout vanligtvis en typ av fel. Det är inte speciellt för Rod. För koden ovan kan vi göra detta för att upptäcka timeout:

```go
sidan := rod.New().MustConnect().MustPage()

err := rod.Try(func() {
    page.Timeout(2 * time.Second).MustNavigate("http://github.com")
})
om fel. s(err, kontext. eadlineExceeded) {
    // kod för timeout fel
} annars om fel! nil {
    // kod för andra typer av fel
}
```

Här använder vi `stav.Försök` att linda in funktionen som kan kasta ett timeoutfel.

Vi kommer att tala mer om felbehandling vid [Felhantering](error-handling.md).
