# المتصفحات & الصفحات

من البديهي استخدام Rod للتحكم في العديد من المتصفحات أو الصفحات في نفس الوقت.

## متصفحات متعددة

لبدء متصفحات متعددة:

```go
المتصفح1 := rod.New().MustConnect()
المتصفح2 := rod.New().MustConnect()
```

جميع واجهات برمجة التطبيقات آمنة للموضوع، نفس الأعمال لتعدد الروتينيات.

يمكنك أيضا استخدام وضع التخفي لتشغيل متصفحات متعددة:

```go
المتصفح1 := rod.New().MustConnect()
المتصفح2 := المتصفح.MustIncognito()
```

تشغيل المتصفحات مع حجج تشغيل مختلفة:

```go
المتصفح1 := rod.New().ControlURL(
    launcher.New().Headless(false).MustLaunch()
).MustConnect()

المتصفح1 := rod.New().ControlURL(
    launcher.New().UserDataDir("path").MustLaunch()
).MustConnect()
```

## صفحات متعددة

To launch multiple pages for a browser:

```go
المتصفح := rod.New().MustConnect()
صفحة 1 := المتصفح.MustPage("http://a.com")
صفحة 2 := المتصفح.MustPage("http://b.com")
```

If a browser already has several pages open and you don't have references to them, you can use [Browser.Pages()](https://pkg.go.dev/github.com/go-rod/rod#Browser.Pages) to get a [Pages](https://pkg.go.dev/github.com/go-rod/rod#Pages) struct which is a list of tabs and/or windows with several helpful methods attached, such as [Pages.Find()](https://pkg.go.dev/github.com/go-rod/rod#Pages.Find), [Pages.FindByURL()](https://pkg.go.dev/github.com/go-rod/rod#Pages.FindByURL), [Pages.First()](https://pkg.go.dev/github.com/go-rod/rod#Pages.First), etc. Once you get a reference to the page you want you can use [Page.Activate()](https://pkg.go.dev/github.com/go-rod/rod#Page.Activate) to focus it. If you are clicking a link opens a new page then you can use [Page.WaitOpen](https://pkg.go.dev/github.com/go-rod/rod#Page.WaitOpen) to grab a reference to the new window as soon as it is launched.

## مخزن الصفحات

We can use PagePool to help concurrently control and reuse pages.

Check this [example](https://github.com/go-rod/rod/blob/46baf3aad803ed5cd8671aa325cbae4e297a89a4/examples_test.go#L533)

## مخزن المتصفح

The tests in Rod is a good example of managing a pool of browsers to run tests concurrently. That's why the tests can finish in seconds. Check the code [here](https://github.com/go-rod/rod/blob/46baf3aad803ed5cd8671aa325cbae4e297a89a4/setup_test.go#L59).
