# Browser & Seiten

Es ist intuitiv mit Rod mehrere Browser oder Seiten gleichzeitig zu steuern.

## Mehrere Browser

Um mehrere Browser zu starten:

```go
browser1 := rod.New().MustConnect()
browser2 := rod.New().MustConnect()
```

Alle APIs sind Thread-sicher, dasselbe funktioniert für mehrere Go-Routinen.

Sie können auch den Inkognito-Modus verwenden, um mehrere Browser zu starten:

```go
browser1 := rod.New().MustConnect()
browser2 := browser1.MustIncognito()
```

Browser mit verschiedenen Startargumenten starten:

```go
browser1 := rod.New().ControlURL(
    launcher.New().Headless(false).MustLaunch()
).MustConnect()

browser1 := rod.New().ControlURL(
    launcher.New().UserDataDir("path").MustLaunch()
).MustConnect() 
 ).MustConnect()
```

## Mehrere Seiten

Um mehrere Seiten für einen Browser zu steuern:

```go
browser := rod.New().MustConnect()
page1 := browser.MustPage("http://a.com")
page2 := browser.MustPage("http://b.com")
```

## Seitenpool

Wir können PagePool verwenden, um die gleichzeitige Kontrolle und Wiederverwendung von Seiten zu erleichtern.

Prüfe dieses [-Beispiel](https://github.com/go-rod/rod/blob/46baf3aad803ed5cd8671aa325cbae4e297a89a4/examples_test.go#L533)

## Browserpool

Die Tests in Rod sind ein gutes Beispiel für die Verwaltung eines Browserpools zur gleichzeitigen Durchführung von Tests. Deshalb können die Tests in Sekunden beendet werden. Überprüfen Sie den Code [hier](https://github.com/go-rod/rod/blob/46baf3aad803ed5cd8671aa325cbae4e297a89a4/setup_test.go#L59).
