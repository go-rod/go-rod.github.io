# Совместимость

## ОС

Вы можете легко скомпилировать и запускать Rod на всех основных платформах, которые поддерживает Golang. On some platforms, you might need to install the browser manually, Rod can't guarantee the auto-downloaded browser will always work, If you want Rod to support a platform, please raise an issue for it.

It's very easy to google how to install the browser on your system, for example, on Ubuntu or Debian you will find something like this to install the browser:

```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
apt install ./google-chrome-stable_current_amd64.deb
```

В CentOS:

```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm
yum localinstall -y google-chrome-stable_current_x86_64.rpm
```

На альпине:

```bash
apk добавить хром
```

## Поддерживаемые браузеры

Rod должен работать с любым браузером, поддерживающим [DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/).

- Microsoft Edge поддерживается.
- Firefox [поддерживает](https://wiki.mozilla.org/Remote) этот протокол.
- В Safari пока нет ни одного плана для его поддержки.
- Я не поддерживаю.

## Версия протокола браузера и cdp

Протокол cdp всегда такой же, как [launcher.DefaultRevision](https://pkg.go.dev/github.com/go-rod/rod/lib/launcher#DefaultRevision). Если Rod не может найти ваш локальный браузер, он загрузит версию браузера `launcher.DefaultRevision`.

Каждая версия Rod гарантирует только работу с `launcher.DefaultRevision` браузера.

## API Versioning

[Семвер-](https://semver.org/) используется.

До `v1.0.0` при изменении второго раздела, например `v0.1.0` на `v0. .0`, должны быть некоторые публичные изменения API, такие как изменение имен функций или типов параметров. Если только последний раздел изменится, публичный API не будет изменен.

Вы можете использовать сравнение релизов Github для просмотра автоматического списка изменений, например, [сравнить v0.75.2 с v0.76.0](https://github.com/go-rod/rod/compare/v0.75.2...v0.76.0).

## Версия API справочной версии

Перейдите к [здесь](https://pkg.go.dev/github.com/go-rod/rod?tab=versions).

## Версии сайта

Мы используем github для управления документом, легко просматривать любую версию документации:

1. Клонировать репозиторий [](https://github.com/go-rod/go-rod.github.io.git)
2. Git checkout to the commit that is near the release of the Rod version that you want
3. Установить [docsify-cli](https://docsify.js.org/#/quickstart)
4. При корне репозитория запустить `docsify serve -o`
