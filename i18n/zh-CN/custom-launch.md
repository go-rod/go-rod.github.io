# 自定义浏览器启动

## 连接到正在运行的浏览器

查找您的浏览器的可执行路径，例如 macOS 运行：

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --remote-debugging-port=9222
```

它将输出类似于：

```txt
DevTools listening on ws://127.0.0.1:9222/devtools/browser/4dcf09f2-ba2b-463a-8ff5-90d27c6cc913
```

上面的 `ws://127.0.0.1:9222/devtools/browser/4dcf09f2-ba2b-463a-8ff5-90d27c6cc913` 就是控制浏览器的接口：

```go
package main

import (
    "github.com/go-rod/rod"
)

func main() {
    u := "ws://127.0.0.1:9222/devtools/browser/4dcf09f2-ba2b-463a-8ff5-90d27c6cc913"
    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

## launcher 库

由于上面的工作流经常被使用，我们抽象出 ` launcher ` 库来简化浏览器的启动。 例如自动下载或搜索浏览器可执行程序， 添加或删除浏览器可执行程序的命令行参数等。

因此，上述的手动启动和代码变成：

```go
func main() {
    u := launcher.New().Bin("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome").MustLaunch()
    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

我们可以使用帮助函数 `launcher.LookPath` 来获取浏览器的可执行文件路径，上面的代码等价于：

```go
func main() {
    path, _ := launcher.LookPath()
    u := launcher.New().Bin(path).MustLaunch()
    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

If `ControlURL` is not set, the `MustConnect` will run `launcher.New().MustLaunch()` automatically. 默认情况下，launcher 将自动下载并使用固定版本的浏览器，以保证浏览器 的行为一致性。 So you can simplify the above code into:

```go
func main() {
    rod.New().MustConnect().MustPage("https://example.com")
}
```

## 增加或删除选项

可以使用 `Set` 和 `Delete` 来修改浏览器的启动参数（标志）：

```go
package main

import (
    "github.com/go-rod/rod"
    "github.com/go-rod/rod/lib/launcher"
)

func main() {
    u := launcher.New().
        Set("user-data-dir", "path").
        Set("headless").
        Delete("--headless").
        MustLaunch()

    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

`--` 前缀可选，例如 `headless` 和 `--headless` 相同。

由于类似 `user-data-dir`、`proxy-server`、`headless` 的选项经常会用到，我们为它们写了一些 helper，所以上面的代码可以改成这样：

```go
func main() {
    u := launcher.New().
        UserDataDir("path").
        Headless(true).
        Headless(false).
        MustLaunch()

    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

所有可用的选项：[链接](https://peter.sh/experiments/chromium-command-line-switches)。

阅读 API 文档以获取更多信息：[链接](https://pkg.go.dev/github.com/go-rod/rod/lib/launcher#Launcher)。

## Remotely manage the launcher

For production scraping system, usually, we will separate the scrapers and browsers into different clusters so that they can scale separately. Rod provides the module `launcher.Manager` to manage the launcher remotely. With it we can remotely launch a browser with custom browser launch flags. The example to use it is [here](https://github.com/go-rod/rod/blob/master/lib/launcher/rod-manager/main.go).

Because on some linux distributions it's very hard to install chromium correctly, we build a docker image to make it consistent cross platforms. Here's an example to use it:

1. 运行 rod 镜像 `docker run -p 7317:7317 ghcr.io/go-rod/rod`

2. 打开另一个终端，并运行类似这个[示例](https://github.com/go-rod/rod/blob/master/lib/examples/launch-managed/main.go)中的代码

The image is [tuned](https://github.com/go-rod/rod/blob/master/lib/docker/Dockerfile) for screenshots and fonts among popular natural languages. Each container can launch multiple browsers at the same time.

## Low-level API

If you want to control every step of the launch process, such as disable the auto-download and use the system's default browser, check the [example file](https://github.com/go-rod/rod/blob/master/lib/launcher/example_test.go).
