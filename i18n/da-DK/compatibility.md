# Forenelighed

## OS

Du bør være i stand til at kompilere og køre Rod problemfrit på alle hovedplatforme, som Golang understøtter. På nogle platforme, du måske nødt til at installere browseren manuelt, Rod kan ikke garantere auto-downloadede browser vil altid arbejde, Hvis du vil have Rod til at støtte en platform, bedes du rejse et problem for det.

Det er meget nemt at google hvordan du installerer browseren på dit system, for eksempel, på Ubuntu eller Debian vil du finde sådan noget at installere browseren:

```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
apt install ./google-chrome-stable_current_amd64.deb
```

På CentOS:

```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm
yum localinstall -y google-chrome-stable_current_x86_64.rpm
```

På Alpen:

```bash
apk tilsætter chrom
```

## Understøttede browsere

Rod bør arbejde med enhver browser, der understøtter [DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/).

- Microsoft Kant understøttes.
- Firefox is [supporting](https://wiki.mozilla.org/Remote) this protocol.
- Safari har ikke nogen plan til at støtte det endnu.
- IE vil ikke støtte det.

## Browser og CDP protokol versionering

CDP-protokollen er altid den samme som [launcher.DefaultRevision](https://pkg.go.dev/github.com/go-rod/rod/lib/launcher#DefaultRevision). Hvis Rod ikke kan finde din lokale browser, vil den downloade browserversionen af `launcher.DefaultRevision`.

Hver version af Rod garanterer kun at arbejde med sin `launcher.DefaultRevision` af browseren.

## API Versioning

[Semver](https://semver.org/) anvendes.

Før `v1.0.0` når andet afsnit ændres, såsom `v0.1.0` til `v0. .0`, der skal være nogle offentlige API-ændringer, såsom ændringer af funktionsnavne eller parametertyper. Hvis kun den sidste sektion ændres, vil ingen offentlig API blive ændret.

Du kan bruge Githubs udgivelsessammenligning for at se den automatiserede changelog, for eksempel [sammenlign v0.75.2 med v0.76.0](https://github.com/go-rod/rod/compare/v0.75.2...v0.76.0).

## API reference versionering

Gå til [her](https://pkg.go.dev/github.com/go-rod/rod?tab=versions).

## Dok-webstedsversionering

Vi bruger github til at styre doc, det er nemt at se enhver version af doc:

1. Klon doc [repo](https://github.com/go-rod/go-rod.github.io.git)
2. Git checkout til den commit der er nær udgivelsesdatoen for den Rod version du ønsker
3. Installer [docsify-cli](https://docsify.js.org/#/quickstart)
4. På roden af repo køre `docsify tjene -o`
