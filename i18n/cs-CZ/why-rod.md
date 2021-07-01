# Proč prut

Existuje mnoho skvělých projektů, ale nikdo není dokonalý, vyberte si ty nejlepší, které vyhovují vašim potřebám, je důležité.

## Ve srovnání s jinými libami

### Chromedp

Teoreticky by Rod měl pracovat rychleji a spotřebovávat méně paměti než Chromedp.

[Chromedp][chromedp] ve výchozím nastavení používá prohlížeč systému, může způsobit problémy, pokud jste prohlížeč omylem aktualizovali.

[Chromedp][chromedp] používá [fixní vyrovnávací paměť](https://github.com/chromedp/chromedp/blob/b56cd66/target.go#L69-L73) pro události, může způsobit uzamčení při vysoké konměně. Protože Chromedp používá jednu smyčku, pomalé manipulátory událostí se budou navzájem blokovat. Rod nemá tyto problémy, protože je založen na [goob](https://github.com/ysmood/goob).

Chromedp dekóduje všechny zprávy z prohlížeče, tyč je dekódován na vyžádání, takže Rod funguje lépe, zejména pro události s těžkou sítí.

Chromedp používá třetí část WebSocket lib, která má [1MB režijní plochu](https://github.com/chromedp/chromedp/blob/b56cd66f9cebd6a1fa1283847bbf507409d48225/conn.go#L43-L54) pro každého cdp klienta, pokud chcete ovládat tisíce vzdálených prohlížečů, může to být problém. Kvůli tomuto omezení se Chromedp zhroutí, pokud vyhodnotíte js skript větší než 1 MB, zde je příklad toho, jak snadno můžete havarovat Chromedp: [Gist](https://gist.github.com/ysmood/0d5b2c878ecbdb598776af7d3d305b79).

Když dojde k havárii, Chromedp opustí proces zombie na Windows a Mac.

Rod je více konfigurovatelný, například můžete dokonce nahradit WebSocket lib slovem, které se vám líbí.

Pro přímé porovnání kódů si můžete prohlédnout [zde](https://github.com/go-rod/rod/tree/master/lib/examples/compare-chromedp). Pokud srovnáte příklad nazvaný `logika` mezi [rod](https://github.com/go-rod/rod/tree/master/lib/examples/compare-chromedp/logic/main.go) a [chromedp](https://github.com/chromedp/examples/blob/master/logic/main.go), zjistíte, jak jednodušší je tyčinka.

S Chromedp musíte použít jejich detailní úkoly podobné DSL pro zpracování logiky kódu. Chromedp používá několik wrapperů ke zvládání exekuce s kontextem a možnostmi, takže je velmi obtížné pochopit jejich kód, když dojde k chybám. Silně používaná rozhraní činí statické typy zbytečnými při sledování problémů. Naproti tomu Rod používá co nejméně rozhraní.

Rod má méně závislostí, jednodušší strukturu kódů a lepší automatizaci testů. Měl bys najít snazší přispívat kód Rodovi. Proto v porovnání s Chromedp má Rod potenciál mít příjemnější funkce z komunity v budoucnosti.

Dalším problémem Chromedp je jejich architektura založená na [DOM uzlu id](https://chromedevtools.github.io/devtools-protocol/tot/DOM/#type-NodeId), loutka a tyč jsou založeny na [ID vzdáleného objektu](https://chromedevtools.github.io/devtools-protocol/tot/Runtime/#type-RemoteObjectId). V důsledku toho nejde jen o [pomalejší](https://github.com/puppeteer/puppeteer/issues/2936) a také zabraňuje společnosti Chromedp v přidávání vysokých funkcí, které jsou spojeny s provozem. Například, tento [tiket](https://github.com/chromedp/chromedp/issues/72) otevřel 3 roky. Dokonce i poté, co je uzavřen, stále nemůžete vyhodnotit vyjádření js v prvku uvnitř iframu. Kromě toho Chromedp udržuje [kopii](https://github.com/chromedp/chromedp/blob/e2970556e3d05f3259c464faeed1ec0e862f0560/target.go#L375-L376) všech uzlů v paměti. To způsobí závod mezi lokálním seznamem NodeID a [DOM.documentUpdated](https://chromedevtools.github.io/devtools-protocol/tot/DOM/#event-documentUpdated), což může způsobit matoucí problémy, jako je [#762](https://github.com/chromedp/chromedp/issues/762).

### Pupečník

[Puppeteer][puppeteer] bude JSON dekódovat všechny zprávy z prohlížeče, Rod je dekode-na vyžádání, takže teoreticky Rod bude fungovat lépe, zejména pro události těžké sítě.

S loutkou musíte zvládnout slibné/async/čekat hodně, takže je elegantní [tekuté rozhraní](https://en.wikipedia.org/wiki/Fluent_interface) velmi náročné. Konec až ukončení testů vyžaduje spoustu synchronizačních operací k simulaci lidských vstupů, protože Puppeteer je založen na Nodejs všechny IO operace jsou async hovory, takže lidé končí psát tuny async/Čekat. Pokud zapomenete napsat `čeká`, je obvykle bolestivé ladit leaking Promise. Když váš projekt poroste, režijní náklady porostou.

Rod je ve výchozím nastavení bezpečný a má lepší interní komentáře o tom, jak funguje samotný Rod. Má typ vazeb pro všechny koncové body v Devtools protokolu.

Bůh zakáže události domény, kdykoli je to možné, štětce vždy zapne všechny domény. Při jízdě na vzdáleném prohlížeči spotřebuje spoustu zdrojů.

Režim podporuje zrušení a časový limit lépe, to může být kritické, pokud chcete zpracovat tisíce stránek. Například, k simulaci `klikněte` , musíme poslat serval cdp požadavky, pomocí [Promise](https://stackoverflow.com/questions/29478751/cancel-a-vanilla-ecmascript-6-promise-chain) nemůžete dosáhnout něčeho jako "pouze pošlete polovinu požadavků cdp", ale s [kontextem](https://golang.org/pkg/context/) můžeme.

### Přehrávat vpravo

Bůh a [Playwright](https://github.com/microsoft/playwright) byly poprvé zveřejněny téměř ve stejnou dobu. Většina porovnání mezi Bohem a Puppeteer zůstává pro Playwright pravdivá, protože Playwright i Puppeteer jsou vedeny téměř týmiž přispěvateli.

Jak Playwright uvedl na doku "Playwright umožňuje spolehlivé testování mezi koncovými body moderních webových aplikací". Zaměření projektu je testováno. Pozornost pro Boha je však obecnější, jak pro webovou automatizaci tak pro sešrotování, díky čemuž se design více zaměřuje na flexibilitu a výkon.

Jedním z Rodových architektonických cílů je usnadnit všem přispívání a učinit z nich čistý komunitní projekt. To je jeden z hlavních důvodů, proč jsem si vybral Golang a MIT licenci. Typescript je pěkná volba, ale pokud se podíváte na výběr Playwrightu, [`jakékoli`](https://www.typescriptlang.org/docs/handbook/basic-types.htmvl#any) a [typy unií](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html#union-types) jsou všude, pokud se pokoušíte přeskočit na zdrojový kód stránky [. lick](https://playwright.dev/#version=v1.6.2&path=docs%2Fapi.md&q=pageclickselector-options), `d.ts` soubory vám umožní pochopit realitu psiscriptu. Golang rozhodně není dost dobrý, ale obvykle zavádí méně technologicky vyspělého dluhu než uzel. s typiscript, pokud chcete, abych si vybral, který z nich bude použit pro QA nebo Infra, kdo není obeznámen s kódováním pro automatizaci testů typu end-to-end nebo site-monitoringu, Chtěl bych vybrat Golang.

Jejich snaha o podporu napříč prohlížeči je báječná. Ale dnes je HTML5 dobře přijat hlavními značkami, je těžké říci, že složitost, kterou přináší může vážit výhody. Bude se [záplaty přes prohlížeč](https://github.com/microsoft/playwright/tree/master/browser_patches) v budoucnu zatížením? Další starostí je bezpečnostní otázky pro upravené prohlížeče. Je také složité testovat staré verze Firefoxu nebo Safari. Doufejme, že to není příliš strojírenské.

### Selenium

[Selenium](https://www.selenium.dev/) je založeno na [webdriver protokolu](https://www.w3.org/TR/webdriver/) , který má mnohem méně funkcí v porovnání s [devtools protokolem](https://chromedevtools.github.io/devtools-protocol). Například nedokáže zpracovat [uzavřený stínový DOM](https://github.com/sukgu/shadow-automation-selenium/issues/7#issuecomment-563062460). Není způsob, jak uložit stránky jako PDF. Žádná podpora pro nástroje jako [Profiler](https://chromedevtools.github.io/devtools-protocol/tot/Profiler/) nebo [Performance](https://chromedevtools.github.io/devtools-protocol/tot/Performance/)atd.

Těžší nastavit a udržovat kvůli mimořádným závislostem, jako je ovladač prohlížeče.

I když se selen prodává za lepší podporu napříč prohlížečem, je obvykle velmi obtížné zajistit, aby fungoval pro všechny hlavní prohlížeče.

Existuje mnoho článků o "selenium vs loupání", můžete ošetřovat tyč jako Golang verzi Puppeteer.

### Cystis

[Cypress](https://www.cypress.io/) je velmi omezený, protože uzavřený stín nebo napříč doménami je téměř nepoužitelný. Přečtěte si jejich [omezovací doc](https://docs.cypress.io/guides/references/trade-offs.html) pro více informací.

Pokud s námi chcete spolupracovat na vytvoření testovací základny Rod pro překonání omezení cytisku, prosím kontaktujte nás.

## Co znamená Rod

Tyč je název kontrolního zařízení pro štěňátka, jako je například hnědá páska v následujícím obrázku:

![tyč](https://user-images.githubusercontent.com/1415488/80178856-31cd8880-863a-11ea-83e9-64f84be3282d.png ":size=200")

Význam je, že jsme loutka, prohlížeč je loutka, používáme tyč k ovládání loutky.

[chromedp]: https://github.com/chromedp/chromedp
[puppeteer]: https://github.com/puppeteer/puppeteer
