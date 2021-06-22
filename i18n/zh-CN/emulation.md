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

Emulation is activated by default (using the [Devices.LaptopWithMDPIScreen](https://github.com/go-rod/rod/blob/bc44c39c9b4352c15d00bef6f6a1071205d2c388/lib/devices/list.go#L616) device), which overrides some of the default browser settings, which is better in terms of coherence (i.e., it helps to perform repeteable tests).

You can disable the Device Emulation feature passing the special _Clear_ device as DefaultDevice.

```go
browser.DefaultDevice(devices.Clear)
```

Or you can just use the [Browser.NoDefaultDevice](https://pkg.go.dev/github.com/go-rod/rod#Browser.NoDefaultDevice) helper.

## User Agent

If you want to specify a user-agent for a specific page, use [Page.SetUserAgent](https://pkg.go.dev/github.com/go-rod/rod#Page.SetUserAgent).

## 视区

If you want to specify the viewport for a specific page, use [Page.SetViewport](https://pkg.go.dev/github.com/go-rod/rod#Page.SetViewport).

## 语言和时区

You can use the launch env to set for all pages:

```go
u := launcher.New().Env("TZ=America/New_York").MustConnect()
browser := rod.New().ControlURL(u).MustConnect()
```

Or you can use [EmulationSetTimezoneOverride](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetTimezoneOverride) or [EmulationSetLocaleOverride](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetLocaleOverride) to set for a specific page:

```go
proto.EmulationSetTimezoneOverride{TimezoneID: "America/New_York"}.Call(page)
```

## 权限

Use [BrowserGrantPermissions](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#BrowserGrantPermissions)

## 地理位置

Use [EmulationSetGeolocationOverride](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetGeolocationOverride)

## 配色方案和媒体

Use [EmulationSetEmulatedMedia](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetEmulatedMedia)

```go
proto.EmulationSetEmulatedMedia{
    Media: "screen",
    Features: []*proto.EmulationMediaFeature{
        {"prefers-color-scheme", "dark"},
    },
}.Call(page)
```

## 防止机器人检测

When we control a page we hope it's completely transparent for the page so that the page cannot tell if it's under control or not. Sure you can handcraft one, but here's one tested solution that might help: [code example](https://github.com/go-rod/stealth/blob/master/examples_test.go).

In some cases, some servers could detect some incoherences (_lies_) between the params reported in the browser API, other browser features (like web workers) and the headers sent to the server. For those cases it's recommended to disable the device emulation and tune the browser launcher with the [custom launch](custom-launch.md) features.

For example, you could try to:
- Launch the rod browser with some deterministic params (language, viewport, timezone, etc.) to make the browser fingerprint more reliable.
- Just point the path to use your regular user browser.

You can test the reliability of your setup using some test sites:
- https://bot.sannysoft.com
- https://abrahamjuliot.github.io/creepjs
- https://pixelscan.net