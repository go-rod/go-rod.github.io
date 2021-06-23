# Емуляція

Тяга надає різні способи наслідування навколишнього середовища для сторінок.

## Пристрої

Щоб встановити вікно перегляду, орієнтацію, значення й т. д. одночасно для сторінки ви можете використовувати визначені пристрої:

```go
page.MustEmulate(devices.IPhone6or7or8Plus)
```

Або визначте свій власний пристрій:

```go
сторінка.MustEmulate(пристрої. evice{
  Title: "iPhone 4",
  Можливості: []string{"touch", "mobile"},
  Agent: "Mozilla/5. (iPhone; CPU для iPhone 712,147, як Mac OS X)",
  Прийняти мову: "en",
  Скрін: пристрої. creen{
    DevicePixelRatio: 2,
    Горизонталь: пристрої. creenSize{
      Width:  480,
      Height: 320,
    },
    Вертикально: пристроїes.Розмір{
      Width:  320,
      Height: 480,
    },
  },
})
```

Перевірте вихідний код попередньо визначених пристроїв, поля повинні пояснювати себе.

Ви також можете встановити пристрій за замовчуванням для всіх сторінок за допомогою [Browser.DefaultDevice](https://pkg.go.dev/github.com/go-rod/rod#Browser.DefaultDevice).

Емуляція активується за замовчуванням (використовуючи [пристрої. aptopWithMDPIScreen](https://github.com/go-rod/rod/blob/bc44c39c9b4352c15d00bef6f6a1071205d2c388/lib/devices/list.go#L616) device), який замінює деякі налаштування браузера за замовчуванням, що краще з точки зору узгодженості (тобто допомагає відтворити тести).

Ви можете вимкнути функцію емуляції пристрою, передавши спеціальний _Очистити_ пристрій на `Browser.DefaultDevice`.

```go
browser.DefaultDevice(devices.Clear)
```

Або ви можете просто використовувати [Browser.NoDefaultDevice](https://pkg.go.dev/github.com/go-rod/rod#Browser.NoDefaultDevice) помічник.

## Клієнтський додаток

Якщо ви хочете вказати user-agent для конкретної сторінки, використовуйте [Page.SetUserAgent](https://pkg.go.dev/github.com/go-rod/rod#Page.SetUserAgent).

## Вюпорт

Якщо ви бажаєте вказати вікно перегляду для певної сторінки, використовуйте [Page.SetViewport](https://pkg.go.dev/github.com/go-rod/rod#Page.SetViewport).

## Регіональний та часовий пояс

Ви можете використовувати launch env, щоб встановити для всіх сторінок:

```go
u := launcher.New().Env("TZ=America/New_York").MustConnect()
browser := rod.New().ControlURL(u).MustConnect()
```

Або ви можете використовувати [Емуляцію SetTimezoneOverride](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetTimezoneOverride) або [EmulationSetLocaleOverride](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetLocaleOverride) для встановлення для певної сторінки:

```go
proto.EmulationSetTimezoneOverride{TimezoneID: "Америка/New_York"}.Call(сторінка)
```

## Дозволи

Використовувати [BrowserGrantPermissions](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#BrowserGrantPermissions)

## Геопозиціювання

Використовувати [Емуляцію SetGeolocationOverride](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetGeolocationOverride)

## Кольорова схема та медіа

Використовувати [Емуляцію SetulatedMedia](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetEmulatedMedia)

```go
proto.EmulationSetulatedMedia{
    Media: "screen",
    Особливості: []*proto.EmulationMediaFeature{
        {"prefers-color-scheme", "dark"},
    },
}.Call(page)
```

## Запобігання виявлення ботів

Зазвичай, краще зробити так, щоб головний браузер повністю прозорий для сторінки, щоб він не зміг зрозуміти, чи контролюється людина або робота. В деяких випадках, деякі сторінки могли використовувати клієнтських J, щоб визначити, чи здійснює управління сторінкою людиною або роботом, такі заголовки WebGL, WebDriver, або http запитів. Ви можете використати js lib, щоб виготовити всі сліди, або просто використати [lib](https://github.com/go-rod/stealth): [код](https://github.com/go-rod/stealth/blob/master/examples_test.go).

Якщо `крадіжка` куба не працює, ви можете просто запустити звичайний користувацький браузер з `лаунчер. ewUserMode`: [mode](custom-launch.md?id=user-mode).

Ви можете використовувати такі інструменти як [https://bot.sannysoft.com](https://bot.sannysoft.com) для тестування вашої конфігурації.

## Відбиток браузера

Відбиток бравзера не є виявленням бота. Застосовується різні трюки для збору унікальних атрибутів браузера для ідентифікації браузера. Сайт може використовувати його для відслідковування користувачів, навіть якщо вони не зареєстровані, він також широко використовується для відмітки заголовків хмарочосів. Наприклад, інші користувачі зазвичай встановлюють різні шрифти на ОС, ми можемо використати це, щоб розрізнити різних користувачів. Інший приклад використання полотна для візуалізації тексту, різні користувачі зазвичай матимуть різні GPU, графічні водії або OS, всі вони вплинуть на результат рендереного зображення.

Зазвичай ви можете запустити декілька екземплярів браузера для різних відбитків пальців. Якщо ви хочете використовувати один браузер, щоб зберегти пам'ять і процесор, вам потрібно вручну змінити API на полотно, шрифти і т.д.

Ви можете використовувати проекти з відкритим вихідним кодом, такі як [відбитки пальців](https://github.com/fingerprintjs/fingerprintjs/) для перевірки вашої конфігурації.
