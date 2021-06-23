# Compatibilitate

## SG

Ar trebui să poți compila și rula Rod fără probleme pe toate platformele principale pe care Golang le sprijină. Pe unele platforme, s-ar putea să aveți nevoie să instalați manual browser-ul, Rod nu poate garanta că browser-ul descărcat automat va funcționa întotdeauna. Dacă doriți ca Rod să suporte o platformă, vă rugăm să ridicați o problemă pentru ea.

Este foarte ușor să google cum să instalezi browser-ul pe sistemul tău, de exemplu, pe Ubuntu sau Debian veţi găsi ceva de genul acesta pentru a instala browser-ul:

```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
apt install ./google-chrome-stable_current_amd64.deb
```

Pe CentOS:

```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm
yum localinstall -y google-chrome-stable_current_x86_64.rpm
```

Pe alpină:

```bash
apk adaugă crom
```

## Browsere suportate

Rod ar trebui să funcționeze cu orice browser care acceptă [DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/).

- Microsoft Edge este suportat.
- Firefox [suportă](https://wiki.mozilla.org/Remote) acest protocol.
- Safari nu are nici un plan pentru a-l susţine încă.
- IE nu o va suporta.

## Versionare protocol browser şi cdp

Protocolul cdp este întotdeauna la fel ca [launcher.DefaultRevision](https://pkg.go.dev/github.com/go-rod/rod/lib/launcher#DefaultRevision). Dacă Rod nu vă poate găsi browser-ul local, va descărca versiunea de browser a `launcher.DefaultRevision`.

Fiecare versiune de Rod garantează doar funcționarea cu lansatorul `DefaultRevision` al browserului.

## API Versioning

[Semver](https://semver.org/) este folosit.

Înainte de `v1.0.0` ori de câte ori s-a schimbat a doua secțiune, cum ar fi `v0.1.0` la `v0. .0`, trebuie să existe unele modificări API publice, cum ar fi modificări ale numelor funcției sau a tipurilor de parametri. Dacă numai ultima secțiune modificată, niciun API public nu va fi schimbat.

Poți folosi comparația cu lansările lui Giext pentru a vedea modificarea automată, de exemplu, [compara v0.75.2 cu v0.76.0](https://github.com/go-rod/rod/compare/v0.75.2...v0.76.0).

## Versionare referință API

Accesați [aici](https://pkg.go.dev/github.com/go-rod/rod?tab=versions).

## Versionare Doc site

Folosim github pentru a gestiona documentul, este ușor de văzut orice versiune a documentului:

1. Clonează documentul [repo](https://github.com/go-rod/go-rod.github.io.git)
2. Git checkout to the commit that is near the release date of the Rod version you want
3. Instalează [docsify-cli](https://docsify.js.org/#/quickstart)
4. Pe rădăcina repo run `docsify serve -o`
