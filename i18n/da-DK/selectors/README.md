# Vælgere

Rod giver masser af metoder til at få elementer. Deres navne er alle præfikseret med `MustElement` eller `Element`. Hvis du bruger en IDE efter du har indtastet `Element`, vil du se alle tilgængelige vælgere som nedenfor:

![idevælgere](ide-selectors.png)

Hvis du svæver markøren over metoden, vil du se doc af det som nedenfor:

![ide-doc](ide-doc.png)

Normalt behøver du kun nogle grundlæggende viden om [CSS Selector](css-selector) for at opnå den automatiseringsopgave, du ønsker at gøre. I resten af dokumentationen vil vi kun bruge CSS Selector til at få elementer fra siden.

## Efter tekst indhold

Brug `ElementR` til at matche elementer med specifikt tekstindhold, såsom vælg søgeinput i skærmbilledet nedenfor:

![match-tekst](match-text.png)

```go
page.MustElementR("input", "Search or jump")
page.MustElementR("input", "/click/i") // brug det case-ufølsomme flag "i"
```

Da vi bruger [js regex](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp), behøver vi ikke at matche hele tekstkonteksten. Den tekst, der skal matches, er, hvad du rent faktisk ser på hjemmesiden, ikke kildekoden, sammenligne 1 og 2 i skærmbilledet nedenfor. Du kan bruge `kopi` hjælperen i Devtools til at kopiere teksten til din udklipsholder (kig på 4):

![kopi-tekst](copy-text.png)

## Efter XPath

CSS-selector er den anbefalede måde at vælge elementer, så du ikke kan bruge XPath til at vælge [renderet tekst](https://stackoverflow.com/questions/51992258/xpath-to-find-pseudo-element-after-in-side-a-div-element-with-out-any-content/51993454). Men nogle gange XPath kan være handier for programmører, der kommer fra andre sprog. Brug `ElementX` til XPath:

```go
page.MustElementX("//h2")
```

## Af Javascript

Hvis du har en kompleks forespørgsel, eller du ønsker at bruge en høj-niveau forespørgselsmotor, såsom [jQuery](https://jquery.com/):

```go
page.MustElementByJS(`() => jQuery('option:selected')[0]`)
```

Faktisk, hvis du tjekker kildekoden for andre vælgere, såsom `Element` eller `ElementR`, de er alle baseret på `ElementByJS`, og `ElementByJS` er baseret på `side. værdsætte`, for flere detaljer om hvordan man evaluerer js, tjek [Javascript Runtime](/javascript-runtime.md). Normalt bruger du `ElementByJS` til at oprette din egen selector for at udvide Rod.

## Vælg liste over elementer

Navnene på metoderne til at få flere elementer er alle præfikseret med `MustElements` eller `Elements`. En nøgleforskel mellem en enkelt selector og en multi-selector er single-selector vil vente på, at -elementet vises. Hvis en multi-selector ikke finder noget, vil den straks returnere en tom liste.

## Traverse element træ

Der er også nogle praktiske vælgere til at vælge elementer inde i eller omkring et element, såsom `MustParent`, `MustNext`, `MustPrevious`osv.

Her er et eksempel på, hvordan vi bruger forskellige vælgere til at hente indhold fra en side:

```go
// På awesome-go side, finde den angivne sektion sektion,
// og hente de tilknyttede projekter fra siden.
func main() {
    side := rod.New().MustConnect().MustPage("https://github.com/avelino/awesome-go")

    sektion := page.MustElementR("p", "Selen og browser kontrolværktøjer"). ustNext()

    // få underordnede elementer i et element
    projekter := sektion. ustElements("li")

    for _, project := range projects {
        link := project. ustElement("a")
        log. rintf(
            "projekt %s (%s): '%s'",
            link. ustText(),
            link. ustProperty("href"),
            -projektet. ustText(),
        )
    }
}
```

## Hent elementer fra iframes

For eksempel har vi ønsker at få knappen fra de indlejrede iframes:

![iframes](iframes.png)

Koden vil se sådan ud:

```go
frame01 := page.MustElement("iframe").MustFrame()
iframe02 := iframe01.MustElement("iframe").MustFrame()
frame02.MustElement("button")
```

## Søg i elementer

Der er en anden kraftfuld hjælper til at få elementer, `MustSearch`. Det er mindre præcist end de vælgere, der er nævnt ovenfor, , men det er praktisk, hvis du ønsker at få elementer fra dybe indlejrede iframes eller skygge-doms.

Funktionen er den samme som [Devtools' søgning efter indholdselementer](https://developers.google.com/web/tools/chrome-devtools/dom#search), du kan bruge den til at finde ud af, hvilket søgeord du skal bruge til at vælge det element, du ønsker, såsom skærmbilledet nedenfor:

![søg](search.png)

For at få det samme element fra [Hent elementer fra iframes](#get-elements-from-iframes)kan vi blot kode på denne måde:

```go
page.MustSearch("knap")
```

## Race vælgere

Rod tilskynde til søvnfri automatisering for at reducere flakinitet. Når en handling har flere resultater, bruger vi ikke søvn til at vente på siden til at omdirigere eller afvikle ned. For eksempel, når vi logger ind på en side, adgangskoden måske forkert, vi ønsker at håndtere succes og fiasko separat. Vi bør undgå kodekser som nedenfor:

```go
func main() {
    side := rod.New().MustConnect().MustPage("https://leetcode.com/accounts/login/")

    page.MustElement("#id_login").MustInput("brugernavn")
    side.MustElement("#id_password").MustInput("password").MustPress(input.Enter)

    time.Sleep(10 * tid.Second) // Undgå venligst at bruge time.Sleep!

    hvis page.MustHas(". av-user-icon-base") {
        // udskrive brugernavn efter vellykket login
        fmt. rintln(*el.MustAttribute ("titel"))
    } ellers hvis side. ustHas("[data-cy=sign-in-error]") {
        // når forkert brugernavn eller adgangskode
        fmt. rintln(el.MustText())
    }
}
```

I stedet bør vi kode på følgende måde:

```go
func main() {
    side := rod.New().MustConnect().MustPage("https://leetcode.com/accounts/login/")

    page.MustElement("#id_login").MustInput("brugernavn")
    side. ustElement("#id_password").MustInput("password").MustPress(input.Enter)

    // Det vil fortsætte med at stemme, indtil en selector har fundet en match
    side.Race().Element(". av-user-icon-base").MustHandle(func(e *rod. lement) {
        // udskrive brugernavnet efter vellykket login
        fmt. rintln (*e.MustAttribute ("titel"))
    }). lement("[data-cy=sign-in-error]").MustHandle(func(e *rod. lement) {
        // når forkert brugernavn eller adgangskode
        panik (f. eks. ustText())
    }).MustDo()
}
```
