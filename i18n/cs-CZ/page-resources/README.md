# Zdroje stránky

Můžete použít metodu `Page.GetResource` k získání souborů zde:

![Zdroje na stránkování](page-resources.png)

Například, jak získat obrázek:

```go
bin, err := page.GetResource("https://test.com/a.png")
```

## Zdroj prvku

Můžete také použít metodu `Element.Resource` pro získání souboru atributu `src`. Jako u prvku `<img src="a.jpg">`můžete použít kód jako tento k získání `a.jpg`:

```go
bin := page.MustElement("img").MustResource()
```
