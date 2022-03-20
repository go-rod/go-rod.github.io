# Selectori

Rod oferă o mulțime de metode pentru a obține elemente. Numele lor sunt prestabilite cu `Element` sau `Element`. Dacă folosești un IDE după ce tastezi `Element`, vei vedea toate selectoarele disponibile ca mai jos:

![selectori-ide-selectori](ide-selectors.png)

Dacă planezi cursorul peste metodă, vei vedea documentul acestuia ca mai jos:

![ide-doc](ide-doc.png)

De obicei, ai nevoie doar de cunoștințe de bază despre [CSS Selector](css-selector) pentru a realiza sarcina de automatizare pe care vrei să o faci. În restul documentației vom folosi CSS Selector doar pentru a obține elemente de pe pagină.

## După conținut text

Folosește `ElementR` pentru a se potrivi cu elemente cu conținut specific de text, cum ar fi selectarea intrărilor de căutare din captura de mai jos:

![text-potrivire](match-text.png)

```go
page.MustElementR("input", "Search or jump")
page.MustElementR("input", "/click/i") // utilizează steagul insensibil la majuscule "i"
```

Din moment ce folosim [js regex](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp), nu trebuie să potrivim întregul context de text. Textul care se potrivește este ceea ce vezi de fapt pe site, nu codul sursă, compară 1 și 2 din captura de ecran de mai jos. Poți folosi `copia` ajutor în Devtools pentru a copia textul în clipboard (uită-te la 4):

![copiază-text](copy-text.png)

## Cu XPath

Selectorul CSS este modul recomandat de selectare a elementelor, cum ar fi faptul că nu puteți folosi XPath pentru a selecta [text redat](https://stackoverflow.com/questions/51992258/xpath-to-find-pseudo-element-after-in-side-a-div-element-with-out-any-content/51993454). Dar câteodată XPath poate fi un interlocutor pentru programatorii care vin din alte limbi. Folosiți `ElementX` pentru XPath:

```go
page.MustElementX("//h2")
```

## După Javascript

Dacă aveţi o interogare complexă sau doriţi să utilizaţi un motor de interogare la nivel înalt, cum ar fi [jQuery](https://jquery.com/):

```go
page.MustElementByJS(`() => jQuery('option:selected')[0]`)
```

De fapt, dacă verifici codul sursă al altor selectori, cum ar fi `Element` sau `ElementR`, toate sunt bazate pe `ElementByJS`, și `ElementByJS` se bazează pe pagina `. evaluați`, pentru mai multe detalii despre cum să evaluați j, verificați [Javascript Runtime](/javascript-runtime.md). De obicei, folosești `ElementByJS` pentru a-ți crea propriul selector pentru a extinde Dumnezeu.

## Selectaţi lista de elemente

Numele metodelor de a obține mai multe elemente sunt prefixate cu `MustElements` sau `Elemente`. O diferență de taste între un singur selector și un multi-selector este unicul selector va aștepta ca elementul să apară. Dacă un multi-selector nu găsește nimic, va returna imediat o listă goală.

## Arborele elementelor transversale

Există, de asemenea, câteva selectori utile pentru a selecta elemente în interiorul sau în jurul unui element, ca `MustParent`, `MustNext`, `Mustanterior`, etc.

Iată un exemplu despre cum folosim diferite selectori pentru a prelua conținutul dintr-o pagină:

```go
// Pe pagina minunată, găsind secţiunea sectă specificată,
// şi preluând proiectele asociate din pagină.
func main() {
    pagina := rod.New().MustConnect().MustPage("https://github.com/avelino/awesome-go")

    secţiunea := page.MustElementR("p", "Seleniu şi instrumente de control ale browser-ului"). ustNext()

    // obține elementele de copii ale unui element
    proiecte := secțiune. ustElements("li")

    pentru _, proiect := range projects {
        link := project. jurnalul ustElement("a")
        . rintf(
            "project %s (%s): '%s'", Link-ul
            . ustText(), link
            . ustProperty("href"),
            proiect. ustText(),
        )
    }
}
```

## Obțineți elemente de la iframes

De exemplu, vrem să obținem butonul de la iframe-urile imbricate:

![iframe-uri](iframes.png)

Codul va arăta în felul următor:

```go
frame01 := page.MustElement("iframe").MustFrame()
iframe02 := iframe01.MustElement("iframe").MustFrame()
frame02.MustElement("button")
```

## Căutare elemente

Există un alt ajutor puternic pentru a obține elemente, `MustSearch`. Este mai puțin precis decât selectorii menționați mai sus, dar este la îndemână dacă doriți să obțineți elemente din iframe-uri adânci sau din boabe umbră.

Funcționalitatea este identică cu [Căutarea dispozitivelor pentru nodurile](https://developers.google.com/web/tools/chrome-devtools/dom#search), o poți folosi pentru a afla ce cuvânt cheie să folosești pentru a selecta elementul pe care îl dorești, ca screenshot de mai jos:

![căutare](search.png)

Pentru a obține același element din [Obține elemente de pe iframes](#get-elements-from-iframes), putem pur și simplu programa astfel:

```go
page.MustSearch("buton")
```

## Selectoare cursă

Ploaie încurajează automatizarea fără somn pentru a reduce flăcările. Când o acţiune are mai multe rezultate, nu folosim somnul pentru a aştepta ca pagina să redirecţioneze sau să se aşeze. De exemplu, atunci când conectăm o pagină, parola poate incorectă, vrem să ne ocupăm separat de succes și de eșec. Ar trebui să evităm codul ca mai jos:

```go
func main() {
    pagina := rod.New().MustConnect().MustPage("https://leetcode.com/accounts/login/")

    page.MustElement("#id_login").MustInput("username")
    page.MustElement("#id_password").MustInput("password").MustPress(input.Enter)

    time.Sleep(10 * time.Secunda)// Evitați utilizarea timpului.Sleep!

    if page.MustHas(". av-user-icon-base") {
        // imprimați numele de utilizator după autentificare cu succes
        fmt. rintln(*el.MustAttribute("title")) altfel de pagină.
    } ustHas("[data-cy=sign-in-error]") {
        // atunci când numele de utilizator sau parola greșită
        fmt. rintln(el.MustText())
    }
}
```

În schimb, ar trebui să programăm astfel:

```go
func main() {
    pagina := rod.New().MustConnect().MustPage("https://leetcode.com/accounts/login/")

    page.MustElement("#id_login").MustInput("username")
    pagină. ustElement("#id_password").MustInput("password").MustPress(input.Enter)

    // Va continua sondarea până când un selector va găsi un selector
    page.Race().Element(". av-user-icon-base").MustHandle(func(e *rod. lement) {
        // imprimați numele de utilizator după autentificarea cu succes
        fmt. rintln(*e.MustAttribute("titlu"))
    }). lement("[data-cy=sign-in-error]").MustHandle(func(e *rod. lement) {
        // atunci când numele de utilizator sau parola greșită este panică
        (e. ustText())
    }).MustDo()
}
```
