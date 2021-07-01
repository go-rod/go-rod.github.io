# Velgere

Rod gir mange metoder for å få elementer. Navnene deres er alle med prefikset `MustElement` eller `Element`. Dersom du bruker en IDE etter at du skriver `Element`vil du se alle tilgjengelige velgere som nedenfor:

![ide-velgere](ide-selectors.png)

Hvis du holder markøren over metoden, vil du se duken av den som nedenfor:

![ide-doc](ide-doc.png)

Vanligvis trenger du bare grunnleggende kunnskap om [CSS-velgeren](css-selector) for å oppnå automatiseringsoppgaven du vil gjøre. I resten av dokumentasjonen vil vi bare bruke CSS Selector til å få elementer fra siden.

## Etter tekstinnhold

Bruk `ElementR` for å matche elementer med bestemt tekstinnhold, som f.eks. velg søkeinndata i skjermbildet nedenfor:

![samsvarende tekst](match-text.png)

```go
page.MustElementR("input", "Søk eller hopp")
page.MustElementR("input", "/click/i") // bruk den case-insensitive flagget "i"
```

Siden vi bruker [js regex](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp), trenger vi ikke å samsvare med hele tekstsammenhengen. Teksten du stemmer overens med, er det du faktisk ser på nettsiden, ikke kildekoden, sammenlign 1 og 2 på skjermbildet nedenfor. Du kan bruke `kopier` hjelperen i Devtools for å kopiere teksten til utklippstavlen (se på 4):

![Kopier tekst](copy-text.png)

## Av XPath

CSS-velgeren er den anbefalte måten å velge elementer på, for eksempel kan du ikke bruke XPath på å velge [gjengitt tekst](https://stackoverflow.com/questions/51992258/xpath-to-find-pseudo-element-after-in-side-a-div-element-with-out-any-content/51993454). Men noen ganger kan XPath være funksjonsdyktig for programmerere som kommer fra andre språk. Bruk `ElementX` for XPath:

```go
page.MustElementX("//h2")
```

## Som Javascript

Hvis du har en kompleks spørring eller du ønsker å bruke en høykvalitets søkemotor, som [jQuery](https://jquery.com/):

```go
page.MustElementByJS(`jQuery('option:selected')[0]`)
```

Faktisk hvis du sjekker kildekoden til andre velgere slik som `Element` eller `ElementR`, alle er basert på `ElementByJS`, og `ElementByJS` er basert på `side. verdi`, for flere detaljer om hvordan man evaluerer js, sjekk [Javascript kjøringstid](/javascript-runtime.md). Vanligvis bruker du `ElementByJS` for å lage din egen velger for å utvide Rod.

## Velg liste over elementer

Navnene på metodene for å få flere elementer er alle forhåndsutfylt med `Måleelementer` eller `element`. En nøkkelforskjell mellom en envelgeren og en multivelger er enkeltvelgeren venter på at elementet skal komme opp. Hvis en multivelger ikke finner noe, vil den umiddelbart returnere en tom liste.

## Traverseringselement tre

Det er også noen praktiske velgere for å velge elementer i eller rundt et element, som `Målefortid`, `Måneboks`, `Måler`, osv.

Her er et eksempel på hvordan vi bruker ulike velgere for å hente innhold fra en side:

```go
// På awesome-go siden, finner du angitt seksjon,
// og henter de tilknyttede prosjektene fra siden.
func main() {
    side := rod.New().MustConnect().MustPage("https://github.com/avelino/awesome-go")

    seksjon := page.MustElementR("p", "Selenium and browser kontrollverktøy"). ustNext()

    // få underelementer i et element
    prosjekt := seksjon. ustElements("li")

    for _, prosjekt := rekkeviddeprosjekter {
        link := prosjekt. ustelement("a")
        logg. rintf(
            "prosjekt %s (%s): "%s'",
            lenke. ustTekst(),
            lenker. ustProperty("href"),
            prosjekt. ustetekst (),
        )
    }
}
```

## Hent elementer fra iframes

For eksempel ønsker vi å få knappen fra de nestede integrerte rammene:

![iframes](iframes.png)

Koden vil se slik ut:

```go
frame01 := page.MustElement("iframe").MustFrame()
iframe02 := iframe01.MustElement("iframe").MustFrame()
frame02.MustElement("button")
```

## Søk etter elementer

Det er en annen kraftig hjelper å få elementer, `mestringsøk`. Det er mindre nøyaktig enn velgerne nevnt ovenfor, men det er nyttig hvis du vil skaffe elementer fra dype nisserte rammer eller skygger.

Funksjonen er det samme som [Devtools' søk etter noder](https://developers.google.com/web/tools/chrome-devtools/dom#search), du kan bruke det for å finne ut hvilke nøkkelord du kan bruke for å velge elementet du vil, som skjermbildet nedenfor:

![søk](search.png)

For å få det samme elementet fra [Få elementer fra iframes](#get-elements-from-iframes), kan vi bare kode slik:

```go
side.MustSearch("knapp")
```

## Rase velgere

Torden oppfordrer til søvnfri automatisering for å redusere flak. Når en handling har flere resultater, bruker vi ikke søvn for å vente på at siden skal sende tilbake eller gjøre opp for seg. For eksempel når vi logger inn på en side, kanskje passordet er feil, ønsker vi å håndtere suksess og feil separat. Vi bør unngå kode som nedenfor:

```go
func main() {
    side := rod.New().MustConnect().MustPage("https://leetcode.com/accounts/login/")

    page.MustElement("#id_login").MustInput("brukernavn")
    page.MustElement("#id_password").MustInput("password").Musts(input.Enter)

    time.Sleep(10 * time.Second) // Unngå bruk av tid.Sleep!

    hvis side.MustHas(". av-user-icon-base") {
        // skriv ut brukernavnet etter vellykket pålogging
        fmt. rintln(*el.MustAttribute("title"))
    } ellers hvis siden. ustHas("[data-cy=sign-in-error]") {
        // når feil brukernavn eller passord
        fmt. rintln(el.MustText())
    }

```

I stedet må vi kode slik:

```go
func main() {
    side := rod.New().MustConnect().MustPage("https://leetcode.com/accounts/login/")

    page.MustElement("#id_login").MustInput("username")
    -side. ustElement("#id_password").MustInput("password").MustPress(input.Enter)

    // Den holder polling til en velger har funnet en match
    side.Race().Element(". av-bruker-icon-base").MustHandle(e *rod. lement) {
        // print brukernavnet etter vellykket pålogging
        fmt. rintln(*e.MustAttribute("title"))
    }). lement("[data-cy=sign-in-error]").MustHandle(Funn (e *rod. lement) {
        // når feil brukernavn eller passord
        panic(e. ustText())
    }).MustDo()
}
```
