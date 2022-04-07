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

We can use the helper function `launcher.LookPath` to get the browser executable path, the above code is the same as:

```go
func main() {
	path, _ := launcher.LookPath()
	u := launcher.New().Bin(path).MustLaunch()
	rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

If `ControlURL` is not set, the `MustConnect` will run `launcher.New().MustLaunch()` automatically.
By default, the launcher will automatically download and use a statically versioned browser so that the browser
behavior is consistent. So you can simplify the above code into:

```go
func main() {
	rod.New().MustConnect().MustPage("https://example.com")
}
```

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

## Remotely manage the launcher :id=remotely-manage-the-launcher

For production scraping system, usually, we will separate the scrapers and browsers into different clusters so that
they can scale separately. Rod provides the module `launcher.Manager` to manage the launcher remotely.
With it we can remotely launch a browser with custom launch flags.
The example to use it is [here](https://github.com/go-rod/rod/blob/master/lib/launcher/rod-manager/main.go).

Because it's very hard to install chromium correctly on some linux distributions,
Rod provides a docker image to make it consistent cross platforms.
Here's an example to use it:

1. Run the rod image `docker run -p 7317:7317 ghcr.io/go-rod/rod`

2. Open another terminal and run code like this [example](https://github.com/go-rod/rod/blob/master/lib/examples/launch-managed/main.go)

The image is [tuned](https://github.com/go-rod/rod/blob/master/lib/docker/Dockerfile) for screenshots and fonts among popular natural languages.
Each container can launch multiple browsers at the same time.

## User mode :id=user-mode

When you log into your github account, and you want to reuse the login session for automation task.
You can use the `launcher.NewUserMode` to launch your regular user browser. Rod will be just like a browser extension:

```go
wsURL := launcher.NewUserMode().MustLaunch()
browser := rod.New().ControlURL(wsURL).MustConnect().NoDefaultDevice()
```

Here's a more detailed example: [code example](https://github.com/go-rod/rod/blob/master/lib/examples/use-rod-like-chrome-extension/main.go).

## Low-level API

If you want to control every step of the launch process, such as disable the auto-download and use the system's default browser,
check the [example file](https://github.com/go-rod/rod/blob/master/lib/launcher/example_test.go).
