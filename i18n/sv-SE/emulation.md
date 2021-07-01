# Emulering

Rod ger olika sätt att efterlikna miljön för sidor.

## Enheter

För att ställa in vyport, användaragent, orientering, etc samtidigt för en sida, kan du använda fördefinierade enheter:

```go
sida.MustEmulate (enheter.IPhone6or7or8Plus)
```

Eller definiera din egen enhet:

```go
sida.MustEmulate (enheter. evice{
  Titel: "iPhone 4",
  Funktioner: []string{"touch", "mobil"},
  UserAgent: "Mozilla/5. (iPhone; CPU iPhone OS 7_1_2 som Mac OS X)",
  AccepteraSpråk: "sv",
  Skärmen: enheter. creen{
    DevicePixelRatio: 2,
    Horisontal: enheter. creenSize{
      Width:  480,
      Height: 320,
    },
    Vertikal: enheter.Skärmstorlek{
      Width:  320,
      Height: 480,
    },
  },
})
```

Kontrollera källkoden för de fördefinierade enheterna, fälten bör själv förklara sig.

Du kan också ställa in standardenheten för alla sidor genom att använda [Browser.DefaultDevice](https://pkg.go.dev/github.com/go-rod/rod#Browser.DefaultDevice).

Emulering aktiveras som standard (genom att använda [-enheterna. aptopWithMDPIScreen](https://github.com/go-rod/rod/blob/bc44c39c9b4352c15d00bef6f6a1071205d2c388/lib/devices/list.go#L616) enhet), som åsidosätter några av standardinställningarna i webbläsaren, vilket är bättre när det gäller samstämmighet (dvs. det hjälper till att reproducera tester).

Du kan inaktivera funktionen Enhetsemulering som skickar den speciella _Rensa_ enheten till `Webbläsare.Standardenhet`.

```go
browser.DefaultDevice(devices.Clear)
```

Eller så kan du bara använda [Browser.NoDefaultDevice](https://pkg.go.dev/github.com/go-rod/rod#Browser.NoDefaultDevice) hjälpare.

## Användar agent

Om du vill ange en användaragent för en specifik sida, använd [Page.SetUserAgent](https://pkg.go.dev/github.com/go-rod/rod#Page.SetUserAgent).

## Visningsport

Om du vill ange visningsporten för en specifik sida, använd [Page.SetViewport](https://pkg.go.dev/github.com/go-rod/rod#Page.SetViewport).

## Språk och tidszon

Du kan använda start-env för att ställa in för alla sidor:

```go
u := launcher.New().Env("TZ=America/New_York").MustConnect()
browser := rod.New().ControlURL(u).MustConnect()
```

Eller så kan du använda [EmulationSetTimezoneOverride](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetTimezoneOverride) eller [EmulationSetLocaleOverride](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetLocaleOverride) för att ange för en specifik sida:

```go
proto.EmulationSetTimezoneOverride{TimezoneID: "Amerika/New_York"}.Call(sida)
```

## Behörigheter

Använd [BrowserGrantPermissions](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#BrowserGrantPermissions)

## Geolokalisering

Använd [EmulationSetGeolocationOverride](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetGeolocationOverride)

## Färgschema och media

Använd [emuleringSetEmulatedMedia](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetEmulatedMedia)

```go
proto.EmulationSetEmulatedMedia{
    Media: "screen",
    Funktioner: []*proto.EmulationMediaFeature{
        {"prefers-color-schema", "dark"},
    },
}.Call(sida)
```

## Förhindra identifiering av bot

Vanligtvis är det bättre att göra den huvudlösa webbläsaren helt transparent för sidan så att sidan inte kan avgöra om den styrs av en människa eller robot. I vissa fall kan vissa sidor använda klientjs för att upptäcka om sidan är kontroll av en människa eller en robot, sådana webb WebGL, WebDriver, eller http förfrågningsrubriker. Du kan tillverka en js lib för att dölja alla spår, eller bara använda lib [stealth](https://github.com/go-rod/stealth): [kodexempel](https://github.com/go-rod/stealth/blob/master/examples_test.go).

Om `stealth` lib inte fungerar för dig, kan du bara starta den vanliga användarens webbläsare med `launcher. ewUserMode`: [Användarläge](custom-launch.md?id=user-mode).

Du kan använda verktyg som [https://bot.sannysoft.com](https://bot.sannysoft.com) för att testa din konfiguration.

## Fingeravtryck i webbläsaren

Webbläsarens fingeravtryck är inte bot upptäckt. Den använder olika knep för att samla in unika webbläsarattribut för att identifiera webbläsare. Webbplatsen kan använda den för att spåra användare även när de inte är inloggade, det är också allmänt används för att markera huvudlösa skrapor. Till exempel, olika användare vanligtvis kommer att installera olika typsnitt på sina operativsystem, kan vi använda detta för att skilja olika användare. Ett annat exempel skulle vara att använda duken för att rendera text, olika användare kommer vanligtvis att ha olika GPU:er, grafiska drivrutiner, eller operativsystem, kommer alla att påverka resultatet av den renderade bilden.

Vanligtvis kan du starta flera webbläsarinstanser för att ha olika fingeravtryck. Om du vill använda en enda webbläsare för att spara minne och CPU, måste du manuellt åsidosätta API för duk, typsnitt etc.

Du kan använda projekt med öppen källkod som [FingerprintJS](https://github.com/fingerprintjs/fingerprintjs/) för att testa din konfiguration.
