# Kiezers

Staaf biedt veel methoden om elementen te krijgen. Hun namen zijn allemaal voorafgegaan door `MustElement` of `Element`. Als je een IDE gebruikt nadat je een `element`typt, zie je alle beschikbare selectors zoals hieronder:

![selectoren](ide-selectors.png)

Als je de cursor over de methode beweegt, zie je de verwijzing zoals hieronder:

![ide-doc](ide-doc.png)

Meestal heb je alleen wat basiskennis van [CSS Selector](css-selector) nodig om de automatiseringstaak te kunnen uitvoeren die je wilt uitvoeren. In de rest van de documentatie gebruiken we alleen de CSS-Selector om elementen van de pagina te krijgen.

## Op tekstinhoud

Gebruik `ElementR` om elementen te koppelen aan specifieke tekstinhoud, zoals de zoekinvoer in onderstaande schermafbeelding:

![wedstrijdtekst](match-text.png)

```go
page.MustElementR("input", "Zoeken of springen")
page.MustElementR("input", "/click/i") // gebruik de hoofdletterongevoelige vlag "i"
```

Omdat we [js regex](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)gebruiken, hoeven we niet te voldoen aan de hele tekst context. De tekst die moet overeenkomen met wat je eigenlijk ziet op de website, niet de broncode, vergelijk 1 en 2 in de onderstaande schermafbeelding. U kunt de `kopieer` helper in Devtools gebruiken om de tekst naar uw klembord te kopiëren (kijk naar de 4):

![koptekst-tekst](copy-text.png)

## Op XPath

CSS-selector is de aanbevolen manier om elementen te selecteren, zoals XPath niet kan gebruiken om [opgemaakte tekst](https://stackoverflow.com/questions/51992258/xpath-to-find-pseudo-element-after-in-side-a-div-element-with-out-any-content/51993454) te selecteren. Maar soms is XPath misschien handiger voor programmeurs die uit andere talen komen. Gebruik het `ElementX` voor XPath:

```go
page.MustElementX("//h2")
```

## Door Javascript

Als u een complexe query heeft of als u een hoge query engine wilt gebruiken, zoals [jQuery](https://jquery.com/):

```go
page.MustElementByJS(`jQuery('option:selected')[0]`)
```

Eigenlijk als je de broncode van andere selectors controleert, zoals `element` of `ElementR`, ze zijn allemaal gebaseerd op `ElementByJS`, en `ElementByJS` is gebaseerd op `pagina. waarde`, bekijk de [Javascript Runtime](/javascript-runtime.md) voor meer details over het evalueren van js. Meestal gebruik je `ElementByJS` om je eigen selector te maken om Rod uit te breiden.

## Lijst van elementen selecteren

De namen van de methoden om meerdere elementen te krijgen worden allemaal voorafgegaan door `Mosterheden` of `Elementen`. Een belangrijk verschil tussen een enkelselector en een multi-selector is de enkelvoudige selector die wacht tot het element verschijnt. Als een multi-selector niets vindt, geeft het onmiddellijk een lege lijst terug.

## Traverse element boom

Er zijn ook enkele handige selectors om elementen binnen of rond een element te selecteren, zoals `MoustParent`, `MoustNext`, `MoustVorige`, etc.

Hier is een voorbeeld van hoe we verschillende selectors gebruiken om inhoud op te halen van een pagina:

```go
// On awesome-go pagina, het vinden van de opgegeven sectie sect,
// en het ophalen van de bijbehorende projecten van de pagina.
func main() {
    page := rod.New().MustConnect().MustPage("https://github.com/avelino/awesome-go")

    sectie := page.MustElementR("p", "Selenium en browser control tools"). ustNext()

    // krijg onderliggende elementen van een element
    projecten := sectie. ustElements("li")

    voor _, project := project {
        link := project. ustElement("a")
        log. rintf(
            "project %s (%s): '%s'",
            link. ustText(),
            link. ustProperty("href"),
            project. ustText(),
        )
    }
}
```

## Haal elementen op uit iframes

We willen bijvoorbeeld de knop van de geneste iframes:

![iframes](iframes.png)

De code zal er als volgt uitzien:

```go
frame01 := page.MustElement("iframe").MustFrame()
iframe02 := iframe01.MustElement("iframe").MustFrame()
frame02.MustElement("button")
```

## Zoek elementen

Er is nog een krachtige helper om elementen te krijgen, de `zoeken`. Het is minder nauwkeurig dan de hierboven genoemde selectoren, maar het is handig als je elementen wilt krijgen uit diepe geneste klieren of schaduw-domen.

De functionaliteit is hetzelfde als de [Devtools Zoeken naar knooppunten](https://developers.google.com/web/tools/chrome-devtools/dom#search), je kan het gebruiken om erachter te komen welk trefwoord je wilt gebruiken, zoals de screenshot hieronder:

![Zoeken](search.png)

Om hetzelfde element te krijgen van de [Haal elementen van iframes](#get-elements-from-iframes), kunnen we gewoon zo coderen:

```go
page.MustSearch("knop")
```

## Race selectors

Rod de slaapvrije automatisering aan om de smaak te verminderen. Wanneer een actie meerdere resultaten heeft, gebruiken we geen slaap om te wachten tot de pagina wordt doorverwezen of neergezet. Als we bijvoorbeeld een pagina inloggen, het wachtwoord is misschien niet correct, dan willen we het succes en de mislukking apart behandelen. We moeten code zoals hieronder voorkomen:

```go
func main() {
    pagina := rod.New().MustConnect().MustPage("https://leetcode.com/accounts/login/")

    page.MustElement("#id_login").MustInput("username")
    page.MustElement("#id_password").MustInput("password").MustPress(input.Enter)

    time.Sleep(10 * time.Second) // Voorkom het gebruik van tijd.Sleep!

    if page.MustHas(". av-user-icon-base") {
        // print de gebruikersnaam na succesvolle login
        fmt. rintln(*el.MustAttribute("titel"))
    } anders als pagina. ustHas("[data-cy=sign-in-error]") {
        // wanneer de verkeerde gebruikersnaam of wachtwoord
        fmt. rintln(el.MustText())
    }
}
```

In plaats daarvan moeten we dit coderen:

```go
func main() {
    pagina := rod.New().MustConnect().MustPage("https://leetcode.com/accounts/login/")

    page.MustElement("#id_login").MustInput("username")
    pagina. ustElement("#id_password").MustInput("wachtwoord").MustPress(input.Enter)

    // Het zal blijven stemmen totdat één selector een match heeft gevonden
    page.Race().Element(". av-user-icon-base").MustHandle(functie(e *rod. lement) {
        // print de gebruikersnaam af na succesvolle login
        fmt. rintln(*e.MustAttribute("titel"))
    }). lement("[data-cy=sign-in-error]").MustHandle(func(e *rod. {
        // wanneer de verkeerde gebruikersnaam of wachtwoord
        paniek (e. ustText())
    }).MustDo()
}
```
