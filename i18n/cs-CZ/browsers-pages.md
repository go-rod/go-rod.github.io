# Prohlížeče & stránky

Je intuitivní použít Rod k ovládání více prohlížečů nebo stránek najednou.

## Více prohlížečů

Chcete-li spustit více prohlížečů:

```go
browser1 := rod.New().MustConnect()
browser2 := rod.New().MustConnect()
```

Všechny API jsou bezpečné, shodné práce pro více rutin Go.

Můžete také použít anonymní režim pro spuštění více prohlížečů:

```go
prohlížeč1 := rod.New().MustConnect()
prohlížeč2 := prohlížeč1.MustIncognito()
```

Spustit prohlížeče s různými argumenty spuštění:

```go
browser1 := rod.New().ControlURL(
    launcher.New().Headless(false).MustLaunch()
).MustConnect()

browser1 := rod.New().ControlURL(
    launcher.New().UserDataDir("cesta").MustLaunch()
).MustConnect()
```

## Více stránek

Možnost ovládat více stránek prohlížeče:

```go
prohlížeč := rod.New().MustConnect()
page1 := browser.MustPage("http://a.com")
page2 := browser.MustPage("http://b.com")
```

## Stránka

PagePool můžeme použít k souběžné kontrole a opakovanému použití stránek.

Zaškrtněte tento [příklad](https://github.com/go-rod/rod/blob/46baf3aad803ed5cd8671aa325cbae4e297a89a4/examples_test.go#L533)

## Sloupec prohlížeče

Testy v modu jsou dobrým příkladem správy skupiny prohlížečů pro současné provádění testů. To je důvod, proč zkoušky mohou být ukončeny v sekundách. Zkontrolujte kód [zde](https://github.com/go-rod/rod/blob/46baf3aad803ed5cd8671aa325cbae4e297a89a4/setup_test.go#L59).
