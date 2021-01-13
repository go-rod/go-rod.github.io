# Compatibility

## OS

You should be able to compile and run Rod seamlessly on all main platforms that Golang supports.
On some platforms, you might need to install the browser manually, Rod can't guarantee the auto-downloaded browser will always work,
If you want Rod to support a platform, please raise an issue for it.

It's very easy to google how to install the browser on your system, for example,
on Ubuntu or Debian you will find something like this to install the browser:

```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
apt install ./google-chrome-stable_current_amd64.deb
```

On CentOS:

```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm
yum localinstall -y google-chrome-stable_current_x86_64.rpm
```

## Supported browsers

Rod should work with any browser that supports [DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/).

- Microsoft Edge is supported.
- Firefox is [supporting](https://wiki.mozilla.org/Remote) this protocol.
- Safari doesn't have any plan to support it yet.
- IE won't support it.

## Browser and cdp protocol versioning

The cdp protocol is always the same as [launcher.DefaultRevision](https://pkg.go.dev/github.com/go-rod/rod/lib/launcher#DefaultRevision).
If Rod can't find your local browser, it will download the browser version of the `launcher.DefaultRevision`.

## API Versioning

[Semver](https://semver.org/) is used.

Before `v1.0.0` whenever the second section changed, such as `v0.1.0` to `v0.2.0`, there must be some public API changes, such as changes of function names or parameter types. If only the last section changed, no public API will be changed.

You can use Github's release comparison to see the automated changelog, for example, [compare v0.75.2 with v0.76.0](https://github.com/go-rod/rod/compare/v0.75.2...v0.76.0).
