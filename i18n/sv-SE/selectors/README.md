# Väljare

Rod ger massor av metoder för att få element. Deras namn är alla prefixade med `MustElement` eller `Element`. Om du använder en IDE när du skriver `Element`, kommer du att se alla tillgängliga selektorer som nedan:

![ide-väljare](ide-selectors.png)

Om du svävar markören över metoden, kommer du att se doc av det som nedan:

![ide-doc](ide-doc.png)

Vanligtvis behöver du bara några grundläggande kunskaper i [CSS Selector](css-selector) för att uppnå den automatiseringsuppgift du vill göra. I resten av dokumentationen kommer vi endast att använda CSS-väljaren för att få element från sidan.

## Efter textinnehåll

Använd `ElementR` för att matcha element med specifikt textinnehåll, till exempel välj sökinmatningen i skärmdumpen nedan:

![match-text](match-text.png)

```go
page.MustElementR("input", "Search or jump")
page.MustElementR("input", "/click/i") // använd den fall-okänsliga flaggan "i"
```

Eftersom vi använder [js regex](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)behöver vi inte matcha hela textkontexten. Texten att matcha är vad du faktiskt ser på webbplatsen, inte källkoden, jämför 1 och 2 i skärmdumpen nedan. Du kan använda `kopiera` hjälparen i Devtools för att kopiera texten till ditt urklipp (titta på 4):

![kopieringstext](copy-text.png)

## Efter XPath

CSS-väljare är det rekommenderade sättet att välja element som du inte kan använda XPath för att välja [renderad text](https://stackoverflow.com/questions/51992258/xpath-to-find-pseudo-element-after-in-side-a-div-element-with-out-any-content/51993454). Men ibland kan XPath vara handier för programmerare som kommer från andra språk. Använd `ElementX` för XPath:

```go
page.MustElementX("//h2")
```

## Av Javascript

Om du har en komplex fråga eller om du vill använda en sökmotor på hög nivå, till exempel [jQuery](https://jquery.com/):

```go
sida.MustElementByJS(`jQuery('option:selected')[0]`)
```

Faktum är att om du kontrollerar källkoden för andra selektorer, som `Element` eller `ElementR`, de är alla baserade på `ElementByJS`, och `ElementByJS` är baserade på `sida. värdera`, för mer information om hur man utvärderar js, kontrollera [Javascript Runtime](/javascript-runtime.md). Vanligtvis använder du `ElementByJS` för att skapa din egen väljare för att förlänga Rod.

## Välj lista över element

Namnen på metoderna för att få flera element är alla prefixade med `MustElements` eller `Elements`. En nyckelskillnad mellan en enda väljare och en multiväljare är att en väljare väntar på att -elementet ska visas. Om en multiväljare inte hittar något kommer den omedelbart att returnera en tom lista.

## Träd med traverser

Det finns också några praktiska väljare att välja element inuti eller runt ett element, såsom `MustParent`, `MustNext`, `MustPrevious`, etc.

Här är ett exempel på hur vi använder olika väljare för att hämta innehåll från en sida:

```go
// På awesome-go-sidan hittar du det angivna avsnittet sekt,
// och hämtar de associerade projekten från sidan.
func main() {
    page := rod.New().MustConnect().MustPage("https://github.com/avelino/awesome-go")

    sektion := sida.MustElementR("p", "Selen och webbläsare styrverktyg"). ustNext()

    // få underordnade element i ett element
    projekt := avsnitt. ustElements("li")

    for _, project := range projects {
        link := project. ustElement("a")
        logg. rintf(
            "projekt %s (%s): '%s'",
            länk. ustText(),
            länk. ustProperty("href"),
            projekt. ustText(),
        )
    }
}
```

## Hämta element från iframes

Till exempel har vi vill få knappen från de nästlade iframes:

![iframes](iframes.png)

Koden kommer att se ut:

```go
frame01 := page.MustElement("iframe").MustFrame()
iframe02 := iframe01.MustElement("iframe").MustFrame()
frame02.MustElement("button")
```

## Sök element

Det finns en annan kraftfull hjälpare att hämta element, `MustSearch`. Det är mindre exakt än de selektorer som nämns ovan, men det är praktiskt om du vill få element från djupa nästlade iramar eller skugg-doms.

Funktionen är densamma som [Devtools' Sök efter noder](https://developers.google.com/web/tools/chrome-devtools/dom#search), du kan använda den för att ta reda på vilket nyckelord du vill använda för att välja det element du vill ha, som skärmdump nedan:

![sök](search.png)

För att få samma element från [Hämta element från iframes](#get-elements-from-iframes)kan vi helt enkelt koda så här:

```go
MustSearch("knapp")
```

## Ras väljare

Rod uppmuntra sömnfri automatisering för att minska flagnigheten. När en åtgärd har flera resultat använder vi inte sömn för att vänta på att sidan ska omdirigeras eller avvecklas. Till exempel, när vi loggar in en sida, lösenordet kanske felaktigt, vi vill hantera framgång och misslyckande separat. Vi bör undvika kod som nedan:

```go
func main() {
    sida := rod.New().MustConnect().MustPage("https://leetcode.com/accounts/login/")

    sida.MustElement("#id_login").MustInput("användarnamn")
    sida.MustElement("#id_password").MustInput("lösenord").MustPress(input.Enter)

    tid.Sleep(10 * time.Second) // Undvik användning av tid.Sleep!

    om sidan.MustHas(". av-user-icon-base") {
        // skriv ut användarnamnet efter lyckad inloggning
        fmt. rintln(*el.MustAttribute("titel"))
    } annars om sidan. ustHas("[data-cy=sign-in-error]") {
        // när fel användarnamn eller lösenord
        fmt. rintln(el.MustText())
    }
}
```

Istället skulle vi koda så här:

```go
func main() {
    sida := rod.New().MustConnect().MustPage("https://leetcode.com/accounts/login/")

    sida.MustElement("#id_login").MustInput("användarnamn")
    sida. ustElement("#id_password").MustInput("lösenord").MustPress(input.Enter)

    // Det kommer att fortsätta polling tills en selektor har hittat en match
    page.Race().Element(". av-user-icon-base").MustHandle (funktion (e *stav. lement) {
        // skriv ut användarnamnet efter lyckad inloggning
        fmt. rintln(*e.MustAttribute("titel"))
    }). lement("[data-cy=sign-in-error]").MustHandle(func(e *rod. lement) {
        // vid fel användarnamn eller lösenord
        panic(e. ustText())
    }).MustDo()
}
```
