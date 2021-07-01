# Sivun Resurssit

Voit käyttää `Page.GetResource` -menetelmää saadaksesi tiedostoja täältä:

![sivu-resurssit](page-resources.png)

Kuten saat kuvan:

```go
bin, err := page.GetResource("https://test.com/a.png")
```

## Elementin resurssi

Voit myös käyttää `Element.Resource` -menetelmää saadaksesi `src` -attribuutin tiedoston. Kuten elementille `<img src="a.jpg">`, voit käyttää tällaista koodia saadaksesi `a.jpg`:

```go
bin := sivu.MustElement("img").MustResource()
```
