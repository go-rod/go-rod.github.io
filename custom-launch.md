# Custom Browser Launch

## Connect to an running browser

Find the executable path of your browser, such as on macOS run:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --remote-debugging-port=9222
```

It will output something like:

```txt
DevTools listening on ws://127.0.0.1:9222/devtools/browser/4dcf09f2-ba2b-463a-8ff5-90d27c6cc913
```

The above `ws://127.0.0.1:9222/devtools/browser/4dcf09f2-ba2b-463a-8ff5-90d27c6cc913` is the interface to control the browser:

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

## The launcher lib

Because the above workflow is so often used, we abstract a the `launcher` lib to simplify launch of browsers.
Such as automatically download or search for the browser executable,
add or delete the browser executable command-line arguments, etc.

So the above manual launch and code becomes:

```go
func main() {
	u := launcher.New().Bin("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome").MustLaunch()
	rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

You can simplify it into:

```go
func main() {
	rod.New().MustConnect().MustPage("https://example.com")
}
```

Because if `ControlURL` is not set, the `MustConnect` will run `launcher.New().MustLaunch()` automatically.
By default, the launcher will automatically download and use a statically versioned browser so that the browser
behavior is consistent.

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

As you can see from above the `--` prefix is optional, such as `headless` and `--headless` are the same.

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

## Docker

Here's an example to remote control browsers inside the container so that we don't have to install browsers locally,
because on some linux distributions it's very hard to install chromium correctly:

1. Run the rod image `docker run -p 7317:7317 ghcr.io/go-rod/rod`

2. Open another terminal and run code like this [example](https://github.com/go-rod/rod/blob/master/lib/examples/launch-managed/main.go)

The rod image can dynamically launch a browser for each remote driver with customizable browser flags.
It's [tuned](https://github.com/go-rod/rod/blob/master/lib/docker/Dockerfile) for screenshots and fonts among popular natural languages.
You can easily load balance requests to the cluster of this image, each container can create multiple browser instances at the same time.

## Control every step

If you want to control every step of the launch process, such as disable the auto-download and use the system's default browser,
check the [example file](https://github.com/go-rod/rod/blob/master/lib/launcher/example_test.go).
