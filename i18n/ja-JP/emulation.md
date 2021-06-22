# Emulation

Rod provides various ways to emulate the environment for pages.

## Devices

To set the viewport, user-agent, orientation, etc at the same time for a page, you can use the predefined devices:

```go
page.MustEmulate(devices.IPhone6or7or8Plus)
```

Or define your own device:

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

Check the source code of the predefined devices, the fields should self explain themselves.

You can also set the default device for all pages by using [Browser.DefaultDevice](https://pkg.go.dev/github.com/go-rod/rod#Browser.DefaultDevice).

Emulation is activated by default (using the [Devices.LaptopWithMDPIScreen](https://github.com/go-rod/rod/blob/bc44c39c9b4352c15d00bef6f6a1071205d2c388/lib/devices/list.go#L616) device), which overrides some of the default browser settings, which is better in terms of coherence (i.e., it helps to reproduce tests).

You can disable the Device Emulation feature passing the special _Clear_ device to the `Browser.DefaultDevice`.

```go
browser.DefaultDevice(devices.Clear)
```

Or you can just use the [Browser.NoDefaultDevice](https://pkg.go.dev/github.com/go-rod/rod#Browser.NoDefaultDevice) helper.

## User agent

If you want to specify a user-agent for a specific page, use [Page.SetUserAgent](https://pkg.go.dev/github.com/go-rod/rod#Page.SetUserAgent).

## Viewport

If you want to specify the viewport for a specific page, use [Page.SetViewport](https://pkg.go.dev/github.com/go-rod/rod#Page.SetViewport).

## Locale and timezone

You can use the launch env to set for all pages:

```go
u := launcher.New().Env("TZ=America/New_York").MustConnect()
browser := rod.New().ControlURL(u).MustConnect()
```

Or you can use [EmulationSetTimezoneOverride](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetTimezoneOverride) or [EmulationSetLocaleOverride](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetLocaleOverride) to set for a specific page:

```go
proto.EmulationSetTimezoneOverride{TimezoneID: "America/New_York"}.Call(page)
```

## Permissions

Use [BrowserGrantPermissions](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#BrowserGrantPermissions)

## Geolocation

Use [EmulationSetGeolocationOverride](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetGeolocationOverride)

## Color scheme and media

Use [EmulationSetEmulatedMedia](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetEmulatedMedia)

```go
proto.EmulationSetEmulatedMedia{
    Media: "screen",
    Features: []*proto.EmulationMediaFeature{
        {"prefers-color-scheme", "dark"},
    },
}.Call(page)
```

## Prevent bot detection

Usually it's better to make the headless browser completely transparent for the page so that the page cannot tell if it's controlled by a human or robot. In some cases, some page could use client js to detect if the page is control by a human or a robot, such web WebGL, WebDriver, or http request headers. You can handcraft a js lib to hide all the trails, or just use lib [stealth](https://github.com/go-rod/stealth): [code example](https://github.com/go-rod/stealth/blob/master/examples_test.go).

If `stealth` lib doesn't work for you, you can just launch the regular user browser with `launcher.NewUserMode`: [User mode](custom-launch.md?id=user-mode).

You can use tools like [https://bot.sannysoft.com](https://bot.sannysoft.com) to test your configuration.

## Browser fingerprint

Browser fingerprinting is not bot detection. It uses various tricks to collect unique browser attributes to identify browsers. Website can use it to track users even when they are not logged in, it's also widely used to mark headless scrapers. For example, different users usually will install different fonts on their OS, we can use this to distinguish different users. Another example would be using the canvas to render text, different users usually will have different GPUs, graphic drivers, or OSes, they all will affect the result of the rendered image.

Usually you can launch multiple browser instances to have different fingerprints. If you want to use a single browser to save memory and CPU, you have to manually overriding the API for canvas, fonts, etc.

You can use open-source projects like [FingerprintJS](https://github.com/fingerprintjs/fingerprintjs/) to test your configuration.
