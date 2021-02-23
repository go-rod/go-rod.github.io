# 为什么使用 Rod

有许多不错的项目，但其中没有一个是完美的。重要的是选择其中最适合你需求的那一个。

## 与其他库对比

### Chromedp

理论上来说，Rod 会比 Chromedp 运行得更快，并消耗更少的内存。

[Chromedp][chromedp] 默认使用系统浏览器，如果意外升级了浏览器，这可能会导致问题。

[Chromedp][chromedp] 为事件使用[固定大小的缓冲](https://github.com/chromedp/chromedp/blob/b56cd66/target.go#L69-L73)，这可能会在高并发情况下导致死锁。 由于 Chromedp 只使用一个事件循环，缓慢的事件处理程序可能会互相阻塞。 Rod 没有这些问题，因为它基于 [goob](https://github.com/ysmood/goob)。

Chromedp 会对浏览器传回的每条消息进行 JSON 解码，而 rod 则按需解码，因此 Rod 性能更好，尤其是对于大量用到网络的事件来说。

Chromedp 使用一个第三方 WebSocket 库，而每有一个 cdp 客户端，这个库都会有 [1MB 开销](https://github.com/chromedp/chromedp/blob/b56cd66f9cebd6a1fa1283847bbf507409d48225/conn.go#L43-L54)。如果你想要控制成千上万的远程浏览器，这会带来一些问题。 由于这一限制，如果执行大于 1MB 的 js 脚本 Chromedp 就会崩溃。有关 Chromedp 会多么容易崩溃，这里有一个例子：[gist](https://gist.github.com/ysmood/0d5b2c878ecbdb598776af7d3d305b79)。

在 Windows 和 Mac 上，Chromedp 会在崩溃时留下浏览器僵尸进程。

Rod 可配置程度更高，比如甚至可以把 WebSocket 库替换成一个你喜欢的库。

对于直接的代码比较，见[此](https://github.com/go-rod/rod/tree/master/lib/examples/compare-chromedp)。 比较 [rod](https://github.com/go-rod/rod/tree/master/lib/examples/compare-chromedp/logic/main.go) 和 [chromedp](https://github.com/chromedp/examples/blob/master/logic/main.go) 名为 `logic` 的示例后可以发现 rod 是多么的简单。

使用 Chromedp 时，必须要使用他们那冗长的、类似于 DSL 的任务来处理主要逻辑，因为 Chromedp 使用了好几个封装来处理上下文和选项的执行，而这会导致出现 bug 时很难理解代码。 大量使用的接口使得静态类型在追踪问题时毫无用处。 对比之下，Rod 使用尽可能少的接口。

Rod 的依赖更少，代码结构更简单，自动化测试更好。你会发现为 Rod 贡献代码更简单。 Therefore compared with Chromedp, Rod has the potential to have more nice functions from the community in the future.

Another problem of Chromedp is their architecture is based on [DOM node id](https://chromedevtools.github.io/devtools-protocol/tot/DOM/#type-NodeId), puppeteer and rod are based on [remote object id](https://chromedevtools.github.io/devtools-protocol/tot/Runtime/#type-RemoteObjectId). In consequence, it will prevent Chromedp's maintainers from adding high-level functions that are coupled with runtime. For example, this [ticket](https://github.com/chromedp/chromedp/issues/72) had opened for 3 years. Even after it's closed, you still can't evaluate js express on the element inside an iframe.

### Puppeteer

[Puppeteer][puppeteer] will JSON decode every message from the browser, Rod is decode-on-demand, so theoretically Rod will perform better, especially for heavy network events.

With puppeteer, you have to handle promise/async/await a lot, it makes elegant [fluent interface](https://en.wikipedia.org/wiki/Fluent_interface) design very hard. End to end tests requires a lot of sync operations to simulate human inputs, because Puppeteer is based on Nodejs all IO operations are async calls, so usually, people end up typing tons of async/await. If you forget to write a `await`, it's usually painful to debug leaking Promise. The overhead grows when your project grows.

Rod is type-safe by default, and has better internal comments about how Rod itself works. It has type bindings for all endpoints in Devtools protocol.

Rod will disable domain events whenever possible, puppeteer will always enable all the domains. It will consume a lot of resources when driving a remote browser.

Rod supports cancellation and timeout better, this can be critical if you want to handle thousands of pages. For example, to simulate `click` we have to send serval cdp requests, with [Promise](https://stackoverflow.com/questions/29478751/cancel-a-vanilla-ecmascript-6-promise-chain) you can't achieve something like "only send half of the cdp requests", but with the [context](https://golang.org/pkg/context/) we can.

### Playwright

Rod and [Playwright](https://github.com/microsoft/playwright) were first published almost at the same time. It's a great step forward for the Puppeteer team. Most comparisons between Rod and Puppeteer remain true to Playwright.

One of Rod's architectural goal is to make it easier for everyone to contribute and make it a pure community project, that's one big reason why I chose Golang and the MIT license. Typescript is a nice choice but if you check Playwright's design choices, [`any`](https://www.typescriptlang.org/docs/handbook/basic-types.htmvl#any) and [union types](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html#union-types) are everywhere, if you try to jump to the source code of [page.click](https://playwright.dev/#version=v1.6.2&path=docs%2Fapi.md&q=pageclickselector-options), `d.ts` files will let you understand the reality of typescript. Golang is definitely not good enough, but it usually introduces less tech debt than node.js typescript, if you want me to choose which one to use for QA or Infra who's not familiar with coding to automate end-to-end test or site-monitoring, I would pick Golang.

Their effort for cross-browser support is fabulous. But nowadays, HTML5 is well adopted by main brands, it's hard to say the complexity it brings can weight the benefits. Will the cross-browser [patches](https://github.com/microsoft/playwright/tree/master/browser_patches) become a burden in the future? Security issues for patched browsers is another concern. It also makes it tricky to test old versions of Firefox or Safari. Hope it's not over-engineering.

### Selenium

[Selenium](https://www.selenium.dev/) is based on [webdriver protocol](https://www.w3.org/TR/webdriver/) which has much less functions compare to [devtools protocol](https://chromedevtools.github.io/devtools-protocol). Such as it can't handle [closed shadow DOM](https://github.com/sukgu/shadow-automation-selenium/issues/7#issuecomment-563062460). No way to save pages as PDF. No support for tools like [Profiler](https://chromedevtools.github.io/devtools-protocol/tot/Profiler/) or [Performance](https://chromedevtools.github.io/devtools-protocol/tot/Performance/), etc.

Harder to set up and maintain because of extra dependencies like a browser driver.

Though selenium sells itself for better cross-browser support, it's usually very hard to make it work for all major browsers.

There are plenty of articles about "selenium vs puppeteer", you can treat rod as the Golang version of Puppeteer.

### Cypress

[Cypress](https://www.cypress.io/) is very limited, for closed shadow dom or cross-domain iframes it's almost unusable. Read their [limitation doc](https://docs.cypress.io/guides/references/trade-offs.html) for more details.

If you want to cooperate with us to create a testing focused framework base on Rod to overcome the limitation of cypress, please contact us.

## What does Rod mean

Rod is the name of the control device for puppetry, such as the brown stick in the image below:

![rod](https://user-images.githubusercontent.com/1415488/80178856-31cd8880-863a-11ea-83e9-64f84be3282d.png)

The meaning is we are the puppeteer, the browser is the puppet, we use the rod to control the puppet.

[chromedp]: https://github.com/chromedp/chromedp
[puppeteer]: https://github.com/puppeteer/puppeteer
