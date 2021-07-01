# Hvorfor Rod

Det er mange store prosjekter, men ingen er perfekt, velg det beste som passer dine behov er viktig.

## Sammenlignet med andre ligger

### Kromedp

Teoretisk skal Rod gjennomføre raskere og konsumere mindre minne enn Chromedp.

[Chromedp][chromedp] bruker systemets nettleser som standard, kan det forårsake problemer hvis du tilfeldigvis oppgraderer nettleseren.

[Chromedp][chromedp] bruker en [hurtigbuffer](https://github.com/chromedp/chromedp/blob/b56cd66/target.go#L69-L73) til hendelser, som kan forårsake dødelås på høy valuta. Fordi Chromedp bruker en enkelt hendelse-løkke, vil de langsomme hendelsesbehandlerne blokkere hverandre. Rod har ikke disse problemene fordi det er basert på [goob](https://github.com/ysmood/goob).

Chromedp vil JSON-dekode hver melding fra nettleseren, stang er dekoderedrikt, så Rod fremfører bedre, spesielt for tunge nettverkshendelser.

Chromedp bruker tredjedel-del WebSocket lib som har [1MB overhead](https://github.com/chromedp/chromedp/blob/b56cd66f9cebd6a1fa1283847bbf507409d48225/conn.go#L43-L54) for hver cdp-klient, hvis du ønsker å kontrollere tusenvis av eksterne nettlesere kan det bli et problem. På grunn av denne begrensningen, hvis du evaluerer et js-skript som er større enn 1MB, vil Chromedp krasje, Her er et eksempel på hvor enkelt du kan krasj Chromedp: [Gist](https://gist.github.com/ysmood/0d5b2c878ecbdb598776af7d3d305b79).

Når en krasj oppstår, vil Chromedp forlate nettleserprosessen for vandøde på Windows og Mac.

Rod er mer konfigurerbar, for eksempel du kan til og med erstatte WebSocket lib med den du ønsker.

For direkte sammenligning av koden, kan du se [her](https://github.com/go-rod/rod/tree/master/lib/examples/compare-chromedp). Hvis du sammenligner eksempelet kalt `logikk` mellom [stav](https://github.com/go-rod/rod/tree/master/lib/examples/compare-chromedp/logic/main.go) og [kromedp](https://github.com/chromedp/examples/blob/master/logic/main.go), du finner ut hvor enklere staven er.

Med Chromedp, må du bruke deres ordresmitte DSL-lignende oppgaver for å håndtere kodelogikk. Chromedp bruker flere vippere til å håndtere utførelse med kontekst og alternativer, noe som gjør det svært vanskelig å forstå koden når feil skjer. Det mye brukte grensesnittene gjør de statiske typene ubrukelige ved sporing. Rod bruker derimot så få grensesnitt som mulig.

Stod har færre avhengigheter, en enklere kodestruktur, og bedre testautomatisering. Du burde finne det lettere å bidra med kode til Rod. Sammenliknet med Chromedp har derfor Rod potensial til å få flere flotte funksjoner fra samfunnet i framtiden.

Et annet problem med Chromedp er deres arkitektur er basert på [DOM node id](https://chromedevtools.github.io/devtools-protocol/tot/DOM/#type-NodeId), valp og stang er basert på [ekstern gjenstands-ID](https://chromedevtools.github.io/devtools-protocol/tot/Runtime/#type-RemoteObjectId). Derfor er det ikke bare [langsommere](https://github.com/puppeteer/puppeteer/issues/2936) og forebygger også Chromedp i å legge til høynivåfunksjoner som er koblet til rulletiden. For eksempel hadde denne [billetten](https://github.com/chromedp/chromedp/issues/72) åpnet i 3 år. Selv etter at den er lukket, kan du fremdeles ikke evaluere js uttrykke på elementet innenfor en iramme. Dessuten vedlikeholder Chromedp en [copy](https://github.com/chromedp/chromedp/blob/e2970556e3d05f3259c464faeed1ec0e862f0560/target.go#L375-L376) av alle nodene i minnet. Det vil forårsake rase tilstand mellom lokal NodeID liste og [DOM.documentUpdated](https://chromedevtools.github.io/devtools-protocol/tot/DOM/#event-documentUpdated), som kan forårsake forvirringsproblemer som [#762](https://github.com/chromedp/chromedp/issues/762).

### Puppetere

[Puppeteer][puppeteer] vil JSON-dekode hver melding fra nettleseren, Rod er decode-on-demand, så teoretisk Rod vil utføre bedre spesielt for tunge nettverkshendelser.

Med puppeteer må du håndtere loven/async/Venter på mye, det får elegant [flytende grensesnitt](https://en.wikipedia.org/wiki/Fluent_interface) til veldig hardt. Slutten av testene krever mange synkroniseringsoperasjoner for å simulere menneskelige innganger, fordi Puppeteer er basert på Nodejs alle IO-operasjoner er asynkroniske samtaler, så vanligvis ender folk opp med å skrive toner av async/avvent. Hvis du glemmer å skrive et `vent`er det vanligvis vondt å lekke på. Overhodet vokser når prosjektet vokser.

Rod er type-sikker som standard, og har bedre interne kommentarer til hvordan Rod selv virker. Den har bindinger for alle endepunkter i Devtools protocol.

Rod vil deaktivere domeneventer når det er mulig, puppeteer vil alltid aktivere alle domenene. Den vil bruke mye ressurser når du kjører en fjernnettleser.

Rammeverk støtter kansellering og tidsavbrudd bedre, dette kan være avgjørende hvis du ønsker å håndtere tusenvis av sider. For eksempel, for å simulere `klikk` vi må sende serval cdp forespørsler, med [Reklame](https://stackoverflow.com/questions/29478751/cancel-a-vanilla-ecmascript-6-promise-chain) du kan ikke oppnå noe "bare sende halvparten av cdp-forespørslene", men med [konteksten](https://golang.org/pkg/context/) kan vi.

### Spillerett

od og [Playwright](https://github.com/microsoft/playwright) ble først publisert nesten samtidig. De fleste sammenligninger mellom Rod og Puppeteer har tro mot kloden, fordi både Playwright og Puppeteer vedlikeholdes av nesten samme bidragsytere.

Som Playwright oppgitt på deres "Playwright aktiverer pålitelig slutt-testing for moderne nettapper". Fokuset på prosjektet testes. Satsingen til Torsk er mer generell, både ved nettautomasjon og ved hjelp av skraping, som kan gjøre designet mer opptatt av fleksibilitet og ytelse.

Et av Mods arkitektoniske mål er å gjøre det enklere for alle å bidra og gjøre det til et rent samfunnsprosjekt. Det er en stor grunn til at jeg valgte Golang og MIT-lisensen. Typescript er et fint valg, men hvis du sjekker design til Playwright's valg, [`hvilken som helst`](https://www.typescriptlang.org/docs/handbook/basic-types.htmvl#any) og [fagforeningstyper](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html#union-types) er overalt, hvis du prøver å gå til kildekoden til [siden. Klikk](https://playwright.dev/#version=v1.6.2&path=docs%2Fapi.md&q=pageclickselector-options), `d.ts` filer vil la deg forstå virkeligheten av skriving. Golang er definitivt ikke god nok, men det introduserer vanligvis mindre teknologi gjeld enn noden. s skriveskilt, hvis du vil at jeg skal velge hvilken som skal brukes for QA eller Infra hvem som ikke er kjent med koding for å automatisere ende-til-siste test eller nettsted-overvåking, Jeg skulle velge Golang.

Deres innsats for støtte på tvers av nettleseren er fabelaktig. Men nå blir HTML5 godt brukt av hovedmerkevarer, det er vanskelig å si kompleksiteten som gir kan vekte fordelene. Vil nettleseren [depotplastre](https://github.com/microsoft/playwright/tree/master/browser_patches) bli en byrde i fremtiden? Sikkerhetsproblemer for de patchede nettleserne er en annen bekymring. Dette gjør også det vanskelig å teste eldre versjoner av Firefox og Safari. Håp den er ikke overprosjekterende.

### Selenium

[Selenium](https://www.selenium.dev/) er basert på [webdriver protokoll](https://www.w3.org/TR/webdriver/) som har mye mindre funksjoner sammenliknet med [devtools protocol](https://chromedevtools.github.io/devtools-protocol). Slik kan det ikke håndtere [lukket skygge DOM](https://github.com/sukgu/shadow-automation-selenium/issues/7#issuecomment-563062460). Ingen måte å lagre sider som PDF. Ingen støtte for verktøy som [Profiler](https://chromedevtools.github.io/devtools-protocol/tot/Profiler/) eller [Performance](https://chromedevtools.github.io/devtools-protocol/tot/Performance/), etc.

Standarder å sette opp og vedlikeholde på grunn av ekstra avhengigheter som en nettleserdriver.

Selv om selenium selger seg for bedre støtte til kryss av nettlesere, er det vanligvis veldig vanskelig å få det til å fungere for alle større nettlesere.

Det finnes mange artikler om "selenium vs puppete", du kan behandle stang som Golang-versjonen av Puppeter.

### Kypros

[Skriv](https://www.cypress.io/) er veldig begrenset, for lukkede skygger eller kryss-domener er det nesten ubrukelig. Les [-begrensningsduk](https://docs.cypress.io/guides/references/trade-offs.html) for flere detaljer.

Hvis du vil samarbeide med oss for å lage en testfokusert rammebase på Rod for å overvinne begrensningen på Kypros, vennligst kontakt oss.

## Hva betyr Rod

Stridsett er navnet på kontrollenheten for valper, som den brune pinnen i bildet nedenfor:

![stang](https://user-images.githubusercontent.com/1415488/80178856-31cd8880-863a-11ea-83e9-64f84be3282d.png ":size=200")

Betydningen er at vi er puppeter, nettleseren er valppet, vi bruker staven til å styre valpen.

[chromedp]: https://github.com/chromedp/chromedp
[puppeteer]: https://github.com/puppeteer/puppeteer
