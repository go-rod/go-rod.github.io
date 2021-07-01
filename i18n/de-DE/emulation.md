# Emulation

Rod bietet verschiedene Möglichkeiten, die Umgebung für Seiten zu emulieren.

## Geräte

Um den Viewport, den User-Agent, die Orientierung usw. gleichzeitig für eine Seite festzulegen, können Sie die vordefinierten Geräte verwenden:

```go
page.MustEmulate(devices.IPhone6or7or8Plus)
```

Oder definieren Sie Ihr eigenes Gerät:

```go
page.MustEmulate(Geräte. evice{
  Titel: "iPhone 4",
  Fähigkeiten: []string{"touch", "mobile"},
  UserAgent: "Mozilla/5. (iPhone; CPU iPhone OS 7_1_2 wie Mac OS X)",
  AcceptLanguage: "en",
  Bildschirm: Geräte. creen{
    DevicePixelRatio: 2,
    Horizontal: Geräte. creenGröße{
      Width:  480,
      Height: 320,
    },
    Vertikal: Geräte. Bildschirmgröße{
      Width:  320,
      Height: 480,
    },
  },
})
```

Überprüfen Sie den Quellcode der vordefinierten Geräte, die Felder sollten sich selbst erklären.

Sie können das Standardgerät für alle Seiten auch mit [Browser.DefaultDevice](https://pkg.go.dev/github.com/go-rod/rod#Browser.DefaultDevice) setzen.

Emulation ist standardmäßig aktiviert (mit den [Geräten. aptopWithMDPIScreen](https://github.com/go-rod/rod/blob/bc44c39c9b4352c15d00bef6f6a1071205d2c388/lib/devices/list.go#L616) device), das einige der Standardeinstellungen des Browsers überschreibt, was besser in Bezug auf Kohärenz ist (d.h. es hilft, Tests zu reproduzieren).

Sie können die Funktion Geräte-Emulation deaktivieren und das spezielle _Leere_ Gerät an das `Browser.DefaultDevice` übergeben.

```go
browser.DefaultDevice(devices.Clear)
```

Oder Sie können einfach den [Browser.NoDefaultDevice](https://pkg.go.dev/github.com/go-rod/rod#Browser.NoDefaultDevice) Helfer verwenden.

## User-Agent

Wenn Sie einen User-Agent für eine bestimmte Seite angeben möchten, verwenden Sie [Page.SetUserAgent](https://pkg.go.dev/github.com/go-rod/rod#Page.SetUserAgent).

## Viewport

Wenn Sie den Viewport für eine bestimmte Seite angeben möchten, verwenden Sie [Page.SetViewport](https://pkg.go.dev/github.com/go-rod/rod#Page.SetViewport).

## Sprache und Zeitzone

Du kannst den Start env für alle Seiten verwenden:

```go
u := launcher.New().Env("TZ=America/New_York").MustConnect()
Browser := rod.New().ControlURL(u).MustConnect()
```

Oder Sie können [EmulationSetTimeZoneOverride](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetTimezoneOverride) oder [EmulationSetLocaleOverride](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetLocaleOverride) für eine bestimmte Seite verwenden:

```go
proto.EmulationSetTimezoneOverride{TimezoneID: "America/New_York"}.Call(page)
```

## Berechtigungen

[BrowserGrantPermissionen verwenden](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#BrowserGrantPermissions)

## Ortung

[EmulationSetGeolocationOverride verwenden](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetGeolocationOverride)

## Farbschema und Medien

[EmulationSetEmulatedMedia verwenden](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetEmulatedMedia)

```go
proto.EmulationSetEmulatedMedia{
    Medien: "screen",
    Funktionen: []*proto.EmulationMediaFeature{
        {"prefers-color-scheme", "dark"},
    },
}.Call(page)
```

## Bot-Erkennung verhindern

Normalerweise ist es besser, den kopflosen Browser vollständig transparent für die Seite zu machen, so dass die Seite nicht sagen kann, ob sie von einem Menschen oder Roboter kontrolliert wird. In einigen Fällen könnte eine Seite Client Js verwenden, um festzustellen, ob die Seite von einem Menschen oder einem Roboter kontrolliert wird, solche WebGL, WebDriver oder http Request Header. Du kannst eine js lib handhaben, um alle Spuren zu verstecken, oder einfach die lib [stealth](https://github.com/go-rod/stealth): [Code-Beispiel](https://github.com/go-rod/stealth/blob/master/examples_test.go) verwenden.

Wenn `Stealth` lib nicht für Sie funktioniert, können Sie einfach den normalen Browser mit `Launcher starten. ewUserMode`: [Benutzermodus](custom-launch.md?id=user-mode).

Sie können Werkzeuge wie [https://bot.sannysoft.com](https://bot.sannysoft.com) verwenden, um Ihre Konfiguration zu testen.

## Browser-Fingerabdruck

Browser-Fingerabdruck ist keine Bot-Erkennung. Es verwendet verschiedene Tricks, um eindeutige Browserattribute zu sammeln, um Browser zu identifizieren. Website kann verwendet werden, um Benutzer zu verfolgen, auch wenn sie nicht eingeloggt sind, ist es auch weit verbreitet, kopflose Scraper zu markieren. Zum Beispiel, verschiedene Benutzer in der Regel verschiedene Schriftarten auf ihrem Betriebssystem installieren, können wir dies verwenden, um verschiedene Benutzer zu unterscheiden. Ein weiteres Beispiel wäre, die Leinwand zu benutzen, um Text zu rendern, andere Benutzer werden normalerweise unterschiedliche GPUs haben, -Grafiktreiber oder Betriebssysteme, die alle das Ergebnis des gerenderten Bildes beeinflussen.

Normalerweise können Sie mehrere Browser-Instanzen starten, um unterschiedliche Fingerabdrücke zu haben. Wenn Sie einen einzelnen Browser verwenden wollen, um Speicher und CPU zu speichern, müssen Sie die API für Leinwand, Schriftarten usw. manuell überschreiben.

Sie können Open-Source-Projekte wie [FingerprintJS](https://github.com/fingerprintjs/fingerprintjs/) verwenden, um Ihre Konfiguration zu testen.
