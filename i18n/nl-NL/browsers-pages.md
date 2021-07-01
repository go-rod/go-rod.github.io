# Browsers & pagina's

Het is intuïtief om Rod te gebruiken om meerdere browsers of pagina's tegelijkertijd te besturen.

## Meerdere browsers

Om meerdere browsers te starten:

```go
browser1 := rod.New().MustConnect()
browser2 := rod.New().MustConnect()
```

Alle API's zijn thread-safe, hetzelfde werkt voor meerdere Go routines.

Je kunt ook de incognito-modus gebruiken om meerdere browsers te starten:

```go
browser1 := rod.New().MustConnect()
browser2 := browser1.MustIncognito()
```

Start browsers met verschillende lanceringargumenten:

```go
browser1 := rod.New().ControlURL(
    launcher.New().Headless(false).MustLaunch()
).MustConnect()

browser1 := rod.New().ControlURL(
    launcher.New().UserDataDir("path").MustLaunch()
).MustConnect()
```

## Meerdere pagina's

Om meerdere pagina's voor een browser te bedienen:

```go
browser := rod.New().MustConnect()
page1 := browser.MustPage("http://a.com")
page2 := browser.MustPage("http://b.com")
```

## Pagina pool

We kunnen PagePool gebruiken om tegelijkertijd controle en hergebruik van pagina's te ondersteunen.

Controleer dit [voorbeeld](https://github.com/go-rod/rod/blob/46baf3aad803ed5cd8671aa325cbae4e297a89a4/examples_test.go#L533)

## Browser Pool

De tests in Rod zijn een goed voorbeeld van het beheer van een zwembad met browsers om tegelijkertijd tests uit te voeren. Daarom kunnen de tests in enkele seconden worden afgerond. Controleer de code [hier](https://github.com/go-rod/rod/blob/46baf3aad803ed5cd8671aa325cbae4e297a89a4/setup_test.go#L59).
