# 模拟

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

或者可以使用 [EmulationSetTimezoneOverride](https://pkg.go.dev/github.com/go-rod/rod@v0.81.3/lib/proto#EmulationSetTimezoneOverride) 或 [EmulationSetLocaleOverride](https://pkg.go.dev/github.com/go-rod/rod@v0.81.3/lib/proto#EmulationSetLocaleOverride) 为特定页面设置：

```go
proto.EmulationSetTimezoneOverride{TimezoneID: "America/New_York"}.Call(page)
```

## 权限

使用 [BrowserGrantPermissions](https://pkg.go.dev/github.com/go-rod/rod@v0.81.3/lib/proto#BrowserGrantPermissions)

## 地理位置

使用 [EmulationSetGeolocationOverride](https://pkg.go.dev/github.com/go-rod/rod@v0.81.3/lib/proto#EmulationSetGeolocationOverride)

## 配色方案和媒体

使用 [EmulationSetEmulatedMedia](https://pkg.go.dev/github.com/go-rod/rod@v0.81.3/lib/proto#EmulationSetEmulatedMedia)

```go
proto.EmulationSetEmulatedMedia{
    Media: "screen",
    Features: []*proto.EmulationMediaFeature{
        {"prefers-color-scheme", "dark"},
    },
}.Call(page)
```

## Prevent bot detection

控制页面时，我们希望整个过程对页面来说完全不可感知，这样页面就不知道是否是机器人在控制它。 Sure you can handcraft one, but here's one tested solution that might help: [code example](https://github.com/go-rod/stealth/blob/master/examples_test.go)

[下一章](/network.md)
