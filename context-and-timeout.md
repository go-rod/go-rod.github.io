# Context and Timeout

In Golang, we usually use [Context](https://golang.org/pkg/context/) to abort long-running tasks.
Rod uses Context to handle cancellations for IO blocking operations, most times it's timeout.
You need to pay special attention to them.

If you are not familiar with Context, please read [Understand Context](understand-context.md) first.

## Cancellation

For example, the code below creates a blank page and navigates it to the "github.com":

```go
page := rod.New().MustConnect().MustPage("")
page.MustNavigate("http://github.com")
```

Now, suppose we want to cancel the `MustNavigate` if it takes more than 2 seconds.
In Rod we can do something like this:

```go
page := rod.New().MustConnect().MustPage("")

ctx, cancel := context.WithCancel(context.Background())
pageWithCancel := page.Context(ctx)

go func() {
    time.Sleep(2 * time.Second)
    cancel()
}()

pageWithCancel.MustNavigate("http://github.com") // will be canceled after 2 seconds
```

We use the `page.Context` to create a shallow clone of the `page`. Whenever we call the `cancel`, the operations
triggered by the `pageWithCancel` will be canceled, it can be any operation, not just `MustNavigate`.

This style is not special for Rod, you can find similar APIs like [Request.WithContext](https://golang.org/pkg/net/http/#Request.WithContext) in the standard library.

Because `pageWithCancel` and `page` are independent to each other, operations triggered by `page` will not be affected by the cancellation:

```go
page.MustNavigate("http://github.com") // won't be canceled after 2 seconds
```

## Timeout

The code above is just a way to timeout an operation. In Golang, timeout is usually just a special case of cancellation.
Because it's so useful, we created a helper to do the same thing above, it's called `Timeout`, so the code above can be reduced like below:

```go
page := rod.New().MustConnect().MustPage("")
page.Timeout(2 * time.Second).MustNavigate("http://github.com")
```

The `page.Timeout(2 * time.Second)` is the previous `pageWithCancel`.
Not just `Page`, `Browser` and `Element` also have the same context helpers.

## Detect timeout

How do I know if an operation is timed out or not? In Golang, timeout is usually a type of error. It's not special for Rod.
For the code above we can do this to detect timeout:

```go
page := rod.New().MustConnect().MustPage("")

err := rod.Try(func() {
    page.Timeout(2 * time.Second).MustNavigate("http://github.com")
})
if errors.Is(err, context.DeadlineExceeded) {
    // code for timeout error
} else if err != nil {
    // code for other types of error
}
```

Here we use `rod.Try` to wrap the function that may throw a timeout error.

We will talk more about error handing at [Error Handling](error-handling.md).

[Next Chapter](error-handling.md)
