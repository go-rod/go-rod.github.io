# Recursos de página

Puedes usar el método `Page.GetResource` para obtener archivos desde aquí:

![recursos de página](page-resources.png)

Tal como obtener una imagen:

```go
bin, err := page.GetResource("https://test.com/a.png")
```

## Recurso del elemento

También puede utilizar el método `Element.Resource` para obtener el archivo del atributo `src`. Tal como para el elemento `<img src="a.jpg">`, puede usar código como este para obtener el `a.jpg`:

```go
bin := page.MustElement("img").MustResource()
```
