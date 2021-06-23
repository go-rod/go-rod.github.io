# Slučitelnost s vnitřním trhem

## OS

Měl bys být schopen kompilovat a spustit prut hladce na všech hlavních platformách, které Golang podporuje. Na některých platformách možná budete muset nainstalovat prohlížeč ručně, Rod nemůže zaručit, že automaticky stažený prohlížeč bude vždy fungovat, Pokud chcete, aby Rod podporoval platformu, prosím nastolte pro ni problém.

Je velmi snadné google nainstalovat prohlížeč například na váš systém, na Ubuntu nebo Debianu najdete něco podobného k instalaci prohlížeče:

```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
apt install ./google-chrome-stable_current_amd64.deb
```

Na CentOS:

```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm
yum localinstall -y google-chrome-stable_current_x86_64.rpm
```

Na Alpinu:

```bash
apk přidat chromium
```

## Podporované prohlížeče

Rod by měl fungovat s kterýmkoliv prohlížečem, který podporuje [DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/).

- Microsoft Edge je podporován.
- Firefox [podporuje](https://wiki.mozilla.org/Remote) tento protokol.
- Safari zatím nemá žádný plán na jeho podporu.
- IE ji nepodpoří.

## Verze prohlížeče a cdp protokolu

cdp protokol je vždy stejný jako [launcher.DefaultRevision](https://pkg.go.dev/github.com/go-rod/rod/lib/launcher#DefaultRevision). Pokud Rod nemůže najít váš místní prohlížeč. Stáhne si verzi `launcher.DefaultRevision`.

Každá verze čáry zaručuje, že bude pracovat pouze se svým `launcher.DefaultRevision` prohlížeče.

## API Versioning

[Používá se seminář](https://semver.org/).

Před `v1.0.0` vždy, když se změnila druhá sekce, například `v0.1.0` na `v0. .0`, musí dojít k některým veřejným změnám API, jako jsou změny jmen funkcí nebo typů parametrů. Pokud se změnil pouze poslední sekce, nebude změněno žádné veřejné API.

Srovnání Githubových vydání můžete použít pro zobrazení automatického seznamu změn, například, [porovnat v0.75.2 s v0.76.0](https://github.com/go-rod/rod/compare/v0.75.2...v0.76.0).

## Referenční verze API

Přejděte na [zde](https://pkg.go.dev/github.com/go-rod/rod?tab=versions).

## Verze stránky Doc

Pro správu doku používáme github, je snadné zobrazit jakoukoliv verzi dokumentu:

1. Klonovat doc [repozitář](https://github.com/go-rod/go-rod.github.io.git)
2. Git pokladna pro commit, který se blíží datu vydání verze Rod kterou chcete
3. Nainstalujte [docsify-cli](https://docsify.js.org/#/quickstart)
4. Na kořenovém adresáři repo run `docsify serve -o`
