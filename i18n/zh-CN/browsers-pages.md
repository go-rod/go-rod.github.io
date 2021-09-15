# 多浏览器与多页面

你可以很直观的使用 Rod 同时控制多个浏览器或页面。

## 多个浏览器

启动多个浏览器：

```go
browser1 := rod.New().MustConnect()
browser2 := rod.New().MustConnect()
```

所有 API 都是线程安全的，同样适用于多个 Go routines。

也可以使用隐身模式启动多个浏览器：

```go
browser1 := rod.New().MustConnect()
browser2 := browser1.MustIncognito()
```

使用不同的启动参数启动浏览器：

```go
browser1 := rod.New().ControlURL(
    launcher.New().Headless(false).MustLaunch()
).MustConnect()

browser1 := rod.New().ControlURL(
    launcher.New().UserDataDir("path").MustLaunch()
).MustConnect()
```

## 多页面

在一个浏览器中开启多个页面：

```go
browser := rod.New().MustConnect()
page1 := browser.MustPage("http://a.com")
page2 := browser.MustPage("http://b.com")
```

如果浏览器已经开启了多个页面而且你没有它们的引用，你可以 [Browser.Pages()](https://pkg.go.dev/github.com/go-rod/rod#Browser.Pages) 来获取 [Pages](https://pkg.go.dev/github.com/go-rod/rod#Pages) 结构体，这是一个由标签页或窗口组成的数组，它拥有一些帮助函数，如 [Pages.Find()](https://pkg.go.dev/github.com/go-rod/rod#Pages.Find), [Pages.FindByURL()](https://pkg.go.dev/github.com/go-rod/rod#Pages.FindByURL)， [Pages.First()](https://pkg.go.dev/github.com/go-rod/rod#Pages.First)，等等。 Once you get a reference to the page you want you can use [Page.Activate()](https://pkg.go.dev/github.com/go-rod/rod#Page.Activate) to focus it. If you are clicking a link opens a new page then you can use [Page.WaitOpen](https://pkg.go.dev/github.com/go-rod/rod#Page.WaitOpen) to grab a reference to the new window as soon as it is launched.

## 页面池

We can use PagePool to help concurrently control and reuse pages.

Check this [example](https://github.com/go-rod/rod/blob/46baf3aad803ed5cd8671aa325cbae4e297a89a4/examples_test.go#L533)

## 浏览器池

The tests in Rod is a good example of managing a pool of browsers to run tests concurrently. That's why the tests can finish in seconds. Check the code [here](https://github.com/go-rod/rod/blob/46baf3aad803ed5cd8671aa325cbae4e297a89a4/setup_test.go#L59).
