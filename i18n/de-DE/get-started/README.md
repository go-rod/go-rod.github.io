# Erste Schritte mit Stab

## Anforderungen

[Golang](https://golang.org/) ist die einzige Voraussetzung, Sie müssen nicht einmal etwas über HTML wissen.

Wenn du Golang noch nie benutzt hast, installiere [es](https://golang.org/doc/install) und du kannst es in Stunden beherrschen: [Eine Tour durch Go](https://tour.golang.org/welcome).

## Erstes Programm

Lass uns Rod benutzen, um eine Seite zu öffnen und einen Screenshot davon zu machen, erstelle zuerst eine "main.go" Datei mit dem folgenden Inhalt:

```go
package main

import "github.com/go-rod/rod"

func main() {
    page := rod.New().MustConnect().MustPage("https://www.wikipedia.org/")
    page.MustWaitLoad().MustScreenshot("a.png")
}
```

Das `Rage.Neu` erstellt ein Browserobjekt, das `MustConnect` startet und verbindet sich mit einem Browser. Die `MustPage` erstellt ein Seitenobjekt, es ist wie ein Seiten-Tab im Browser. Der `MustWaitLoad` wartet auf die Seite ist vollständig geladen. Der `MustScreenshot` macht einen Screenshot der Seite.

Modul erstellen:

```bash
go env -w GOPROXY=https://goproxy.io,direct
go mod init learn-rod
go mod tidy
```

Modul ausführen:

```bash
gehen Sie .
```

Das Programm wird einen Screenshot "a.png" ausgeben, wie der untenstehend:

![erstes Programm](first-program.png)

## Sieh was unter der Haube ist

Für ältere Entwickler können Sie alle überspringen und diese Datei lesen: [Link](https://github.com/go-rod/rod/blob/master/examples_test.go).

Standardmäßig wird Rod das Browser-UI deaktivieren, um die Leistung zu maximieren. Aber bei der Entwicklung einer Automatisierungsaufgabe kümmern wir uns in der Regel mehr um die Leichtigkeit des Debuggens. Rod bietet eine Menge von Lösungen, die Ihnen helfen, den Code zu debuggen.

Erstellen wir eine ".rod" Konfigurationsdatei unter dem aktuellen Arbeitsverzeichnis. Der Inhalt ist:

```txt
zeigen
```

Es bedeutet "das Browser-Interface im Vordergrund anzeigen". Bevor wir das Modul erneut ausführen, lassen Sie uns `mal anhängen. Sleep(Zeit. unser)` bis zum Ende des Codes, so dass es für unsere Augen nicht zu schnell ist, um ihn zu fangen Code von "main. o" wird jetzt:

```go
package main

import (
    "time"

    "github.com/go-rod/rod"
)

func main() {
    page := rod.New().MustConnect().MustPage("https://www.wikipedia.org/")
    page.MustWaitLoad().MustScreenshot("a.png")
    time.Sleep(time.Stour)
}
```

Wenn Sie das Modul erneut ausführen, sollten Sie einen Browser wie folgt sehen:

![zeigen](show.png)

Drücken Sie [STRG + C](https://en.wikipedia.org/wiki/Control-C) auf der Tastatur, um das Programm zu stoppen.

## Eingabe und Klicken

Lassen Sie uns die Website automatisieren, um das Stichwort "Erde" zu suchen. Eine Website kann viele Eingabefelder oder Schaltflächen haben, wir müssen dem Programm mitteilen, welche zu manipulieren sind. Normalerweise verwenden wir [Devtools](https://developers.google.com/web/tools/chrome-devtools/) um uns dabei zu helfen, das Element zu finden, das wir steuern möchten. lasst uns eine neue Konfiguration an die ".rod" Datei anhängen, um die Devtools zu aktivieren, jetzt wird es:

```txt
show
devtools
```

Starte das "main. o" erneut bewegen Sie Ihre Maus in das Eingabefeld und klicken mit der rechten Maustaste darüber. Sie sehen das Kontextmenü, dann klicken Sie auf die "Perspektive":

![überprüfen](inspect.png)

Sie sollten den `<input id="searchInput` wie unten sehen:

![input](input.png)

Rechtsklick, um den [css Selektor](css-selector.md) wie das Bild oben zu kopieren. Der Inhalt in Ihrer Zwischenablage wird "#searchInput" sein. Wir werden es verwenden, um das Element zu finden, um das Schlüsselwort einzugeben. Jetzt wird das "main.go" bekommen:

```go
package main

import (
    "time"

    "github. om/go-rod/rod"
)

func main() {
    page := rod.New().MustConnect().MustPage("https://www.wikipedia. rg/").MustWindowFullscreen()

    page.MustElement("#searchInput").MustInput("earth")

    page.MustWaitLoad().MustScreenshot("a.png")
    time.Sleep(time.Stour)
}
```

Der `MustWindowFullscreen` vergrößert die Größe des Browserfensters, um das Debuggen zu vereinfachen. We use `MustElement` and the selector we copied from the Devtools panel to get the element we want to manipulate. Das `MustElement` wird automatisch warten, bis das Element erscheint, also müssen wir vor dem Element `MustWaitLoad` nicht verwenden. Dann rufen wir den `MustInput` auf, um das Schlüsselwort "Erde" in ihn einzugeben. Wenn Sie die "main.go" erneut starten, sollten Sie das Ergebnis wie unten sehen:

![nach-Eingabe](after-input.png)

Ähnlich wie im Eingabefeld klicken wir mit der rechten Maustaste auf die Suche um den Selektor zu kopieren:

![such-btn](search-btn.png)

![search-btn-selector](search-btn-selector.png)

Füge dann Code hinzu, um auf den Such-Button zu klicken, jetzt sieht die "main.go" wie folgt aus:

```go
package main

import "github.com/go-rod/rod"

func main() {
    page := rod.New().MustConnect().MustPage("https://www.wikipedia.org/").MustWindowFullscreen()

    page.MustElement("#searchInput").MustInput("earth")
    page.MustElement("#search-form > fieldset > button").MustClick()

    page.MustWaitLoad().MustScreenshot("a.png")
 } }
```

Wenn wir das Modul neu starten, zeigt das "a.png" das Suchergebnis:

![Erdseite](earth-page.png)

## Langsame Bewegung und visuelle Spur

Die automatisierten Operationen sind zu schnell für menschliche Augen zum Fangen um sie zu debuggen, aktivieren wir in der Regel die langsam-Bewegung und visuelle Trace-Konfigurationen, lassen Sie uns das " aktualisieren. od" Datei:

```txt
zeige
langsam=1s
Trace
```

Dann starten Sie das Modul neu, jetzt wartet jede Aktion für 1 Sekunde, bevor seine Ausführung ausführt. Auf der Seite sehen Sie den Debug-Trace generiert von Rod wie unten:

![spur](trace.png)

Wie Sie auf der Suchschaltfläche sehen können, erstellt Rod einen Mauszeiger.

Auf der Konsole siehst du das Track-Log wie unten:

```txt
[rod] 2020/11/11 11:11:11 [eval] {"js":"rod.element","params":["#searchInput"]}
[rod] 2020/11/11 11:11:11 [eval] {"js":"rod. isible", this":"input#searchInput"}
[rod] 2020/11/11 11:11:11 [input] scrollen in die Ansicht
[rod] 2020/11/11 11:11:11 [input] Eingabewelt
[rod] 2020/11/11 11:11:11 [eval] {"js":"rod. lement","params":["#search-form > fieldset > button"]}
[rod] 2020/11/11 11:11:11 [eval] {"js":"rod.visible","this":"button.pure-button. ure-button-primary-progressive"}
[rod] 20/11/11 11:11:11 [input] scrollen in die Ansicht
[rod] 2020/11/11 11:11:11 [input] Linksklick
```

## Andere als die ".rod" Datei

Die ". od" Datei ist nur ein Shortcut für einige häufig verwendete API, Sie können sie auch manuell im Code setzen wie zum Beispiel die "langsame", der Code, den er setzen soll, ist wie `Stange. ew().SlowMotion(2 * time.second)`. Du kannst sie auch mit einer Umgebungsvariable einstellen, wie zum Beispiel auf Mac oder Linux: `rod=show go main.go`.

## Textinhalt abrufen

Rod bietet viele praktische Methoden, um den Inhalt von der Seite abzurufen.

Lass uns versuchen, die Beschreibung der Erde zu erhalten, verwende die gleiche Technik, mit der wir zuvor den Selektor aus den Devtools kopierten:

![get-text](get-text.png)

Die von uns verwendete Methode ist `MustText`, hier ist der vollständige Code:

```go
package main

import (
    "fmt"

    "github. om/go-rod/rod"
)

func main() {
    page := rod. ew().MustConnect().MustPage("https://www.wikipedia.org/")

    page.MustElement("#searchInput"). ustInput("earth")
    page.MustElement("#search-form > fieldset > button").MustClick()

    el := page. ustElement("#mw-content-text > div.mw-parser-output > p:nth-child(6)")
    fmt.Println(el.MustText())
}
```

Wenn wir das Modul neu starten, sollten wir die Konsolenausgabe so etwas wie folgt sehen:

```txt
Die Erde ist der dritte Planet von der Sonne und das einzige astronomische Objekt, das bekannt ist, um Leben zu beherbergen.
...
```

## Bildinhalt abrufen

So wie Text erhalten, können wir auch Bilder von der Seite erhalten lasst uns den Selektor des Erdbildes holen und `MustResource` verwenden, um die Binärdatei des Bildes zu erhalten:

![get-image](get-image.png)

Der vollständige Code ist:

```go
package main

import (
    "github.com/go-rod/rod"
    "github. om/go-rod/rod/lib/utils"
)

func main() {
    page := rod. ew().MustConnect().MustPage("https://www.wikipedia.org/")

    page.MustElement("#searchInput").MustInput("earth")
    page. ustElement("#search-form > fieldset > button").MustClick()

    el := page.MustElement("#mw-content-text > div.mw-parser-Ausgabe > Tabelle. nfobox > tbody > tr:nth-child(1) > td > a > img")
    _ = utils. utputFile("b.png", el.MustResource())
}
```

Die Ausgabedatei "b.png" sollte sein:

![Erde](earth.png)
