# Get Started with Rod

## Requirements

[Golang](https://golang.org/) is the only requirement, you don't even need to know anything about HTML.

If you have never used Golang, [install](https://golang.org/doc/install) it and you can master it in hours: [A tour of Go](https://tour.golang.org/welcome).

## First program

Let's use Rod to open a page and take a screenshot of it, first, create a "main.go" file with the content below:

```go
package main

import "github.com/go-rod/rod"

func main() {
    page := rod.New().MustConnect().MustPage("https://www.wikipedia.org/")
    page.MustWaitLoad().MustScreenshot("a.png")
}
```

The `rod.New` creates a browser object, the `MustConnect` launches and connects to a browser.
The `MustPage` creates a page object, it's like a page tab in the browser. The `MustWaitLoad`
waits for the page is fully loaded. The `MustScreenshot` takes a screenshot of the page.

Create a module:

```bash
go env -w GOPROXY=https://goproxy.io,direct
go mod init learn-rod
go mod tidy
```

Run the module:

```bash
go run .
```

The program will output a screenshot "a.png" like the one below:

![first-program](first-program.png)

## See what's under the hood

For senior developers, you can skip all and read this file: [link](https://github.com/go-rod/rod/blob/master/examples_test.go).

By default, Rod will disable the browser's UI to maximize the performance.
But when developing an automation task we usually care more about the ease of debugging.
Rod provides a lot of helpers to make your debugging experience great.

Before we run the module again, let's modify the code a little bit to make it easy to debug:

```go
package main

import (
	"time"

	"github.com/go-rod/rod"
)

func main() {
	page := rod.New().NoDefaultDevice().MustConnect().MustPage("https://www.wikipedia.org/")
	page.MustWindowFullscreen()
	page.MustWaitLoad().MustScreenshot("a.png")
	time.Sleep(time.Hour)
}
```

The `NoDefaultDevice` and `MustWindowFullscreen` maximize the page viewport and browser window to make it more comfortable to overview the page.
We added `time.Sleep(time.Hour)` at the end the code so that it won't be too fast for our eyes to catch it before the program exits.

Let's run the module again with the `-rod` command line flag:

```bash
go run . -rod=show
```

The `show` option means "show the browser UI on the foreground".
Now you should see a browser like this:

![show](show.png)

To stop the program, let's go back to the terminal and press [CTRL + C](https://en.wikipedia.org/wiki/Control-C) on the keyboard.

## Input and click

Let's automate the website to search the keyword "earth".
A website may have many input fields or buttons, we need to tell the program which one to manipulate.
Usually, we use [Devtools](https://developers.google.com/web/tools/chrome-devtools/)
to help us locate the element we want to control.
Let's append a new config to the `-rod` flag to enable the Devtools, now the command becomes:

```bash
go run . -rod=show,devtools
```

Run the command above, move your mouse to the input field and right-click
above it, you will see the context menu, then click the "inspect":

![inspect](inspect.png)

You should see the `<input id="searchInput` like below:

![input](input.png)

Right-click to copy the [css selector](css-selector.md) like the image above. The content on
your clipboard will be "#searchInput". We will use it to locate the
element to input the keyword. Now the "main.go" becomes:

```go
package main

import (
    "time"

    "github.com/go-rod/rod"
)

func main() {
	browser := rod.New().MustConnect().NoDefaultDevice()
	page := browser.MustPage("https://www.wikipedia.org/").MustWindowFullscreen()

    page.MustElement("#searchInput").MustInput("earth")

	page.MustWaitLoad().MustScreenshot("a.png")
	time.Sleep(time.Hour)
}
```

We use `MustElement` and the selector we copied from the Devtools panel
to get the element we want to manipulate. The `MustElement` will automatically wait until the element appears,
so we don't need to use `MustWaitLoad` before it.
Then we call the `MustInput` to input the keyword "earth" into it. If you rerun the "main.go",
you should see the result looks like below:

![after-input](after-input.png)

Similar to the input field let's right-click the search
button to copy the selector for it:

![search-btn](search-btn.png)

![search-btn-selector](search-btn-selector.png)

Then add code to click the search button, now the "main.go" looks like:

```go
package main

import (
	"time"

	"github.com/go-rod/rod"
)

func main() {
	browser := rod.New().MustConnect().NoDefaultDevice()
	page := browser.MustPage("https://www.wikipedia.org/").MustWindowFullscreen()

	page.MustElement("#searchInput").MustInput("earth")
	page.MustElement("#search-form > fieldset > button").MustClick()

	page.MustWaitLoad().MustScreenshot("a.png")
	time.Sleep(time.Hour)
}
```

If we rerun the module, the "a.png" will show the search result:

![earth-page](earth-page.png)

## Slow motion and visual trace

The automated operations are too fast for human eyes to catch, to debug them we usually
enable the slow-motion and visual trace configs, let's update run the module with extra options:

```bash
go run . -rod="show,slow=1s,trace"
```

Now every action now will wait for 1 second before its execution.
On the page, you will see the debug trace generated by Rod like below:

![trace](trace.png)

As you can see on the search button, Rod will create a mock mouse cursor.

On console you will see the trace log like below:

```txt
[rod] 2020/11/11 11:11:11 [eval] {"js":"rod.element","params":["#searchInput"]}
[rod] 2020/11/11 11:11:11 [eval] {"js":"rod.visible","this":"input#searchInput"}
[rod] 2020/11/11 11:11:11 [input] scroll into view
[rod] 2020/11/11 11:11:11 [input] input earth
[rod] 2020/11/11 11:11:11 [eval] {"js":"rod.element","params":["#search-form > fieldset > button"]}
[rod] 2020/11/11 11:11:11 [eval] {"js":"rod.visible","this":"button.pure-button.pure-button-primary-progressive"}
[rod] 2020/11/11 11:11:11 [input] scroll into view
[rod] 2020/11/11 11:11:11 [input] left click
```

## Other than the command line options

The the command line options is just a shortcut for some commonly used methods, you can also manually set them with code,
such as the "slow", the code to set it is like `rod.New().SlowMotion(2 * time.Second)`.

## Get text content

Rod provides lots of handy methods to retrieve the contents from the page.

Let's try to get the description of the Earth, use the same technique we previously used to copy the selector
from the Devtools:

![get-text](get-text.png)

The method we use is `MustText`, here's the full code of it:

```go
package main

import (
	"fmt"

	"github.com/go-rod/rod"
)

func main() {
	page := rod.New().MustConnect().MustPage("https://www.wikipedia.org/")

	page.MustElement("#searchInput").MustInput("earth")
	page.MustElement("#search-form > fieldset > button").MustClick()

	el := page.MustElement("#mw-content-text > div.mw-parser-output > p:nth-child(7)")
	fmt.Println(el.MustText())
}
```

If we rerun the module, we should see the console outputs something like:

```txt
Earth is the third planet from the Sun and the only astronomical object known to harbor life.
...
```

## Get image content

Same as get text, we can also get images from the page, let's get the selector of the Earth image and use `MustResource`
to get the binary of the image:

![get-image](get-image.png)

The full code is:

```go
package main

import (
	"github.com/go-rod/rod"
	"github.com/go-rod/rod/lib/utils"
)

func main() {
	page := rod.New().MustConnect().MustPage("https://www.wikipedia.org/")

	page.MustElement("#searchInput").MustInput("earth")
	page.MustElement("#search-form > fieldset > button").MustClick()

	el := page.MustElement("#mw-content-text > div.mw-parser-output > table.infobox > tbody > tr:nth-child(1) > td > a > img")
	_ = utils.OutputFile("b.png", el.MustResource())
}
```

The output file "b.png" should be:

![earth](earth.png)
