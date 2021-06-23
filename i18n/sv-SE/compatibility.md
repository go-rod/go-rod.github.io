# Kompatibilitet

## OS

Du bör kunna kompilera och köra Rod sömlöst på alla huvudplattformar som Golang stöder. På vissa plattformar kan du behöva installera webbläsaren manuellt, Rod kan inte garantera att den automatiskt nedladdade webbläsaren alltid kommer att fungera. Om du vill att Rod ska stödja en plattform, vänligen ta upp ett problem för den.

Det är mycket lätt att google hur man installerar webbläsaren på ditt system, till exempel på Ubuntu eller Debian hittar du något liknande för att installera webbläsaren:

```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
apt install ./google-chrome-stable_current_amd64.deb
```

På CentOS:

```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm
yum localinstall -y google-chrome-stable_current_x86_64.rpm
```

På Alpine:

```bash
apk lägg till krom
```

## Webbläsare som stöds

Rod bör fungera med alla webbläsare som stöder [DevTools protokoll](https://chromedevtools.github.io/devtools-protocol/).

- Microsoft Edge stöds.
- Firefox stöder [](https://wiki.mozilla.org/Remote) detta protokoll.
- Safari har ingen plan för att stödja det ännu.
- IE kommer inte att stödja det.

## Version av webbläsar- och cdp-protokoll

cdp-protokollet är alltid samma som [launcher.DefaultRevision](https://pkg.go.dev/github.com/go-rod/rod/lib/launcher#DefaultRevision). Om Rod inte kan hitta din lokala webbläsare, det kommer att ladda ner webbläsarversionen av `launcher.DefaultRevision`.

Varje version av Rod garanterar bara att arbeta med sin `launcher.DefaultRevision` av webbläsaren.

## API Versioning

[Semver](https://semver.org/) används.

Före `v1.0.0` när det andra avsnittet ändrades, till exempel `v0.1.0` till `v0. .0`, det måste finnas några offentliga API-ändringar, såsom ändringar av funktionsnamn eller parametertyper. Om bara det sista avsnittet ändras, kommer inget offentligt API att ändras.

Du kan använda Github's release jämförelse för att se den automatiska ändringsloggen, till exempel, [jämför v0.75.2 med v0.76.0](https://github.com/go-rod/rod/compare/v0.75.2...v0.76.0).

## API referens versionshantering

Gå till [här](https://pkg.go.dev/github.com/go-rod/rod?tab=versions).

## Dok-webbplatsversionering

Vi använder github för att hantera dokumentet, det är lätt att visa alla versioner av dokumentet:

1. Klona dokumentet [repo](https://github.com/go-rod/go-rod.github.io.git)
2. Git kassan till åtagandet som ligger nära releasedatumet för den Stod version du vill ha
3. Installera [docsify-cli](https://docsify.js.org/#/quickstart)
4. På roten av repo kör `docsify serve -o`
