# 上下文（Context）和超时（Timeout）

在 Golang 中，我们通常使用 [Context](https://golang.org/pkg/context/) 来终止长时间运行的任务。 Rod 使用 Context 来处理 IO 阻塞操作的取消（通常是因为超时）。 你需要特别注意这一问题。

如果你对 Context 不熟悉，请先阅读 [了解 Context](understand-context.md)。

## 取消

例如下面的代码会创建一个空白页面并访问 “github.com”：

```go
page := rod.New().MustConnect().MustPage()
page.MustNavigate("http://github.com")
```

现在假设我们想要在 `MustNavigate` 花费多于 2 秒时中断它。 在 Rod 中我们可以这样实现：

```go
page := rod.New().MustConnect().MustPage()

ctx, cancel := context.WithCancel(context.Background())
pageWithCancel := page.Context(ctx)

go func() {
    time.Sleep(2 * time.Second)
    cancel()
}()

pageWithCancel.MustNavigate("http://github.com") // will be canceled after 2 seconds
```

我们使用 `page.Context` 创建了 `page` 的一个浅克隆。 当我们调用 `cancel` 时，由 `pageWithCancel` 发起的所有操作（不仅仅是 `MustNavigate`）都会被取消。

Rod 的此种风格和 Golang 标准库中的 [Request.WithContext](https://golang.org/pkg/net/http/#Request.WithContext) 很类似。

同时由于 `pageWithCancel` 和 `page` 是相互独立的，所以 `cancel` 只会影响到 <0>pageWithCancel</0> 发起的操作而不会影响到 <0>page</0> 发起的操作。

```go
page.MustNavigate("http://github.com") // 不会在 2 秒钟后取消
```

## 超时

上面的示例只是给操作设置超时的一种方式。 在 Golang 中，超时通常只是取消的一种特例。 鉴于它十分实用，所以我们提供了一个简单的方法来实现它，也就是 `Timeout`。上面的代码可以简化为：

```go
page := rod.New().MustConnect().MustPage()
page.Timeout(2 * time.Second).MustNavigate("http://github.com")
```

`page.Timeout(2 * time.Second)` 相当于之前的 `pageWithCancel`。 同时，对 `Context` 的操作并不是 `Page` 独有。在 Rod 中，`Browser` 和 <0>Element</0> 也都有相同的 API。

## 判断超时

那么我们如何知晓一个失败的操作是否是因为超时了呢？ 在 Golang 中超时通常是一种异常。 这并不是 Rod 特有的。 对于先前的代码，我们可以像这样判断超时：

```go
page := rod.New().MustConnect().MustPage()

err := rod.Try(func() {
    page.Timeout(2 * time.Second).MustNavigate("http://github.com")
})
if errors.Is(err, context.DeadlineExceeded) {
    // code for timeout error
} else if err != nil {
    // code for other types of error
}
```

这里我们使用了 `rod.Try` 来包裹可能抛出超时异常的函数。

我们在[异常处理](error-handling.md)里有更多这方面的讲解。

[下一章](error-handling.md)
