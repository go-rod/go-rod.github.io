# Eigener Browserstart

## Mit einem laufenden Browser verbinden

You can use `launcher` lib to custom the launch of browsers, such as add or delete the browser executable command-line arguments, custom the auto-download-browser mirrors.

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --remote-debugging-port=9222
```

Es wird etwas wie folgt ausgeben:

```txt
DevTools lauscht auf ws://127.0.0.1:9222/devtools/browser/4dcf09f2-ba2b-463a-8ff5-90d27c6cc913
```

The `--` prefix is optional, such as `headless` and `--headless` are the same.

```go
package main

import (
    "github.com/go-rod/rod"

 )

func main() {
    u := "ws://127.0.0.1:9222/devtools/browser/4dcf09f2-ba2b-463a-8ff5-90d27c6cc913"
    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

## Die Launcher-lib

Da der obige Workflow so oft genutzt wird, abstrahieren wir eine `Launcher` lib, um das Starten von Browsern zu vereinfachen. So wie das automatische Herunterladen oder die Suche nach dem ausführbaren Browser, fügen oder löschen Sie die ausführbaren Kommandozeilenargumente des Browsers usw.

So wird der obige manuelle Start und Code folgendermaßen:

```go
func main() {
    u := launcher.New().Bin("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome").MustLaunch()
    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

Wir können die Hilfsfunktion `launcher.LookPath` verwenden, um den ausführbaren Pfad des Browsers zu erhalten, der obige Code ist derselbe wie:

```go
func main() {
    path, _ := launcher.LookPath()
    u := launcher.New().Bin(path).MustLaunch()
    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

Wenn `ControlURL` nicht gesetzt ist, wird die `MustConnect` automatisch `launcher.New().MustLaunch()` ausführen. Standardmäßig wird der Launcher automatisch einen statisch versionierten Browser herunterladen und verwenden, so dass das Verhalten des Browsers konsistent ist. So können Sie den obigen Code vereinfachen:

```go
func main() {
    rod.New().MustConnect().MustPage("https://example.com")
}
```

## Optionen hinzufügen oder entfernen

Sie können die `Set` und `Löschen` verwenden, um die Start-Argumente des Browsers zu ändern (Flags):

```go
package main

import (
    "github.com/go-rod/rod"
    "github.com/go-rod/rod/rod/lib/launcher"
)

func main() {
    u := launcher.New().
        Setzen ("Benutzerdaten-Verzeichnis", "Pfad").
        Setzen ("kopflos").
        Löschen("--headless").
        MustLaunch()

    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

If you want to control every step of the launch process, such as disable the auto-download and use the system's default browser, check the [example file](https://github.com/go-rod/rod/blob/master/lib/launcher/example_test.go).

Because options like `user-data-dir`, `proxy-server`, `headless` are so often used, we added some helpers for them, so the above code can become like this:

```go
func main() {
    u := launcher.New().
        UserDataDir("Pfad").
        Kopflos (wahr).
        Kopflos (falsch).
        MustLaunch()

    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

Hier sind die verfügbaren Flags: [Link](https://peter.sh/experiments/chromium-command-line-switches).

Lesen Sie das API Doc für weitere Infos: [Link](https://pkg.go.dev/github.com/go-rod/rod/lib/launcher#Launcher).

## Remote-Verwaltung des Launcher

Für das Produktionsscraping-System werden wir in der Regel die Scrapper und Browser in verschiedene Cluster unterteilen, so dass sie separat skalieren können. Rod stellt das Modul `launcher.Manager` zur Verfügung, um den Launcher aus der Ferne zu verwalten. Damit können wir aus der Ferne einen Browser mit benutzerdefinierten Start-Flags starten. Das zu verwendende Beispiel ist [hier](https://github.com/go-rod/rod/blob/master/lib/launcher/rod-manager/main.go).

Da es sehr schwierig ist, Chrom korrekt auf einigen Linux-Distributionen zu installieren, stellt Rod ein Docker-Image bereit, um es konsistente Cross-Plattformen zu machen. Hier ist ein Beispiel, um es zu verwenden:

1. Führe das Stange Bild `Docker ausführen -p 7317:7317 ghcr.io/go-rod/rod`

2. Open another terminal and run code like this [example](https://github.com/go-rod/rod/blob/master/lib/examples/remote-launch/main.go)

The image is [tuned](https://github.com/go-rod/rod/blob/master/lib/docker/Dockerfile) for screenshots and fonts among popular natural languages. Jeder Container kann mehrere Browser gleichzeitig starten.

## Benutzermodus :id=Benutzermodus

Wenn Sie sich in Ihr Github Konto einloggen und die Login-Sitzung für Automatisierungsaufgaben wiederverwenden möchten. Sie können den `launcher.NewUserMode` verwenden, um Ihren normalen Browser zu starten. Rod wird wie eine Browser-Erweiterung aussehen:

```go
wsURL := launcher.NewUserMode().MustLaunch()
Browser := rod.New().ControlURL(wsURL).MustConnect().NoDefaultDevice()
```

Hier ist ein detaillierteres Beispiel: [Code-Beispiel](https://github.com/go-rod/rod/blob/master/lib/examples/use-rod-like-chrome-extension/main.go).

## Low-Level-API

Wenn Sie jeden Schritt des Start-Prozesses steuern möchten, wie zum Beispiel den automatischen Download deaktivieren und den Standard-Browser des Systems verwenden möchten, Überprüfen Sie die [Beispieldatei](https://github.com/go-rod/rod/blob/master/lib/launcher/example_test.go).
