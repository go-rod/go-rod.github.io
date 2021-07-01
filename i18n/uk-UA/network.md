# Мережа

## Запити cіджака

Ви можете використовувати мотузку для викрадення будь-якого HTTP або HTTPS трафіку.

Увесь процес викрадення одного запиту:

```text
   браузер --req-> жорстка ---> сервер ---> rod --res-> браузер
```

Коли браузер хоче відправити запит на сервер, він спочатку відправить запит до Проза, потім Rod діятиме, як проксі-сервер для надсилання запиту на справжній сервер і повернення відповіді на браузер. `--req->` і `--res->` це частини, які можна змінити.

Наприклад, щоб замінити файл `test.js` на сервер, ми можемо зробити щось на зразок цього:

```go
Браузер := rod.New().MustConnect()

маршрутизатор := browser.HijackRequests()

router.MustAdd("*/test.js", func(ctx *rod.Hijack) {
    ctx.MustLoadResponse()
    ctx.Response.Response.SetBody(`console. og("js файл замінено")`)
})

go router.Run()

сторінка := browser.MustPage("https://test.com/")

// Hijack запитів під областю сторінки
page.HijackRequests()
```

Для отримання додаткової інформації перевірте [тест](https://github.com/go-rod/rod/blob/master/hijack_test.go)
