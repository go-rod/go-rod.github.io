# Perché Rod

Ci sono un sacco di grandi progetti, ma nessuno è perfetto, scegliere quello migliore che si adatta alle vostre esigenze è importante.

## Rispetto ad altre libs

### Cromedp

Teoricamente, Rod dovrebbe eseguire più velocemente e consumare meno memoria di Chromedp.

[Chromedp][chromedp] utilizza il browser del sistema per impostazione predefinita, può causare problemi se si aggiorna accidentalmente il browser.

[Chromedp][chromedp] utilizza un [buffer di dimensioni fisse](https://github.com/chromedp/chromedp/blob/b56cd66/target.go#L69-L73) per gli eventi, può causare blocco morto su alta concorrenza. Poiché Chromedp utilizza un singolo event-loop, i gestori di eventi lenti si bloccheranno a vicenda. Rod non ha questi problemi perché si basa su [goob](https://github.com/ysmood/goob).

Chromedp decodificherà ogni messaggio dal browser, rod è decode-on-demand, così Rod funziona meglio, soprattutto per gli eventi di rete pesanti.

Chromedp utilizza la terza parte WebSocket lib che ha [1MB sopra](https://github.com/chromedp/chromedp/blob/b56cd66f9cebd6a1fa1283847bbf507409d48225/conn.go#L43-L54) per ogni client cdp, se si desidera controllare migliaia di browser remoti può diventare un problema. A causa di questa limitazione, se si valuta uno script js più grande di 1MB, Chromedp crash, ecco un esempio di quanto facile puoi schiantare Chromedp: [gist](https://gist.github.com/ysmood/0d5b2c878ecbdb598776af7d3d305b79).

Quando si verifica un incidente, Chromedp lascerà il processo del browser zombie su Windows e Mac.

Rod è più configurabile, come si può anche sostituire il WebSocket lib con il labbro che ti piace.

Per il confronto diretto del codice puoi controllare [qui](https://github.com/go-rod/rod/tree/master/lib/examples/compare-chromedp). Se si confronta l'esempio chiamato `logic` tra [rod](https://github.com/go-rod/rod/tree/master/lib/examples/compare-chromedp/logic/main.go) e [chromedp](https://github.com/chromedp/examples/blob/master/logic/main.go), scoprirete quanto sia più semplice l'asta.

Con Chromedp, è necessario utilizzare le loro attività DSL prolisso per gestire la logica del codice. Chromedp utilizza diversi wrapper per gestire l'esecuzione con contesto e opzioni, il che rende molto difficile capire il loro codice quando si verificano bug. Le interfacce pesantemente usate rendono inutili i tipi statici quando si rilevano problemi. Al contrario, Rod utilizza il minor numero possibile di interfacce.

Rod ha meno dipendenze, una struttura di codice più semplice e una migliore automazione dei test. Dovresti trovare che è più facile contribuire codice a Rod. Pertanto, rispetto a Chromedp, Rod ha il potenziale di avere funzioni più belle dalla comunità in futuro.

Un altro problema di Chromedp è la loro architettura è basata su [DOM node id](https://chromedevtools.github.io/devtools-protocol/tot/DOM/#type-NodeId), puppeteer and rod are based on [remote object id](https://chromedevtools.github.io/devtools-protocol/tot/Runtime/#type-RemoteObjectId). Di conseguenza, non è solo [più lento](https://github.com/puppeteer/puppeteer/issues/2936) e impedisce a Chromedp di aggiungere funzioni di alto livello che sono accoppiate con runtime. Ad esempio, questo [biglietto](https://github.com/chromedp/chromedp/issues/72) era aperto per 3 anni. Anche dopo che è chiuso, non è ancora possibile valutare js esprimere sull'elemento all'interno di un iframe. Inoltre, Chromedp mantiene una [copia](https://github.com/chromedp/chromedp/blob/e2970556e3d05f3259c464faeed1ec0e862f0560/target.go#L375-L376) di tutti i nodi in memoria. Questo causerà condizioni di gara tra la lista NodeID locale e [DOM.documentAggiornato](https://chromedevtools.github.io/devtools-protocol/tot/DOM/#event-documentUpdated), che può causare problemi confusi come [#762](https://github.com/chromedp/chromedp/issues/762).

### Puppeteer

[Puppeteer][puppeteer] decodificherà JSON ogni messaggio dal browser, Rod è decode-on-demand, quindi teoricamente Rod funzionerà meglio, soprattutto per gli eventi di rete pesanti.

Con puppeteer, devi gestire promessa/async/attendere molto, rende elegante [fluente interfaccia](https://en.wikipedia.org/wiki/Fluent_interface) design molto difficile. I test di fine alla fine richiedono molte operazioni di sincronizzazione per simulare gli input umani, perché Puppeteer si basa su Nodejs tutte le operazioni IO sono chiamate asincrone, così di solito, le persone finiscono per digitare tonnellate di asinica/attesa. Se si dimentica di scrivere un `attendono`, di solito è doloroso per il debug della Promessa di Perdite. Il sovraccarico cresce quando il vostro progetto cresce.

Rod è sicuro di tipo per impostazione predefinita, e ha migliori commenti interni su come funziona Rod stesso. Ha attacchi di tipo per tutti gli endpoint nel protocollo Devtools.

Rod disabiliterà gli eventi di dominio quando possibile, puppeteer abiliterà sempre tutti i domini. Sarà consumare un sacco di risorse durante la guida di un browser remoto.

Rod supporta la cancellazione e il timeout migliori, questo può essere critico se si desidera gestire migliaia di pagine. Ad esempio, per simulare `clicca` dobbiamo inviare richieste serval cdp, con [Promise](https://stackoverflow.com/questions/29478751/cancel-a-vanilla-ecmascript-6-promise-chain) non puoi ottenere qualcosa come "invia solo metà delle richieste CDP", ma con il [contesto](https://golang.org/pkg/context/) possiamo.

### Playwright

Rod e [Playwright](https://github.com/microsoft/playwright) sono stati pubblicati quasi allo stesso tempo. La maggior parte dei confronti tra Rod e Puppeteer rimane fedele a Playwright, perché sia Playwright che Puppeteer sono mantenuti da quasi gli stessi contributori.

Come ha affermato Playwright sul loro documento "Playwright consente test end-to-end affidabili per le moderne applicazioni web.", il focus del progetto è testing. Ma l'attenzione per Rod è più generale, sia per l'automazione web che per l'scraping, che rendono il design concentrarsi maggiormente sulla flessibilità e sulle prestazioni.

Uno degli obiettivi architettonici di Rod è quello di rendere più facile per tutti contribuire e renderlo un puro progetto comunitario, che è una grande ragione per cui ho scelto Golang e la licenza MIT. Typescript è una buona scelta, ma se si controlla le scelte di design di Playwright, [`qualsiasi`](https://www.typescriptlang.org/docs/handbook/basic-types.htmvl#any) e [tipi di unione](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html#union-types) sono ovunque, se provi a saltare al codice sorgente della pagina [. lick](https://playwright.dev/#version=v1.6.2&path=docs%2Fapi.md&q=pageclickselector-options), `d.ts` file ti permetterà di capire la realtà del typescript. Golang è sicuramente non abbastanza buono, ma di solito introduce meno debito tecnologico del nodo. s typescript, se vuoi che scelga quale utilizzare per QA o Infra che non ha familiarità con la codifica per automatizzare il test end-to-end o il monitoraggio del sito, Io sceglierei Golang.

Il loro sforzo per il supporto cross-browser è favoloso. Ma al giorno d'oggi, HTML5 è ben adottato dai marchi principali, è difficile dire che la complessità che porta può pesare i benefici. Le [patch cross-browser](https://github.com/microsoft/playwright/tree/master/browser_patches) diventeranno un onere in futuro? Problemi di sicurezza per i browser patched è un'altra preoccupazione. Inoltre rende difficile testare vecchie versioni di Firefox o Safari. La speranza non è sovraingegneria.

### Selenium

[Selenium](https://www.selenium.dev/) è basato sul protocollo [webdriver](https://www.w3.org/TR/webdriver/) che ha molto meno funzioni confrontate con [protocollo devtools](https://chromedevtools.github.io/devtools-protocol). Come non può gestire [DOM ombra chiusa](https://github.com/sukgu/shadow-automation-selenium/issues/7#issuecomment-563062460). Nessun modo per salvare le pagine come PDF. Nessun supporto per strumenti come [Profiler](https://chromedevtools.github.io/devtools-protocol/tot/Profiler/) o [Performance](https://chromedevtools.github.io/devtools-protocol/tot/Performance/), ecc.

Più difficile da impostare e mantenere a causa di dipendenze extra come un driver del browser.

Anche se selenio si vende per un migliore supporto cross-browser, di solito è molto difficile farlo funzionare per tutti i principali browser.

Ci sono un sacco di articoli su "selenio vs burattino", è possibile trattare asta come la versione Golang di Puppeteer.

### Cipresso

[Il cipresso](https://www.cypress.io/) è molto limitato, per gli iframi di ombra chiusa o di dominio incrociato è quasi inutilizzabile. Leggi il loro [documento di limitazione](https://docs.cypress.io/guides/references/trade-offs.html) per maggiori dettagli.

Se volete collaborare con noi per creare una base di riferimento focalizzata sul test su Rod per superare la limitazione del cipresso, vi preghiamo di contattarci.

## Cosa significa Rod

Rod è il nome del dispositivo di controllo per i burattini, come il bastone marrone nell'immagine qui sotto:

![asta](https://user-images.githubusercontent.com/1415488/80178856-31cd8880-863a-11ea-83e9-64f84be3282d.png ":size=200")

Il significato è che siamo il burattino, il browser è il burattino, usiamo l'asta per controllare il burattino.

[chromedp]: https://github.com/chromedp/chromedp
[puppeteer]: https://github.com/puppeteer/puppeteer
