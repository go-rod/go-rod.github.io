# Page Resources

You can use the `Page.GetResource` method to get files from here:

![page-resources](page-resources.png)

Such as get an image:

```go
bin, _ := page.GetResource("https://test.com/a.png")
fmt.Println(bin)
```

## Element resource

You can also use the `Element.Resource` method to get the file of the `src` attribute. Such as for element `<img src="a.jpg">`, you can use code like this to get the `a.jpg`:

```go
bin := page.MustElement("img").MustResource()
fmt.Println(bin)
```
