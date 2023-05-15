# Navegadores & Páginas

É intuitivo usar Rod para controlar vários navegadores ou páginas ao mesmo tempo.

## Vários navegadores

Para iniciar vários navegadores:

```go
browser1 := rod. New(). MustConnect()
browser2 := rod. New(). MustConnect()
fmt. Println(browser1, browser2)
```

Todas as APIs são seguras em threads, as mesmas obras para várias rotinas.

Você também pode usar o modo anônimo para iniciar vários navegadores:

```go
browser1 := rod. New(). MustConnect()
browser2 := browser1. MustIncognito()
fmt. Println(browser1, browser2)
```

Inicie navegadores com diferentes argumentos de lançamento:

```go
browser1 := rod. New(). ControlURL(
    launcher. New(). Headless(false). MustLaunch(),
). MustConnect()

browser2 := rod. New(). ControlURL(
    launcher. New(). UserDataDir("path"). MustLaunch(),
). MustConnect()
fmt. Println(browser1, browser2)
```

## Várias páginas

To launch multiple pages for a browser:

```go
browser := rod. New(). MustConnect()
page1 := browser. MustPage("http://a.com")
page2 := browser. MustPage("http://b.com")
fmt. Println(page1, page2)
```

If a browser already has several pages open and you don't have references to them, you can use [Browser. Pages()](https://pkg.go.dev/github.com/go-rod/rod#Browser.Pages) to get a [Pages](https://pkg.go.dev/github.com/go-rod/rod#Pages) struct which is a list of tabs and/or windows with several helpful methods attached, such as [Pages. Find()](https://pkg.go.dev/github.com/go-rod/rod#Pages.Find), [Pages. FindByURL()](https://pkg.go.dev/github.com/go-rod/rod#Pages.FindByURL), [Pages. First()](https://pkg.go.dev/github.com/go-rod/rod#Pages.First), etc. Once you get a reference to the page you want you can use [Page. Activate()](https://pkg.go.dev/github.com/go-rod/rod#Page.Activate) to focus it. If you are clicking a link opens a new page then you can use [Page. WaitOpen](https://pkg.go.dev/github.com/go-rod/rod#Page.WaitOpen) to grab a reference to the new window as soon as it is launched.

## Page pool

We can use PagePool to help concurrently control and reuse pages.

Check this [example](https://github.com/go-rod/rod/blob/46baf3aad803ed5cd8671aa325cbae4e297a89a4/examples_test.go#L533)

## Browser pool

The tests in Rod is a good example of managing a pool of browsers to run tests concurrently. That's why the tests can finish in seconds. Check the code [here](https://github.com/go-rod/rod/blob/46baf3aad803ed5cd8671aa325cbae4e297a89a4/setup_test.go#L59).
