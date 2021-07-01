# Browser & Pagine

È intuitivo usare Rod per controllare contemporaneamente più browser o pagine.

## Browser multipli

Per avviare più browser:

```go
browser1 := rod.New().MustConnect()
browser2 := rod.New().MustConnect()
```

Tutte le API sono senza fili, lo stesso funziona per le routine Go multiple.

È inoltre possibile utilizzare la modalità in incognito per avviare più browser:

```go
browser1 := rod.New().MustConnect()
browser2 := browser1.MustIncognito()
```

Avvia browser con diversi argomenti di lancio:

```go
browser1 := rod.New().ControlURL(
    launcher.New().Headless(false).MustLaunch()
).MustConnect()

browser1 := rod.New().ControlURL(
    launcher.New().UserDataDir("path").MustLaunch()
).MustConnect()
```

## Pagine multiple

Per controllare più pagine per un browser:

```go
browser := rod.New().MustConnect()
page1 := browser.MustPage("http://a.com")
page2 := browser.MustPage("http://b.com")
```

## Page pool

Possiamo usare PagePool per aiutare a controllare e riutilizzare le pagine contemporaneamente.

Controlla questo [esempio](https://github.com/go-rod/rod/blob/46baf3aad803ed5cd8671aa325cbae4e297a89a4/examples_test.go#L533)

## Browser pool

I test in Rod è un buon esempio di gestione di un pool di browser per eseguire test contemporaneamente. Ecco perché i test possono finire in pochi secondi. Controlla il codice [qui](https://github.com/go-rod/rod/blob/46baf3aad803ed5cd8671aa325cbae4e297a89a4/setup_test.go#L59).
