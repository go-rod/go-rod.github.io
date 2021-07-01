# De ce ploaie

Există o mulţime de proiecte minunate, dar nimeni nu este perfect, alegeţi cel mai bun care se potriveşte nevoilor dumneavoastră este important.

## Comparativ cu alte organe

### Chromedp

Teoretic, Rod ar trebui să execute mai repede şi să consume mai puţină memorie decât Chromedp.

[Chromedp][chromedp] folosește browser-ul sistemului în mod implicit, poate cauza probleme dacă actualizezi din greșeală browser-ul.

[Chromedp][chromedp] folosește [un tampon cu dimensiune fixă](https://github.com/chromedp/chromedp/blob/b56cd66/target.go#L69-L73) pentru evenimente, poate cauza blocarea blocajului la convalenţa mare. Pentru că Chromedp foloseşte o singură buclă de eveniment, gestionarii de evenimente lenţi se vor bloca reciproc. Rodul nu are aceste probleme pentru că se bazează pe [goob](https://github.com/ysmood/goob).

Chromedp va decoda JSON fiecare mesaj din browser, tija este decodare la cerere, astfel încât Rodul va executa mai bine, în special pentru evenimentele de rețea grea.

Chromedp foloseşte a treia parte WebSocket lib care are [1MB peste cheltuieli](https://github.com/chromedp/chromedp/blob/b56cd66f9cebd6a1fa1283847bbf507409d48225/conn.go#L43-L54) pentru fiecare client cdp, dacă vrei să controlezi mii de browsere de la distanţă, acesta poate deveni o problemă. Din cauza acestei limitări, dacă evaluezi un script js mai mare de 1MB, Chromedp se va prăbuși, Iată un exemplu despre cât de uşor poţi să crash Chromedp: [gist](https://gist.github.com/ysmood/0d5b2c878ecbdb598776af7d3d305b79).

Când se întâmplă un accident, Chromedp va părăsi procesul browser-ului zombi pe Windows și Mac.

Rodul este mai configurabil, cum ai putea chiar să înlocuiești placa WebSocket cu libul care îți place.

Pentru compararea codurilor directe, puteți verifica [aici](https://github.com/go-rod/rod/tree/master/lib/examples/compare-chromedp). Dacă compari exemplul numit `logica` între [tijă](https://github.com/go-rod/rod/tree/master/lib/examples/compare-chromedp/logic/main.go) și [chromedp](https://github.com/chromedp/examples/blob/master/logic/main.go), vei afla cât de simplă este tija.

Cu Chromedp, trebuie să utilizaţi sarcinile lor verbose DSL pentru a trata logica codului. Chromedp foloseşte mai mulţi înfăşurători pentru a se ocupa de execuţie cu contexte şi opţiuni, ceea ce face foarte greu de înţeles codul lor atunci când apar erori. Interfețele foarte utilizate fac ca tipurile statice să fie inutile atunci când urmăresc problemele. Spre deosebire de Rod folosește cât mai puține interfețe posibil.

Rodul are mai puţine dependenţe, o structură de cod mai simplă şi o mai bună automatizare. Ar trebui să găsești că este mai ușor să contribuie cu cod la Dumnezeu. Prin urmare, în comparaţie cu Chromedp, Rod are potenţialul de a avea mai multe funcţii frumoase din partea comunităţii în viitor.

O altă problemă a Chromedp este că arhitectura lor se bazează pe [id de nod DOM](https://chromedevtools.github.io/devtools-protocol/tot/DOM/#type-NodeId), puppeteer și tijă sunt bazate pe [obiectul distant](https://chromedevtools.github.io/devtools-protocol/tot/Runtime/#type-RemoteObjectId). În consecinţă, nu este doar [mai lent](https://github.com/puppeteer/puppeteer/issues/2936) şi de asemenea previne Chromedp să adauge funcţii de nivel înalt cuplate cu runtime. De exemplu, acest [bilet](https://github.com/chromedp/chromedp/issues/72) a fost deschis de 3 ani. Chiar și după ce a fost închis, tot nu poți evalua js exprimă elementul dintr-un iframe. În plus, Chromedp menține o [copie](https://github.com/chromedp/chromedp/blob/e2970556e3d05f3259c464faeed1ec0e862f0560/target.go#L375-L376) a tuturor nodurilor din memorie. Aceasta va cauza o condiție de cursă între lista locală NodeID și [DOM.documentUpdated](https://chromedevtools.github.io/devtools-protocol/tot/DOM/#event-documentUpdated), care poate cauza probleme derutante precum [#762](https://github.com/chromedp/chromedp/issues/762).

### Puppeter

[Puppeteer][puppeteer] va decoda JSON fiecare mesaj din browser, Doamne este decodat la cerere, astfel încât teoretic Rod va fi mai bun, în special pentru evenimentele de rețea grea.

Cu păpuşar, trebuie să te ocupi de promisiune/async/await mult, face design-ul [fluent](https://en.wikipedia.org/wiki/Fluent_interface) elegant foarte greu. Sfârșit până la sfârșitul testelor necesită o mulțime de operațiuni de sincronizare pentru a simula intrări umane, pentru că Puppeteer este bazat pe Nodejs, toate operațiunile IO sunt apeluri async, deci de obicei, oamenii ajung să tasteze tone de async/await. Dacă uitați să scrieți un `așteaptă`, de obicei este dureros să depanați scurgerile Promise. Cheltuielile de regie cresc atunci când proiectul tău crește.

În mod implicit, trandafirul este sigur și are comentarii interne mai bune despre modul în care funcționează el însuși. Ea are legături pentru toate punctele finale din protocolul Devtools.

Rod va dezactiva evenimentele de domeniu ori de câte ori este posibil, puppeteer va activa întotdeauna toate domeniile. Va consuma o mulțime de resurse atunci când conduci un browser de la distanță.

Suportă anularea și expirarea temporizării, acest lucru poate fi esențial dacă vrei să gestionezi mii de pagini. De exemplu, pentru a simula `fă clic` trebuie să trimitem cereri de cdp serval, cu [Promise](https://stackoverflow.com/questions/29478751/cancel-a-vanilla-ecmascript-6-promise-chain) nu poți realiza ceva de genul "trimite doar jumătate din cererile cdp", dar cu [contextul](https://golang.org/pkg/context/) putem.

### Playwright

Rod și [Playwright](https://github.com/microsoft/playwright) au fost publicate pentru prima dată aproape în același timp. Majoritatea comparațiilor dintre Rod și Puppeteer rămân sincere cu Playwright, deoarece atât Playwright cât și Puppeteer sunt menținute de aproape aceiași contribuitori.

După cum spunea Playwright pe documentul lor „Playwright permite testarea de încredere de la un capăt la altul a aplicațiilor web moderne”, obiectivul principal al proiectului este de a testa. Dar se pune un accent mai general pe Rod, atât pentru automatizarea internetului, cât și pentru dezmembrarea acestuia, ceea ce face ca proiectul să se concentreze mai mult pe flexibilitate și performanță.

Unul din obiectivele arhitecturale ale lui Rod este acela de a facilita contribuţia şi transformarea sa într-un proiect pur comunitar, Acesta este un motiv important pentru care am ales Golang şi licenţa MIT. Tipescript este o alegere frumoasă, dar dacă verificați opțiunile de design ale Playwright, [`orice`](https://www.typescriptlang.org/docs/handbook/basic-types.htmvl#any) și [tip de uniune](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html#union-types) sunt peste tot, dacă încercați să săriți la codul sursă [pagină. clic](https://playwright.dev/#version=v1.6.2&path=docs%2Fapi.md&q=pageclickselector-options), `d.ts` fişiere vă vor permite să înţelegeţi realitatea tastaturii. Golang nu este cu siguranţă suficient de bun, dar de obicei introduce mai puţină datorie tehnologică decât nodul. s typescript, dacă vrei să aleg pe care să o folosesc pentru QA sau Infra, care nu este familiarizat cu codificarea pentru a automatiza testul de la un capăt la altul sau monitorizarea site-ului, Aș alege Golang.

Efortul lor pentru suport pentru toate browserele este fabulos. Dar astăzi, HTML5 este bine adoptat de mărci principale, e greu de spus că complexitatea pe care o aduce poate cântări beneficiile. Vor fi [patch-urile pentru browserele](https://github.com/microsoft/playwright/tree/master/browser_patches) o povară în viitor? Un alt motiv de îngrijorare îl reprezintă problemele de securitate pentru browserele modificate. De asemenea, este dificil să testezi versiunile vechi de Firefox sau Safari. Sper că nu e o supra-inginerie.

### Selenium

[Selenium](https://www.selenium.dev/) se bazează pe [protocolul webdriver](https://www.w3.org/TR/webdriver/) care are mult mai puține funcții în comparație cu [protocolul devtools](https://chromedevtools.github.io/devtools-protocol). Cum nu poate manipula [umbra închisă DOM](https://github.com/sukgu/shadow-automation-selenium/issues/7#issuecomment-563062460). Nici o modalitate de a salva paginile ca PDF. Fără suport pentru instrumente precum [Profiler](https://chromedevtools.github.io/devtools-protocol/tot/Profiler/) sau [Performanță](https://chromedevtools.github.io/devtools-protocol/tot/Performance/), etc.

Harder de configurat și întreținut din cauza unor dependențe suplimentare ca un șofer navigator.

Deși seleniul se vinde pentru un suport mai bun între browsere, de obicei este foarte greu să îl facă să funcționeze pentru toate browserele importante.

Există o mulțime de articole despre "selenium vs puppeteer", poți trata tija ca fiind versiunea Golang a lui Puppeteer.

### Ciclu

[Cypress](https://www.cypress.io/) este foarte limitat, pentru iframe-urile din umbră închise sau din mai multe domenii este aproape inutilizabile. Citește [limitările lor](https://docs.cypress.io/guides/references/trade-offs.html) pentru mai multe detalii.

Dacă doriţi să cooperaţi cu noi pentru a crea un cadru de testare concentrat pe Rod pentru a depăşi limitarea bicicliştilor, vă rugăm să ne contactaţi.

## Ce înseamnă „Doamne”

Rod este numele dispozitivului de comandă pentru păpuşă, cum ar fi batul maro din imaginea de mai jos:

![tijă](https://user-images.githubusercontent.com/1415488/80178856-31cd8880-863a-11ea-83e9-64f84be3282d.png ":size=200")

Semnificația este că noi suntem păpuși, browserul este păpușa, folosim tija pentru a controla păpușa.

[chromedp]: https://github.com/chromedp/chromedp
[puppeteer]: https://github.com/puppeteer/puppeteer
