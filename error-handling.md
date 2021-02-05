# Error Handling

In the previous chapters, we have seen a lot of `Must` prefixed methods like `MustNavigate`, `MustElement`, etc.
They all have non-prefixed versions like `Navigate`, `Element`, etc. The main difference between them is how
they handle errors. It's not special for Rod, you can find it in the standard library like [regex.MustCompile](https://golang.org/pkg/regexp/#MustCompile).

The methods like `MustNavigate` and `MustElement` are commonly used in example code or quick scripting.
They are useful for jobs like smoke testing, site monitoring, end-to-end test, etc.
Jobs with lots of uncertainty, such as web scraping, the non-prefixed version will be a better choice.

The prefixed version is just the non-prefixed version wrapped with an error checker.
Here's the source code of the `MustElement`, as you can see it just calls the `Element` with
several extra lines to panic if err is not `nil`:

```go
func (p *Page) MustElement(selectors ...string) *Element {
    el, err := p.Element(selectors...)
    if err != nil {
        panic(err)
    }
	return el
}
```

## Get the error value

The two code blocks below are almost doing the same thing in two styles.

The style below will usually end up in less code, but it may also catch extra errors:

```go
page := rod.New().MustConnect().MustPage("https://example.com")

err := rod.Try(func() {
    fmt.Println(page.MustElement("a").MustHTML())
})
handleError(err)
```

We use `rod.Try` to catch the error from the `Must` prefixed methods `MustElement` and `MustHTML`.

The style below is the Go's standard way to handle errors. Usually, it's more consistent and precise:

```go
page := rod.New().MustConnect().MustPage("https://example.com")

el, err := page.Element("a")
if err != nil {
    handleError(err)
    return
}
html, err := el.HTML()
if err != nil {
    handleError(err)
    return
}
fmt.Println(html)
```

## Check the error type

We use Go's standard way to check error types, no magic.

The `handleError` in the above code may look like:

```go
func handleError(err error) {
    var evalErr *rod.ErrEval
    if errors.Is(err, context.DeadlineExceeded) { // timeout error
        fmt.Println("timeout err")
    } else if errors.As(err, &evalErr) { // eval error
        fmt.Println(evalErr.LineNumber)
    } else if err != nil {
        fmt.Println("can't handle", err)
    }
}
```

[Next Chapter](selectors/README.md)
