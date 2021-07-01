# Nettlesere & sider

Det er intuitivt å bruke Rod til å styre flere nettlesere eller sider samtidig.

## Flere nettlesere

For å starte flere nettlesere:

```go
Nettleser1 := rod.New().MustConnect()
browser2 := rod.New().MustConnect()
```

Alle APIer er tråd-sikker, samme fungerer for flere Go routines.

Du kan også bruke inkognitomodus for å starte flere nettlesere:

```go
Nettleser1 := rod.New().MustConnect()
browser2 := browser1.MustIncognito()
```

Start nettlesere med forskjellige startargumenter:

```go
Nettleser1 := rod.New().ControlURL(
    launcher.New().Headless(false).MustLaunch()
).MustConnect()

browser1 := rod.New().ControlURL(
    launcher.New().UserDataDir("path").MustLaunch()
).MustConnect()
```

## Flere sider

For å kontrollere flere sider til en nettleser:

```go
nettleser := rod.New().MustConnect()
page1 := browser.MustPage("http://a.com")
page2 := browser.MustPage("http://b.com")
```

## Sidens samling

Vi kan bruke PagePool for å hjelpe koncurrently kontroll og gjenbruk sider.

Sjekk dette [eksempelet](https://github.com/go-rod/rod/blob/46baf3aad803ed5cd8671aa325cbae4e297a89a4/examples_test.go#L533)

## Brøtt basseng

Testene i Rod er et godt eksempel på å administrere et basseng med nettlesere for å gjennomføre tester samtidig. Derfor kan testene fullføres i løpet av sekunder. Kontroller koden [her](https://github.com/go-rod/rod/blob/46baf3aad803ed5cd8671aa325cbae4e297a89a4/setup_test.go#L59).
