# Selaimet & sivut

On intuitiivista käyttää sauvaa ohjaamaan useita selaimia tai sivuja samaan aikaan.

## Useita selaimia

Avataksesi useita selaimia:

```go
browser1 := rod.New().MustConnect()
browser2 := rod.New().MustConnect()
```

Kaikki sovellusrajapinnat ovat lankaturvallisia, samat työt useille Go-rutiineille.

Voit myös käyttää incognito-tilaa käynnistääksesi useita selaimia:

```go
browser1 := rod.New().MustConnect()
selain2 := selain1.MustIncognito()
```

Käynnistä selaimet, joilla on erilaiset käynnistysparametrit:

```go
browser1 := rod.New().ControlURL(
    launcher.New().Headless(false).MustLaunch()
).MustConnect()

browser1 := rod.New().ControlURL(
    launcher.New().UserDataDir("path").MustLaunch()
).MustConnect()
```

## Useita sivuja

Voit hallita useita sivuja selaimella:

```go
selain := rod.New().MustConnect()
sivu1 := browser.MustPage("http://a.com")
sivu2 := browser.MustPage("http://b.com")
```

## Sivun pooli

Voimme käyttää PagePoelia, joka auttaa samanaikaisesti valvomaan ja uudelleenkäyttämään sivuja.

Tarkista tämä [esimerkki](https://github.com/go-rod/rod/blob/46baf3aad803ed5cd8671aa325cbae4e297a89a4/examples_test.go#L533)

## Selain uima-allas

Testit turska on hyvä esimerkki hallita joukko selaimia suorittaa testejä samanaikaisesti. Siksi testit voivat päättyä sekunneissa. Tarkista koodi [tästä](https://github.com/go-rod/rod/blob/46baf3aad803ed5cd8671aa325cbae4e297a89a4/setup_test.go#L59).
