# Сумісність

## ОС

Ви повинні бути в змозі скласти і безперешкодно запустити Rod на всіх основних платформах, які підтримує Golang . На деяких платформах, можливо, вам доведеться встановити браузер вручну, Rod не може гарантувати, що автоматично завантажений браузер завжди працюватиме, Якщо ви хочете, щоб мотузка підтримувала платформу, будь ласка, задачу про неї.

Це дуже просто встановити браузер на вашу систему, наприклад, на Ubuntu або Debian ви знайдете щось на зразок цього браузера:

```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
apt встановити ./google-chrome-stable_current_amd64.deb
```

На Центрі:

```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm
yum localinstall -y google-chrome-stable_current_x86_64.rpm
```

На Alpin:

```bash
apk додати хроміум
```

## Браузери, що підтримуються

Rod повинен працювати з будь-яким браузером, який підтримує [Інструментарний протокол](https://chromedevtools.github.io/devtools-protocol/).

- Microsoft Edge підтримується.
- Firefox [підтримує](https://wiki.mozilla.org/Remote) цей протокол.
- Safari ще не має жодного плану його підтримки.
- IE не підтримає.

## Браузер і cdp версія протоколу

Cdp протокол завжди такий самий, як [launcher.DefaultRevision](https://pkg.go.dev/github.com/go-rod/rod/lib/launcher#DefaultRevision). Якщо Rod не може знайти ваш локальний браузер, він завантажить версію браузера `launcher.DefaultRevision`.

Кожна версія Rod гарантує працювати лише з її `launcher.DefaultRevision` браузера.

## API Versioning

[Семвер](https://semver.org/) використовується.

До початку `v1.0.0` коли змінюється другий розділ, наприклад `v0.1.0` до `v0. .0`, повинні бути деякі публічні зміни API, такі як зміни імен функцій або типів параметрів. Якщо тільки останній розділ змінився, жоден публічний API не буде змінено.

Наприклад, ви можете використати реліз Github, щоб переглянути автоматичний журнал змін, наприклад, [порівняти версії v0.75.2 з v0.76.0](https://github.com/go-rod/rod/compare/v0.75.2...v0.76.0).

## Версія API

Перейдіть до [тут](https://pkg.go.dev/github.com/go-rod/rod?tab=versions).

## Керування документами

Ми використовуємо github для керування документацією - просто переглядати будь-яку версію доку:

1. Клонувати доку [репозиторій](https://github.com/go-rod/go-rod.github.io.git)
2. Git перевірки на коміт, який знаходиться біля дати випуску Роду, яку ви хочете
3. Встановіть [docsify-cli](https://docsify.js.org/#/quickstart)
4. У кореневому тесті запуску репозиторія `docsify serve -o`
