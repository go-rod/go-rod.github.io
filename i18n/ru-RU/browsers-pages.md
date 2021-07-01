# Браузеры & страницы

Интуитивно понятно использовать Rod для управления несколькими браузерами или страницами одновременно.

## Несколько браузеров

Для запуска нескольких браузеров:

```go
browser1 := rod.New().MustConnect()
browser2 := rod.New().MustConnect()
```

Все API безопасны для потоков, одинаковые работают для нескольких процедур Go.

Вы также можете использовать режим инкогнито для запуска нескольких браузеров:

```go
browser1 := rod.New().MustConnect()
browser2 := browser1.MustIncognito()
```

Запускать браузеры с различными параметрами запуска:

```go
browser1 := rod.New().ControlURL(
    launcher.New().Headless(false).MustLaunch()
).MustConnect()

browser1 := rod.New().ControlURL(
    launcher.New().UserDataDir("path").MustLaunch()
).MustConnect()
```

## Несколько страниц

Управлять несколькими страницами браузера:

```go
браузер := rod.New().MustConnect()
page1 := browser.MustPage("http://a.com")
page2 := browser.MustPage("http://b.com")
```

## Пул страницы

Мы можем использовать PagePool для одновременного контроля и повторного использования страниц.

Проверьте этот [пример](https://github.com/go-rod/rod/blob/46baf3aad803ed5cd8671aa325cbae4e297a89a4/examples_test.go#L533)

## Пул браузера

Тест на Rod является хорошим примером управления пулом браузеров для одновременного запуска тестов. Поэтому тесты могут завершиться в считанные секунды. Проверьте код [здесь](https://github.com/go-rod/rod/blob/46baf3aad803ed5cd8671aa325cbae4e297a89a4/setup_test.go#L59).
