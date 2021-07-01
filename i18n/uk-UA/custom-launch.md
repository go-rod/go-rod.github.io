# Користувальницький браузер запущений

## Під'єднайтеся до запущеного браузера

Знайдіть виконуваний шлях браузера, який можна виконати на macOS запустити:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --remote-debugging-port=9222
```

Вона виведе на вихід щось:

```txt
DevTools слухають на ws://127.0.0.1:9222/devtools/browser/4dcf09f2-ba2b-463a-8ff5-90d27c6c913
```

Зверху `ws://127.0.0.1:9222/devtools/browser/4dcf09f2-ba2b-463a-8ff5-90d27c6c913` - це інтерфейс для керування браузером:

```go
пакет головний

імпорт (
    "github.com/go-rod/rod"
)

func main() {
    u := "ws://127.0.0.0.1:9222/devtools/browser/4dcf09f2-ba2b-463a-8ff5-90d27cc913"
    rod.New().Control(u).MustConnect().MustConnect().MustConnect().Mage
}
```

## Тривога

Тому що вищезгаданий робочий процес часто використовується, ми абстрагуємо `лаунчер` милий, щоб спростити запуск браузерів. При автоматичному завантаженні або пошуку виконуваного браузера додавання або видалення аргументів, які виконуваний командний рядок браузера тощо.

Таким чином, настає ручний запуск та код:

```go
func main() {
    u := launcher.New().Bin("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome").MustLaunch()
    rod.New().ControlURL(u).MustConnect().MustConnect().MustPage("https://example.com")
}
```

Ми можемо використовувати допоміжну функцію `launcher.LookPath` щоб отримати виконуваний шлях браузера, наведений вище код такий самий:

```go
func main() {
    path, _ := launcher.LookPath()
    u := launcher.New().Bin(path).MustLaunch()
    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

Якщо `ControlURL` не встановлено, `MustConnect` запуститься `launcher.New().MustLaunch()` автоматично. По замовчуванню, лаунчер буде автоматично завантажувати та використовувати статично версійний браузер, щоб браузер дотримувався правих. Можна спростити наведений вище код на:

```go
func main() {
    rod.New().MustConnect().MustPage("https://example.com")
}
```

## Додати або видалити параметри

Ви можете використовувати `Встановити` і `Видалити` для зміни аргументів запуску браузера (flags):

```go
пакет головний

імпорт (
    "github.com/go-rod/rod"
    "github.com/go-rod/rod/lib/launcher"
)

func main() {
    u := launcher.New().
        Встановити("user-data-dir", "шлях").
        Встановити("безголові").
        Видалити("--headless").
        MustLaunch()

    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")

```

Як ви можете побачити згори `--` префікс є необов'язковим, наприклад, `headless` і `--headless` - те саме.

Оскільки параметри `user-data-dir`, `proxy-server`, `без заголовків` часто використовуються, ми додали для них кілька помічників, так що наведений вище код може стати наступним чином:

```go
func main() {
    u := launcher.New().
        UserDataDir("шлях").
        Headless(true).
        Headless(false).
        MustLaunch()

    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")

```

Ось доступні прапори: [посилання](https://peter.sh/experiments/chromium-command-line-switches).

Прочитайте API doc для додаткової інформації: [посилання](https://pkg.go.dev/github.com/go-rod/rod/lib/launcher#Launcher).

## Віддалене керування запускачем

Для системи виробництва, як правило, ми розділимо катувальники і брокери на різні кластери, щоб вони могли розташовуватися окремо. Rod надає модуль `launcher.Manager` для дистанційного керування. З допомогою цього ми можемо віддалено запустити браузер з власними прапорами запуску. Приклад використання цього є [тут](https://github.com/go-rod/rod/blob/master/lib/launcher/rod-manager/main.go).

Оскільки дуже важко встановити chromium правильно на деякі розподіли Linux, Rod надає docker образ, щоб зробити його стійкими крос-платформами. Ось приклад, який це використання:

1. Запустити зображення стрижня `докер запустити -p 7317:7317 ghcr.io/go-rod/rod/rod`

2. Відкрийте інший термінал і запустіть код, як це [приклад](https://github.com/go-rod/rod/blob/master/lib/examples/launch-managed/main.go)

Зображення [налаштовано](https://github.com/go-rod/rod/blob/master/lib/docker/Dockerfile) для скріншотів і шрифтів серед популярних природних мов. Кожен контейнер може запускати декілька браузерів одночасно.

## Режим користувача :id=user-mode

Коли ви увійдете в свій обліковий запис на GitHub, і ви хочете повторно використовувати сеанс входу для автоматизації завдання. Ви можете використовувати `launcher.NewUserMode` для запуску звичайного браузера користувача. Род буде просто як розширення для браузера:

```go
wsURL := launcher.NewUserMode().MustLaunch()
browser := rod.New().ControlURL(wsURL).MustConnect().NoDefaultDevice()
```

Ось більш детальний приклад: [приклад коду](https://github.com/go-rod/rod/blob/master/lib/examples/use-rod-like-chrome-extension/main.go).

## API низького рівня

Якщо ви хочете контролювати кожен крок запуску, наприклад, відключити автозавантаження і використовувати браузер за замовчуванням системи, перевірити [приклад файлу](https://github.com/go-rod/rod/blob/master/lib/launcher/example_test.go).
