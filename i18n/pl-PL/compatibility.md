# Zgodność z rynkiem wewnętrznym

## OS

Powinieneś mieć możliwość kompilowania i prowadzenia Rod bezproblemowo na wszystkich głównych platformach obsługiwanych przez Golang. Na niektórych platformach może być konieczne zainstalowanie przeglądarki ręcznie, Rod nie może zagwarantować, że automatycznie pobrana przeglądarka zawsze działa, Jeśli chcesz, aby Rod wspierał platformę, zgłoś problem.

Bardzo łatwo jest google jak zainstalować przeglądarkę w Twoim systemie, na przykład na Ubuntu lub Debian znajdziesz coś takiego, aby zainstalować przeglądarkę:

```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
apt install ./google-chrome-stable_current_amd64.deb
```

Na CentOS:

```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm
yum localinstall -y google-chrome-stable_current_x86_64.rpm
```

Na Alpie:

```bash
apk dodaj chrom
```

## Obsługiwane przeglądarki

Rod powinien pracować z każdą przeglądarką, która obsługuje [Protokół DevTools](https://chromedevtools.github.io/devtools-protocol/).

- Obsługiwane jest Microsoft Edge.
- Firefox [obsługuje](https://wiki.mozilla.org/Remote) ten protokół.
- Safari nie ma jeszcze żadnego planu do jego wsparcia.
- IE tego nie obsługuje.

## Wersja protokołu przeglądarki i cdp

Protokół cdp jest zawsze taki sam jak [launcher.DefaultRevision](https://pkg.go.dev/github.com/go-rod/rod/lib/launcher#DefaultRevision). Jeśli Rod nie może znaleźć twojej lokalnej przeglądarki, pobierze wersję przeglądarki `launcher.DefaultRevision`.

Każda wersja Rod gwarantuje tylko pracę z jej `launcher.DefaultRevision` przeglądarki.

## API Versioning

[Semver](https://semver.org/) jest używany.

Przed `v1.0.0` w każdym przypadku zmiany drugiej sekcji, np. `v0.1.0` na `v0. .0`, muszą być pewne publiczne zmiany API, takie jak zmiany nazw funkcji lub typów parametrów. Jeśli zmieniono tylko ostatnią sekcję, żadne publiczne API nie zostanie zmienione.

Możesz użyć porównania wersji Github, aby zobaczyć zautomatyzowany dziennik zmian, na przykład [porównać v0.75.2 z v0.76.0](https://github.com/go-rod/rod/compare/v0.75.2...v0.76.0).

## Wersja API

Przejdź do [tutaj](https://pkg.go.dev/github.com/go-rod/rod?tab=versions).

## Wersja witryny Doc

Używamy github do zarządzania dokumentem, łatwo wyświetlić każdą wersję dokumentu:

1. Sklonuj plik [repozytorium](https://github.com/go-rod/go-rod.github.io.git)
2. Git kasout do commitu który znajduje się blisko daty wydania wersji Rod którą chcesz
3. Zainstaluj [docsify-cli](https://docsify.js.org/#/quickstart)
4. W katalogu głównym repozytorium uruchom `docsify serve -o`
