# Události

Události jsou akce nebo události, které se odehrávají v prohlížeči, který ovládáte, , o kterém vám prohlížeč říká, abyste na ně mohli v případě potřeby nějakým způsobem reagovat. Například když necháme stránku přejít na novou adresu URL, můžeme se přihlásit k odběru událostí, abychom věděli, kdy je navigace dokončena nebo když je stránka vykreslena.

## Počkejte na událost jednou

Pojďme se pokusit přejít na stránku a počkat, dokud síť stránky nebude téměř nečinná:

```go
func main() {
    page := rod.New().MustConnect().MustPage()

    wait := page.MustWaitNavigation()
    page.MustNavigate("https://www.wikipedia.org/")
    wait()
}
```

K odběru události v nečinnosti sítě používáme `MustWaitNavigation`. Důvod, proč je předplatné před navigací neposléze proto, že kód pro spuštění navigace bude trvat nějakou dobu, během této doby k události již došlo. Po `MustNavigate` zavoláme funkci `čekat` a blokovat kód, dokud se nestane další událost v nečinnosti sítě.

Bod poskytuje spoustu dalších pomocníků pro událost, jména funkcí jsou přednastavena na `MustWait` nebo `Počkejte`.

## Získat podrobnosti o události

Některé typy událostí obsahují podrobnosti o samotné události. Například přejdeme na url a použijeme událost k získání kódu odezvy v navigačním požadavku:

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

## Zpracovávat více událostí

Pokud chcete zpracovat všechny události typu, jako naslouchat všem událostem v konzoli stránky, můžeme udělat něco podobného:

```go
go page.EachEvent(func(e *proto.RuntimeConsoleAPICalled) {
    fmt.Println(page.MustObjectsToJSON(e.Args))
})()
```

Chcete-li současně odebírat více typů událostí, jako např. subscribe `RuntimeConsoleAPICalled` a `PageLoadEventFired`:

```go
go page.EachEvent(func(e *proto.RuntimeConsoleAPICalled) {
    fmt.Println(page.MustObjectsToJSON(e.Args))
}, func(e *proto.PageLoadEventFired) {
    fmt.Println("loaded")
})()
```

## Zastavit odběr

Jakákoliv funkce v Modu, že bloky mohou být zrušeny s [kontextem](context-and-timeout.md), není to speciální pro události. Kromě toho můžete také zastavit událost odesláním pravdy z obsluhy události, například:

```go
čekat := page.EachEvent(func(e *proto.PageLoadEventFired) (stop bool) {
    return true
})
page.MustNavigate("https://example.com")
čekat()
```

Pokud se nevrátíme pravda, čekání bude stále čekat na události `PageLoadEventFired` a zablokovat program navždy. Toto je ve skutečnosti kód jak `page.WaitEvent` funguje.

## Dostupné události

Všechny typy událostí implementují rozhraní `proto.Event` , můžete jej použít k nalezení všech událostí. Obvykle bude IDE automaticky filtrovat pomocí rozhraní. Tak jako chceme vidět všechny události pod doménou Stránka, můžeme vytvořit prázdný objekt stránky a použít `WaitEvent(proto. vent)` pro zobrazení a filtrování všech typů událostí, jako je například snímek obrazovky:

![seznam událostí](event-list.png)

Tuto [stránku](https://chromedevtools.github.io/devtools-protocol/tot/Page) můžete také použít k procházení událostí.
