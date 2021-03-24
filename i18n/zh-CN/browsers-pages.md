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

控制一个浏览器的多个页面：

```go
browser := rod.New().MustConnect()
page1 := browser.MustPage("http://a.com")
page2 := browser.MustPage("http://b.com")
```

## 页面池

我们可以使用 PagePool 来辅助同时控制和复用多个页面。

见这个[示例](https://github.com/go-rod/rod/blob/46baf3aad803ed5cd8671aa325cbae4e297a89a4/examples_test.go#L533)

## 浏览器池

Rod 中测试是管理浏览器池进行并发测试的一个好例子。 这就是为什么测试可以在数秒钟内跑完。 请看这里的[代码](https://github.com/go-rod/rod/blob/46baf3aad803ed5cd8671aa325cbae4e297a89a4/setup_test.go#L59)。

[下一章](/custom-launch.md)
