# 兼容性

## OS

一般来说你可以在 Golang 支持的所有主要平台上无感知地编译和运行 Rod。 在某些平台上，你可能需要手动安装浏览器。Rod 无法保证总是能成功自动下载浏览器。如果想要 Rod 支持某一平台，请发起一个 issue。

在网上可以很轻松地搜索到如何在你的系统中安装浏览器。比如说，对于 Ubuntu 或 Debian，可以搜索到这种安装浏览器的方法：

```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
apt install ./google-chrome-stable_current_amd64.deb
```

对于 CentOS：

```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm
yum localinstall -y google-chrome-stable_current_x86_64.rpm
```

On Alpine:

```bash
apk add chromium
```

## 支持的浏览器

Rod should work with any browser that supports [DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/).

- 支持 Microsoft Edge。
- Firefox 目前正在[支持](https://wiki.mozilla.org/Remote)这一协议。
- Safari 目前还没有支持它的计划。
- IE 不会支持它的。

## 浏览器和 cdp 协议版本号

The cdp protocol is always the same as [launcher.DefaultRevision](https://pkg.go.dev/github.com/go-rod/rod/lib/launcher#DefaultRevision). If Rod can't find your local browser, it will download the browser version of the `launcher.DefaultRevision`.

Each version of Rod only guarantees to work with its `launcher.DefaultRevision` of the browser.

## API 版本号

[Semver](https://semver.org/) is used.

Before `v1.0.0` whenever the second section changed, such as `v0.1.0` to `v0.2.0`, there must be some public API changes, such as changes of function names or parameter types. If only the last section changed, no public API will be changed.

You can use Github's release comparison to see the automated changelog, for example, [compare v0.75.2 with v0.76.0](https://github.com/go-rod/rod/compare/v0.75.2...v0.76.0).

## API 文档版本

Go to [here](https://pkg.go.dev/github.com/go-rod/rod?tab=versions).

## Doc 网站版本

We use github to manage the doc, it's easy to view any version of the doc:

1. 克隆 doc [repo](https://github.com/go-rod/go-rod.github.io.git)
2. Git checkout 到你想要的 Rod 版本发布日期附近的 commit
3. 安装 [docsify-cli](https://docsify.js.org/#/quickstart)。
4. 在仓库的根目录下运行 `docsify serve -o`
