# Side ressurser

Du kan bruke `Page.GetResource` metoden for å få filer her:

![ressurser på siden](page-resources.png)

Slik får du et bilde:

```go
bin, err := page.GetResource("https://test.com/a.png")
```

## Ressurs for element

Du kan også bruke `Element.Resource` metoden for å få filen av `src` attributtet. Såsom for element `<img src="a.jpg">`, kan du bruke kode som denne for å få `a.jpg`:

```go
bin := page.MustElement("img").MustResource()
```
