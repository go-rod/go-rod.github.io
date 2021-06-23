# Integrering

Rod giver forskellige måder at efterligne miljøet til sider.

## Enheder

For at indstille viewporten, bruger-agent, orientering osv på samme tid for en side, kan du bruge de foruddefinerede enheder:

```go
page.MustEmulate(devices.IPhone6or7or8Plus)
```

Eller definer din egen enhed:

```go
side.MustEmulate(enheder. evice{
  Titel: "iPhone 4",
  Capabilities: []string{"touch", "mobil"},
  UserAgent: "Mozilla/5. (iPhone; CPU iPhone OS 7_1_2 som Mac OS X)",
  AcceptLanguage: "en",
  Skærm: enheder. creen{
    DevicePixelRatio: 2,
    Vandret: enheder. creenSize{
      Width:  480,
      Height: 320,
    },
    Lodret: enheder.ScreenSize{
      Width:  320,
      Height: 480,
    },
  },
})
```

Tjek kildekoden for de foruddefinerede enheder, felterne skal selv forklare sig selv.

Du kan også indstille standardenheden for alle sider ved hjælp af [Browser.DefaultDevice](https://pkg.go.dev/github.com/go-rod/rod#Browser.DefaultDevice).

Emuleringen aktiveres som standard (ved hjælp af [enhederne. aptopWithMDPIScreen](https://github.com/go-rod/rod/blob/bc44c39c9b4352c15d00bef6f6a1071205d2c388/lib/devices/list.go#L616) enhed), som tilsidesætter nogle af standardbrowserindstillingerne, hvilket er bedre med hensyn til sammenhæng (dvs. det hjælper med at reproducere tests).

Du kan deaktivere funktionen Enhedsemulering, der videregiver den særlige _Ryd_ enhed til `Browseren.DefaultDevice`.

```go
browser.DefaultDevice(enheder.Clear)
```

Eller du kan bare bruge [Browser.NoDefaultDevice](https://pkg.go.dev/github.com/go-rod/rod#Browser.NoDefaultDevice) hjælper.

## Bruger agent

Hvis du ønsker at angive en bruger-agent for en bestemt side, skal du bruge [Page.SetUserAgent](https://pkg.go.dev/github.com/go-rod/rod#Page.SetUserAgent).

## Visning

Hvis du ønsker at angive viewport for en bestemt side, skal du bruge [Page.SetViewport](https://pkg.go.dev/github.com/go-rod/rod#Page.SetViewport).

## Landestandard og tidszone

Du kan bruge start env til at indstille for alle sider:

```go
u := launcher.New().Env ("TZ=America/New_York").MustConnect()
browser := rod.New().ControlURL(u).MustConnect()
```

Eller du kan bruge [EmulationSetTimezoneTilsidesæt](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetTimezoneOverride) eller [EmulationSetLocaleTilsidesæt](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetLocaleOverride) til at indstille for en bestemt side:

```go
proto.EmulationSetTimezoneOverride{TimezoneID: "Amerika/New_York"}.Call(side)
```

## Rettigheder

Brug [BrowserGrantTilladelser](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#BrowserGrantPermissions)

## Geolokation

Brug [emulationSetGeolocationTilsidesæt](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetGeolocationOverride)

## Farvesammensætning og medier

Brug [emulationSetEmulatedMedia](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetEmulatedMedia)

```go
proto.EmulationSetEmulatedMedia{
    Medie: "skærm",
    Funktioner: []*proto.EmulationMediaFeature{
        {"prefers-color-scheme", "dark"},
    },
}.Call(side)
```

## Forhindr bot detektering

Normalt er det bedre at gøre hovedløse browser helt gennemsigtig for siden, så siden ikke kan fortælle, om det er kontrolleret af et menneske eller en robot. I nogle tilfælde kan nogle side bruge klient js til at opdage, om siden er kontrol af et menneske eller en robot, sådan web WebGL, WebDriver, eller http anmodning overskrifter. Du kan håndtere en js lib for at skjule alle sporene, eller bare bruge lib [stealth](https://github.com/go-rod/stealth): [kode eksempel](https://github.com/go-rod/stealth/blob/master/examples_test.go).

Hvis `stealth` lib ikke virker for dig, kan du bare starte den almindelige brugerbrowser med `launcher. ewUserMode`: [Brugertilstand](custom-launch.md?id=user-mode).

Du kan bruge værktøjer som [https://bot.sannysoft.com](https://bot.sannysoft.com) til at teste din konfiguration.

## Browser fingeraftryk

Browser fingeraftryk er ikke bot afsløring. Det bruger forskellige tricks til at indsamle unikke browserattributter til at identificere browsere. Websted kan bruge det til at spore brugere, selv når de ikke er logget ind, det er også almindeligt anvendt til at markere hovedløse skrabere. For eksempel vil forskellige brugere normalt installere forskellige skrifttyper på deres OS, vi kan bruge dette til at skelne forskellige brugere. Et andet eksempel ville være at bruge lærred til at gøre tekst, forskellige brugere normalt vil have forskellige GPU'er, grafiske chauffører eller operativsystemer, de alle vil påvirke resultatet af det afgivne billede.

Normalt kan du starte flere browser instanser for at have forskellige fingeraftryk. Hvis du ønsker at bruge en enkelt browser til at gemme hukommelse og CPU, skal du manuelt tilsidesætte API til lærred, skrifttyper osv.

Du kan bruge open source-projekter som [FingerprintJS](https://github.com/fingerprintjs/fingerprintjs/) til at teste din konfiguration.
