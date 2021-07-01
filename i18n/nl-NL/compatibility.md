# Compatibiliteit

## Besturingssysteem

Je zou Rod naadloos moeten kunnen compileren en runnen op alle belangrijke platforms die GØ ondersteunt. Op sommige platforms, moet u misschien de browser handmatig installeren, Rod kan niet garanderen dat de automatisch gedownloade browser altijd zal werken, Als je wilt dat Rod een platform ondersteunt, stel er dan een probleem voor.

Het is erg makkelijk om te installeren van de browser op uw systeem, bijvoorbeeld: op Ubuntu of Debian vind je iets dergelijks om de browser te installeren:

```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
apt install ./google-chrome-stable_current_amd64.deb
```

Over CentOS:

```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm
yum localinstall -y google-chrome-stable_current_x86_64.rpm
```

Op Alpine:

```bash
apk chroom toevoegen
```

## Ondersteunde browsers

Rod moet met elke browser werken die [DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/) ondersteunt.

- Microsoft Edge wordt ondersteund.
- Firefox ondersteunt [](https://wiki.mozilla.org/Remote) dit protocol.
- Safari heeft nog geen plan om dit te ondersteunen.
- IE zal het niet ondersteunen.

## Browser en cdp protocol versiebeheer

Het cdp protocol is altijd hetzelfde als [launcher.DefaultRevision](https://pkg.go.dev/github.com/go-rod/rod/lib/launcher#DefaultRevision). Als Rod uw lokale browser niet kan vinden, zal het de browserversie van de `launcher.DefaultRevision` downloaden.

Elke versie van Rod garandeert alleen dat u met de `launcher.DefaultRevision` van de browser kunt werken.

## API Versioning

[Semver](https://semver.org/) wordt gebruikt.

Vóór `v1.0.0` wanneer de tweede sectie veranderde, zoals `v0.1.0` tot `v0. .0`, er moeten veranderingen in de openbare API zijn, zoals veranderingen in functienamen of parametertypes. Als alleen de laatste sectie is veranderd, wordt geen publieke API gewijzigd.

Je kunt Github's releasevergelijking gebruiken om bijvoorbeeld de geautomatiseerde changelog, te zien [Vergelijk v0.75.2 met v0.76.0](https://github.com/go-rod/rod/compare/v0.75.2...v0.76.0).

## API referentie versie

Ga naar [hier](https://pkg.go.dev/github.com/go-rod/rod?tab=versions).

## Doc website versie

We gebruiken github om het document te beheren, het is eenvoudig om elke versie van het document te bekijken:

1. Kloon de doc [repo](https://github.com/go-rod/go-rod.github.io.git)
2. Afrekenen tot aan de commit die in de buurt is van de vrijgavedatum van de gewenste Rod versie
3. [docsify-cli](https://docsify.js.org/#/quickstart) installeren
4. Op de basis van de repo run `docsify gebruik -o`
