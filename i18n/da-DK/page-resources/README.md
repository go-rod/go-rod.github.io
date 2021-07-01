# Side Ressourcer

Du kan bruge `Page.GetResource` metoden til at hente filer herfra:

![side-ressourcer](page-resources.png)

Sådan som at få et billede:

```go
bin, err := page.GetResource("https://test.com/a.png")
```

## Element ressource

Du kan også bruge `Element.Resource` -metoden til at få filen af `src` -attributten. Såsom for element `<img src="a.jpg">`, kan du bruge kode som denne for at få `a.jpg`:

```go
bin := page.MustElement("img").MustResource()
```
