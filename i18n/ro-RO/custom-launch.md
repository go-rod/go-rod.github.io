# Lansare browser personalizată

## Conectează-te la un browser care rulează

Găsiți calea executabilă a browser-ului dvs., cum ar fi la pornirea macOS:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --remote-debuging-port=9222
```

Acesta va produce ceva de genul:

```txt
DevTools ascultand pe ws://127.0.1:9222/devtools/browser/4dcf09f2-ba2b-463a-8ff5-90d27c6c913
```

Cea de mai sus `ws://127.0.1:9222/devtools/browser/4dccf09f2-ba2b-463a-8ff5-90d27c6c913` este interfața pentru a controla browser-ul:

```go
pachet principal

import (
    "github.com/go-rod/rod"
)

func main() {
    u := "ws://127.0.0.1:9222/devtools/browser/4dcf09f2-ba2b-463a-8ff5-90d27c6cc913"
    rod.New().ControlURL(u).MustConnect().MustPage("https://exemplu)
}
```

## Agenda de lansare

Deoarece fluxul de lucru de mai sus este atât de des utilizat, abstractizăm un lib `launcher` pentru a simplifica lansarea browserelor. Cum ar fi să descarci automat sau să cauți browser-ul executabil, adaugă sau șterge argumentele executabile ale browser-ului, etc.

Așadar, lansarea manuală și codul de mai sus devine:

```go
func main() {
    u := launcher.New().Bin("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome").MustLaunch()
    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

Putem folosi funcţia de ajutor `launcher.LookPath` pentru a obţine calea executabilă a browser-ului, codul de mai sus este acelaşi ca:

```go
func main() {
    calea, _ := launcher.LookPath()
    u := launcher.New().Bin(path).MustLaunch()
    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

Dacă `ControlURL` nu este setat, `MustConnect` va rula `launcher.New().MustLaunch()` automat. În mod implicit, lansatorul va descărca automat și va utiliza un browser cu versiuni statice, astfel încât navigatorul să fie consecvent. Așa că poți simplifica codul de mai sus în:

```go
func main() {
    rod.New().MustConnect().MustPage("https://example.com")
}
```

## Adaugă sau șterge opțiuni

Puteți utiliza `Setați` și `Ștergeți` pentru a modifica argumentele lansării browser-ului (steaguri):

```go
pachet principal

import (
    "github.com/go-rod/rod"
    "github.com/go-rod/rod/lib/launcher"
)

func main() {
    u := launcher.New().
        Setare ("user-data-dir", "path").
        Setare („căști”).
        Ștergere("--căști").
        MustLaunch()

    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

După cum puteţi vedea de deasupra `--` prefixul este opţional, cum ar fi `headless` şi `--headless` sunt aceleaşi.

Deoarece opțiuni precum `user-data-dir`, `proxy-server`, `Healess` sunt atât de des utilizate, am adăugat niște ajutoare pentru ei, astfel încât codul de mai sus să devină în felul următor:

```go
func main() {
    u := launcher.New().
        UserDataDir("cale").
        Cefalee (adevărat).
        Cefalee (false).
        MustLaunch()

    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

Aici sunt steagurile disponibile: [link-ul](https://peter.sh/experiments/chromium-command-line-switches).

Citește documentul API pentru mai multe informații: [link-ul](https://pkg.go.dev/github.com/go-rod/rod/lib/launcher#Launcher).

## Gestionați la distanță lansatorul

Pentru sistemul de dezmembrare a producției, de obicei, vom separa browserele în diferite clustere, astfel încât să se poată dimensiona separat. Rod furnizează modulul `launcher.Manager` pentru a administra launcherul de la distanță. Cu el putem lansa de la distanță un browser cu stegulețe de lansare personalizate. Exemplul pentru a-l folosi este [aici](https://github.com/go-rod/rod/blob/master/lib/launcher/rod-manager/main.go).

Pentru că este foarte greu să instalezi chromium corect pe niște distribuții linux, Rod oferă o imagine de docker pentru a o face să fie consecventă platforme încrucișate. Iată un exemplu pentru a-l folosi:

1. Rulează imaginea tijă `docker run -p 7317:7317 ghcr.io/go-rod/rod`

2. Deschide un alt terminal și rulează cod ca exemplul acestă [](https://github.com/go-rod/rod/blob/master/lib/examples/launch-managed/main.go)

Imaginea este [aproximată](https://github.com/go-rod/rod/blob/master/lib/docker/Dockerfile) pentru capturi de ecran şi fonturi din limbile naturale populare. Fiecare container poate lansa mai multe browsere în același timp.

## Mod utilizator :id=mod utilizator

Când te autentifici în contul tău github și vrei să refolosești sesiunea de conectare pentru sarcina automată. Puteţi utiliza `launcher.NewUserMode` pentru a lansa browser-ul de utilizator obişnuit. Rodul va fi exact ca o extensie a browserului:

```go
wsURL := launcher.NewUserMode().MustLaunch()
browser := rod.New().ControlURL(wsURL).MustConnect().NoDefaultDevice()
```

Iată un exemplu mai detaliat: [exemplul de cod](https://github.com/go-rod/rod/blob/master/lib/examples/use-rod-like-chrome-extension/main.go).

## API de nivel scăzut

Dacă doriţi să controlaţi fiecare pas al procesului de lansare, cum ar fi dezactivarea descărcării automate şi utilizarea browser-ului implicit al sistemului, verifică [fișierul exemplu](https://github.com/go-rod/rod/blob/master/lib/launcher/example_test.go).
