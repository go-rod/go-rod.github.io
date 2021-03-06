# Custom Browser Launch

可以使用 `launcher` 库来自定义浏览器的启动，比如说增减命令行参数、自定义自动下载浏览器的镜像。

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

1. 运行 rod 镜像 `docker run -p 9222:9222 rodorg/rod`

2. 打开另一个终端，并运行类似这个[示例](https://github.com/go-rod/rod/blob/master/lib/examples/remote-launch/main.go)中的代码

[rod 镜像](https://hub.docker.com/repository/docker/rodorg/rod)为每个远程驱动动态地运行一个浏览器，且启动选项可以自定义。 它对于常见的自然语言的截图和字体进行过[调优](https://github.com/go-rod/rod/blob/master/lib/docker/Dockerfile)。 你可以轻松地将请求负载均衡到由这个镜像组成的集群中，每个容器可以同时创建多个浏览器实例。

## 控制每一步

如果你想要控制启动过程中的每个步骤，比如说禁用自动下载、使用系统默认浏览器，见此[示例文件](https://github.com/go-rod/rod/blob/master/lib/launcher/example_test.go)。

[下一章](/custom-websocket.md)
