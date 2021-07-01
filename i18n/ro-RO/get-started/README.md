# Începeți cu Dumnezeu

## Cerințe

[Golang](https://golang.org/) este singura cerinţă, nici măcar nu trebuie să ştii nimic despre HTML.

Dacă nu ai folosit niciodată Golang, [instalează-l](https://golang.org/doc/install) și îl poți stăpâni în ore: [Un tur de tip Go](https://tour.golang.org/welcome).

## Primul program

Hai să folosim Rod pentru a deschide o pagină și să facem o captură de ecran, mai întâi, creați un fișier "main.go" cu conținutul de mai jos:

```go
pachetul principal

import "github.com/go-rod/rod"

func main() {
    pagina := rod.New().MustConnect().MustPage("https://www.wikipedia.org/")
    page.MustWaitLoad().MustScreenshot("a.png")
}
```

`rod.New` creează un obiect browser, `MustConnect` lansează și se conectează la un browser. `MustPage` creează un obiect de pagină, este ca o filă de pagină în browser. `MustWaitLoad` așteaptă ca pagina să fie complet încărcată. `MustScreenshot` face o captură de ecran a paginii.

Creeaza un modul:

```bash
mergi rov -w GOPROXY=https://goproxy.io,direct
mergi mod init learn-rod
mergi cu mod tidy
```

Rulează modulul:

```bash
mergi să fugi .
```

Programul va afișa o captură de ecran "a.png" ca cea de mai jos:

![primul program](first-program.png)

## Vezi ce se află sub cucerire

Pentru dezvoltatori de rang superior, puteţi sări peste toate şi citi acest fişier: [link-ul](https://github.com/go-rod/rod/blob/master/examples_test.go).

În mod implicit, Rod va dezactiva interfața browser-ului pentru a maximiza performanța. Dar atunci când dezvoltăm o sarcină de automatizare ne pasă mai mult de uşurinţa depanării. Rod oferă o mulțime de soluții pentru a vă ajuta să depanați codul.

Hai să creăm un fișier de configurare ".rod" în actualul director de lucru. Conținutul este:

```txt
arată
```

Înseamnă "arată interfața browser-ului pe prim-plan". Înainte de a rula modulul din nou, haideți să adăugăm `time.Sleep(timpul. our)` până la sfârșit codul astfel încât să nu fie prea rapid pentru ca ochii noștri să îl prindă, codul "principal". o” devine acum:

```go
pachetul principal

import (
    "time"

    "github.com/go-rod/rod"
)

func main() {
    page := rod.New().MustConnect().MustPage("https://www.wikipedia.org/")
    page.MustWaitLoad().MustScreenshot("a.png")
    time.Sleep(time.Hour)
}
```

Dacă rulați din nou modulul, ar trebui să vedeți un browser ca acesta:

![arată](show.png)

Apăsați [CTRL + C](https://en.wikipedia.org/wiki/Control-C) de pe tastatură pentru a opri programul.

## Introduceți și apăsați pe

Hai să automatizăm site-ul pentru a căuta cuvântul cheie "Pământ". Un site web poate avea mai multe câmpuri sau butoane, trebuie să spunem programului pe care să îl manipulăm. De obicei, folosim [Devtools](https://developers.google.com/web/tools/chrome-devtools/) pentru a ne ajuta să localizăm elementul pe care vrem să-l controlăm. haideți să adăugăm o configurație nouă la fișierul ".rod" pentru a activa instrumentele, acum devine:

```txt
show
devtools
```

Rulează "principalul". o" din nou, mutați mouse-ul în câmpul de intrare și faceți clic dreapta deasupra lui, veți vedea meniul contextual, apoi faceți clic pe "inspectare":

![inspectează](inspect.png)

Ar trebui să vezi `<input id="searchInput` ca mai jos:

![input](input.png)

Faceţi clic dreapta pentru a copia [selectorul css](css-selector.md) ca imaginea de mai sus. Continutul de pe clipboard-ul tau va fi "#searchInput". Îl vom folosi pentru a localiza elementul pentru a introduce cuvântul cheie. Acum „main.go” devine:

```go
import main

(
    "time"

    "github. om/go-rod/rod"
)

func main() {
    page := rod.New().MustConnect().MustPage("https://www.wikipedia. rg/").MustWindowFullscreen()

    page.MustElement("#searchInput").MustInput("earth")

    page.MustWaitLoad().MustScreenshot("a.png")
    time.Sleep(time.Hour)
}
```

Ecranul `MustWindowFullscreen` redimensionează fereastra browser-ului pentru a facilita depanarea. Folosim `MustElement` și selectorul pe care l-am copiat din panoul Devtools pentru a obține elementul pe care dorim să-l manipulăm. `MustElement` va aștepta automat până când elementul apare, astfel încât nu trebuie să folosim `MustWaitLoad` înainte de acesta. Apoi numim `MustInput` pentru a introduce cuvântul cheie "Pământ" în el. Dacă reexecutați "main.go", ar trebui să vedeți rezultatul arată mai jos:

![post-intrare](after-input.png)

Similar cu câmpul de intrare să facem clic dreapta pe butonul căutare pentru a copia selectorul acestuia:

![Tn de căutare](search-btn.png)

![selector-de-căutare](search-btn-selector.png)

Apoi adaugă cod pentru a apăsa butonul de căutare, acum "main.go" arată astfel:

```go
principal

import "github.com/go-rod/rod"

func main() {
    pagina := rod.New().MustConnect().MustPage("https://www.wikipedia.org/").MustWindowFullscreen()

    page.MustElement("#searchInput").MustInput"
    page.MustElement("#search-form > buton > button").MustClick()

    page.MustitLoad().MustScreenshot(".n.

```

Daca reexecutam modulul, "a.png" va afisa rezultatul cautarii:

![pagină terestră](earth-page.png)

## Mișcare lentă și urmărire vizuală

Operațiunile automatizate sunt prea rapide pentru ca ochii umani să prindă, pentru a le depana, de obicei activăm mişcările lente şi configurările vizuale, hai să actualizăm ". Fişier od:

```txt
arată traseul
lent=1s

```

Apoi ruleaza modulul, acum fiecare actiune va astepta 1 secunda inainte de executia. Pe pagină, vei vedea urmele de depanare generate de Steem mai jos:

![urme](trace.png)

După cum puteți vedea în butonul de căutare, Id va crea un cursor pentru mouse-ul mock.

Pe consolă vei vedea jurnalul urmelor de mai jos:

```txt
[rod] 2020/11/11 11:11:11 [eval] {"js":"rod.element","params":["#searchInput"]}
[rod] 2020/11/11 11:11:11 [eval] {"js":"rod. opsițiune”, this":"input#searchInput"}
[rod] 2020/11/11 11:11:11 [input] scroll in view
[rod] 2020/11/11 11:11:11 [input] input earth
[rod] 2020/11/11 11:11:11 [eval] {"js":"rod. lement","params":["#search-form > fieldset > button"]}
[rod] 2020/11/11 11:11:11 [eval] {"js":"rod.visible","this":"button.pure-button. derulare ure-button-primar-progresive"}
[rod] 2020/11/11 11:11:11 [input] în vedere
[rod] 2020/11/11 11:11:11 [input] click stânga
```

## Altul decât fișierul ".rod"

”. 'od' este doar o scurtătură pentru unele API utilizate în mod obișnuit, le puteți seta manual în cod, precum "lent", codul care îl setează este ca `tijă. ew().SlowMotion(2 * time.Secundă)`. Poți folosi, de asemenea, o variabilă de mediu pentru a o seta, cum ar fi pe Mac sau Linux: `rod=show go main.go`.

## Obține conținut text

Ploile oferă o mulţime de metode utile pentru a prelua conţinutul de pe pagină.

Să încercăm să obținem descrierea Pământului, să folosim aceeași tehnică pe care am folosit-o anterior pentru a copia selectorul de pe Dispozitive:

![citește-text](get-text.png)

Metoda pe care o folosim este `MustText`, iată codul complet al acestuia:

```go
import principal

(
    "fmt"

    "github. om/go-rod/rod
)

func main() {
    page := rod. ew().MustConnect().MustPage("https://www.wikipedia.org/")

    page.MustElement("#searchInput"). ustInput("Pământ")
    page.MustElement("#search-formular > buton > ").MustClick()

    el := page. ustElement("#mw-content-text > div.mw-parser-output > p:nth-child(6)")
    fmt.Println(el.MustText())
}
```

Dacă rerulăm modulul, ar trebui să vedem consola ieșind ceva de genul:

```txt
Pământul este a treia planetă din Soare şi singurul obiect astronomic cunoscut ca adăpostind viaţă.
...
```

## Obține conținutul imaginii

La fel ca textul, putem obține și imagini de pe pagină, hai să obținem selectorul imaginii Pământului și să folosim `MustResource` pentru a obține binarul imaginii:

![get-image](get-image.png)

Codul complet este:

```go
import main

(
    "github.com/go-rod/rod"
    "github. om/go-rod/rod/lib/utils
)

func main() {
    page := rod. ew().MustConnect().MustPage("https://www.wikipedia.org/")

    page.MustElement("#searchInput").MustInput("earth")
    . ustElement("#search-form > fieldset > button").MustClick()

    el := page.MustElement("#mw-content-text > div.mw-parser-output > tabel. poșetă > tbody > tr:nth-child(1) > td > a > img")
    _ = utilitare. utputFile("b.png", el.MustResource())
}
```

Fișierul de ieșire "b.png" trebuie să fie:

![Pământ](earth.png)
