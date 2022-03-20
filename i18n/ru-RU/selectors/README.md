# Селекторы

Жезл предоставляет множество методов для получения элементов. Their names are all prefixed with `MustElement` or `Element`. If you use an IDE after you type `Element`, you will see all the available selectors like below:

![ide-селекторы](ide-selectors.png)

Если вы наведите курсор на метод, вы увидите его как ниже:

![ide-doc](ide-doc.png)

Обычно для достижения задачи автоматизации вам требуется лишь некоторое базовое знание [CSS Selector](css-selector). В остальной документации мы будем использовать только CSS Selector для получения элементов со страницы.

## По тексту

Используйте `ElementR` для сопоставления элементов с конкретным текстовым содержимым, например, выберите поисковый вход на скриншоте ниже:

![текст совпадений](match-text.png)

```go
page.MustElementR("input", "Search or jump")
page.MustElementR("input", "/click/i") // используйте регистрационный флаг "i"
```

Поскольку мы используем [js regex](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp), нам не нужно сопоставлять весь текстовый контекст. Текст, который будет соответствовать тому, что вы на самом деле видите на сайте, а не исходный код, сравнить 1 и 2 в скриншоте ниже. Вы можете использовать `копирование` помощника в Devtools для копирования текста в буфер обмена (смотрите 4):

![копировать текст](copy-text.png)

## По XPath

CSS селектор является рекомендованным способом для выбора элементов, например, вы не можете использовать XPath для выбора [отображаемого текста](https://stackoverflow.com/questions/51992258/xpath-to-find-pseudo-element-after-in-side-a-div-element-with-out-any-content/51993454). Но иногда XPath может быть handier для программистов, исходящих от других языков. Используйте `ElementX` для XPath:

```go
page.MustElementX("//h2")
```

## По Javascript

Если у вас есть сложный запрос или вы хотите использовать высокоуровневую систему запросов, такую как [jQuery](https://jquery.com/):

```go
page.MustElementByJS(`() => jQuery('option:selected')[0]`)
```

Actually, if you check the source code of other selectors, such as `Element` or `ElementR`, they are all based on `ElementByJS`, and `ElementByJS` is based on `Page.Evaluate`, for more details about how to evaluate js, check the [Javascript Runtime](/javascript-runtime.md). Обычно вы используете `ElementByJS` для создания собственного селектора для расширения Rod.

## Выберите список элементов

Названия методов, чтобы получить несколько элементов префиксованы `MustElements` или `Элементы`. One key difference between a single-selector and a multi-selector is the single-selector will wait for the element to appear. Если множественный селектор ничего не найдет, он немедленно вернет пустой список.

## Дерево элементов хода

There are also some handy selectors to select elements inside or around an element, such as `MustParent`, `MustNext`, `MustPrevious`, etc.

Вот пример того, как мы используем различные селекторы для получения содержимого страницы:

```go
// На awesome-go странице, находясь в указанном разделе sect,
// и получаем связанные проекты со страницы.
func main() {
    page := rod.New().MustConnect().MustPage("https://github.com/avelino/awesome-go")

    раздел := page.MustElementR("p", "Selenium and browser control tools"). ustNext()

    // получение дочерних элементов элемента
    проектов := секции. ustElements("li")

    для _, project := range projects {
        link := project. Журнал ustElement("a")
        . rintf(
            "project %s (%s): '%s'",
            ссылка. ustText(),
            ссылка. ustProperty("href"),
            проекта. ustText(),
        )
    }
}
```

## Получить элементы из iframes

Например, мы хотим получить кнопку из вложенных iframes:

![iframes](iframes.png)

Код будет выглядеть так:

```go
frame01 := page.MustElement("iframe").MustFrame()
iframe02 := iframe01.MustElement("iframe").MustFrame()
frame02.MustElement("button")
```

## Поиск элементов

Есть еще один мощный помощник, чтобы получить элементы, `MustSearch`. It's less precise than the selectors mentioned above, but it's handy if you want to get elements from deep nested iframes or shadow-doms.

The functionality is the same as the [Devtools' Search for nodes](https://developers.google.com/web/tools/chrome-devtools/dom#search), you can use it to find out what keyword to use to select the element you want, like the screenshot below:

![поиск](search.png)

Чтобы получить один и тот же элемент из [получить элементы из iframes](#get-elements-from-iframes), мы можем просто код:

```go
page.MustSearch("кнопка")
```

## Селекторы гонок

Жук поощряет автоматизацию без спа, чтобы уменьшить хлопот. Когда действие имеет несколько результатов, мы не используем сна, чтобы ждать перенаправления страницы или расположиться. Например, когда мы входим в страницу, пароль может быть неправильным, мы хотим обработать успех и неудачу отдельно. Мы должны избегать кода, как указано ниже:

```go
func main() {
    page := rod.New().MustConnect().MustPage("https://leetcode.com/accounts/login/")

    page.MustElement("#id_login").MustInput("имя пользователя")
    page.MustElement("#id_password").MustInput("password").MustPress(input.Enter)

    time.Sleep(10 * time.Second) // Не используйте время.Sleep!

    if page.MustHas(". av-user-icon-base") {
        // распечатать имя пользователя после успешного входа
        fmt. rintln(*el.MustAttribute("title"))
    } else if page. ustHas("[data-cy=sign-in-error]") {
        // когда неправильное имя пользователя или пароль
        fmt. rintln(el.MustText())
    }
}
```

Вместо этого мы должны написать код:

```go
func main() {
    страница := rod.New().MustConnect().MustPage("https://leetcode.com/accounts/login/")

    page.MustElement("#id_login").MustInput("имя пользователя")
    страница. ustElement("#id_password").MustInput("пароль").MustPress(input.Enter)

    // Будет проводиться опрос до тех пор, пока один селектор не найдет совпадение
    page.Race().Element(". av-user-icon-base").MustHandle(func(e *rod. lement) {
        // распечатать имя пользователя после успешного входа
        fmt. rintln(*e.MustAttribute("title"))
    }). lement("[data-cy=sign-in-error]").MustHandle(func(e *rod. lement) {
        // когда неправильное имя пользователя или пароль
        panic(e. ustText())
    }).MustDo()
}
```
