# Zasoby strony

Możesz użyć metody `Page.GetResource` , aby pobrać pliki tutaj:

![zasoby strony](page-resources.png)

Takie jak uzyskanie obrazu:

```go
bin, err := page.GetResource("https://test.com/a.png")
```

## Zasób elementu

Możesz również użyć metody `Element.Resource` , aby uzyskać plik atrybutu `src`. Takie jak dla elementu `<img src="a.jpg">`możesz użyć takiego kodu aby uzyskać `a.jpg`:

```go
bin := page.MustElement("img").MustResource()
```
