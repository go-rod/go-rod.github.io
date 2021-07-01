# Emulare

Rod oferă diverse moduri de a imita mediul pentru pagini.

## Dispozitive

Pentru a seta vizualizarea, agentul de utilizator, orientarea, etc în acelaşi timp pentru o pagină, puteţi utiliza dispozitivele predefinite:

```go
page.MustEmulate(dispozes.IPhone6or7or8Plus)
```

Sau definiți propriul dispozitiv:

```go
page.MustEmulate(dispozitive). evice{
  Title: "iPhone 4",
  capabilități: []string{"touch", "mobile"},
  Agent Utilizator: "Mozilla/5. (iPhone; CPU iPhone OS 7_1_2 ca Mac OS X)",
  Limba de acceptare: "ro",
  ecran: dispozitive. creen{
    DevicePixelRatio: 2,
    Dispozitive orizontale: dimensiunea ecranului{
      Width:  480,
      Height: 320,
    },
    Vertical: dispozitive.Dimensiunea ecranului{
      Width:  320,
      Height: 480,
    },
  },
})
```

Verificați codul sursă al dispozitivelor predefinite, câmpurile ar trebui să se explice singure.

Puteți, de asemenea, seta dispozitivul implicit pentru toate paginile folosind [Browser.DefaultDevice](https://pkg.go.dev/github.com/go-rod/rod#Browser.DefaultDevice).

Emularea este activată în mod implicit (folosind dispozitivele [aptopWithMDPIScreen](https://github.com/go-rod/rod/blob/bc44c39c9b4352c15d00bef6f6a1071205d2c388/lib/devices/list.go#L616) care suprascrie unele din setările implicite ale browser-ului, care este mai bun în ceea ce privește coerența (adică, ajută la reproducerea testelor).

Puteți dezactiva caracteristica Emulare de dispozitiv care trece de dispozitivul special _Golește_ la `Browser.Dispozitiv Implicit`.

```go
browser.DefaultDevice(dispozitive.Clear)
```

Sau poți folosi ajutorul [Browser.NoDefaultDevice](https://pkg.go.dev/github.com/go-rod/rod#Browser.NoDefaultDevice).

## Agent utilizator

Dacă doriți să specificați un agent de utilizator pentru o anumită pagină, utilizați [Page.SetUserAgent](https://pkg.go.dev/github.com/go-rod/rod#Page.SetUserAgent).

## Vizualizare

Dacă doriţi să specificaţi viewport-ul pentru o anumită pagină, utilizaţi [Page.SetViewport](https://pkg.go.dev/github.com/go-rod/rod#Page.SetViewport).

## Locale și fus orar

Puteți folosi lansarea env pentru a seta pentru toate paginile:

```go
u := launcher.New().Env("TZ=America/New_York").MustConnect()
browser := rod.New().ControlURL(u).MustConnect()
```

Sau poți folosi [EmulationSetTimezoneSuprascriere](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetTimezoneOverride) sau [EmulationSetLocaleOverride](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetLocaleOverride) pentru a seta pentru o anumită pagină:

```go
proto.EmulationSetTimezoneSuprascriere{TimezoneID: "America/New_York"}.Call(pagină)
```

## Permisiuni

Folosește [BrowserGrantPermisiuni](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#BrowserGrantPermissions)

## Geolocalizare

Folosește [EmulationSetSetGeolocationSuprascriere](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetGeolocationOverride)

## Schema de culori și media

Folosește [EmulationSetEmulatedMedia](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetEmulatedMedia)

```go
proto.EmulationSetEmulatedMedia{
    Media: "screen",
    Caracteristici: []*proto.EmulationMediaFeature{
        {"prefers-color-scheme", "dark"},
    },
}.Call(pagină)
```

## Prevenire detectare bot

De obicei, este mai bine ca browserul fără cap să fie complet transparent pentru pagină, astfel încât pagina să nu poată vedea dacă este controlată de un om sau un robot. În unele cazuri, unele pagini ar putea folosi client js pentru a detecta dacă pagina este controlată de un om sau un robot, astfel de antete WebGL, WebDriver, sau http request header. Poți crea manual un lib js pentru a ascunde toate urmele, sau să folosești lib [ascuns](https://github.com/go-rod/stealth): [exemplu cod](https://github.com/go-rod/stealth/blob/master/examples_test.go).

Dacă `stealth` lib nu funcționează pentru tine, poți doar să lansezi browser-ul de utilizator obișnuit cu `launcher. Mod ewUser`: [Utilizator modul](custom-launch.md?id=user-mode).

Puteți folosi instrumente precum [https://bot.sannysoft.com](https://bot.sannysoft.com) pentru a testa configurarea.

## Amprentă browser

Amprentarea browser-ului nu este detectarea botului. Folosește diferite trucuri pentru a colecta atribute unice de browser pentru browsere de identificare. Site-ul îl poate folosi pentru a urmări utilizatorii chiar și atunci când nu sunt conectați, este de asemenea folosit la scară largă pentru a marca casele fără cap. De exemplu, de obicei diferiți utilizatori vor instala fonturi diferite pe sistemul lor de operare, putem folosi acest lucru pentru a distinge utilizatorii diferiți. Un alt exemplu ar fi utilizarea pânzei pentru a reda text, de obicei diferiți utilizatori vor avea GPU-uri diferite; șoferii grafici sau sistemele de operare vor afecta rezultatul imaginii redate.

De obicei poți lansa mai multe instanțe de browser pentru a avea diferite amprente. Dacă doriți să utilizați un singur browser pentru a salva memoria și CPU, trebuie să suprascrieți manual API-ul pentru pânză, fonturi, etc.

Poți folosi proiecte open-source ca [FingerprintJS](https://github.com/fingerprintjs/fingerprintjs/) pentru a-ți testa configurația.
