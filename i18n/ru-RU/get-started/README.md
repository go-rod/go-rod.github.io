# Начните с стержня

## Требования

[Golang](https://golang.org/) является единственным требованием, вам даже не нужно ничего знать о HTML.

Если вы никогда не использовали Golang, [установите](https://golang.org/doc/install) его, и вы можете освоить его в часах: [Тур по Go](https://tour.golang.org/welcome).

## Первая программа

Давайте воспользуемся Rod, чтобы открыть страницу и сделать скриншот ее, сначала создайте файл "main.go" с содержимым ниже:

```go
генеральный

импорт "github.com/go-rod/rod"

func main() {
    page := rod.New().MustConnect().MustPage("https://www.wikipedia.org/")
    page.MustWaitLoad().MustScreenshot("a.png")
}
```

`rod.New` создает объект браузера, `MustConnect` запускает и подключается к браузеру. `MustPage` создает объект страницы, он похож на страницу в браузере. `MustWaitLoad` ожидает полной загрузки страницы. `MustScreenshot` делает скриншот страницы.

Создать модуль:

```bash
go env -w GOPROXY=https://goproxy.io,direct
go mod init learn-rod
go mod tidy
```

Запуск модуля:

```bash
идите запустить .
```

Программа выведет скриншот "a.png", как показано ниже:

![первая программа](first-program.png)

## Посмотрите, что находится в канун

Для старших разработчиков вы можете пропустить все и прочитать этот файл: [ссылка](https://github.com/go-rod/rod/blob/master/examples_test.go).

По умолчанию, Rod отключит интерфейс браузера для увеличения производительности. Но при разработке задачи автоматизации мы обычно заботимся о простоте отладки. Rod предоставляет множество решений, которые помогут вам отладить код.

Давайте создадим конфигурационный файл ".rod" в текущем рабочем каталоге. Содержимое:

```txt
показать
```

Это означает "показать интерфейс браузера на переднем плане". Прежде чем мы снова запустим модуль, давайте добавим `раз.Sleep(время. наш)` до конца кода, чтобы его поймать не было слишком быстро, код "main. о" теперь становится:

```go
главный импорт пакетов

(
    "время"

    "github.com/go-rod/rod"
)

func main() {
    page := rod.New().MustConnect().MustPage("https://www.wikipedia.org/")
    page.MustWaitLoad().MustScreenshot("a.png")
    time.Sleep(time.Hour)
}
```

Если вы запустили модуль снова, вы увидите браузер так:

![показать](show.png)

Нажмите [CTRL + C](https://en.wikipedia.org/wiki/Control-C) на клавиатуре, чтобы остановить программу.

## Введите и нажмите

Давайте автоматизируем сайт для поиска по ключевому слову "земля". Веб-сайт может иметь много полей ввода или кнопок, нам нужно сообщить программе, какой будет управляться. Обычно мы используем [Devtools](https://developers.google.com/web/tools/chrome-devtools/) , чтобы помочь нам найти элемент, который мы хотим контролировать. давайте добавим новую конфигурацию к файлу ".rod", чтобы включить Devtools, теперь:

```txt
show
devtools
```

Запустите "main. , снова переместите курсор мыши в поле ввода и щелкните правой кнопкой мыши над ним, вы увидите контекстное меню, затем нажмите кнопку "Просмотр":

![исследовать](inspect.png)

Вы должны увидеть `<входной код id="searchInput` как ниже:

![input](input.png)

Щелкните правой кнопкой мыши, чтобы скопировать селектор [css](css-selector.md) , как изображение выше. Содержимое в вашем буфере обмена будет "#searchInput". Мы будем использовать его, чтобы найти элемент для ввода ключевого слова. Теперь "main.go" становится:

```go
генеральный импорт пакета

(
    "time"

    "github. om/go-rod/rod"
)

func main() {
    page := rod.New().MustConnect().MustPage("https://www.wikipedia. rg/").MustWindowFullscreen()

    page.MustElement("#searchInput").MustInput("earth")

    page.MustWaitLoad().MustScreenshot("a.png")
    time.Sleep(time.Hour)
}
```

`MustWindowFullscreen` расширяет окно браузера, чтобы упростить отладку. Мы используем `MustElement` и селектор, который мы скопировали из панели Devtools чтобы получить элемент, который мы хотим манипулировать. `MustElement` будет автоматически ждать появления элемента, поэтому не нужно использовать `MustWaitLoad` перед этим. Затем мы называем `MustInput` для ввода в него ключевого слова "земля". Если вы перезапустите "main.go", вы увидите результат похожий на ниже:

![после](after-input.png)

Подобно полю ввода, щелкните правой кнопкой мыши по кнопке поиска , чтобы скопировать селектор для него:

![search-btn](search-btn.png)

![search-btn-selector](search-btn-selector.png)

Затем добавьте код, чтобы нажать кнопку поиска, теперь "main.go" выглядит так:

```go
основной пакет

импорт "github.com/go-rod/rod"

func main() {
    page := rod.New().MustConnect().MustPage("https://www.wikipedia.org/").MustWindowFullscreen()

    page.MustElement("#searchInput").MustInput("earth")
    page.MustElement("#search-form > fieldset > button").MustClick()

    page.MustWaitLoad().MustScreenshot("a.png")
}
```

Если мы перезапустим модуль, "a.png" отобразит результат поиска:

![земляная страница](earth-page.png)

## Замедление движения и визуальный след

Автоматизированные операции слишком быстро, чтобы поймать человеческие глаза, чтобы отладить их, мы обычно включили медленное движение и визуальные настройки трассировки, давайте обновим ". od" файл:

```txt
показать
slow=1s
трассировку
```

Затем перезапустите модуль, теперь каждое действие будет ждать 1 секунду до его выполнения. На странице вы увидите отладочный след, созданный Rod как ниже:

![трассировка](trace.png)

Как вы можете видеть на кнопке поиска, Rod создаст мок-курсор мыши.

На консоли вы увидите журнал трассировки как ниже:

```txt
[rod] 2020/11/11 11:11:11 [eval] {"js":"rod.element","params":["#searchInput"]}
[rod] 2020/11/11 11:11:11 [eval] {"js":"rod. видимый", this":"input#searchInput"}
[rod] 2020/11/11 11:11:11 [input] прокрутка во взгляд
[rod] 2020/11/11 11:11:11 [input] Ввод Земли
[rod] 2020/11/11 11:11:11 [eval] {"js":"rod. lement","params":["#search-form > fieldset > button"]}
[rod] 2020/11/11 11:11:11 [eval] {"js":"rod.visible","this":"button.pure-button. ure-button-основная прогрессия"}
[rod] 2020/11/11 11:11:11:11 [input] прокрутка в взгляд
[rod] 2020/11/11 11:11:11 [input] клик левой кнопкой мыши
```

## Кроме файла ".rod"

The ". Файл od" является просто ярлыком для некоторых распространенных API, вы можете также вручную задать их в коде, например "медленно", код для установки как `проволока. ew().Меддвижение(2* время.секунд)`. Вы также можете использовать переменную окружения , чтобы установить ее, например, на Mac или Linux: `rod=show go main.go`.

## Получить текст

Rod предоставляет множество удобных методов для извлечения содержимого из страницы.

Давайте попробуем получить описание Земли, используя ту же технику, которую мы ранее использовали для копирования селектора из Devtools:

![get-текст](get-text.png)

Используемый нами метод - `MustText`, здесь полный код:

```go
package main

import (
    "fmt"

    "github.com/go-rod/rod"
)

func main() {
    page := rod.New().MustConnect().MustPage("https://www.wikipedia.org/")

    page.MustElement("#searchInput").MustInput("earth")
    page.MustElement("#search-form > fieldset > button").MustClick()

    el := page.MustElement("#mw-content-text > div.mw-parser-output > p:nth-child(6)")
    fmt.Println(el.MustText())
}
```

Если мы перезапустим модуль, мы увидим консоль для вывода чего:

```txt
Земля является третьей планетой от Солнца и единственным астрономическим объектом, известным как гавань жизни.
...
```

## Получить содержимое изображения

То же, что и получить текст, мы также можем получить изображения со страницы, давайте получим селектор изображения Земли и воспользуемся `MustResource` для получения бинарного изображения:

![get-image](get-image.png)

Полный код:

```go
основной импорт пакета

(
    "github.com/go-rod/rod"
    "github. om/go-rod/rod/lib/utils"
)

func main() {
    page := rod. ew().MustConnect().MustPage("https://www.wikipedia.org/")

    page.MustElement("#searchInput").MustInput("earth")
    page ustElement("#search-form > fieldset > button").MustClick()

    el := page.MustElement("#mw-content-text > div.mw-parser-output > table. nfobox > tbody > tr:nth-child(1) > td > a > img")
    _ = утилиты. utputFile("b.png", el.MustResource())
}
```

Выходной файл "b.png" должен быть:

![земля](earth.png)
