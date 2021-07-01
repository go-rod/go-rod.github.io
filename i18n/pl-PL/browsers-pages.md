# Przeglądarki & Strony

Jest intuicyjne, aby kontrolować wiele przeglądarek lub stron w tym samym czasie.

## Wiele przeglądarek

Aby uruchomić wiele przeglądarek:

```go
przeglądarka1 := rod.New().MustConnect()
przeglądarka2 := rod.New().MustConnect()
```

Wszystkie API są bezpieczne dla wątków, to samo działa dla wielu rutynów Idź.

Możesz również użyć trybu incognito do uruchomienia wielu przeglądarek:

```go
browser1 := rod.New().MustConnect()
browser2 := browser1.MustIncognito()
```

Uruchom przeglądarki z różnymi argumentami uruchomienia:

```go
przeglądarka1 := rod.New().ControlURL(
    launcher.New().Headless(false).MustLaunch()
).MustConnect()

browser1 := rod.New().ControlURL(
    launcher.New().UserDataDir("path").MustLaunch()
).MustConnect()
```

## Wiele stron

Aby kontrolować wiele stron dla przeglądarki:

```go
przeglądarka := rod.New().MustConnect()
strona1 := browser.MustPage("http://a.com")
strona2 := browser.MustPage("http://b.com")
```

## Pula stron

Możemy użyć PagePool, aby pomóc jednocześnie kontrolować i ponownie używać stron.

Sprawdź ten [przykład](https://github.com/go-rod/rod/blob/46baf3aad803ed5cd8671aa325cbae4e297a89a4/examples_test.go#L533)

## Pula przeglądarek

Testy w Rod są dobrym przykładem zarządzania pulą przeglądarek do jednoczesnego przeprowadzania testów. Dlatego testy mogą zakończyć się w kilka sekund. Sprawdź kod [tutaj](https://github.com/go-rod/rod/blob/46baf3aad803ed5cd8671aa325cbae4e297a89a4/setup_test.go#L59).
