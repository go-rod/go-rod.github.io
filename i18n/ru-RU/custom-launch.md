# Пользовательский запуск браузера

## Подключиться к запущенному браузеру

You can use `launcher` lib to custom the launch of browsers, such as add or delete the browser executable command-line arguments, custom the auto-download-browser mirrors.

```bash
"/Приложения/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --remote-debugging-port=9222
```

Это даст что-то вроде этого:

```txt
DevTools listening on ws://127.0.0.1:9222/devtools/browser/4dcf09f2-ba2b-463a-8ff5-90d27c6cc913
```

The `--` prefix is optional, such as `headless` and `--headless` are the same.

```go
main

import (
    "github.com/go-rod/rod"
)

func main() {
    u := "ws://127.0.0.1:9222/devtools/browser/4dcf09f2-ba2b-463a-8ff5-90d27c6cc913"
    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

## Лаунчер lib

Поскольку приведенный выше рабочий процесс так часто используется, мы абстрагируем `лаунчер` lib для упрощения запуска браузеров. Такие как автоматическая загрузка или поиск исполняемого файла браузера, добавляйте или удаляйте исполняемые аргументы в командной строке браузера и т.д.

Таким образом, приведенный выше ручной запуск и код становится:

```go
func main() {
    u := launcher.New().Bin("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome").MustLaunch()
    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

Мы можем использовать вспомогательную функцию `launcher.LookPath` для получения исполняемого пути в браузере, приведенный выше код такой же как:

```go
func main() {
    path, _ := launcher.LookPath()
    u := launcher.New().Bin(path).MustLaunch()
    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

Если `ControlURL` не установлен, то `MustConnect` запустит `launcher.New().MustLaunch()` автоматически. По умолчанию, лаунчер будет автоматически загружать и использовать статически версионный браузер, чтобы поведение браузера было последовательным. Таким образом, вы можете упростить приведенный выше код в:

```go
func main() {
    rod.New().MustConnect().MustPage("https://example.com")
}
```

## Добавить или удалить параметры

Вы можете использовать `Set` и `Удалить` для изменения аргументов запуска браузера (флаги):

```go
пакет основного

импорта (
    "github.com/go-rod/rod"
    "github.com/go-rod/rod/lib/launcher"
)

func main() {
    u := launcher.New().
        Set("user-data-dir", "path").
        Set("headless").
        Удалить("--headless").
        MustLaunch()

    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

If you want to control every step of the launch process, such as disable the auto-download and use the system's default browser, check the [example file](https://github.com/go-rod/rod/blob/master/lib/launcher/example_test.go).

Because options like `user-data-dir`, `proxy-server`, `headless` are so often used, we added some helpers for them, so the above code can become like this:

```go
func main() {
    u := launcher.New().
        UserDataDir("путь").
        Headless(true).
        Headless(false).
        MustLaunch()

    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

Вот доступные флага: [ссылка](https://peter.sh/experiments/chromium-command-line-switches).

Подробнее о [ссылке](https://pkg.go.dev/github.com/go-rod/rod/lib/launcher#Launcher).

## Удаленное управление лаунчером

Для системы скрепежа, как правило, мы разделим скреперы и браузеры на различные кластеры, чтобы они могли масштабироваться отдельно. Rod предоставляет модуль `launcher.Manager` для удаленного управления лаунчером. С ним можно удаленно запустить браузер с пользовательскими флагами запуска. Пример его использования — [здесь](https://github.com/go-rod/rod/blob/master/lib/launcher/rod-manager/main.go).

Поскольку очень трудно правильно установить chromium на некоторых дистрибутивах linux, Rod обеспечивает образ докера, чтобы сделать его совместимыми кросс-платформами. Вот пример его использования:

1. Запустите изображение стержня `запуска докер -p 7317:7317 ghcr.io/go-rod/rod`

2. Open another terminal and run code like this [example](https://github.com/go-rod/rod/blob/master/lib/examples/remote-launch/main.go)

[Изображение настроено](https://github.com/go-rod/rod/blob/master/lib/docker/Dockerfile) на скриншоты и шрифты среди популярных природных языков. Каждый контейнер может запускать несколько браузеров одновременно.

## Режим пользователя :id=пользовательский режим

Когда вы входите в свою учетную запись github, и вы хотите повторно использовать сеанс входа в систему для автоматизации. Вы можете использовать `launcher.NewUserMode` для запуска вашего обычного браузера. Rod будет похож на расширение браузера:

```go
wsURL := launcher.NewUserMode().MustLaunch()
браузер := rod.New().ControlURL(wsURL).MustConnect().NoDefaultDevice()
```

Вот более подробный пример: [код пример](https://github.com/go-rod/rod/blob/master/lib/examples/use-rod-like-chrome-extension/main.go).

## Нижний уровень API

Если вы хотите контролировать каждый шаг процесса запуска, например, отключите автозагрузку и используйте системный браузер по умолчанию, проверьте пример файла [](https://github.com/go-rod/rod/blob/master/lib/launcher/example_test.go).
