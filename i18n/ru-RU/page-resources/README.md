# Ресурсы страницы

Вы можете использовать метод `Page.GetResource` для получения файлов:

![пейдж-ресурсы](page-resources.png)

Например, получить изображение:

```go
bin, err := page.GetResource("https://test.com/a.png")
```

## Ресурс элемента

Вы также можете использовать метод `Element.Resource` , чтобы получить файл атрибута `src`. Например, для элемента `<img src="a.jpg">`, вы можете использовать такой код, чтобы получить `a.jpg`:

```go
bin := page.MustElement("img").MustResource()
```
