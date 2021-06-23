# Avvio Browser Personalizzato

## Connetti a un browser in esecuzione

Trova il percorso eseguibile del tuo browser, ad esempio durante l'esecuzione di macOS:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --remote-debugging-port=9222
```

Verrà prodotto qualcosa come:

```txt
DevTools in ascolto su ws://127.0.0.1:9222/devtools/browser/4dcf09f2-ba2b-463a-8ff5-90d27c6cc913
```

Quanto sopra `ws://127.0.0.1:9222/devtools/browser/4dcf09f2-ba2b-463a-8ff5-90d27c6cc913` è l'interfaccia per controllare il browser:

```go
package main

import (
    "github.com/go-rod/rod"
)

func main() {
    u := "ws://127.0.1:9222/devtools/browser/4dcf09f2-ba2b-463a-8ff5-90d27c6cc913"
    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

## La lib del launcher

Poiché il flusso di lavoro di cui sopra è così spesso utilizzato, astraiamo un lib `launcher` per semplificare il lancio dei browser. Ad esempio scaricare o cercare automaticamente l'eseguibile del browser, aggiungere o eliminare gli argomenti eseguibili della riga di comando del browser, ecc.

Quindi il lancio e il codice manuali di cui sopra diventano:

```go
func main() {
    u := launcher.New().Bin("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome").MustLaunch()
    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

Possiamo usare la funzione helper `launcher.LookPath` per ottenere il percorso eseguibile del browser, il codice di cui sopra è lo stesso:

```go
func main() {
    path, _ := launcher.LookPath()
    u := launcher.New().Bin(path).MustLaunch()
    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

Se `ControlURL` non è impostato, il `MustConnect` eseguirà `launcher.New().MustLaunch()` automaticamente. Per impostazione predefinita, il launcher scaricherà automaticamente e utilizzerà un browser con versione statica in modo che il comportamento del browser sia coerente. Così è possibile semplificare il codice di cui sopra:

```go
func main() {
    rod.New().MustConnect().MustPage("https://example.com")
}
```

## Aggiungi o rimuovi opzioni

È possibile utilizzare il `Set` e `Delete` per modificare gli argomenti di avvio del browser (flag):

```go
package main

import (
    "github.com/go-rod/rod"
    "github.com/go-rod/rod/lib/launcher"
)

func main() {
    u := launcher.New().
        Set("user-data-dir", "path").
        Set("headless").
        Elimina("--headless").
        MustLaunch()

    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

Come puoi vedere dall'alto il prefisso `--` è opzionale, come `headless` e `--headless` sono gli stessi.

Perché opzioni come `user-data-dir`, `proxy-server`, `headless` sono così spesso utilizzati, abbiamo aggiunto alcuni aiutanti per loro, in modo che il codice sopra può diventare così:

```go
func main() {
    u := launcher.New().
        UserDataDir("path").
        Headless(true).
        Intestazione (falso).
        MustLaunch()

    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

Ecco le bandiere disponibili: [link](https://peter.sh/experiments/chromium-command-line-switches).

Leggi il documento API per maggiori informazioni: [link](https://pkg.go.dev/github.com/go-rod/rod/lib/launcher#Launcher).

## Gestisci in remoto il launcher

Per il sistema di raschiatura di produzione, di solito, separeremo i raschiatori e browser in diversi cluster in modo che possano scalare separatamente. Rod fornisce il modulo `launcher.Manager` per gestire il launcher da remoto. Con esso possiamo lanciare da remoto un browser con bandiere di lancio personalizzate. L'esempio da usare è [qui](https://github.com/go-rod/rod/blob/master/lib/launcher/rod-manager/main.go).

Poiché è molto difficile installare correttamente il cromo su alcune distribuzioni linux, Rod fornisce un'immagine docker per renderlo coerente le piattaforme trasversali. Ecco un esempio per usarlo:

1. Esegui l'immagine dell'asta `docker run -p 7317:7317 ghcr.io/go-rod/rod`

2. Apri un altro terminale ed esegui il codice come questo [esempio](https://github.com/go-rod/rod/blob/master/lib/examples/launch-managed/main.go)

L'immagine è [sintonizzata](https://github.com/go-rod/rod/blob/master/lib/docker/Dockerfile) per screenshot e caratteri tra i linguaggi naturali popolari. Ogni contenitore può lanciare più browser allo stesso tempo.

## Modalità utente :id=user-mode

Quando si accede al tuo account github, e si desidera riutilizzare la sessione di login per l'attività di automazione. È possibile utilizzare il `launcher.NewUserMode` per avviare il browser utente normale. Rod sarà proprio come un'estensione del browser:

```go
wsURL := launcher.NewUserMode().MustLaunch()
browser := rod.New().ControlURL(wsURL).MustConnect().NoDefaultDevice()
```

Ecco un esempio più dettagliato: [esempio di codice](https://github.com/go-rod/rod/blob/master/lib/examples/use-rod-like-chrome-extension/main.go).

## API A Basso Livello

Se si desidera controllare ogni fase del processo di lancio, come disabilitare il download automatico e utilizzare il browser predefinito del sistema, controlla il [file di esempio](https://github.com/go-rod/rod/blob/master/lib/launcher/example_test.go).
