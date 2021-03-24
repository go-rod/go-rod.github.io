# Browsers & Pages

It's intuitive to use Rod to control multiple browsers or pages at the same time.

## Multiple browsers

To launch multiple browsers:

```go
browser1 := rod.New().MustConnect()
browser2 := rod.New().MustConnect()
```

All APIs are thread-safe, same works for multiple Go routines.

You can also use incognito mode to launch multiple browsers:

```go
browser1 := rod.New().MustConnect()
browser2 := browser1.MustIncognito()
```

Launch browsers with different launch arguments:

```go
browser1 := rod.New().ControlURL(
    launcher.New().Headless(false).MustLaunch()
).MustConnect()

browser1 := rod.New().ControlURL(
    launcher.New().UserDataDir("path").MustLaunch()
).MustConnect()
```

## Multiple pages

To control multiple pages for a browser:

```go
browser := rod.New().MustConnect()
page1 := browser.MustPage("http://a.com")
page2 := browser.MustPage("http://b.com")
```

## Page pool

We can use PagePool to help concurrently control and reuse pages.

Check this [example](https://github.com/go-rod/rod/blob/46baf3aad803ed5cd8671aa325cbae4e297a89a4/examples_test.go#L533)

## Browser pool

The tests in Rod is a good example of managing a pool of browsers to run tests concurrently. That's why the tests can finish in seconds. Check the code [here](https://github.com/go-rod/rod/blob/46baf3aad803ed5cd8671aa325cbae4e297a89a4/setup_test.go#L59).

[Next Chapter](/custom-launch.md)
