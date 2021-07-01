# Браузери & сторінки

інтуїтивно використовувати Rod для керування кількома браузерами або сторінками одночасно.

## Кілька браузерів

Щоб запустити декілька браузерів:

```go
browser1 := rod.New().MustConnect()
browser2 := rod.New().MustConnect()
```

Всі API безпечні для потоку, те ж саме працює для підпрограм декількох.

Ви також можете використовувати режим інкогніто для запуску декількох браузерів:

```go
browser1 := rod.New().MustConnect()
browser2 := 1.MustIncognito()
```

Запустити браузери з різними аргументами запуску:

```go
browser1 := rod.New().ControlURL(
    launcher.New().Headless(false).MustLaunch()
).MustConnect()

browser1 := rod.New().ControlURL(
    launcher.New().UserDataDir("path").MustLaunch()
).MustConnect()
```

## Кілька сторінок

Щоб керувати кількома сторінками у браузері:

```go
Браузер := rod.New().MustConnect()
page1 := browser.MustPage("http://a.com")
сторінка := browser.MustPage("http://b.com")
```

## Пункт сторінки

Ми можемо використовувати PagePool для допомоги в спільному контролі і повторному використанні сторінок.

Відмітьте [приклад](https://github.com/go-rod/rod/blob/46baf3aad803ed5cd8671aa325cbae4e297a89a4/examples_test.go#L533)

## Браузерний басейн

Тести в Роді є гарним прикладом управління пулом браузерів для передачі тестів в даний час. Ось чому тести можуть завершити за секунди. Перевірте код [тут](https://github.com/go-rod/rod/blob/46baf3aad803ed5cd8671aa325cbae4e297a89a4/setup_test.go#L59).
