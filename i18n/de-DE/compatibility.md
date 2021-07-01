# Kompatibilität

## OS

Sie sollten in der Lage sein, Rod nahtlos auf allen wichtigen Plattformen zu kompilieren und zu betreiben, die Golang unterstützt. On some platforms, you might need to install the browser manually, Rod can't guarantee the auto-downloaded browser will always work, If you want Rod to support a platform, please raise an issue for it.

It's very easy to google how to install the browser on your system, for example, on Ubuntu or Debian you will find something like this to install the browser:

```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
apt install ./google-chrome-stable_current_amd64.deb
```

Auf CentOS:

```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm
yum localinstall -y google-chrome-stable_current_x86_64.rpm
```

Im Alpin:

```bash
apk add Chrom
```

## Unterstützte Browser

Rod sollte mit jedem Browser arbeiten, der [DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/) unterstützt.

- Microsoft Edge wird unterstützt.
- Firefox is [supporting](https://wiki.mozilla.org/Remote) this protocol.
- Safari hat noch keinen Plan, es zu unterstützen.
- IE wird es nicht unterstützen.

## Browser- und cdp-Protokollversionierung

Das cdp-Protokoll ist immer das gleiche wie [launcher.DefaultRevision](https://pkg.go.dev/github.com/go-rod/rod/lib/launcher#DefaultRevision). Wenn Rod Ihren lokalen Browser nicht finden kann, wird die Browserversion des `launcher.DefaultRevision` heruntergeladen.

Jede Version von Rod garantiert nur, mit der `launcher.DefaultRevision` des Browsers zu arbeiten.

## API Versioning

[Semver](https://semver.org/) wird verwendet.

Vor `v1.0.0` bei jeder Änderung des zweiten Abschnitts, wie `v0.1.0` zu `v0. .0`, es muss einige öffentliche API-Änderungen geben, wie zum Beispiel Änderungen an Funktionsnamen oder Parametertypen. Wenn nur der letzte Abschnitt geändert wird, wird keine öffentliche API geändert.

Sie können Github Versionsvergleich verwenden, um den automatisierten Changelog zu sehen, zum Beispiel [vergleiche v0.75.2 mit v0.76.0](https://github.com/go-rod/rod/compare/v0.75.2...v0.76.0).

## API-Referenzversionierung

Gehe zu [hier](https://pkg.go.dev/github.com/go-rod/rod?tab=versions).

## Dokumenten-Versionierung

Wir verwenden github um das Doc zu verwalten, es ist einfach jede Version der Dokumentation anzuzeigen:

1. Kopiere den Doc [Repo](https://github.com/go-rod/go-rod.github.io.git)
2. Git Checkout zu dem Commit, der neben dem Veröffentlichungsdatum der Rod-Version ist, die du möchtest
3. [docsify-cli](https://docsify.js.org/#/quickstart) installieren
4. Auf der Wurzel des Repos läuft `docsify serve -o`
