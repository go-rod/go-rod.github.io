# Waarom Strood

Er zijn veel geweldige projecten, maar niemand is perfect, maar het beste dat aan uw behoeften voldoet, is belangrijk.

## Vergeleken met andere libs

### Chromedp

Theoretisch moet Rod sneller presteren en minder geheugen verbruiken dan Chromedp.

[Chromedp][chromedp] gebruikt standaard de browser van het systeem, dit kan problemen veroorzaken als u per ongeluk de browser upgrade.

[Chromedp][chromedp] gebruikt een [grote buffer](https://github.com/chromedp/chromedp/blob/b56cd66/target.go#L69-L73) voor gebeurtenissen, het kan leiden tot een impasse op hoge concurrentie. Omdat Chromedp een enkele event-lus gebruikt, zullen de langzame event-handlers elkaar blokkeren. Strijd heeft deze problemen niet omdat het gebaseerd is op [goob](https://github.com/ysmood/goob).

Chromedp zal JSON alle berichten van de browser decode-on-demand coderen, dus Rod presteert beter, vooral voor zware netwerkgebeurtenissen.

Chromedp gebruikt een derde deel van WebSocket lib dat [1 MB overhead](https://github.com/chromedp/chromedp/blob/b56cd66f9cebd6a1fa1283847bbf507409d48225/conn.go#L43-L54) heeft voor elke cdp client, als je duizenden afgelegen browsers wilt beheren, kan dat een probleem worden. Vanwege deze beperking zal Chromedp crashen als u een js script groter dan 1MB beoordeelt, Hier is een voorbeeld van hoe gemakkelijk je Chromedp: [gist](https://gist.github.com/ysmood/0d5b2c878ecbdb598776af7d3d305b79).

Wanneer een crash plaatsvindt, zal Chromedp het zombie browserproces verlaten op Windows en Mac.

Rod is meer configureerbaar, zoals je zelfs de WebSocket lib kunt vervangen door het lib dat je wilt.

Voor een directe codevergelijking kun je [hier](https://github.com/go-rod/rod/tree/master/lib/examples/compare-chromedp) bekijken. Als je het voorbeeld `logica` vergelijkt tussen [staaf](https://github.com/go-rod/rod/tree/master/lib/examples/compare-chromedp/logic/main.go) en [chromedp](https://github.com/chromedp/examples/blob/master/logic/main.go), je zult erachter komen hoe eenvoudiger stang is.

Met Chromedp moet je hun verbose DSL-achtige taken gebruiken om codelogica. Chromedp gebruikt verschillende wrappers om uitvoering te behandelen met context en opties, wat het erg moeilijk maakt om hun code te begrijpen als er fouten gebeuren. De zwaar gebruikte interfaces maken de statische types nutteloos bij het traceren van problemen. Rod daarentegen gebruikt zo weinig mogelijk interfaces als mogelijk.

Rol heeft minder afhankelijkheden, een eenvoudigere code-structuur en een betere testautomatisering. Je moet vinden dat het makkelijker is om bij te dragen aan de Rod. In vergelijking met Chromedp heeft Rod daarom het potentieel om in de toekomst meer leuke functies van de gemeenschap te hebben.

Een ander Chromedp probleem is hun architectuur is gebaseerd op [DOM node id](https://chromedevtools.github.io/devtools-protocol/tot/DOM/#type-NodeId), puppeteer en stang zijn gebaseerd op [remote object id](https://chromedevtools.github.io/devtools-protocol/tot/Runtime/#type-RemoteObjectId). Als gevolg daarvan is het niet alleen [langzamer](https://github.com/puppeteer/puppeteer/issues/2936) en voorkomt het ook dat Chromedp hoogwaardige functies toevoegt die gekoppeld zijn aan runtime. Bijvoorbeeld, dit [ticket](https://github.com/chromedp/chromedp/issues/72) was 3 jaar geopend. Zelfs nadat het gesloten is, kun je nog steeds geen js expressies op het element binnen een iframe evalueren. Bovendien, Chromedp behoudt een [kopie](https://github.com/chromedp/chromedp/blob/e2970556e3d05f3259c464faeed1ec0e862f0560/target.go#L375-L376) van alle nodes in het geheugen. Het zal race conditie veroorzaken tussen de lokale NodeID lijst en [DOM.documentUpdated](https://chromedevtools.github.io/devtools-protocol/tot/DOM/#event-documentUpdated), wat verwarrende problemen kan veroorzaken zoals [#762](https://github.com/chromedp/chromedp/issues/762).

### Leerling

[Puppeteer][puppeteer] zal JSON alle berichten uit de browser decode-on-demand coderen, dus theoretisch zal Rod beter presteren, vooral voor zware netwerkgebeurtenissen.

Met puppeteer, moet u veel met belofte/async/wachten doen, het maakt een elegante [vloeiende interface](https://en.wikipedia.org/wiki/Fluent_interface) ontwerp zeer moeilijk. Einde van testen vereist veel synchronisatie-operaties om menselijke input te simuleren, omdat Puppeteer is gebaseerd op Nodejs alle IO-operaties async oproepen zijn, dus meestal eindigen mensen tonnen async/wacht te typen. Als je vergeet een `wacht`te schrijven, is het meestal pijnlijk om Belofte debuggen. Het hoofd groeit als je project groeit.

Rod is standaard type-veilig en heeft betere interne opmerkingen over hoe Rod zelf werkt. Het heeft type bindingen voor alle eindpunten in het Devtools protocol.

Stroming zal domein events uitschakelen wanneer mogelijk, puppeteer zal altijd alle domeinen activeren. Het verbruikt veel middelen bij het besturen van een externe browser.

De rod ondersteunt annulering en timeout beter, dit kan cruciaal zijn als je duizenden pagina's wilt behandelen. Bijvoorbeeld, om `te simuleren klik` moeten we serval cdp verzoeken versturen, met [Belofte](https://stackoverflow.com/questions/29478751/cancel-a-vanilla-ecmascript-6-promise-chain) kun je iets niet bereiken zoals "stuur alleen de helft van de cdp verzoeken", maar met de [context](https://golang.org/pkg/context/) is dat mogelijk.

### Speelrechts

Staaf en [Playwright](https://github.com/microsoft/playwright) werden voor het eerst bijna op hetzelfde moment gepubliceerd. De meeste vergelijkingen tussen Rod en Puppeteer blijven waar voor Playwright, omdat zowel Playwright als Puppeteer door vrijwel dezelfde bijdragers worden onderhouden.

Zoals Playwright verklaarde op zijn doc "Playwright maakt betrouwbare end-to-end testen mogelijk voor moderne webapps.", is het focus van het project testen. Maar de focus voor Rod is meer algemeen, voor zowel webautomatisering als scraping, waardoor het ontwerp meer gericht is op flexibiliteit en prestatie.

Een van de bouwkundige doelen van Rod's is om het voor iedereen gemakkelijker te maken om bij te dragen en er een puur gemeenschapsproject van te maken Dat is een grote reden waarom ik voor Gľ en de MIT-licentie heb gekozen. Typescript is een leuke keuze maar als je de ontwerpkeuzes van Playwright controleert, [`alle`](https://www.typescriptlang.org/docs/handbook/basic-types.htmvl#any) en [vakbondstypen](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html#union-types) zijn overal, als je probeert naar de broncode van de [pagina te gaan. lick](https://playwright.dev/#version=v1.6.2&path=docs%2Fapi.md&q=pageclickselector-options), `d.ts` bestanden laten je de realiteit van het type begrijpen. Gilateraal is zeker niet goed genoeg, maar het introduceert meestal minder technische schulden dan node. s typecript, als je wilt dat ik kies welke ik moet gebruiken voor QA of Infra die niet vertrouwd zijn met codering om end-to-end te automatiseren of site-monitoring, Ik zou Golang kiezen.

Hun inspanningen voor cross-browser ondersteuning zijn fantastisch. Maar vandaag de dag wordt HTML5 goed aangenomen door hoofdmerken, het is moeilijk te zeggen dat de complexiteit ervan de voordelen kan zwaarwegen. Zal de cross-browser [patches](https://github.com/microsoft/playwright/tree/master/browser_patches) in de toekomst een last worden? Een ander punt van zorg is de veiligheidsproblemen voor gepatenteerde browsers. Het maakt het ook lastig om oude versies van Firefox of Safari te testen. Ik hoop dat het niet overtechnisch is.

### Selenium

[Selenium](https://www.selenium.dev/) is gebaseerd op [webdriver protocol](https://www.w3.org/TR/webdriver/) met veel minder functies vergeleken met [devtools protocol](https://chromedevtools.github.io/devtools-protocol). Zo kan het [gesloten schaduw DOM](https://github.com/sukgu/shadow-automation-selenium/issues/7#issuecomment-563062460) niet verwerken. Pagina's opslaan als PDF is niet mogelijk. Geen ondersteuning voor tools zoals [Profiler](https://chromedevtools.github.io/devtools-protocol/tot/Profiler/) of [Prestatie](https://chromedevtools.github.io/devtools-protocol/tot/Performance/), enz.

Het is moeilijker om op te zetten en te onderhouden vanwege extra afhankelijkheden zoals een browserdriver.

Hoewel selenium zichzelf verkoopt voor betere cross-browser ondersteuning, is het meestal erg moeilijk om het te laten werken voor alle grote browsers.

Er zijn tal van artikelen over "selenium vs marippeteer", u kunt de stang van Puppeteer noemen.

### Verschuif

[Cypress](https://www.cypress.io/) is erg beperkt, voor gesloten schaduw of cross-domain iframes is bijna onbruikbaar. Lees hun [limitatie doc](https://docs.cypress.io/guides/references/trade-offs.html) voor meer details.

Als u met ons wilt samenwerken om een test-focus op Rod te creëren om de beperking van cypress te overwinnen, neem dan contact met ons op.

## Wat betekent Rod

Rod is de naam van het besturingsapparaat voor puppetry, zoals de bruine stok in de afbeelding hieronder:

![stang](https://user-images.githubusercontent.com/1415488/80178856-31cd8880-863a-11ea-83e9-64f84be3282d.png ":size=200")

De betekenis is dat wij de marionet zijn, de browser is de marionet, we gebruiken de stang om de marionet te besturen.

[chromedp]: https://github.com/chromedp/chromedp
[puppeteer]: https://github.com/puppeteer/puppeteer
