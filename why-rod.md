# Why Rod

There are a lot of great projects, but no one is perfect, choose the best one that fits your needs is important.

## Compared with other libs

### Chromedp

Theoretically, Rod should perform faster and consume less memory than Chromedp.

[Chromedp][chromedp] uses a [fix-sized buffer](https://github.com/chromedp/chromedp/blob/b56cd66/target.go#L69-L73) for events, it can cause dead-lock on high concurrency. Because Chromedp uses a single event-loop, the slow event handlers will block each other. Rod doesn't have these issues because it's based on [goob](https://github.com/ysmood/goob).

Chromedp will JSON decode every message from the browser, rod is decode-on-demand, so Rod performs better, especially for heavy network events.

Chromedp uses third part WebSocket lib which has [1MB overhead](https://github.com/chromedp/chromedp/blob/b56cd66f9cebd6a1fa1283847bbf507409d48225/conn.go#L43-L54) for each cdp client, if you want to control thousands of remote browsers it can become a problem. Because of this limitation, if you evaluate a js script larger than 1MB, Chromedp will crash, here's an example of how easy you can crash Chromedp: [gist](https://gist.github.com/ysmood/0d5b2c878ecbdb598776af7d3d305b79).

When a crash happens, Chromedp will leave the zombie browser process on Windows and Mac.

Rod is more configurable, such as you can even replace the WebSocket lib with the lib you like.

For direct code comparison you can check [here](lib/examples/compare-chromedp). If you compare the example called `logic` between [rod](lib/examples/compare-chromedp/logic/main.go) and [chromedp](https://github.com/chromedp/examples/blob/master/logic/main.go), you will find out how much simpler rod is.

With Chromedp, you have to use their verbose DSL like tasks to handle the main logic, because Chromedp uses several wrappers to handle execution with context and options which makes it very hard to understand their code when bugs happen. The heavily used interfaces make the static types useless when tracking issues. In contrast, Rod uses as few interfaces as possible.

Rod has less dependencies, a simpler code structure and better test automation, you should find it's easier to contribute code to Rod. Therefore compared with Chromedp, Rod has the potential to have more nice functions from the community in the future.

Another problem of Chromedp is their architecture is based on [DOM node id](https://chromedevtools.github.io/devtools-protocol/tot/DOM/#type-NodeId), puppeteer and rod are based on [remote object id](https://chromedevtools.github.io/devtools-protocol/tot/Runtime/#type-RemoteObjectId). In consequence, it will prevent Chromedp's maintainers from adding high-level functions that are coupled with runtime. For example, this [ticket](https://github.com/chromedp/chromedp/issues/72) had opened for 3 years. Even after it's closed, you still can't evaluate js express on the element inside an iframe.

### Puppeteer

[Puppeteer][puppeteer] will JSON decode every message from the browser, Rod is decode-on-demand, so theoretically Rod will perform better, especially for heavy network events.

With puppeteer, you have to handle promise/async/await a lot, it makes elegant [fluent interface](https://en.wikipedia.org/wiki/Fluent_interface) design very hard. End to end tests requires a lot of sync operations to simulate human inputs, because Puppeteer is based on Nodejs all IO operations are async calls, so usually, people end up typing tons of async/await. If you forget to write a `await`, it's usually painful to debug leaking Promise. The overhead grows when your project grows.

Rod is type-safe by default, and has better internal comments about how Rod itself works. It has type bindings for all endpoints in Devtools protocol.

Rod will disable domain events whenever possible, puppeteer will always enable all the domains. It will consume a lot of resources when driving a remote browser.

Rod supports cancellation and timeout better, this can be critical if you want to handle thousands of pages. For example, to simulate `click` we have to send serval cdp requests, with [Promise](https://stackoverflow.com/questions/29478751/cancel-a-vanilla-ecmascript-6-promise-chain) you can't achieve something like "only send half of the cdp requests", but with the [context](https://golang.org/pkg/context/) we can.

### Playwright

Rod and [Playwright](https://github.com/microsoft/playwright) were first published almost at the same time. It's a great step forward for the Puppeteer team. Most comparisons between Rod and Puppeteer remain true to Playwright.

One of Rod's architectural goal is to make it easier for everyone to contribute and make it a pure community project, that's one big reason why I chose Golang and the MIT license.
Typescript is a nice choice but if you check Playwright's design choices, [`any`](https://www.typescriptlang.org/docs/handbook/basic-types.htmvl#any) and [union types](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html#union-types) are everywhere, if you try to jump to the source code of [page.click](https://playwright.dev/#version=v1.6.2&path=docs%2Fapi.md&q=pageclickselector-options), `d.ts` files will let you understand the reality of typescript. Golang is definitely not good enough, but it usually introduces less tech debt than node.js typescript, if you want me to choose which one to use for QA or Infra who's not familiar with coding to automate end-to-end test or site-monitoring, I would pick Golang.

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

Rod is the name of a control device for puppetry, such as this:

![rod](https://user-images.githubusercontent.com/1415488/80178856-31cd8880-863a-11ea-83e9-64f84be3282d.png).

The meaning is we are the puppeteer, the browser is the puppet, we use the rod to control the puppet.

[chromedp]: https://github.com/chromedp/chromedp
[puppeteer]: https://github.com/puppeteer/puppeteer