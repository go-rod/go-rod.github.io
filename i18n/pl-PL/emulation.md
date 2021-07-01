# Emulacja

Rod zapewnia różne sposoby emulowania środowiska dla stron.

## Urządzenia

Aby ustawić widok, agent użytkownika, orientację itp w tym samym czasie dla strony, możesz użyć predefiniowanych urządzeń:

```go
page.MustEmulate(devices.IPhone6or7or8Plus)
```

Lub zdefiniuj swoje urządzenie:

```go
page.MustEmulate(urządzenia). evice{
  Tytuł: "iPhone 4",
  Możliwości: []string{"touch", "mobile"},
  UserAgent: "Mozilla/5. (iPhone; CPU iPhone OS 7_1_2 like Mac OS X)",
  AcceptLanguage: "en",
  Screen: urządzenia. ekren{
    UrządzeniePixelRatio: 2,
    Poziomy: urządzenia. rozmiar ekranu{
      Width:  480,
      Height: 320,
    },
    Pionowy: urządzenia.ScreenSize{
      Width:  320,
      Height: 480,
    },
  },
})
```

Sprawdź kod źródłowy wstępnie zdefiniowanych urządzeń, pola powinny same wyjaśnić.

Możesz również ustawić domyślne urządzenie dla wszystkich stron za pomocą [Browser.DefaultDevice](https://pkg.go.dev/github.com/go-rod/rod#Browser.DefaultDevice).

Emulacja jest aktywowana domyślnie (przy użyciu [urządzeń. urządzenie aptopWithMDPIScreen](https://github.com/go-rod/rod/blob/bc44c39c9b4352c15d00bef6f6a1071205d2c388/lib/devices/list.go#L616) , które zastępuje niektóre domyślne ustawienia przeglądarki, co jest lepsze pod względem spójności (tj. pomaga odtworzyć testy).

Możesz wyłączyć funkcję Emulacji urządzenia przekazującą specjalne urządzenie _Wyczyść_ do `Browser.DefaultDevice`.

```go
Browser.DefaultDevice(devices.Clear)
```

Możesz też użyć pomocy [Browser.NoDefaultDevice](https://pkg.go.dev/github.com/go-rod/rod#Browser.NoDefaultDevice).

## Agent użytkownika

Jeśli chcesz określić agenta użytkownika dla konkretnej strony, użyj [strony SetUserAgent](https://pkg.go.dev/github.com/go-rod/rod#Page.SetUserAgent).

## Widok

Jeśli chcesz określić widok dla konkretnej strony, użyj [strony SetViewport](https://pkg.go.dev/github.com/go-rod/rod#Page.SetViewport).

## Lokalizacja i strefa czasowa

Możesz użyć env aby ustawić dla wszystkich stron:

```go
u := launcher.New().Env("TZ=America/New_York").MustConnect()
przeglądarka := rod.New().ControlURL(u).MustConnect()
```

Możesz też użyć [EmulationSetTimezoneOverride](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetTimezoneOverride) lub [EmulationSetLocaleOverride](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetLocaleOverride) aby ustawić dla określonej strony:

```go
[PLACEHOLDER] proto.EmulationSetTimezoneOverride{TimezoneID: "America/New_York"}.Call(page)
```

## Uprawnienia

Użyj [BrowserGrantPermissions](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#BrowserGrantPermissions)

## Geolokalizacja

Użyj [EmulationSetGeolocationOverride](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetGeolocationOverride)

## Schemat kolorów i media

Użyj [EmulationSetEmulatedMedia](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetEmulatedMedia)

```go
proto.EmulationSetEmulatedMedia{
    Media: "screen",
    Funkcje: []*proto.EmulationMediaFeature{
        {"prefers-color-scheme", "dark"},
    },
}.Call(page)
```

## Zapobiegaj wykrywaniu bota

Zwykle lepiej sprawić, by przeglądarka bez nagłówka była całkowicie przezroczysta dla strony, aby strona nie mogła dowiedzieć się, czy jest kontrolowana przez człowieka czy robota. W niektórych przypadkach niektóre strony mogą użyć klienta js do wykrycia, czy strona jest kontrolowana przez człowieka lub robota, takie nagłówki żądania WebGL, WebDriver lub http. Możesz ręcznie zrobić js lib, aby ukryć wszystkie ślady lub po prostu użyć lib [ukradnij](https://github.com/go-rod/stealth): [przykład kodu](https://github.com/go-rod/stealth/blob/master/examples_test.go).

Jeśli `stealth` lib nie działa dla Ciebie, możesz po prostu uruchomić zwykłą przeglądarkę użytkowników za pomocą `launchera. ewUserMode`: [Tryb użytkownika](custom-launch.md?id=user-mode).

Możesz użyć narzędzi takich jak [https://bot.sannysoft.com](https://bot.sannysoft.com) , aby przetestować konfigurację.

## Odcisk palca przeglądarki

Odcisk palców przeglądarki nie jest wykryciem bota. Wykorzystuje różne sztuczki do zbierania unikalnych atrybutów przeglądarki w celu identyfikacji przeglądarki. Witryna może użyć jej do śledzenia użytkowników, nawet gdy nie są zalogowani, jest również powszechnie używana do oznaczania zgarniaków bez głowy. Na przykład różni użytkownicy zazwyczaj zainstalują różne czcionki na swoim systemie operacyjnym, możemy użyć tego do rozróżnienia różnych użytkowników. Innym przykładem byłoby użycie płótna do renderowania tekstu, różni użytkownicy zazwyczaj będą mieli różne GPP, sterowniki graficzne lub system OS, wszystkie będą miały wpływ na wynik renderowanego obrazu.

Zazwyczaj możesz uruchomić wiele instancji przeglądarki, aby mieć różne odciski palców. Jeśli chcesz użyć jednej przeglądarki do zapisywania pamięci i CPU, musisz ręcznie nadpisać API dla płótna, czcionek itp.

Możesz użyć projektów open-source, takich jak [FingerprintJS](https://github.com/fingerprintjs/fingerprintjs/) , aby przetestować konfigurację.
