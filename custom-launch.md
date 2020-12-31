# Customize Launch

You can use `launcher` lib to custom the launch of browsers, such as add or delete the browser executable command-line arguments,
custom the auto-download-browser mirrors.

## Add or remove options

You can use the `Set` and `Delete` to modify the browser launch arguments (flags):

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

The `--` prefix is optional, such as `headless` and `--headless` are the same.

Because options like `user-data-dir`, `proxy-server`, `headless` are so often used, we added some helpers for them, so the above code can become
like this:

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

Here are the available flags: [link](https://peter.sh/experiments/chromium-command-line-switches).

Read the API doc for more info: [link](https://pkg.go.dev/github.com/go-rod/rod/lib/launcher#Launcher).

## Disable auto-download browser

Check [here](https://github.com/go-rod/rod/blob/4bbf086d8a10e098c47f8ac1ce095ab7799bf49b/lib/launcher/example_test.go#L29-L36)

## Docker

Check [here](https://github.com/go-rod/rod#q-how-to-use-rod-with-docker-so-that-i-dont-have-to-install-a-browser)

## Custom executable runner

If you want to control every step of the launch process,
check this [example](https://github.com/go-rod/rod/blob/5e2a019449e9703c2b5227ef9821811c8e88cb33/lib/launcher/example_test.go#L11)

[Next Chapter](/customize-websocket.md)
