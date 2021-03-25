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

## 支持的浏览器

Rod 支持任何使用 [DevTools 协议](https://chromedevtools.github.io/devtools-protocol/)的浏览器。

- 支持 Microsoft Edge。
- Firefox 目前正在[支持](https://wiki.mozilla.org/Remote)这一协议。
- Safari 目前还没有支持它的计划。
- IE 不会支持它的。

## 浏览器和 cdp 协议版本号

cdp 协议总是与 [launcher.DefaultRevision](https://pkg.go.dev/github.com/go-rod/rod/lib/launcher#DefaultRevision) 相同。 如果 Rod 找不到本地浏览器，它会下载 `launcher.DefaultRevision` 版本的浏览器。

每个版本的 Rod 指保证支持它的 `launcher.DefaultRevision` 版本的浏览器。

## API 版本号

采用 [Semver](https://semver.org/)。

在 `v1.0.0` 之前，如果版本号的第二个部分改变了，比如说由 `v0.1.0` 变为了 `v0.2.0`，那么肯定有公有 API 发生了改变，比如说函数名或参数类型发生了变更。 如果仅仅是版本号的最后一部分改变了，则公有 API 不会变更。

你可以使用 Github 的版本比较来查看自动生成的更新日志，例如，[比较 v0.75.2 与 v0.76.0](https://github.com/go-rod/rod/compare/v0.75.2...v0.76.0)。

## API reference versioning

Go to [here](https://pkg.go.dev/github.com/go-rod/rod?tab=versions).

## Doc site versioning

We use github to manage the doc, it's easy to view any version of the doc:

1. Clone the doc [repo](https://github.com/go-rod/go-rod.github.io.git)
2. Git checkout to the commit that is near the release date of the Rod version you want
3. Install [docsify-cli](https://docsify.js.org/#/quickstart)
4. On the root of the repo run `docsify serve -o`
