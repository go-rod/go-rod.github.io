# Compatibilità

## OS

Si dovrebbe essere in grado di compilare ed eseguire Rod senza soluzione di continuità su tutte le piattaforme principali che Golang supporta. Su alcune piattaforme, potrebbe essere necessario installare il browser manualmente, Rod non può garantire che il browser scaricato automaticamente funzionerà sempre, Se si desidera che Rod supporti una piattaforma, si prega di sollevare un problema per esso.

È molto facile da cercare come installare il browser sul vostro sistema, per esempio, su Ubuntu o Debian troverai qualcosa di simile per installare il browser:

```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
apt install ./google-chrome-stable_current_amd64.deb
```

Su CentOS:

```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm
yum localinstall -y google-chrome-stable_current_x86_64.rpm
```

Sull'Alpina:

```bash
apk add chromium
```

## Browser supportati

Rod dovrebbe funzionare con qualsiasi browser che supporti [DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/).

- Microsoft Edge è supportato.
- Firefox supporta [](https://wiki.mozilla.org/Remote) questo protocollo.
- Safari non ha ancora alcun piano per supportarlo.
- IE non la sosterrà.

## Versione del protocollo Browser e cdp

Il protocollo cdp è sempre lo stesso di [launcher.DefaultRevision](https://pkg.go.dev/github.com/go-rod/rod/lib/launcher#DefaultRevision). Se Rod non riesce a trovare il tuo browser locale, scaricherà la versione del browser `launcher.DefaultRevision`.

Ogni versione di Rod garantisce solo di lavorare con il suo `launcher.DefaultRevision` del browser.

## API Versioning

[Semver](https://semver.org/) è usato.

Prima di `v1.0.0` ogni volta che la seconda sezione è cambiata, come `v0.1.0` a `v0. .0`, ci devono essere alcune modifiche delle API pubbliche, come le modifiche dei nomi delle funzioni o dei tipi di parametri. Se solo l'ultima sezione è cambiata, nessuna API pubblica sarà cambiata.

È possibile utilizzare il confronto delle versioni di Github, per vedere il changelog automatico, per esempio, [confronta v0.75.2 con v0.76.0](https://github.com/go-rod/rod/compare/v0.75.2...v0.76.0).

## Versione di riferimento API

Vai a [qui](https://pkg.go.dev/github.com/go-rod/rod?tab=versions).

## Versionamento del sito doc

Utilizziamo github per gestire il doc, è facile visualizzare qualsiasi versione del doc:

1. Clona il doc [repo](https://github.com/go-rod/go-rod.github.io.git)
2. Git checkout al commit che è vicino alla data di rilascio della versione Rod che si desidera
3. Installa [docsify-cli](https://docsify.js.org/#/quickstart)
4. Nella root del repo esegui `docsify serve -o`
