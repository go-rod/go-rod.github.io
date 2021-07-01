# Yhteensopivuus

## Käyttöjärjestelmä

Sinun pitäisi pystyä kääntämään ja pyörittämään Rod saumattomasti kaikilla pääalustoilla, joita Golang tukee. Joidenkin alustojen kohdalla saatat joutua asentamaan selaimen manuaalisesti, Rod ei voi taata automaattisesti ladattavan selaimen toimivan aina. Jos haluat, että sauva tukee alustaa, ota esille ongelman siinä.

Se on erittäin helppo google miten asentaa selain järjestelmään, esimerkiksi, Ubuntussa tai Debianissa löydät jotain tällaista asentaaksesi selaimen:

```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
apt install ./google-chrome-stable_current_amd64.deb
```

CentOS:

```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm
yum localinstall -y google-chrome-stable_current_x86_64.rpm
```

Alpiinilla:

```bash
apk lisätä kromi
```

## Tuetut selaimet

Rod pitäisi toimia millä tahansa selaimella, joka tukee [DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/).

- Microsoft Edge on tuettu.
- Firefox tukee [](https://wiki.mozilla.org/Remote) tätä protokollia.
- Safarilla ei ole vielä mitään suunnitelmaa sen tukemiseksi.
- IE ei tue sitä.

## Selaimen ja CDP-protokollan versiointi

CDP-protokolla on aina sama kuin [launcher.DefaultRevision](https://pkg.go.dev/github.com/go-rod/rod/lib/launcher#DefaultRevision). Jos Rod ei löydä paikallista selainta, se lataa selaimen `launcher.DefaultRevision`.

Jokainen sauvan versio takaa vain sen `launcher.DefaultRevision` selaimen.

## API Versioning

[Semveria](https://semver.org/) käytetään.

Ennen `v1.0.0` kun toinen osio muuttui, kuten `v0.1.0` `v0. .0`, täytyy olla joitakin julkisia sovellusrajapintamuutoksia, kuten funktionimien tai parametrityyppien muutoksia. Jos vain viimeinen osa muuttui, julkista APIa ei muuteta.

Voit käyttää Githubin julkaisuvertailua nähdäksesi automaattisen muutoslokin, esimerkiksi, [vertaa v0.75.2 ja v0.76.0](https://github.com/go-rod/rod/compare/v0.75.2...v0.76.0).

## API viitenumero

Mene [täältä](https://pkg.go.dev/github.com/go-rod/rod?tab=versions).

## Doc sivuston versiointi

Käytämme github hallita doc, se on helppo nähdä mikä tahansa versio doc:

1. Kloonaa doc [repo](https://github.com/go-rod/go-rod.github.io.git)
2. Git checkout to the commit that is near the release date of the Rod you want
3. Asenna [docsify-cli](https://docsify.js.org/#/quickstart)
4. Suorita repo juuressa `docsify serve -o`
