# Browsere & sider

Det er intuitivt at bruge Rod til at styre flere browsere eller sider på samme tid.

## Flere browsere

For at starte flere browsere:

```go
browser1 := rod.New().MustConnect()
browser2 := rod.New().MustConnect()
```

Alle API'er er trådsikre, samme værker for flere Go rutiner.

Du kan også bruge inkognito-tilstand til at starte flere browsere:

```go
browser1 := rod.New().MustConnect()
browser2 := browser1.MustIncognito()
```

Start browsere med forskellige start argumenter:

```go
browser1 := rod.New().ControlURL(
    launcher.New().Headless(false).MustLaunch()
).MustConnect()

browser1 := rod.New().ControlURL(
    launcher.New().UserDataDir("path").MustLaunch()
).MustConnect()
```

## Flere sider

For at styre flere sider for en browser:

```go
browser := rod.New().MustConnect()
page1 := browser.MustPage("http://a.com")
page2 := browser.MustPage("http://b.com")
```

## Side pool

Vi kan bruge PagePool til at hjælpe sideløbende styre og genbruge sider.

Tjek dette [eksempel](https://github.com/go-rod/rod/blob/46baf3aad803ed5cd8671aa325cbae4e297a89a4/examples_test.go#L533)

## Browser pool

Testene i Rod er et godt eksempel på at styre en pulje af browsere til at køre tests samtidigt. Derfor kan testene afsluttes på få sekunder. Tjek koden [her](https://github.com/go-rod/rod/blob/46baf3aad803ed5cd8671aa325cbae4e297a89a4/setup_test.go#L59).
