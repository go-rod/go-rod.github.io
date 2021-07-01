# Runtime JavaScript

Ми можемо використовувати мотузку для оцінки випадкового коду javascript на сторінці. Такий як використання його для читання та зміни HTML вмісту сторінки.

## Евалон на сторінці

Наприклад, використовуйте `Page.Eval` щоб встановити глобальне значення:

```go
сторінка MustEval(`window.a = {name: 'jack'}`)
```

Ми можемо використати JS функцію, щоб передати значення в якості аргументів Json:

```go
key := "a"
data := map[string]string{"name": "jack"}
page.MustEval(`(k, val) => {
    window[k] = val
}`, key, data)
```

Щоб отримати повернуте значення з долини:

```go
val := page.MustEval(`a`).Get("name").Str()
fmt.Println(val) // вивід jack
```

## Визначити глобальну функцію

Метод `Page.Evaluate` виконає функцію, якщо його зовнішнє значення є визначенням функції.

Наприклад, функція `тесту` нижче буде виконана негайно, вона не буде розглядатися як функція визначення:

```go
page.MustEval(`function test() { alert('ok') }`)

page.MustEval(`test()`) // паніка з тестом не визначена
```

Щоб визначити глобальну функцію `тест,` ви можете програмувати на зразок цього, оскільки це є присвоєння, а не визначенням функції:

```go
page.MustEval(`test = function () { alert('ok') }`)

page.MustEval(`test()`)
```

## Евал у елементі

`Елемент .Eval` схоже на `Page.Eval`, але з `об'єктом` встановлений в поточний елемент. For example, we have a `<button>Submit</button>` on the page, we can read or modify the element with JS:

```go
el := page.MustElement("button")
el.MustEval(`this.innerText = "Apply"`) // Змініть вміст
txt := el.MustEval(`this.innerText`).Str()
fmt.Println(txt) // вивід файлу: застосувати
```

## Побудувати функції Перейти до сторінки

Ми можемо використовувати `Page.Expose` , щоб відобразити функції зворотного виклику на сторінку. For example, here we expose a function to help the page to calculate md5 hash:

```go
page.MustExpose("md5", func(g gson.JSON) (interface{}, error) {
    return md5.Sum([]byte(g.Str())), nil
})
```

Тепер сторінка може викликати цей метод в об'єкті вікна:

```go
hash := page.MustEval(`window.md5("test").Str()
```
