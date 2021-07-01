# Pagina bronnen

Je kunt de methode `Page.GetResource` gebruiken om bestanden van hier op te halen:

![pagina-bronnen](page-resources.png)

Zo krijg je een afbeelding:

```go
bin, err := page.GetResource("https://test.com/a.png")
```

## Element bron

Je kunt ook de methode `Element.Resource` gebruiken om het bestand van het `src` attribuut te krijgen. Zoals voor element `<img src="a.jpg">`, kunt u code zoals dit gebruiken om de `a.jpg` te krijgen:

```go
bin := page.MustElement("img").MustResource()
```
