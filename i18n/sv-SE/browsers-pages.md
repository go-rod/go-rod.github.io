# Webbläsare & sidor

Det är intuitivt att använda Rod för att styra flera webbläsare eller sidor samtidigt.

## Flera webbläsare

Starta flera webbläsare:

```go
browser1 := rod.New().MustConnect()
browser2 := rod.New().MustConnect()
```

Alla API:er är trådsäkra, samma fungerar för flera Go rutiner.

Du kan också använda inkognitoläge för att starta flera webbläsare:

```go
browser1 := rod.New().MustConnect()
browser2 := browser1.MustIncognito()
```

Starta webbläsare med olika startargument:

```go
browser1 := rod.New().ControlURL(
    launcher.New().Headless(false).MustLaunch()
).MustConnect()

browser1 := rod.New().ControlURL(
    launcher.New().UserDataDir("path").MustLaunch()
).MustConnect()
```

## Flera sidor

För att styra flera sidor för en webbläsare:

```go
webbläsare := rod.New().MustConnect()
page1 := browser.MustPage("http://a.com")
page2 := browser.MustPage("http://b.com")
```

## Sidfrågebank

Vi kan använda PagePool för att samtidigt kontrollera och återanvända sidor.

Kontrollera exemplet [](https://github.com/go-rod/rod/blob/46baf3aad803ed5cd8671aa325cbae4e297a89a4/examples_test.go#L533)

## Webbläsare frågebank

Testerna i Rod är ett bra exempel på att hantera en pool av webbläsare för att köra tester samtidigt. Det är därför testerna kan avslutas på några sekunder. Kontrollera koden [här](https://github.com/go-rod/rod/blob/46baf3aad803ed5cd8671aa325cbae4e297a89a4/setup_test.go#L59).
