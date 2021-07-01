# Varför Rod

Det finns en hel del bra projekt, men ingen är perfekt, välj det bästa som passar dina behov är viktigt.

## Jämfört med andra libs

### Chromedp

Teoretiskt bör Rod prestera snabbare och konsumera mindre minne än Chromedp.

[Chromedp][chromedp] använder systemets webbläsare som standard, det kan orsaka problem om du av misstag uppgraderar webbläsaren.

[Chromedp][chromedp] använder en [buffert i fast storlek](https://github.com/chromedp/chromedp/blob/b56cd66/target.go#L69-L73) för händelser, det kan orsaka dead-lock på hög samvaluta. Eftersom Chromedp använder en enda händelse-loop, blockerar de långsamma händelsehanterarna varandra. Rod har inte dessa problem eftersom det är baserat på [goob](https://github.com/ysmood/goob).

Chromedp kommer JSON avkoda varje meddelande från webbläsaren, staven avkodas på begäran, så Rod presterar bättre, särskilt för tunga nätverkshändelser.

Chromedp använder tredje delen WebSocket lib som har [1MB overhead](https://github.com/chromedp/chromedp/blob/b56cd66f9cebd6a1fa1283847bbf507409d48225/conn.go#L43-L54) för varje cdp-klient, om du vill styra tusentals webbläsare kan det bli ett problem. På grund av denna begränsning, om du utvärderar ett js-skript större än 1MB, kommer Chromedp krascha, Här är ett exempel på hur enkelt du kan krascha Chromedp: [gist](https://gist.github.com/ysmood/0d5b2c878ecbdb598776af7d3d305b79).

När en krasch inträffar, Chromedp kommer att lämna zombie webbläsarprocessen på Windows och Mac.

Rod är mer konfigurerbar, såsom du kan även ersätta WebSocket lib med lib du gillar.

För direkt kodjämförelse kan du kolla [här](https://github.com/go-rod/rod/tree/master/lib/examples/compare-chromedp). Om du jämför exemplet som kallas `logik` mellan [staven](https://github.com/go-rod/rod/tree/master/lib/examples/compare-chromedp/logic/main.go) och [chromedp](https://github.com/chromedp/examples/blob/master/logic/main.go), du kommer att ta reda på hur enklare spö är.

Med Chrome måste du använda deras verbose DSL-liknande uppgifter för att hantera kodlogik. Chromedp använder flera omslag för att hantera exekvering med sammanhang och alternativ, vilket gör det mycket svårt att förstå deras kod när buggar inträffar. De kraftigt använda gränssnitten gör statiska typer värdelösa vid spårningsproblem. Däremot använder Rod så få gränssnitt som möjligt.

Rod har färre beroenden, en enklare kodstruktur och bättre testautomatisering. Det är lättare att bidra med kod till Rod. Jämfört med Chromedp har Rod potential att ha fler trevliga funktioner från samhället i framtiden.

Ett annat problem med Chromedp är deras arkitektur är baserad på [DOM-nod id](https://chromedevtools.github.io/devtools-protocol/tot/DOM/#type-NodeId), marioneteer och stav är baserade på [fjärr-objekt-id](https://chromedevtools.github.io/devtools-protocol/tot/Runtime/#type-RemoteObjectId). Följaktligen är det inte bara [långsammare](https://github.com/puppeteer/puppeteer/issues/2936) och hindrar även Chromedp från att lägga till funktioner på hög nivå som är kopplade till körtid. Till exempel denna [biljett](https://github.com/chromedp/chromedp/issues/72) hade öppnats i 3 år. Även efter att den är stängd, kan du fortfarande inte utvärdera js express på elementet inuti en iframe. Dessutom upprätthåller Chromedp en [kopia](https://github.com/chromedp/chromedp/blob/e2970556e3d05f3259c464faeed1ec0e862f0560/target.go#L375-L376) av alla noder i minnet. Det kommer att orsaka ras tillstånd mellan lokala NodeID-listan och [DOM.documentUppdaterad](https://chromedevtools.github.io/devtools-protocol/tot/DOM/#event-documentUpdated), vilket kan orsaka förvirrande problem som [#762](https://github.com/chromedp/chromedp/issues/762).

### Dockteer

[Puppeteer][puppeteer] kommer JSON avkoda varje meddelande från webbläsaren, Rod avkodas på begäran, så teoretiskt kommer Rod att fungera bättre, särskilt för tunga nätverkshändelser.

Med marioneteer måste du hantera löfte/async/vänta mycket, det gör elegant [flytande gränssnitt](https://en.wikipedia.org/wiki/Fluent_interface) design mycket svårt. Slut-till slut tester kräver en hel del synkronisering operationer för att simulera mänskliga ingångar, eftersom Puppeteer är baserad på Nodejs alla IO operationer är async samtal, så vanligt, människor slutar skriva massor av async/vänta. Om du glömmer att skriva en `väntar`är det oftast smärtsamt att debug läcker löfte. Overheaden växer när ditt projekt växer.

Rod är typsäker som standard, och har bättre interna kommentarer om hur Rod själv fungerar. Den har typbindningar för alla ändpunkter i Devtools protokollet.

Rod kommer att inaktivera domänhändelser när det är möjligt, marioneteer kommer alltid att aktivera alla domäner. Det kommer att konsumera en hel del resurser när du kör en fjärrwebbläsare.

Rod stöder annullering och timeout bättre, detta kan vara avgörande om du vill hantera tusentals sidor. Till exempel, för att simulera `klicka` måste vi skicka serval cdp förfrågningar, med [löfte](https://stackoverflow.com/questions/29478751/cancel-a-vanilla-ecmascript-6-promise-chain) du kan inte uppnå något som "bara skicka hälften av cdp-förfrågningarna", men med [sammanhang](https://golang.org/pkg/context/) kan vi.

### Playwright

Rod och [Playwright](https://github.com/microsoft/playwright) publicerades för första gången nästan samtidigt. De flesta jämförelser mellan Rod och Puppeteer är fortfarande sanna mot Playwright, eftersom både Playwright och Puppeteer upprätthålls av nästan samma bidragsgivare.

Som Playwright sade på sin doc "Playwright möjliggör tillförlitlig end-to-end-testning för moderna webbappar", är projektets fokus testning. Men fokus för Rod är mer allmänt, både för webbautomatisering och skrapning, vilket gör att designen fokuserar mer på flexibilitet och prestanda.

Ett av Rods arkitektoniska mål är att göra det lättare för alla att bidra och göra det till ett rent samhällsprojekt, Det är en stor anledning till att jag valde Golang och MIT-licensen. Typescript är ett trevligt val men om du kontrollerar Playwrights designval, [`alla`](https://www.typescriptlang.org/docs/handbook/basic-types.htmvl#any) och [fackliga typer](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html#union-types) finns överallt, om du försöker hoppa till källkoden på [sidan. Klicka](https://playwright.dev/#version=v1.6.2&path=docs%2Fapi.md&q=pageclickselector-options), `d.ts` filer kommer att låta dig förstå verkligheten i typskrift. Golang är definitivt inte tillräckligt bra, men det brukar införa mindre tech skuld än nod. s typskript, om du vill att jag ska välja vilken som ska användas för QA eller Infra som inte känner till kodning för att automatisera test eller platsövervakning, Jag skulle välja Golang.

Deras ansträngningar för att stödja webbläsare är fantastisk. Men nuförtiden är HTML5 väl antagit av huvudvarumärken, det är svårt att säga den komplexitet det ger kan väga fördelar. Kommer webbläsaren [patchar](https://github.com/microsoft/playwright/tree/master/browser_patches) bli en börda i framtiden? Säkerhetsproblem för lappade webbläsare är ett annat problem. Det gör det också svårt att testa gamla versioner av Firefox eller Safari. Hoppas det inte är över-konstruktion.

### Selenium

[Selen](https://www.selenium.dev/) är baserad på [webdriver protokoll](https://www.w3.org/TR/webdriver/) som har mycket mindre funktioner jämfört med [devtools protokoll](https://chromedevtools.github.io/devtools-protocol). Såsom det inte kan hantera [stängd skugga DOM](https://github.com/sukgu/shadow-automation-selenium/issues/7#issuecomment-563062460). Inget sätt att spara sidor som PDF. Ingen support för verktyg som [Profiler](https://chromedevtools.github.io/devtools-protocol/tot/Profiler/) eller [Prestanda](https://chromedevtools.github.io/devtools-protocol/tot/Performance/)etc.

Svårare att ställa in och underhålla på grund av extra beroenden som en webbläsardrivrutiner.

Även om selenium säljer sig för bättre stöd över webbläsare är det oftast väldigt svårt att få det att fungera för alla större webbläsare.

Det finns gott om artiklar om "selen mot marionetten", du kan behandla staven som Golang-versionen av marionetten.

### Cypress

[Cypress](https://www.cypress.io/) är mycket begränsad, för stängda skuggor dom eller domänöverskridande iframes är den nästan oanvändbar. Läs deras [limitation doc](https://docs.cypress.io/guides/references/trade-offs.html) för mer detaljer.

Om du vill samarbeta med oss för att skapa en testfokuserad ramverksbas på Rod för att övervinna begränsningen av cypress, vänligen kontakta oss.

## Vad betyder Rod

Rod är namnet på styrenheten för dockteater, såsom den bruna pinnen i bilden nedan:

![spö](https://user-images.githubusercontent.com/1415488/80178856-31cd8880-863a-11ea-83e9-64f84be3282d.png ":size=200")

Betydelsen är att vi är marionetten, webbläsaren är marionetten, vi använder staven för att styra marionetten.

[chromedp]: https://github.com/chromedp/chromedp
[puppeteer]: https://github.com/puppeteer/puppeteer
