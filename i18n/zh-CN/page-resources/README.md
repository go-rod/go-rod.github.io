# 页面资源

可以使用 `Page.GetResource` 来从这里获取文件：

![page-resources](page-resources.png)

比如说获取图片：

```go
bin, _ := page.GetResource("https://test.com/a.png")
fmt.Println(bin)
```

## 元素资源

也可以使用 `Element.Resource` 方法来获取 `src` 属性中的文件。 比如说对于元素 `<img src="a.jpg">`，可以使用如下代码获取 `a.jpg`：

```go
bin := page.MustElement("img").MustResource()
fmt.Println(bin)
```
