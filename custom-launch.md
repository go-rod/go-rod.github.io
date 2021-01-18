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

Here's an example to remote control browsers inside the container so that we don't have to install browsers locally:

1. Run the rod image `docker run -p 9222:9222 rodorg/rod`

2. Open another terminal and run code like this [example](https://github.com/go-rod/rod/blob/master/lib/examples/remote-launch/main.go)

The [rod image](https://hub.docker.com/repository/docker/rodorg/rod)
can dynamically launch a browser for each remote driver with customizable browser flags.
It's [tuned](https://github.com/go-rod/rod/blob/master/lib/docker/Dockerfile) for screenshots and fonts among popular natural languages.
You can easily load balance requests to the cluster of this image, each container can create multiple browser instances at the same time.

## Custom executable runner

If you want to control every step of the launch process,
check this [example](https://github.com/go-rod/rod/blob/5e2a019449e9703c2b5227ef9821811c8e88cb33/lib/launcher/example_test.go#L11)

[Next Chapter](/custom-websocket.md)
