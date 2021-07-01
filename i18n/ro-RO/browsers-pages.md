# Browsere & Pagini

Este intuitiv să folosești Rod pentru a controla mai multe browsere sau pagini în același timp.

## Mai multe browsere

Pentru a lansa mai multe browsere:

```go
browser1 := rod.New().MustConnect()
browser2 := rod.New().MustConnect()
```

Toate API-urile sunt nesigure, la fel și pentru mai multe rutine.

De asemenea, puteți utiliza modul incognito pentru a lansa mai multe browsere:

```go
browser1 := rod.New().MustConnect()
browser2 := browser1.MustIncognito()
```

Lansează browsere cu diferite argumente de lansare:

```go
browser1 := rod.New().ControlURL(
    launcher.New().Headless(false).MustLaunch()
).MustConnect()

browser: = rod.New().ControlURL(
    launcher.New().New().UserDataDir("path").MustLaunch()
).MustConnect()
```

## Mai multe pagini

Pentru a controla mai multe pagini pentru un browser:

```go
browser := rod.New().MustConnect()
page1 := browser.MustPage("http://a.com")
page2 := browser.MustPage("http://b.com")
```

## Rezerva paginilor

Putem folosi PagePool pentru a ajuta simultan la controlul și reutilizarea paginilor.

Vezi acest exemplu [](https://github.com/go-rod/rod/blob/46baf3aad803ed5cd8671aa325cbae4e297a89a4/examples_test.go#L533)

## Browser de conexiune

Testele din Rod sunt un bun exemplu de gestionare a unei rezerve de browsere pentru a rula simultan teste. De aceea testele se pot termina în secunde. Verifică codul [aici](https://github.com/go-rod/rod/blob/46baf3aad803ed5cd8671aa325cbae4e297a89a4/setup_test.go#L59).
