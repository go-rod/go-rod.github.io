# Эмуляция

Rod предоставляет различные способы эмулирования окружающей среды для страниц.

## Устройства

Для настройки видового порта, пользовательского агента, ориентации и т.д. одновременно для страницы можно использовать предопределенные устройства:

```go
page.MustEmulate(devices.IPhone6or7or8Plus)
```

Или определите свое собственное устройство:

```go
page.MustEmulate(устройства). evice{
  Title: "iPhone 4",
  Capabilities: []string{"touch", "mobile"},
  UserAgent: "Mozilla/5. (iPhone; CPU iPhone OS 7_1_2 как Mac OS X)",
  AcceptLanguage: "en",
  Screen: устройства. creen{
    DevicePixelRatio: 2,
    Горизонтально: устройства. creenSize{
      Width:  480,
      Height: 320,
    },
    Вертикально: devices.Size{
      Width:  320,
      Height: 480,
    },
  },
})
```

Проверьте исходный код предопределенных устройств, поля должны сами объяснить.

Вы также можете установить устройство по умолчанию для всех страниц, используя [Browser.DefaultDevice](https://pkg.go.dev/github.com/go-rod/rod#Browser.DefaultDevice).

Эмуляция активируется по умолчанию (используя [устройства). Устройство aptopWithMDPIScreen](https://github.com/go-rod/rod/blob/bc44c39c9b4352c15d00bef6f6a1071205d2c388/lib/devices/list.go#L616) ), которое переопределяет некоторые настройки браузера по умолчанию, что лучше с точки зрения согласованности (то есть позволяет воспроизводить тесты).

Вы можете отключить функцию Эмуляции устройства, передав специальное устройство _очистить_ в `Браузер.DefaultDevice`.

```go
browser.DefaultDevice(devices.Clear)
```

Или вы можете просто использовать [Browser.NoDefaultDevice](https://pkg.go.dev/github.com/go-rod/rod#Browser.NoDefaultDevice).

## User agent

Если вы хотите указать user-agent для конкретной страницы, используйте [Page.SetUserAgent](https://pkg.go.dev/github.com/go-rod/rod#Page.SetUserAgent).

## Вид

Если вы хотите указать видовой порт для конкретной страницы, используйте [Page.SetViewport](https://pkg.go.dev/github.com/go-rod/rod#Page.SetViewport).

## Локаль и часовой пояс

Для всех страниц можно использовать запуск env:

```go
u := launcher.New().Env("TZ=America/New_York").MustConnect()
браузер := rod.New().ControlURL(u).MustConnect()
```

Или вы можете использовать [EmulationSetTimezoneOverride](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetTimezoneOverride) или [EmulationSetLocaleOverride](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetLocaleOverride) , чтобы установить для определенной страницы:

```go
proto.EmulationSetTimezoneOverride{TimezoneID: "America/New_York"}.Call(страница)
```

## Права доступа

Используйте [Браузерские права](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#BrowserGrantPermissions)

## Геолокация

Используйте [EmulationSetGeolocationOverride](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetGeolocationOverride)

## Цветовая схема и медиа

Используйте [EmulationSetEmulatedMedia](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetEmulatedMedia)

```go
proto.EmulationSetEmulatedMedia{
    Media: "screen",
    Возможности: []*proto.EmulationMediaFeature{
        {"prefers-color-scheme", "dark"},
    },
}.Call(page)
```

## Предотвратить обнаружение ботов

Обычно лучше сделать бесголовной браузер полностью прозрачным для страницы, чтобы страница не могла определить, контролируется ли он человеком или роботом. В некоторых случаях некоторые страницы могут использовать клиент js для определения, контролируется ли страница человеком или роботом, такой веб WebGL, WebDriver, или http заголовки запроса. Вы можете вручную создать js lib, чтобы скрыть все следы, или просто использовать lib [стелс](https://github.com/go-rod/stealth): [код пример](https://github.com/go-rod/stealth/blob/master/examples_test.go).

Если `stealth` lib не работает для вас, вы можете просто запустить обычный пользовательский браузер с помощью `лаунчера. Режим ewUserMode`: [Режим пользователя](custom-launch.md?id=user-mode).

Вы можете использовать такие инструменты, как [https://bot.sannysoft.com](https://bot.sannysoft.com) для проверки вашей конфигурации.

## Отпечаток браузера

Отпечаток пальца браузера не обнаружен. Он использует различные трюки для сбора уникальных атрибутов браузера для идентификации браузеров. Сайт может использовать его для отслеживания пользователей, даже если они не вошли в систему, он также широко используется для обозначения бесголовых скреперов. Например, различные пользователи обычно устанавливают различные шрифты на ОС Windows, мы можем использовать это для различения разных пользователей. Другим примером может быть использование холста для отрисовки текста, различные пользователи обычно имеют разные GPU, графические драйверы или ОС, все они повлияют на результат изображения.

Обычно вы можете запускать несколько экземпляров браузера, чтобы иметь разные отпечатки пальцев. Если вы хотите использовать один браузер для сохранения памяти и процессора, вам придется вручную переопределить API для холста, шрифтов и т.д.

Вы можете использовать проекты с открытым исходным кодом, такие как [FingerprintJS](https://github.com/fingerprintjs/fingerprintjs/) для тестирования конфигурации.
