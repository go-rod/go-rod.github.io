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

您可以简化它：

```go
func main() {
    rod.New().MustConnect().MustPage("https://example.com")
}
```

因为如果未设置 `ControlURL` ， `MustConnect` 将自动运行 `launch().MustLaunch()`。 默认情况下，launcher 将自动下载并使用固定版本的浏览器，以保证浏览器 的行为一致性。

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

## Docker

这里有一个远程控制 container 内的浏览器的例子；这样我们就不用在本地安装浏览器了（一些 linux 发行版中很难正确安装 chromium）：

1. 运行 rod 镜像 `docker run -p 7317:7317 ghcr.io/go-rod/rod`

2. 打开另一个终端，并运行类似这个[示例](https://github.com/go-rod/rod/blob/master/lib/examples/launch-managed/main.go)中的代码

rod 镜像为每个远程驱动动态地运行一个浏览器，且启动选项可以自定义。 它对于常见的自然语言的截图和字体进行过[调优](https://github.com/go-rod/rod/blob/master/lib/docker/Dockerfile)。 你可以轻松地将请求负载均衡到由这个镜像组成的集群中，每个容器可以同时创建多个浏览器实例。

## 控制每个步骤

如果你想要控制启动过程中的每个步骤，比如说禁用自动下载、使用系统默认浏览器，见此[示例文件](https://github.com/go-rod/rod/blob/master/lib/launcher/example_test.go)。
