# Javascript Runtime

Мы можем использовать Rod для оценки случайного кода javascript на странице. Например, использовать его для чтения или изменения HTML содержимого страницы.

## Оценка на странице

Например, используйте `Page.Eval` , чтобы установить глобальное значение:

```go
page.MustEval(`window.a = {name: 'jack'}`)
```

Мы можем использовать функцию js для передачи значения в качестве аргументов json:

```go
key := "a"
данных := map[string]string{"name": "jack"}
page.MustEval(`(k, val) => {
    window[k] = val
}`, key, data)
```

Для получения возвращаемого значения от Eval:

```go
val := page.MustEval(`a`).Get("name").Str()
fmt.Println(val) // output: jack
```

## Определить глобальную функцию

Метод `Page.Evaluate` будет выполнять функцию, если она является определением функции.

Например, тестовая функция `` ниже будет выполняться немедленно, она не будет рассматриваться как определение функции:

```go
page.MustEval(`function test() { alert('ok') }`)

page.MustEval(`test()`) // паника с тестом, не определенным
```

Чтобы определить глобальную функцию `тест` , вы можете выполнить код, потому что крайний предел является назначением, а не определением функции:

```go
page.MustEval(`test = function () { alert('ok') }`)

page.MustEval(`test()`)
```

## Выполнение элемента

`Element.Eval` is similar with `Page.Eval`, but with the `this` object set to the current element. Например, на странице у нас есть `<button>Отправьте</button>` </code>, мы можем прочитать или изменить элемент с JS:

```go
el := page.MustElement("кнопка")
el.MustEval(`this.innerText = "Apply"`) // Изменить содержимое
txt := el.MustEval(`this.innerText`).Str()
fmt.Println(txt) // output: Применить
```

## Рассказать о функциях Перейти на страницу

Мы можем использовать `Page.Expose` для выявления функции обратного вызова на эту страницу. Например, здесь мы обнаружили функцию, чтобы помочь странице вычислить md5 хэш:

```go
page.MustExpose("md5", func(g gson.JSON) (interface{}, error) {
    return md5.Sum([]byte(g.Str())), nil
})
```

Теперь страница может вызывать этот метод в объекте окна:

```go
хэш := page.MustEval(`window.md5("test")`).Str()
```
