# Miksi Turska

On paljon suuria projekteja, mutta kukaan ei ole täydellinen, valitse paras joka sopii tarpeisiisi on tärkeä.

## Verrattuna muihin libeihin

### Chromedp

Teoriassa Rod pitäisi suorittaa nopeammin ja kuluttaa vähemmän muistia kuin Chromedp.

[Chromedp][chromedp] käyttää oletusarvoisesti järjestelmän selainta, se voi aiheuttaa ongelmia, jos päivität selaimen vahingossa.

[Chromedp][chromedp] käyttää [korjauksen kokoista puskuria](https://github.com/chromedp/chromedp/blob/b56cd66/target.go#L69-L73) tapahtumiin, se voi aiheuttaa umpikujan korkealla konfiguraatiolla. Koska Chromedp käyttää yhtä tapahtumasilmukkaa, hidas tapahtumakäsittelijä estää toisensa. Rodulla ei ole näitä ongelmia, koska se perustuu [goob](https://github.com/ysmood/goob).

Chromedp purkaa jokaisen viestin selaimesta, sauva on dekoodaus on-demand, joten Rod toimii paremmin, erityisesti raskaiden verkkotapahtumien osalta.

Chromedp käyttää kolmannen osan WebSocket lib jossa on [1MB yläpuolella](https://github.com/chromedp/chromedp/blob/b56cd66f9cebd6a1fa1283847bbf507409d48225/conn.go#L43-L54) jokaiselle cdp-asiakkaalle, jos haluat hallita tuhansia etäselaimia, siitä voi tulla ongelma. Tämän rajoituksen vuoksi, jos arvioit js-komentosarjan, joka on suurempi kuin 1 MB, Chromedp kaatuu, Tässä on esimerkki siitä, kuinka helppoa Chromedpin kaataminen: [gist](https://gist.github.com/ysmood/0d5b2c878ecbdb598776af7d3d305b79).

Kun kaatuminen tapahtuu, Chromedp poistuu zombie-selaimen prosessista Windowsissa ja Macissa.

Rod on konfiguroitavissa, kuten voit jopa korvata WebSocket lib kanssa lib haluat.

Suora koodi vertailu voit tarkistaa [täältä](https://github.com/go-rod/rod/tree/master/lib/examples/compare-chromedp). Jos vertaat esimerkkiä nimeltä `logiikka` välillä [sauva](https://github.com/go-rod/rod/tree/master/lib/examples/compare-chromedp/logic/main.go) ja [kromedp](https://github.com/chromedp/examples/blob/master/logic/main.go), saat selville, kuinka yksinkertaisempi sauva on.

Chromedpin avulla sinun täytyy käyttää heidän verbose DSL-tyyppisiä tehtäviään koodin logiikan käsittelyyn. Chromedp käyttää useita wrappers käsitellä suoritusta asiayhteydellä ja vaihtoehtoja, mikä tekee erittäin vaikea ymmärtää niiden koodia, kun vikoja tapahtuu. Raskaasti käytetyt rajapinnat tekevät staattisista tyypeistä turhia, kun niitä seurataan. Sen sijaan Rod käyttää mahdollisimman vähän rajapintoja.

Turska on vähemmän riippuvuuksia, yksinkertaisempi koodirakenne ja parempi testiautomaatio. Sinun pitäisi löytää on helpompi syöttää koodia sauva. Näin ollen Chromedp:iin verrattuna Rod voi tulevaisuudessa saada yhteisöltä mukavampia toimintoja.

Toinen ongelma Chromedp on niiden arkkitehtuuri perustuu [DOM solmun id](https://chromedevtools.github.io/devtools-protocol/tot/DOM/#type-NodeId), nuppeteer ja sauva perustuvat [etäobjektin id](https://chromedevtools.github.io/devtools-protocol/tot/Runtime/#type-RemoteObjectId). Näin ollen se ei ole vain [hitaampi](https://github.com/puppeteer/puppeteer/issues/2936) ja myös estää Chromedpin lisäämästä korkean tason toimintoja, joihin on kytketty ajoaika. Esimerkiksi, tämä [lippu](https://github.com/chromedp/chromedp/issues/72) oli avattu 3 vuotta. Edes sen jälkeen, kun se on suljettu, et vieläkään voi arvioida js ilmaista elementin sisällä iframe. Lisäksi Chromedp ylläpitää [kopion](https://github.com/chromedp/chromedp/blob/e2970556e3d05f3259c464faeed1ec0e862f0560/target.go#L375-L376) kaikista muistissa olevista solmuista. Se aiheuttaa rodun kunto paikallisen NodeID-luettelon ja [DOM.documentUpdated](https://chromedevtools.github.io/devtools-protocol/tot/DOM/#event-documentUpdated), joka voi aiheuttaa sekavia ongelmia, kuten [#762](https://github.com/chromedp/chromedp/issues/762).

### Peukalinkki

[Puppeteer][puppeteer] purkaa jokaisen viestin selaimesta, Rod on dekoodaus on-demand, joten teoriassa Rod toimii paremmin, erityisesti raskaan verkon tapahtumia.

Pentueerilla sinun täytyy käsitellä lupausta/async/await paljon, se tekee tyylikkäästä [sujuvasta käyttöliittymästä](https://en.wikipedia.org/wiki/Fluent_interface) erittäin vaikeaa. Testien päättäminen edellyttää paljon synkronointitoimia, joilla simuloidaan ihmisen syötteitä, koska Puppeteer perustuu Nodejs kaikki IO operaatiot ovat async puhelut, joten yleensä ihmiset päätyvät kirjoittamalla tonnia async/odottaa. Jos unohdat kirjoittaa `odottaa,`, se on yleensä tuskallista debug vuotaa lupaa. Yleisö kasvaa, kun projektisi kasvaa.

Rod on oletusarvoisesti turvallinen tyyppi, ja sillä on paremmat sisäiset kommentit siitä, miten Rod itse toimii. Se on tyypin sitomiset kaikille päätepisteille Devtools protokolla.

Rod poistaa verkkotunnuksen käytöstä aina kun se on mahdollista, puppeteer ottaa aina käyttöön kaikki verkkotunnukset. Se kuluttaa paljon resursseja, kun ajetaan etäselainta.

Rod tukee peruutusta ja aikakatkaisua paremmin, tämä voi olla kriittinen jos haluat käsitellä tuhansia sivuja. Esimerkiksi simuloidaksesi `klikkaa` meidän täytyy lähettää serval cdp -pyyntöjä, kanssa [Promise](https://stackoverflow.com/questions/29478751/cancel-a-vanilla-ecmascript-6-promise-chain) et voi saavuttaa jotain kuten "lähetä vain puolet cdp pyynnöistä", mutta [konteksti](https://golang.org/pkg/context/) me voimme.

### Playwright

Rod ja [Playwright](https://github.com/microsoft/playwright) julkaistiin ensimmäisen kerran lähes samaan aikaan. Suurin osa Rodin ja Puppeteerin vertailuista pitää paikkansa Playwrightissa, koska lähes samat osallistujat ylläpitävät sekä Playwright että Puppeteer.

Kuten Playwright totesi doc "Playwright mahdollistaa luotettavan päästä päähän -testauksen nykyaikaisille verkkosovelluksille", projektin painopiste on testauksessa. Mutta painopiste Rod on yleisempi, sekä web-automaatio ja romutus, jotka tekevät suunnittelusta enemmän joustavuutta ja suorituskykyä.

Yksi Rodin arkkitehtonisista tavoitteista on helpottaa kaikkien osallistumista ja tehdä siitä puhdas yhteisöhanke, se on yksi suuri syy miksi valitsin Golang ja MIT lisenssi. Tyyppihyväksyntä on mukava valinta, mutta jos tarkistat Playwrightin suunnitteluvalintoja, [`mitkä tahansa`](https://www.typescriptlang.org/docs/handbook/basic-types.htmvl#any) ja [ammattiyhdistystyypit](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html#union-types) ovat kaikkialla, jos yrität hypätä lähdekoodiin, joka on [sivulla. nuolla](https://playwright.dev/#version=v1.6.2&path=docs%2Fapi.md&q=pageclickselector-options), `d.ts` tiedostojen avulla voit ymmärtää konekirjoituksen todellisuutta. Golang ei todellakaan ole tarpeeksi hyvä, mutta se esittelee yleensä vähemmän teknologian velkaa kuin solmu. s typescript, jos haluat, että valitsen QA- tai Infra-sovelluksen, joka ei ole perehtynyt koodaukseen, jotta voit automatisoida end-to-end -testin tai paikan seurannan Minä valitsisin Golangin.

Heidän ponnistuksensa selainten välistä tukea on upea. Mutta nykyään, HTML5 on hyvin hyväksytty päämerkit, se on vaikea sanoa monimutkaisuus se tuo voi painaa hyötyjä. Tuleeko ristiinselainta [laastareista](https://github.com/microsoft/playwright/tree/master/browser_patches) taakka tulevaisuudessa? Toinen huolenaihe on turvallisuuskysymykset haaskatuilla selaimilla. Se tekee myös hankalaa testata vanhoja versioita Firefox tai Safari. Toivottavasti se ei ole yli-suunnittelu.

### Selenium

[Seleeni](https://www.selenium.dev/) perustuu [webdriver protokollaan](https://www.w3.org/TR/webdriver/) jolla on paljon vähemmän toimintoja kuin [devtools protokollalla](https://chromedevtools.github.io/devtools-protocol). Kuten se ei pysty käsittelemään [suljettu varjo DOM](https://github.com/sukgu/shadow-automation-selenium/issues/7#issuecomment-563062460). Ei keinoa tallentaa sivuja PDF. Ei tukea työkaluille, kuten [Profiler](https://chromedevtools.github.io/devtools-protocol/tot/Profiler/) tai [Suorituskyky](https://chromedevtools.github.io/devtools-protocol/tot/Performance/), jne.

Vaikeampi asettaa ja ylläpitää koska lisäriippuvuuksia kuten selainohjain.

Vaikka seleeni myy itseään parempaan selainten väliseen tukeen, se on yleensä hyvin vaikea saada se toimimaan kaikissa tärkeimmissä selaimissa.

On olemassa paljon artikkeleita "selenium vs puppeteer", voit käsitellä sauva kuin Golang versio Puppeteer.

### Sypressi

[Cypress](https://www.cypress.io/) on hyvin rajallinen, koska suljettujen varjojen tai verkkotunnusten rajat ovat lähes käyttökelvottomia. Lue lisätietoja [limitation doc](https://docs.cypress.io/guides/references/trade-offs.html)

Jos haluat tehdä kanssamme yhteistyötä luodaksesi testauksen keskitetyn kehyksen Rod rajoituksen poistamiseksi, ota meihin yhteyttä.

## Mitä sauva tarkoittaa

Nahka on nuken ohjauslaitteen nimi, kuten esimerkiksi alla olevassa kuvassa oleva ruskea tikka:

![sauva](https://user-images.githubusercontent.com/1415488/80178856-31cd8880-863a-11ea-83e9-64f84be3282d.png ":size=200")

Tarkoituksena on, että olemme nukke, selain on nukke, käytämme sauvaa ohjaamaan nukkea.

[chromedp]: https://github.com/chromedp/chromedp
[puppeteer]: https://github.com/puppeteer/puppeteer
