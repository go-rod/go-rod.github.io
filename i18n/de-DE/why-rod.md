# Warum Rod

Es gibt viele großartige Projekte, aber niemand ist perfekt, wählen Sie die beste für Ihre Bedürfnisse ist wichtig.

## Verglichen mit anderen Bibliotheken

### Chromedp

Theoretisch sollte Rod schneller arbeiten und weniger Speicher verbrauchen als Chromedp.

[Chromedp][chromedp] verwendet standardmäßig den System-Browser, es kann Probleme verursachen, wenn Sie den Browser versehentlich aktualisieren.

[Chromedp][chromedp] verwendet einen [Fix-Größen-Puffer](https://github.com/chromedp/chromedp/blob/b56cd66/target.go#L69-L73) für Ereignisse, wodurch eine Sperrung bei hoher Konwährung entstehen kann. Da Chromedp eine einzige Ereignisschleife verwendet, blockieren sich die langsamen Ereignishandler einander. Rod hat diese Probleme nicht, weil sie auf [goob](https://github.com/ysmood/goob) basieren.

Chromedp wird JSON jede Nachricht aus dem Browser dekodieren, Rod ist decode-on-demand, so dass Rod besser funktioniert, insbesondere bei schweren Netzwerk-Ereignissen.

Chromedp verwendet den dritten Teil der WebSocket-Bibliothek, die [1MB Overhead](https://github.com/chromedp/chromedp/blob/b56cd66f9cebd6a1fa1283847bbf507409d48225/conn.go#L43-L54) für jeden cdp-Client hat Wenn Sie Tausende von entfernten Browsern steuern wollen, kann es zu einem Problem werden. Aufgrund dieser Einschränkung stürzt Chromedp ab, wenn Sie ein js-Skript auswerten, das größer als 1MB ist hier ist ein Beispiel dafür, wie einfach du Chromedp abstürzen kannst: [gist](https://gist.github.com/ysmood/0d5b2c878ecbdb598776af7d3d305b79).

Wenn ein Absturz auftritt, verlässt Chromedp den Prozess des Zombie-Browsers auf Windows und Mac.

Rod ist konfigurierbarer, da Sie die WebSocket lib sogar durch die lib ersetzen können, die Sie mögen.

Für einen direkten Code-Vergleich können Sie hier [nachlesen](https://github.com/go-rod/rod/tree/master/lib/examples/compare-chromedp). Wenn Sie das Beispiel `Logik` zwischen [Stange](https://github.com/go-rod/rod/tree/master/lib/examples/compare-chromedp/logic/main.go) und [chromedp](https://github.com/chromedp/examples/blob/master/logic/main.go)vergleichen, Sie werden herausfinden, wie einfacher die Rute ist.

Mit Chromedp müssen Sie ihre ausführlichen DSL-ähnlichen Aufgaben verwenden, um die Code-Logik zu handhaben. Chromedp verwendet mehrere Wrapper, um die Ausführung mit Kontext und Optionen zu behandeln, was es sehr schwer macht, ihren Code zu verstehen, wenn Fehler auftreten. Die stark benutzten Schnittstellen machen die statischen Typen bei der Verfolgung von Problemen nutzlos. Im Gegensatz dazu verwendet Rod so wenig Schnittstellen wie möglich.

Rod hat weniger Abhängigkeiten, eine einfachere Code-Struktur und eine bessere Testautomatisierung. Du solltest feststellen, dass es einfacher ist, Code zu Rod beizutragen. Daher hat Rod im Vergleich zu Chromedp das Potenzial, in Zukunft mehr nette Funktionen aus der Community zu haben.

Ein weiteres Problem von Chromedp ist ihre Architektur basiert auf [DOM-Knoten-Id](https://chromedevtools.github.io/devtools-protocol/tot/DOM/#type-NodeId), puppeteer und rod basieren auf [remote object id](https://chromedevtools.github.io/devtools-protocol/tot/Runtime/#type-RemoteObjectId). Infolgedessen ist es nicht nur [langsamer](https://github.com/puppeteer/puppeteer/issues/2936) und verhindert auch, dass Chromedp High-Level-Funktionen hinzufügt, die mit Laufzeit verbunden sind. Zum Beispiel hatte dieses [Ticket](https://github.com/chromedp/chromedp/issues/72) seit 3 Jahren geöffnet. Auch nach dem Schließen können Sie js express auf das Element in einem iframe noch nicht auswerten. Besides, Chromedp maintains a [copy](https://github.com/chromedp/chromedp/blob/e2970556e3d05f3259c464faeed1ec0e862f0560/target.go#L375-L376) of all the nodes in memory. Es wird zu einem Wettlauf zwischen lokaler NodeID-Liste und [DOM.documentAktualisiert](https://chromedevtools.github.io/devtools-protocol/tot/DOM/#event-documentUpdated)führen, was verwirrende Probleme wie [#762](https://github.com/chromedp/chromedp/issues/762) verursachen kann.

### Puppetier

[Puppeteer][puppeteer] wird JSON jede Nachricht aus dem Browser dekodieren, Rod ist decode-on-demand, also wird Rod theoretisch besser funktionieren, insbesondere bei schweren Netzwerk-Ereignissen.

Mit Puppeteer musst du vielversprechend/async/warten, es macht das elegante [fließende Interface](https://en.wikipedia.org/wiki/Fluent_interface) Design sehr schwierig. Ende-zu-End-Tests erfordern eine Menge Synchronisationsoperationen, um menschliche Eingaben zu simulieren weil Puppeteer auf Nodejs basiert, sind alle IO-Operationen asynchrone Aufrufe, so dass die Leute am Ende Tonnen von Asynchron/Warten eintippen. If you forget to write a `await`, it's usually painful to debug leaking Promise. Der Overhead wächst, wenn Ihr Projekt wächst.

Rod ist standardmäßig typsicher und hat bessere interne Kommentare darüber, wie Rod selbst funktioniert. Es hat Typbindungen für alle Endpunkte im Devtools-Protokoll.

Rod wird Domain-Ereignisse deaktivieren, wann immer es möglich ist, wird puppeteer immer alle Domains aktivieren. Es verbraucht viel Ressourcen, wenn Sie einen Remote-Browser steuern.

Rod unterstützt Stornierung und Timeout besser. Dies kann entscheidend sein, wenn Sie Tausende von Seiten bearbeiten möchten. Zum Beispiel, um `zu simulieren, klicken Sie` wir müssen serielle cdp-Anfragen senden, mit [Versprechen](https://stackoverflow.com/questions/29478751/cancel-a-vanilla-ecmascript-6-promise-chain) können Sie so etwas wie "nur die Hälfte der cdp-Anfragen senden" nicht erreichen. aber mit dem [Kontext](https://golang.org/pkg/context/) können wir.

### Playwright

Rod und [Playwright](https://github.com/microsoft/playwright) wurden zum ersten Mal fast zur gleichen Zeit veröffentlicht. Die meisten Vergleiche zwischen Rod und Puppeteer bleiben Playwright treu, da sowohl Playwright als auch Puppeer von fast denselben Mitwirkenden gepflegt werden.

Wie Playwright auf ihrem Doc feststellte: "Playwright ermöglicht ein zuverlässiges End-to-End-Testen für moderne Web-Apps.", liegt der Fokus des Projekts auf dem Test. Aber der Fokus für Rod ist allgemeiner, sowohl für Web-Automatisierung als auch für Scraping, die das Design stärker auf Flexibilität und Leistung fokussieren.

Eines der architektonischen Ziele von Rod ist es, es allen zu erleichtern, einen Beitrag zu leisten und es zu einem reinen Gemeinschaftsprojekt zu machen das ist ein großer Grund, warum ich Golang und die MIT Lizenz gewählt habe. Typescript ist eine nette Wahl, aber wenn du Playwrights Designauswahl überprüfst, [`alle`](https://www.typescriptlang.org/docs/handbook/basic-types.htmvl#any) und [Unionstypen](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html#union-types) sind überall, , wenn Sie versuchen, zum Quellcode von [Seite zu springen. Klicken Sie auf](https://playwright.dev/#version=v1.6.2&path=docs%2Fapi.md&q=pageclickselector-options), `d.ts` Dateien werden Ihnen die Realität des Schreibzeichens verständlich machen. Golang ist definitiv nicht gut genug, aber es führt in der Regel weniger technische Schulden als Knoten. s typescript, wenn du möchtest, dass ich wähle, welche für QA oder Infra verwendet werden soll, die nicht mit der Programmierung vertraut sind, um End-zu-Ende-Test oder Site-Monitoring zu automatisieren, Ich würde Golang wählen.

Ihr Einsatz für Cross-Browser-Support ist hervorragend. Aber heutzutage ist HTML5 gut von den Hauptmarken übernommen, es ist schwer zu sagen, die Komplexität bringt kann die Vorteile wiegen. Werden die Cross-Browser- [-Patches](https://github.com/microsoft/playwright/tree/master/browser_patches) in Zukunft zu einer Belastung werden? Sicherheitsprobleme für gepatchte Browser sind ein weiteres Anliegen. Es macht es auch schwierig, alte Versionen von Firefox oder Safari zu testen. Hoffentlich ist es nicht übertechnik.

### Selenium

[Selenium](https://www.selenium.dev/) basiert auf [webdriver Protokoll](https://www.w3.org/TR/webdriver/) , das viel weniger Funktionen hat als [devtools Protokoll](https://chromedevtools.github.io/devtools-protocol). So wie es nicht mit [geschlossenen Schatten-DOM](https://github.com/sukgu/shadow-automation-selenium/issues/7#issuecomment-563062460) umgehen kann. Keine Möglichkeit, Seiten als PDF zu speichern. Keine Unterstützung für Tools wie [Profiler](https://chromedevtools.github.io/devtools-protocol/tot/Profiler/) oder [Performance](https://chromedevtools.github.io/devtools-protocol/tot/Performance/), etc.

Schwieriger einzurichten und zu pflegen wegen zusätzlicher Abhängigkeiten wie einem Browsertreiber.

Obwohl Selen selbst für eine bessere Cross-Browser-Unterstützung verkauft wird, ist es in der Regel sehr schwierig, es für alle wichtigen Browser funktionieren zu lassen.

Es gibt viele Artikel über "selenium vs puppeteer", können Sie die Stäbe als Golang-Version von Puppeteer behandeln.

### Zypressen

[Cypress](https://www.cypress.io/) ist sehr begrenzt, für geschlossene Schatten oder domänenübergreifende iframes ist es fast unbrauchbar. Lesen Sie ihr [Limitierungsdoc](https://docs.cypress.io/guides/references/trade-offs.html) für weitere Details.

Wenn Sie mit uns zusammenarbeiten wollen, um eine Test-fokussierte Basis auf Rod zu schaffen, um die Begrenzung von Zypressen zu überwinden, kontaktieren Sie uns bitte.

## Was bedeutet Rod

Rod ist der Name des Kontrollgeräts für Puppetry, wie der braune Stock im Bild unten:

![rte](https://user-images.githubusercontent.com/1415488/80178856-31cd8880-863a-11ea-83e9-64f84be3282d.png ":size=200")

Die Bedeutung ist das Puppetier, der Browser ist das Puppet, wir verwenden die Stange um das Puppet zu kontrollieren.

[chromedp]: https://github.com/chromedp/chromedp
[puppeteer]: https://github.com/puppeteer/puppeteer
