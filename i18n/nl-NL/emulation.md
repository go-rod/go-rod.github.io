# Emulatie

Rod biedt verschillende manieren om het milieu voor pagina's te emuleren.

## Apparaten

Om de weergave, gebruiker-agent, oriëntatie, etc tegelijkertijd voor een pagina in te stellen, kunt u de vooraf gedefinieerde apparaten gebruiken:

```go
page.MustEmulate(devices.IPhone6or7or8Plus)
```

Of definieer je eigen apparaat:

```go
page.MustEmulate(apparaten. {
  Titel: "iPhone 4",
  Mogelijkheden: []string{"touch", "mobile"},
  Gebruikersagent: "Mozilla/5. (iPhone; CPU iPhone OS 7_1_2 zoals Mac OS X)",
  AcceptLanguage: "en",
  Scherm: apparaten. Creen{
    DevicePixelRatio: 2,
    Horizontaal: apparaten. CreenSize{
      Width:  480,
      Height: 320,
    },
    Verticaal: devices.ScreenSize{
      Width:  320,
      Height: 480,
    },
  },
})
```

Controleer de broncode van de vooraf gedefinieerde apparaten, de velden moeten zichzelf uitleggen.

U kunt ook het standaardapparaat instellen voor alle pagina's door [Browser.DefaultDevice](https://pkg.go.dev/github.com/go-rod/rod#Browser.DefaultDevice) te gebruiken.

Emulatie wordt standaard geactiveerd (gebruik makend van de [apparaten. aptopWithMDPIScreen](https://github.com/go-rod/rod/blob/bc44c39c9b4352c15d00bef6f6a1071205d2c388/lib/devices/list.go#L616) apparaat, dit overschrijft een aantal van de standaard browserinstellingen, wat beter is in termen van samenhang (d.w.z. het helpt tests te reproduceren).

Je kunt de apparaatemulatie functie uitschakelen door het speciale _Wis_ apparaat naar `Browser.DefaultDevice`.

```go
browser.DefaultDevice(apparaten.Clear)
```

Of je kunt gewoon de [Browser.NoDefaultDevice](https://pkg.go.dev/github.com/go-rod/rod#Browser.NoDefaultDevice) helper gebruiken.

## User Agent

Als u een user-agent voor een specifieke pagina wilt opgeven, gebruik dan [Page.SetUserAgent](https://pkg.go.dev/github.com/go-rod/rod#Page.SetUserAgent).

## Uitzicht

Als u de viewport voor een specifieke pagina wilt opgeven, gebruik dan [Page.SetViewport](https://pkg.go.dev/github.com/go-rod/rod#Page.SetViewport).

## Locale en tijdzone

U kunt de lancering env gebruiken om voor alle pagina's in te stellen:

```go
u := launcher.New().Env("TZ=Amerika/New_York").MustConnect()
browser := rod.New().ControlURL(u).MustConnect()
```

Of je kunt [EmulationSetTimezoneOverride](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetTimezoneOverride) of [EmulationSetLocaleOverride](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetLocaleOverride) gebruiken voor een specifieke pagina:

```go
proto.EmulationSetTimezoneOverride{TimezoneID: "Amerika/New_York"}.Call(pagina)
```

## Machtigingen

Gebruik [BrowserGrantPermissions](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#BrowserGrantPermissions)

## Geolocatie

Gebruik [EmulationSetGeolocationOverride](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetGeolocationOverride)

## Kleurenschema en media

Gebruik [EmulationSetEmulatedMedia](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetEmulatedMedia)

```go
proto.EmulationSetEmulatedMedia{
    Media: "scherm",
    Functies: []*proto.EmulationMediaFeature{
        {"prefers-color-schema", "donker"},
    },
}.Call(page)
```

## Voorkom bot detectie

Meestal is het beter om de headless browser volledig transparant te maken voor de pagina, zodat de pagina niet kan zien of deze beheerd wordt door een mens of robot. In sommige gevallen kan sommige pagina client js gebruiken om te detecteren of de pagina door een mens of robot wordt bediend, dergelijke web WebGL, WebDriver of http-verzoekheaders. Je kunt een js lib gebruiken om alle sporen te verbergen, of gewoon lib [stealth](https://github.com/go-rod/stealth)gebruiken: [code voorbeeld](https://github.com/go-rod/stealth/blob/master/examples_test.go).

Als `stealth` lib niet voor u werkt, kunt u gewoon de normale gebruiker browser starten met `launcher. ewUserMode`: [User mode](custom-launch.md?id=user-mode).

Je kunt hulpmiddelen zoals [https://bot.sannysoft.com](https://bot.sannysoft.com) gebruiken om je configuratie te testen.

## Browser vingerafdruk

Browser vingerafdrukken zijn geen bot detectie. Het gebruikt verschillende trucs om unieke browserattributen te verzamelen om browsers te identificeren. Website kan het gebruiken om gebruikers bij te houden, zelfs wanneer ze niet zijn ingelogd, het wordt ook veel gebruikt om headless scrapers te markeren. Verschillende gebruikers zullen bijvoorbeeld meestal verschillende lettertypen op hun OS installeren. We kunnen dit gebruiken om verschillende gebruikers te onderscheiden. Een ander voorbeeld zou het canvas gebruiken om tekst te maken, verschillende gebruikers hebben meestal verschillende GPU's, grafische chauffeurs of besturen, ze hebben allemaal invloed op het resultaat van de weergegeven afbeelding.

Meestal kun je meerdere browserinstanties starten om verschillende vingerafdrukken te hebben. Als je een enkele browser wilt gebruiken om geheugen en CPU op te slaan, moet je handmatig de API voor canvas, lettertypes, etc. overschrijven.

Je kunt open-source projecten zoals [vingerafdruk JS](https://github.com/fingerprintjs/fingerprintjs/) gebruiken om je configuratie te testen.
