# Emulering

Torsken gir ulike måter å emulere miljøet på for sider.

## Enheter

For å angi visning, brukerretning, orientering, etc samtidig for en side, kan du bruke de forhåndsdefinerte enhetene:

```go
page.MustEmulate(enheter.Ione6or7or8Plus)
```

Eller definer din egen enhet:

```go
side.MustEmulat(enheter. evice{
  Tittel: "iPhone 4",
  Capabilities: []string{"touch", "mobil"},
  Brukeragent: "Mozilla/5. (iPhone; CPU iPhone OS 7_1_2 som Mac OS X)",
  AcceptLanguage: "no",
  skjer: enheter. creen{
    DevicePixelRatio: 2,
    Horisontal: enheter. creenSize{
      Width:  480,
      Height: 320,
    },
    Vertikal: devices.ScreenSize{
      Width:  320,
      Height: 480,
    },
  },
})
```

Kontroller kildekoden til de forhåndsdefinerte enhetene, og disse skal selv forklare seg.

Du kan også angi standardenheten for alle sider ved å bruke [Browser.DefaultDevice](https://pkg.go.dev/github.com/go-rod/rod#Browser.DefaultDevice).

Emuleringen aktiveres som standard (ved å bruke [enhetene. aptopWithMDPIScreen](https://github.com/go-rod/rod/blob/bc44c39c9b4352c15d00bef6f6a1071205d2c388/lib/devices/list.go#L616) -enhet), som overstyrer noen av standard nettleserinnstillinger, som er bedre i forhold til sammenheng (dvs. det hjelper til å reprodusere tester).

Du kan deaktivere enhetens utgangsfunksjon som passerer den spesielle _tømme_ enheten til `Browser.Standardenhet`.

```go
browser.StandardDevice(devices.Clear)
```

Eller du kan bare bruke [Browser.NoDefaultDevice](https://pkg.go.dev/github.com/go-rod/rod#Browser.NoDefaultDevice) hjelper.

## Bruker agent

Dersom du vil spesifisere en brukeragent for en bestemt side, bruk [Page.SetUserAgent](https://pkg.go.dev/github.com/go-rod/rod#Page.SetUserAgent).

## Visnings port

Hvis du vil angi visningsporten for en bestemt side, bruk [Page.SetViewport](https://pkg.go.dev/github.com/go-rod/rod#Page.SetViewport).

## Lokal og tidssone

Du kan starte env for å sette opp for alle sider:

```go
u := launcher.New().Env("TZ=Amerika/New_York").MustConnect()
browser := rod.New().ControlURL(u).MustConnect()
```

Eller du kan bruke [EmulationSetTimezoneOverrid](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetTimezoneOverride) or [EmulationSetLocaleOverrid](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetLocaleOverride) for å sette til en bestemt side:

```go
proto.EmulationSetTimezoneOverride{TimezoneID: "Amerika/New_York"}.Call(page)
```

## Tillatelser

Bruk [NettleserGrantTillatelser](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#BrowserGrantPermissions)

## Geolokalisering

Bruk [EmulationSetGeolokasjonOverstyr](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetGeolocationOverride)

## Fargeskjema og medier

Bruk [EmulationSetEmulatedMedia](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetEmulatedMedia)

```go
proto.EmulationSetEmulatedMedia{
    Media: "screen",
    Funksjoner: []*proto.EmulationMediaFeature{
        {"prefers-color-scheme", "dark"},
    },
}.Call(page)
```

## Hindre robotdeteksjon

Vanligvis er det bedre å gjøre hodeløse nettleser helt gjennomsiktig for siden slik at siden ikke vet om den er kontrollert av en person eller en robot. I noen tilfeller kan noen sider bruke klient-js til å oppdage om siden er styrt av en person eller en robot, slike webGL, WebDriver, eller http request header. Du kan håndlage et js løgn for å skjule alle sporene, eller bare bruke lib [stjele](https://github.com/go-rod/stealth): [kodeeksempel](https://github.com/go-rod/stealth/blob/master/examples_test.go).

Hvis `stjelende` lib ikke fungerer for deg, kan du bare starte den vanlige brukernettleseren med `startskjerm. Brukermodus`: [Brukermodus](custom-launch.md?id=user-mode).

Du kan bruke verktøy som [https://bot.sannysoft.com](https://bot.sannysoft.com) for å teste konfigurasjonen.

## Nettleserens fingeravtrykk

Nettleserens fingeravtrykk er ikke dokumentert. Den bruker ulike triks for å samle unike nettleserattributter for å identifisere nettlesere. Nettstedet kan bruke den til å spore brukere selv når de ikke er logget inn, men det er også mye brukt til å merke hodeløse skrapere. For eksempel vil ulike brukere vanligvis installere ulike skrifttyper på OSS, vi kan bruke dette til å skille ulike brukere. Et annet eksempel vil bruke lerret til å gjengi tekst, forskjellige brukere vil vanligvis ha andre brukere, både grafiske drivere, eller OSser, de påvirker resultatet av det gjengitte bildet.

Vanligvis kan du starte flere nettleserinstanser for å ha forskjellige fingeravtrykk. Hvis du vil bruke en nettleser for å lagre minne og prosessorenhet, må du manuelt overstyre API-en for lerret, skrifter osv.

Du kan bruke open-source prosjekter som [FingerprintJS](https://github.com/fingerprintjs/fingerprintjs/) for å teste din konfigurasjon.
