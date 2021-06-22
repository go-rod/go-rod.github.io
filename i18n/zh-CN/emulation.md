# 模拟 / Emulation

Rod 提供了多种方法来模拟页面环境。

## 设备

要同时为页面设置视区、User-Agent、方向等，可以使用预定义的设备：

```go
page.MustEmulate(devices.IPhone6or7or8Plus)
```

或者定义你自己的设备：

```go
page.MustEmulate(devices.Device{
  Title:          "iPhone 4",
  Capabilities:   []string{"touch", "mobile"},
  UserAgent:      "Mozilla/5.0 (iPhone; CPU iPhone OS 7_1_2 like Mac OS X)",
  AcceptLanguage: "en",
  Screen: devices.Screen{
    DevicePixelRatio: 2,
    Horizontal: devices.ScreenSize{
      Width:  480,
      Height: 320,
    },
    Vertical: devices.ScreenSize{
      Width:  320,
      Height: 480,
    },
  },
})
```

见预定义设备的代码，每个字段的意思都显而易见。

还可以通过 [Browser.DefaultDevice](https://pkg.go.dev/github.com/go-rod/rod#Browser.DefaultDevice) 来为所有页面设置默认设备。

设备模拟默认会被起用（[Devices.LaptopWithMDPIScreen](https://github.com/go-rod/rod/blob/bc44c39c9b4352c15d00bef6f6a1071205d2c388/lib/devices/list.go#L616) 会被使用），这会覆盖某些浏览器的默认设定，这么做是为了稳定的一致性（比如有助于复现测试结果）。

你可以通过特殊的 _Clear_ 设备为默认设备来禁用设备模拟功能。

```go
browser.DefaultDevice(devices.Clear)
```

或者你也可以直接使用 [Browser.NoDefaultDevice](https://pkg.go.dev/github.com/go-rod/rod#Browser.NoDefaultDevice) 帮助函数。

## User Agent

使用 [Page.SetUserAgent](https://pkg.go.dev/github.com/go-rod/rod#Page.SetUserAgent) 为特定页面指定 User Agent。

## 视区

使用 [Page.SetViewport](https://pkg.go.dev/github.com/go-rod/rod#Page.SetViewport) 为特定页面指定视区。

## 语言和时区

可以使用 launch env 为所有页面设置：

```go
u := launcher.New().Env("TZ=America/New_York").MustConnect()
browser := rod.New().ControlURL(u).MustConnect()
```

或者可以使用 [EmulationSetTimezoneOverride](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetTimezoneOverride) 或 [EmulationSetLocaleOverride](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetLocaleOverride) 为特定页面设置：

```go
proto.EmulationSetTimezoneOverride{TimezoneID: "America/New_York"}.Call(page)
```

## 权限

使用 [BrowserGrantPermissions](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#BrowserGrantPermissions)

## 地理位置

使用 [EmulationSetGeolocationOverride](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetGeolocationOverride)

## 配色方案和媒体

使用 [EmulationSetEmulatedMedia](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetEmulatedMedia)

```go
proto.EmulationSetEmulatedMedia{
    Media: "screen",
    Features: []*proto.EmulationMediaFeature{
        {"prefers-color-scheme", "dark"},
    },
}.Call(page)
```

## 防止机器人检测

控制页面时，我们希望整个过程对页面来说完全不可感知，这样页面就不知道是否是机器人在控制它。 当然你也可以自己想办法解决，不过这里有一个久经测试的方案：[代码示例](https://github.com/go-rod/stealth/blob/master/examples_test.go).

In some cases, some servers could detect some incoherences (_lies_) between the params reported in the browser API, other browser features (like web workers) and the headers sent to the server. For those cases it's recommended to disable the device emulation and tune the browser launcher with the [custom launch](custom-launch.md) features.

For example, you could try to:

- Launch the rod browser with some deterministic params (language, viewport, timezone, etc.) to make the browser fingerprint more reliable.
- Just point the path to use your regular user browser.

You can test the reliability of your setup using some test sites:

- [https://bot.sannysoft.com](https://bot.sannysoft.com)
- [https://abrahamjuliot.github.io/creepjs](https://abrahamjuliot.github.io/creepjs)
- [https://pixelscan.net](https://pixelscan.net)
