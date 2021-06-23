# Emulaatio

Rod tarjoaa erilaisia tapoja jäljitellä ympäristöä sivuille.

## Laitteet

Näyttöportti, käyttäjän agentti, suunta jne. asettamiseksi samaan aikaan sivulle, voit käyttää ennalta määriteltyjä laitteita:

```go
sivu.MustEmulate(laitteet.IPhone6or7or8Plus)
```

Tai määritä oma laite:

```go
page.MustEmulate(laitteet. evice{
  Otsikko: "iPhone 4",
  Capabilities: []string{"touch", "matkapuhelin"},
  UserAgent: "Mozilla/5. (iPhone; CPU iPhone OS 7_1_2 kuten Mac OS X)",
  AcceptLanguage: "fi",
  Screen: laitteet. creen{
    LaitePixelRatio: 2,
    Vaakasuora: laitteet. creenSize{
      Width:  480,
      Height: 320,
    },
    Pystysuunnassa: laitteet.ScreenSize{
      Width:  320,
      Height: 480,
    },
  },
})
```

Tarkista ennalta määriteltyjen laitteiden lähdekoodi, kenttien tulee itse selittää itseään.

Voit myös asettaa oletuslaitteen kaikille sivuille käyttämällä [Browser.DefaultLaite](https://pkg.go.dev/github.com/go-rod/rod#Browser.DefaultDevice).

Emulointi on oletusarvoisesti aktivoitu (käyttäen [Laitetta. aptopWithMDPIScreen](https://github.com/go-rod/rod/blob/bc44c39c9b4352c15d00bef6f6a1071205d2c388/lib/devices/list.go#L616) laite, joka ohittaa joitakin oletuksena selaimen asetukset, mikä on parempi johdonmukaisuus (eli se auttaa jäljentämään testit).

Voit poistaa laitteen simulaatiotoiminnon käytöstä ja siirtää erityisen _Tyhjennä_ laitteen `selaimeen.OletusLaite`.

```go
browser.DefaultLaite(laitteet.Clear)
```

Tai voit vain käyttää [Browser.NoDefaultDevice](https://pkg.go.dev/github.com/go-rod/rod#Browser.NoDefaultDevice) auttaja.

## Käyttäjän agentti

Jos haluat määrittää käyttäjä-agentin tietylle sivulle, käytä [Sivua.SetUserAgent](https://pkg.go.dev/github.com/go-rod/rod#Page.SetUserAgent).

## Näkymä

Jos haluat määrittää näkymän tietylle sivulle, käytä [Sivua.SetViewport](https://pkg.go.dev/github.com/go-rod/rod#Page.SetViewport).

## Maa-alueet ja aikavyöhyke

Voit käyttää käynnistys env asettaa kaikille sivuille:

```go
u := launcher.New().Env ("TZ=America/New_York").MustConnect()
selain := rod.New().ControlURL(u).MustConnect()
```

Tai voit käyttää [EmulationSetTimezoneOverride](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetTimezoneOverride) tai [EmulationSetLocaleOverride](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetLocaleOverride) asettaaksesi tietylle sivulle:

```go
proto.EmulationSetTimezoneOverride{TimezoneID: "Amerikka/New_York"}.Call(sivu)
```

## Käyttöoikeudet

Käytä [BrowserGrantPermissions](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#BrowserGrantPermissions)

## Paikkatieto

Käytä [EmulationSetGeolocationOverride](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetGeolocationOverride)

## Väriteema ja media

Käytä [EmulationSetEmulatedMedia](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetEmulatedMedia)

```go
proto.EmulationSetEmulatedMedia{
    Media: "screen",
    Ominaisuudet: []*proto.EmulationMediaFeature{
        {"prefers-color-scheme", "dark"},
    },
}.Call(page)
```

## Estä botti tunnistus

Yleensä on parempi tehdä headless selain täysin läpinäkyvä sivulle, jotta sivu ei voi kertoa, onko se hallinnassa ihmisen tai robotin. Joissakin tapauksissa, jotkut sivu voisi käyttää asiakkaan js havaita, jos sivu on hallinnassa ihmisen tai robotin, tällaiset WebGL, WebDriver, tai http pyyntö otsikot. Voit kävellä js lib piilottaa kaikki jäljet, tai vain käyttää lib [stealth](https://github.com/go-rod/stealth): [koodi esimerkki](https://github.com/go-rod/stealth/blob/master/examples_test.go).

Jos `stealth` lib ei toimi sinulle, voit vain käynnistää säännöllisen käyttäjäselaimen `launcher. ewUserMode`: [Käyttäjätila](custom-launch.md?id=user-mode).

Voit testata konfiguraatioitasi käyttämällä esimerkiksi [https://bot.sannysoft.com](https://bot.sannysoft.com) -työkaluja.

## Selain sormenjälki

Selaimen sormenjälki ei ole botin havaitseminen. Se käyttää erilaisia temppuja kerätä ainutlaatuisia selaimen attribuutteja tunnistaa selaimet. Verkkosivusto voi käyttää sitä seurata käyttäjiä silloinkin, kun ne eivät ole kirjautuneet sisään, se on myös laajalti käytetty merkitä headless kaapimet. Esimerkiksi eri käyttäjät yleensä asentaa erilaisia kirjasimia niiden käyttöjärjestelmään, voimme käyttää tätä erottamaan eri käyttäjiä. Toinen esimerkki olisi käyttää kanavaa tekstin tekemiseen, eri käyttäjillä on yleensä eri näytönohjaimia, graafiset kuljettajat tai käyttöjärjestelmät, ne kaikki vaikuttavat renderöidyn kuvan tulokseen.

Yleensä voit käynnistää useita selaimen instansseja, jotta sinulla on erilaisia sormenjälkiä. Jos haluat käyttää yhtä selainta muistin ja suorittimen tallentamiseen, sinun on ohitettava manuaalisesti API kankaalle, fonteille jne.

Voit testata konfiguraatioitasi käyttämällä avoimen lähdekoodin projekteja, kuten [FingerprintJS](https://github.com/fingerprintjs/fingerprintjs/).
