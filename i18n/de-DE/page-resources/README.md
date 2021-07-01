# Seiten Ressourcen

Sie können die `Page.GetResource` Methode verwenden, um Dateien von hier abzurufen:

![seiten-Ressourcen](page-resources.png)

So wie Sie ein Bild erhalten:

```go
bin, err := page.GetResource("https://test.com/a.png")
```

## Elementressource

Sie können auch die `Element.Resource` Methode verwenden, um die Datei des `src` Attributs zu erhalten. So für Element `<img src="a.jpg">`, können Sie diesen Code verwenden, um die `a.jpg` zu bekommen:

```go
bin := page.MustElement("img").MustResource()
```
