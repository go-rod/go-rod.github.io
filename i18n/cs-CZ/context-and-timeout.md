# Kontext a časový limit

V Golangu obvykle používáme [kontext](https://golang.org/pkg/context/) k přerušení dlouhotrvajících úkolů. Režim používá kontext pro zrušení blokování IO, většinou vypršel časový limit. Musíte jim věnovat zvláštní pozornost.

Pokud nejste obeznámeni s kontextem, přečtěte si nejprve [Pochopit kontext](understand-context.md).

## Zrušení

Například níže uvedený kód vytvoří prázdnou stránku a přejde na "github.com":

```go
page := rod.New().MustConnect().MustPage()
page.MustNavigate("http://github.com")
```

Předpokládejme, že chceme zrušit `MustNavigate` , pokud to trvá déle než 2 sekundy. V Bohu můžeme udělat něco podobného:

```go
page := rod.New().MustConnect().MustPage()

ctx, cancel := context.WithCancel(context.Background())
pageWithCancel := page.Context(ctx)

go func() {
    time. leep(2 * čas.Sekund)
    cancel()
}()

pageWithcel.MustNavigate("http://github.com") // bude zrušen po 2 sekundách
```

Používáme `page.Context` k vytvoření mělkého klonu stránky ``. Kdykoli zavoláme `zrušit`budou zrušeny operace spuštěné stránkou `Storno` , může to být jakákoliv operace, nejen `MustNavigate`. Počáteční `stránka` nebude ovlivněna, pokud ji použijeme k volání operací, nebudou zrušeny.

Tento styl není speciální pro Rod, podobné API najdete jako [Request.WithContext](https://golang.org/pkg/net/http/#Request.WithContext) ve standardní knihovně.

Protože `stránkaWithcel` a `stránka` jsou na sobě nezávislé, operace spuštěné stránkou `` nebudou zrušeny:

```go
page.MustNavigate("http://github.com") // nebude zrušen po 2 sekundách
```

## Časový limit

Výše uvedený kód je jen způsob, jak načasovat operaci. V Golangu je časový limit obvykle jen výjimečným případem zrušení. Protože je to tak užitečné, vytvořili jsme pomocníka, abychom udělali stejnou věc výše, se nazývá `Timeout`, takže výše uvedený kód může být snížen jako níže:

```go
stránka := rod.New().MustConnect().MustPage()
page.Timeout(2 * time.Second).MustNavigate("http://github.com")
```

`stránka. Timeout(2 * čas.Sekund)` je předchozí `stránkaStorno`. Nejen `Stránka`, `Prohlížeč` a `Element` mají také stejné kontextové pomocníky.

## Časový limit detekce

Jak vím, zda je nějaká operace časově omezená, či nikoli? V Golangu je časový rozvrh obvykle typem chyby. Není to speciální pro rodič. Pro výše uvedený kód to uděláme pro detekci časového limitu:

```go
page := rod.New().MustConnect().MustPage()

err := rod.Try(func() {
    page.Timeout(2 * time.Second).MustNavigate("http://github.com")
})
if errors. s(err, kontext. eadlineExceeded) {
    // code for timeout error
} else if err ! nil {
    // code for other types of error
}
```

Zde použijeme `rod.Zkus` pro zalomení funkce, která může hodit timeout chybu.

Budeme více mluvit o chybách při [Zpracování chyb](error-handling.md).
