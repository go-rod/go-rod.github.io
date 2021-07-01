# Dlaczego pasek

Istnieje wiele wspaniałych projektów, ale nikt nie jest idealny, wybierz najlepszy projekt odpowiadający waszym potrzebom jest ważny.

## O masie liniowej nitki pojedynczej mniejszej niż 125 decyteksów (o numerze metrycznym przekraczającym 14, ale nieprzekraczającym 43)

### Chromedp

Teoretycznie, Rod powinien działać szybciej i zużywać mniej pamięci niż Chromedp.

[Chromedp][chromedp] domyślnie używa przeglądarki systemowej, może powodować problemy, jeśli przypadkowo zaktualizujesz przeglądarkę.

[Chromedp][chromedp] używa [stałego bufora](https://github.com/chromedp/chromedp/blob/b56cd66/target.go#L69-L73) dla wydarzeń, może spowodować zablokowanie dużej konwaluty. Ponieważ Chromedp używa pojedynczej pętli zdarzeń, powolne osoby obsługujące zdarzenia będą blokować się nawzajem. Róg nie ma tych problemów, ponieważ opiera się na [goob](https://github.com/ysmood/goob).

Chromedp usunie JSON każdą wiadomość z przeglądarki, rod jest dekodowany na żądanie, więc Rod działa lepiej, szczególnie w przypadku ciężkich zdarzeń sieciowych.

Chromedp używa trzeciej części biblioteki WebSocket która ma [1MB nadrzędnego](https://github.com/chromedp/chromedp/blob/b56cd66f9cebd6a1fa1283847bbf507409d48225/conn.go#L43-L54) dla każdego klienta cdp, jeśli chcesz kontrolować tysiące zdalnych przeglądarek, może to stać się problemem. Z powodu tego ograniczenia, jeśli ocenisz skrypt js większy niż 1MB, Chromedp ulegnie awarii, oto przykład jak łatwo możesz zawiesić Chromedp: [gist](https://gist.github.com/ysmood/0d5b2c878ecbdb598776af7d3d305b79).

Gdy wystąpi awaria, Chromedp opuści proces przeglądarki zombie na systemach Windows i Mac.

Rod jest bardziej konfigurowalny, na przykład możesz nawet zamienić zakładkę WebSocket na zakładkę, którą lubisz.

Dla bezpośredniego porównania kodów możesz sprawdzić [tutaj](https://github.com/go-rod/rod/tree/master/lib/examples/compare-chromedp). Jeśli porównasz przykład o nazwie `logika` między [rokiem](https://github.com/go-rod/rod/tree/master/lib/examples/compare-chromedp/logic/main.go) i [chromedp](https://github.com/chromedp/examples/blob/master/logic/main.go), Dowiedz się, jak prostszy jest słód.

W Chromedp musisz użyć ich dokładnych zadań podobnych do DSL, aby obsługiwać logikę kodu. Chromedp używa kilku opakowań do obsługi wykonania z kontekstem i opcjami, co sprawia, że bardzo trudno jest zrozumieć ich kod, gdy pojawiają się błędy. Bardzo używane interfejsy sprawiają, że statyczne typy stają się bezużyteczne podczas śledzenia problemów. Natomiast Rod używa jak najmniejszej liczby interfejsów.

Róg ma mniej zależności, prostszą strukturę kodu i lepszą automatyzację testów. Powinieneś znaleźć łatwiej dodać kod do Rod. Dlatego też w porównaniu z Chromedp Rod może w przyszłości mieć więcej ładnych funkcji ze strony społeczności.

Innym problemem Chromedp jest ich architektura opiera się na [ID węzła DOM](https://chromedevtools.github.io/devtools-protocol/tot/DOM/#type-NodeId), puppeteer i pręt opierają się na [ID obiektu zdalnego](https://chromedevtools.github.io/devtools-protocol/tot/Runtime/#type-RemoteObjectId). W rezultacie nie tylko [wolniejszy](https://github.com/puppeteer/puppeteer/issues/2936) i zapobiega dodawaniu przez Chromedp funkcji wysokiego poziomu, które są połączone z czasem pracy. Na przykład ten [bilet](https://github.com/chromedp/chromedp/issues/72) był otwarty przez 3 lata. Nawet po jego zamknięciu, nadal nie możesz ocenić js ekspresji elementu wewnątrz iframe. Ponadto Chromedp utrzymuje [kopię](https://github.com/chromedp/chromedp/blob/e2970556e3d05f3259c464faeed1ec0e862f0560/target.go#L375-L376) wszystkich węzłów w pamięci. Powoduje stan wyścigu pomiędzy lokalną listą NodeID a [DOM.documentUpdated](https://chromedevtools.github.io/devtools-protocol/tot/DOM/#event-documentUpdated), co może powodować mylące problemy takie jak [#762](https://github.com/chromedp/chromedp/issues/762).

### Kukiełka

[Puppeteer][puppeteer] zdekoduje JSON każdą wiadomość z przeglądarki, Rod jest dekoderem na żądanie, więc teoretycznie Rod będzie działał lepiej, szczególnie w przypadku ciężkich zdarzeń sieciowych.

Z puppeterem, musisz bardzo wiele poradzić sobie z obietnicą/async/czekać, sprawia, że elegancki [płynny interfejs](https://en.wikipedia.org/wiki/Fluent_interface) jest bardzo trudny. Testy końcowe wymagają wielu operacji synchronizacji w celu symulacji danych wejściowych ludzi, ponieważ Puppeteer opiera się na Nodejs wszystkie operacje IO są połączeniami asynchronicznymi, więc zazwyczaj ludzie kończą pisanie tony asyny/oczekiwania. Jeśli zapomnisz napisać `czekać`, debugowanie nieszczelnego Promise jest zwykle bolesne. Górny koszt rośnie, gdy twój projekt rośnie.

Rod jest domyślnie bezpieczny dla typu i ma lepsze wewnętrzne komentarze na temat tego, jak sam Rod działa. Ma powiązania typu dla wszystkich punktów końcowych w protokole Devtools.

Rod wyłączy zdarzenia domen gdy tylko to możliwe, puppeteer zawsze włączy wszystkie domeny. Będzie zużywać dużo zasobów podczas prowadzenia zdalnej przeglądarki.

Rod obsługuje odwołanie i limit czasu, może być krytyczny jeśli chcesz obsłużyć tysiące stron. For example, to simulate `click` we have to send serval cdp requests, with [Promise](https://stackoverflow.com/questions/29478751/cancel-a-vanilla-ecmascript-6-promise-chain) you can't achieve something like "only send half of the cdp requests", but with the [context](https://golang.org/pkg/context/) we can.

### Playwright

Rod and [Playwright](https://github.com/microsoft/playwright) zostały po raz pierwszy opublikowane prawie w tym samym czasie. Większość porównań pomiędzy Rod i Puppeteer pozostaje wierna Playwright, ponieważ zarówno Playwright jak i Puppeteer są utrzymywane przez prawie tych samych współautorów.

Jak stwierdzono w doku Playwright „Playwright umożliwia niezawodne kompleksowe testy dla nowoczesnych aplikacji internetowych”. Jednak nacisk na dorsza jest bardziej ogólny, zarówno w przypadku automatyzacji sieci, jak i złomowania, co sprawia, że projekt w większym stopniu koncentruje się na elastyczności i wydajności.

Jednym z celów architektonicznych Roda jest ułatwienie wszystkim udziału i uczynienie go czystym projektem społeczności. Jest to jeden wielki powód, dla którego wybrałem licencję Golang i MIT. Typescript jest ładnym wyborem, ale jeśli sprawdzisz wybór projektu Playwright, [`każdy`](https://www.typescriptlang.org/docs/handbook/basic-types.htmvl#any) i [typ unii](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html#union-types) są wszędzie, jeśli spróbujesz przejść do kodu źródłowego strony [. lick](https://playwright.dev/#version=v1.6.2&path=docs%2Fapi.md&q=pageclickselector-options), `d.ts` pliki pozwolą zrozumieć rzeczywistość pisma. Golang zdecydowanie nie jest wystarczająco dobry, ale zazwyczaj powoduje mniejsze zadłużenie technologiczne niż węzły. s typescript, jeśli chcesz, żebym wybrał, z którego można korzystać do QA lub Infra, kto nie zna kodowania w celu zautomatyzowania testu end-to-end lub monitorowania witryny, Chciałbym wybrać Golang.

Ich wysiłki na rzecz wsparcia dla różnych przeglądarek są fantastyczne. Jednak w dzisiejszych czasach HTML5 jest dobrze przyjęty przez główne marki, trudno powiedzieć, że złożoność, którą niesie ze sobą może mieć wpływ na korzyści. Czy w przyszłości przekrojowa przeglądarka [plches](https://github.com/microsoft/playwright/tree/master/browser_patches) stanie się ciężarem? Kolejnym problemem są kwestie bezpieczeństwa dla zmodyfikowanych przeglądarek. Sprawia to również, że testowanie starych wersji Firefoksa lub Safari jest trudne. Mam nadzieję, że to nie jest nadmierna inżynieria.

### Selenium

[Selenium](https://www.selenium.dev/) opiera się na [protokole sterownika sieciowego](https://www.w3.org/TR/webdriver/) , który ma znacznie mniejsze funkcje w porównaniu z [protokołem devtool](https://chromedevtools.github.io/devtools-protocol). Takie jak nie może obsłużyć [zamkniętego cienia DOM](https://github.com/sukgu/shadow-automation-selenium/issues/7#issuecomment-563062460). Nie można zapisać stron jako PDF. Brak wsparcia dla narzędzi takich jak [Profiler](https://chromedevtools.github.io/devtools-protocol/tot/Profiler/) lub [Wydajność](https://chromedevtools.github.io/devtools-protocol/tot/Performance/)itp.

Trudniej skonfigurować i utrzymać ze względu na dodatkowe zależności, takie jak sterownik przeglądarki.

Chociaż selenium sprzedaje się dla lepszej obsługi międzyprzeglądarki zazwyczaj bardzo trudno jest sprawić, by działał on dla wszystkich głównych przeglądarek.

Istnieje mnóstwo artykułów o "selenium vs puppeer", możesz traktować go jak wersję Golang Puppeteer.

### Cypresja

[Cypress](https://www.cypress.io/) jest bardzo ograniczony, w przypadku zamkniętego cienia domeny lub międzydomenowej iframes jest prawie nieużyteczny. Przeczytaj ich [ograniczenia](https://docs.cypress.io/guides/references/trade-offs.html) , aby uzyskać więcej informacji.

Jeśli chcecie współpracować z nami w celu stworzenia podstawy testowej ukierunkowanej na Rod w celu przezwyciężenia ograniczenia cyprasy, skontaktuj się z nami.

## Co znaczy Rod

Rod jest nazwą urządzenia sterującego dla puppety, takiego jak brązowy drążek na obrazku poniżej:

![do zw](https://user-images.githubusercontent.com/1415488/80178856-31cd8880-863a-11ea-83e9-64f84be3282d.png ":size=200")

Znaczenie polega na tym, że jesteśmy puppeterem, przeglądarka jest pupperem, używamy pręta do kontroli puppere'a.

[chromedp]: https://github.com/chromedp/chromedp
[puppeteer]: https://github.com/puppeteer/puppeteer
