# Kompatibilitet

## operativsystem

Du bør kunne kompilere og kjøre sømløst med Rod på alle hovedplattformer som Golang støtter. På noen plattformer må du kanskje installere nettleseren manuelt, kan ikke garantere at den nedlastede nettleseren alltid fungerer. Hvis du ønsker at Rod skal støtte en plattform, vennligst gi et problem for den.

Det er veldig enkelt å google hvordan du installerer nettleseren på systemet ditt, for eksempel, på Ubuntu eller Debian vil du finne noe som for å installere nettleseren:

```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
tipp installering./google-chrome-stable_current_amd64.deb
```

På sentrum:

```bash
får https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm
yum localinstall -y google-chrome-stable_current_x86_64.rpm
```

På Alpina:

```bash
apk tilsett krom
```

## Støttede nettlesere

Rod burde fungere med alle nettlesere som støtter [DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/).

- Microsoft Edge-funksjonen er støttet.
- Firefox is [supporting](https://wiki.mozilla.org/Remote) this protocol.
- Safari har ingen plan som støtter den ennå.
- IE vil ikke støtte det.

## Nettleser og cdp protokoll versjonshåndtering

cdp-protokollen er alltid den samme som [launcher.DefaultRevision](https://pkg.go.dev/github.com/go-rod/rod/lib/launcher#DefaultRevision). Hvis Hvis Rod ikke finner din lokale nettleser, vil den laste ned nettleserversjonen av `launcher.DefaultRevision`.

Hver versjon av od garanterer kun å arbeide med sitt `launcher.DefaultRevision` av nettleseren.

## API Versioning

[Semver](https://semver.org/) brukes.

Før `v1.0.0` når den andre seksjonen endret seg, slik som `v0.1.0` til `v0. .0`, det må være noen offentlige API endringer, som for eksempel endringer i funksjonsnavn eller parametertyper. Hvis bare siste avsnitt endres, blir ingen offentlig API endret.

Du kan bruke sammenligningen til Githubs for å se den automatiske endringsloggen, for eksempel, [Sammenlign v0.75.2 med v0.76.0](https://github.com/go-rod/rod/compare/v0.75.2...v0.76.0).

## API versjonshåndtering

Gå til [her](https://pkg.go.dev/github.com/go-rod/rod?tab=versions).

## Doc nettsted versjonshåndtering

Vi bruker github til å administrere dokumentet, det er enkelt å se hvilken som helst versjon av dokumentet:

1. Klon doc [repo](https://github.com/go-rod/go-rod.github.io.git)
2. Git checkout to the commit that is near the release date of the Rod version you want
3. Installer [docsify-cli](https://docsify.js.org/#/quickstart)
4. På roten av repo run `docsify serve -o`
