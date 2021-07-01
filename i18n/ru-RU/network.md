# Сеть

## Запросы на захват

Вы можете использовать Rod для захвата любого HTTP или HTTPS трафика.

Весь процесс взлома одного запроса:

```text
   браузер --req-> rod ---> сервер ---> rod --res-> браузер
```

When the browser wants to send a request to a server, it will send the request to Rod first, then Rod will act like a proxy to send the request to the actual server and return the response to the browser. `--req->` и `--res->` являются частями, которые могут быть изменены.

Например, чтобы заменить файл `test.js` ответ от сервера, мы можем что-то сделать так:

```go
browser := rod.New().MustConnect()

router := browser.HijackRequests()

router.MustAdd("*/test.js", func(ctx *rod.Hijack) {
    ctx.MustLoadResponse()
    ctx.Response.SetBody(`console. og("js file replaced")`)
})

go router.Run()

page := browser.MustPage("https://test.com/")

// Запросы на hijack в области страницы
page.HijackRequests()
```

Для получения дополнительной информации проверьте [тесты захвата](https://github.com/go-rod/rod/blob/master/hijack_test.go)
