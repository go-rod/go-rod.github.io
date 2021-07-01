# Emulazione

Rod fornisce vari modi per emulare l'ambiente per le pagine.

## Dispositivi

Per impostare la porta di visualizzazione, l'utente, l'orientamento, ecc allo stesso tempo per una pagina, è possibile utilizzare i dispositivi predefiniti:

```go
page.MustEmulate(devices.IPhone6or7or8Plus)
```

O definire il proprio dispositivo:

```go
page.MustEmulate(dispositivi. evice{
  Titolo: "iPhone 4",
  Capacità: []string{"touch", "mobile"},
  UserAgent: "Mozilla/5. (iPhone; CPU iPhone OS 7_1_2 come Mac OS X)",
  AcceptLanguage: "it",
  Screen: dispositivi. creen{
    DevicePixelRatio: 2,
    Orizzontale: dispositivi. creenSize{
      Width:  480,
      Height: 320,
    },
    Verticale: devices.ScreenSize{
      Width:  320,
      Height: 480,
    },
  },
})
```

Controllare il codice sorgente dei dispositivi predefiniti, i campi dovrebbero auto-spiegarsi.

È inoltre possibile impostare il dispositivo predefinito per tutte le pagine utilizzando [Browser.DefaultDevice](https://pkg.go.dev/github.com/go-rod/rod#Browser.DefaultDevice).

L'emulazione è attivata per impostazione predefinita (usando i dispositivi [. aptopWithMDPIScreen](https://github.com/go-rod/rod/blob/bc44c39c9b4352c15d00bef6f6a1071205d2c388/lib/devices/list.go#L616) device), che sovrascrive alcune delle impostazioni del browser predefinite, che è migliore in termini di coerenza (cioè, aiuta a riprodurre i test).

È possibile disabilitare la funzione Emulazione dispositivo passando il dispositivo speciale _Cancella_ al `Browser.DefaultDevice`.

```go
browser.DefaultDevice(devices.Clear)
```

Oppure puoi usare l'helper [Browser.NoDefaultDevice](https://pkg.go.dev/github.com/go-rod/rod#Browser.NoDefaultDevice).

## User agent

Se si desidera specificare un user-agent per una pagina specifica, utilizzare [Page.SetUserAgent](https://pkg.go.dev/github.com/go-rod/rod#Page.SetUserAgent).

## Viewport

Se si desidera specificare la vista per una pagina specifica, utilizzare [Page.SetViewport](https://pkg.go.dev/github.com/go-rod/rod#Page.SetViewport).

## Locale e fuso orario

È possibile utilizzare l'env di lancio per impostare per tutte le pagine:

```go
u := launcher.New().Env("TZ=America/New_York").MustConnect()
browser := rod.New().ControlURL(u).MustConnect()
```

Oppure puoi usare [EmulationSetTimezoneOverride](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetTimezoneOverride) o [EmulationSetLocaleOverride](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetLocaleOverride) per impostare per una pagina specifica:

```go
proto.EmulationSetTimezoneOverride{TimezoneID: "America/New_York"}.Call(pagina)
```

## Permessi

Usa [BrowserGrantPermissions](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#BrowserGrantPermissions)

## Geo-localizzazione

Usa [EmulationSetGeolocationOverride](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetGeolocationOverride)

## Schema di colori e supporti

Usa [EmulationSetEmulatedMedia](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetEmulatedMedia)

```go
proto.EmulationSetEmulatedMedia{
    Media: "screen",
    Caratteristiche: []*proto.EmulationMediaFeature{
        {"prefers-color-scheme", "dark"},
    },
}.Call(page)
```

## Impedisci il rilevamento bot

Di solito è meglio rendere il browser senza testa completamente trasparente per la pagina in modo che la pagina non possa dire se è controllato da un umano o un robot. In alcuni casi, alcune pagine potrebbero usare i client js per rilevare se la pagina è controllata da un umano o un robot, tale web WebGL, WebDriver, o http intestazioni di richiesta. Puoi creare a mano un lib js per nascondere tutte le tracce, o semplicemente usare lib [stealth](https://github.com/go-rod/stealth): [code example](https://github.com/go-rod/stealth/blob/master/examples_test.go).

Se `stealth` lib non funziona per te, puoi solo lanciare il browser utente normale con `launcher. ewUserMode`: [Modalità utente](custom-launch.md?id=user-mode).

Puoi usare strumenti come [https://bot.sannysoft.com](https://bot.sannysoft.com) per testare la tua configurazione.

## Impronta digitale del browser

Il rilevamento delle impronte digitali del browser non è un bot. Utilizza vari trucchi per raccogliere attributi browser unici per identificare i browser. Il sito web può usarlo per monitorare gli utenti anche quando non sono loggati, è anche ampiamente utilizzato per contrassegnare raschietti senza testa. Ad esempio, diversi utenti di solito installeranno diversi tipi di carattere sul loro sistema operativo, possiamo usarlo per distinguere gli utenti diversi. Un altro esempio sarebbe quello di utilizzare la tela per rendere il testo, diversi utenti di solito avranno GPU diverse, driver grafici, o OS, tutti influenzeranno il risultato dell'immagine renderizzata.

Di solito è possibile avviare più istanze del browser per avere impronte digitali diverse. Se si desidera utilizzare un singolo browser per salvare memoria e CPU, è necessario sovrascrivere manualmente l'API per la tela, i caratteri, ecc.

È possibile utilizzare progetti open-source come [FingerprintJS](https://github.com/fingerprintjs/fingerprintjs/) per testare la configurazione.
