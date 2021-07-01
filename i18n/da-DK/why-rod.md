# Hvorfor Rod

Der er en masse store projekter, men ingen er perfekt, skal du vælge den bedste, der passer til dine behov er vigtig.

## Sammenlignet med andre liber

### Chromedp

Teoretisk bør Rod udføre hurtigere og forbruge mindre hukommelse end Chromedp.

[Chromedp][chromedp] bruger som standard systemets browser, det kan forårsage problemer, hvis du ved et uheld opgraderer browseren.

[Chromedp][chromedp] bruger en [fast buffer](https://github.com/chromedp/chromedp/blob/b56cd66/target.go#L69-L73) til begivenheder, det kan forårsage dødslusning på høj koncurrence. Fordi Chromedp bruger et enkelt event-loop, blokerer de langsomme event-handlere hinanden. Rod har ikke disse problemer, fordi det er baseret på [goob](https://github.com/ysmood/goob).

Chromedp vil JSON afkode alle meddelelser fra browseren, stang er dekode-on-demand, så Rod udfører bedre, især for tunge netværk begivenheder.

Chromedp bruger tredje del WebSocket lib, som har [1MB overhead](https://github.com/chromedp/chromedp/blob/b56cd66f9cebd6a1fa1283847bbf507409d48225/conn.go#L43-L54) for hver cdp klient, hvis du ønsker at styre tusindvis af eksterne browsere det kan blive et problem. På grund af denne begrænsning, hvis du evaluerer et js script større end 1MB, vil Chromedp gå ned, her er et eksempel på, hvor nemt du kan gå ned Chromedp: [gist](https://gist.github.com/ysmood/0d5b2c878ecbdb598776af7d3d305b79).

Når et nedbrud sker, vil Chromedp forlade zombie browser proces på Windows og Mac.

Rod er mere konfigurerbar, såsom du kan endda erstatte WebSocket lib med den lib du vil.

For direkte kode-sammenligning kan du tjekke [her](https://github.com/go-rod/rod/tree/master/lib/examples/compare-chromedp). Hvis du sammenligner eksemplet kaldet `logik` mellem [stang](https://github.com/go-rod/rod/tree/master/lib/examples/compare-chromedp/logic/main.go) og [chromedp](https://github.com/chromedp/examples/blob/master/logic/main.go), du vil finde ud af, hvor enklere stang er.

Med Chromedp er du nødt til at bruge deres verbose DSL-lignende opgaver til at håndtere kode logik. Chromedp bruger flere wrappers til at håndtere udførelse med kontekst og indstillinger, hvilket gør det meget svært at forstå deres kode, når fejl sker. De stærkt anvendte grænseflader gør de statiske typer nytteløse, når sporing problemer. I modsætning hertil bruger Rod så få grænseflader som muligt.

Rod har færre afhængigheder, en enklere kode struktur, og bedre test automatisering. Du bør finde det lettere at bidrage med kode til Rod. Derfor har Rod i forhold til Chromedp potentiale til at få flere gode funktioner fra fællesskabet i fremtiden.

Et andet problem med Chromedp er deres arkitektur er baseret på [DOM node id](https://chromedevtools.github.io/devtools-protocol/tot/DOM/#type-NodeId), puppeteer og stang er baseret på [remote object id](https://chromedevtools.github.io/devtools-protocol/tot/Runtime/#type-RemoteObjectId). Følgelig er det ikke kun [langsommere](https://github.com/puppeteer/puppeteer/issues/2936) og forhindrer også Chromedp i at tilføje højt niveau funktioner, der er kombineret med runtime. For eksempel havde denne [billet](https://github.com/chromedp/chromedp/issues/72) åbnet i 3 år. Selv efter den er lukket, kan du stadig ikke evaluere js udtrykke på elementet inde i en iframe. Desuden vedligeholder Chromedp en [kopi](https://github.com/chromedp/chromedp/blob/e2970556e3d05f3259c464faeed1ec0e862f0560/target.go#L375-L376) af alle indholdselementer i hukommelsen. Det vil forårsage race condition mellem lokal nodeID liste og [DOM.documentUpdated](https://chromedevtools.github.io/devtools-protocol/tot/DOM/#event-documentUpdated), som kan forårsage forvirrende problemer som [#762](https://github.com/chromedp/chromedp/issues/762).

### Puppeteer

[Puppeteer][puppeteer] vil JSON afkode alle meddelelser fra browseren, Rod er dekode-on-demand, så teoretisk vil Rod udføre bedre, især for tunge netværksbegivenheder.

Med dukketeer, er du nødt til at håndtere lov/async/venter en masse, det gør elegant [flydende interface](https://en.wikipedia.org/wiki/Fluent_interface) design meget hårdt. Slut med at afslutte test kræver en masse synkroniseringsoperationer for at simulere menneskelige input, fordi Puppeteer er baseret på Nodejs alle IO operationer er async opkald, så normalt folk ender med at skrive tonsvis af async/venter. Hvis du glemmer at skrive en `venter`, er det normalt smertefuldt at debug utætte lomise. Overhead vokser når dit projekt vokser.

Rod er som standard typefri, og har bedre interne kommentarer om, hvordan Rod selv fungerer. Det har type bindinger for alle endepunkter i Devtools protokol.

Rod vil deaktivere domæne begivenheder, når det er muligt, marioneteer vil altid aktivere alle domæner. Det vil forbruge en masse ressourcer, når du kører en fjernbrowser.

Rod understøtter annullering og timeout bedre, dette kan være afgørende, hvis du ønsker at håndtere tusindvis af sider. For eksempel, for at simulere `klik` vi er nødt til at sende serval cdp anmodninger, med [Promise](https://stackoverflow.com/questions/29478751/cancel-a-vanilla-ecmascript-6-promise-chain) kan du ikke opnå noget i retning af "kun sende halvdelen af CDP-anmodningerne" men med den [kontekst](https://golang.org/pkg/context/) vi kan.

### Afspilning

Rod og [Playwright](https://github.com/microsoft/playwright) blev først offentliggjort næsten samtidig. De fleste sammenligninger mellem Rod og Puppeteer forbliver tro mod Playwright, fordi både Playwright og Puppeteer vedligeholdes af næsten de samme bidragydere.

Som Playwright sagde på deres doc "Playwright muliggør pålidelig end-to-end test for moderne web-apps.", er fokus i projektet testen. Men fokus for Rod er mere generelt, for både web-automatisering og skrabning, hvilket gør designet mere fokuseret på fleksibilitet og ydeevne.

Et af Rod's arkitektoniske mål er at gøre det lettere for alle at bidrage og gøre det til et rent fællesskabsprojekt, Det er en stor grund til, at jeg valgte Golang og MIT licens. Typescript er et godt valg, men hvis du tjekker Playwright's design valg, [`alle`](https://www.typescriptlang.org/docs/handbook/basic-types.htmvl#any) og [unionstyper](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html#union-types) er overalt, hvis du forsøger at hoppe til kildekoden på [siden. slik](https://playwright.dev/#version=v1.6.2&path=docs%2Fapi.md&q=pageclickselector-options), `d.ts` filer vil give dig mulighed for at forstå virkeligheden af skriveskriften. Golang er absolut ikke godt nok, men det normalt introducerer mindre teknisk gæld end knudepunkt. s typescript, hvis du vil have mig til at vælge, hvilken der skal bruges til QA eller Infra, der ikke er bekendt med kodning til at automatisere end-to-end test eller site-overvågning, Jeg vil vælge Golang.

Deres indsats for cross-browser støtte er fabelagtig. Men i dag, HTML5 er godt vedtaget af de vigtigste mærker, er det svært at sige den kompleksitet, det bringer kan vægt fordelene. Bliver cross-browser [patches](https://github.com/microsoft/playwright/tree/master/browser_patches) en byrde i fremtiden? Sikkerhedsproblemer for patched browsere er en anden bekymring. Det gør det også vanskeligt at teste gamle versioner af Firefox eller Safari. Håber det er ikke overingeniørmæssigt.

### Selenium

[Selen](https://www.selenium.dev/) er baseret på [webdriver protokol](https://www.w3.org/TR/webdriver/) , som har meget færre funktioner sammenlignet med [devtools protokol](https://chromedevtools.github.io/devtools-protocol). Så, som det ikke kan håndtere [lukket skygge DOM](https://github.com/sukgu/shadow-automation-selenium/issues/7#issuecomment-563062460). Ingen måde at gemme sider som PDF. Ingen understøttelse af værktøjer som [Profiler](https://chromedevtools.github.io/devtools-protocol/tot/Profiler/) eller [Ydelse](https://chromedevtools.github.io/devtools-protocol/tot/Performance/)mv.

Harder at oprette og vedligeholde på grund af ekstra afhængigheder som en browser driver.

Selvom selen sælger sig selv for bedre cross-browser support, er det normalt meget svært at gøre det arbejde for alle større browsere.

Der er masser af artikler om "selen vs puppeteer", kan du behandle stang som Golang version af puppeteer.

### Cyprik

[Cypress](https://www.cypress.io/) er meget begrænset, for lukkede skygge dom eller cross-domæne iframes er det næsten ubrugeligt. Læs deres [begrænsning doc](https://docs.cypress.io/guides/references/trade-offs.html) for flere detaljer.

Hvis du ønsker at samarbejde med os for at skabe en test fokuseret ramme base på Rod til at overvinde begrænsningen af cypress, bedes du kontakte os.

## Hvad betyder Rod

Rod er navnet på kontrolenheden til hvalpefoder, såsom den brune pind i billedet nedenfor:

![ke](https://user-images.githubusercontent.com/1415488/80178856-31cd8880-863a-11ea-83e9-64f84be3282d.png ":size=200")

Betydningen er, at vi er dukketeer, browseren er dukken, vi bruger stangen til at kontrollere dukken.

[chromedp]: https://github.com/chromedp/chromedp
[puppeteer]: https://github.com/puppeteer/puppeteer
