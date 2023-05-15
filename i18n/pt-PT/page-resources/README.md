# Recursos da página

Você pode usar o método `Page. GetResource` para obter arquivos aqui:

![recursos](page-resources.png)

Como obter uma imagem:

```go
bin, _ := page. GetResource("https://test.com/a.png")
fmt. Println(bin)
```

## Recurso do elemento

Você também pode usar o método `Element. Resource` para obter o arquivo do atributo `src`. Tal como para o elemento `<img src="a.jpg">`, você pode usar código como esse para obter o `a.jpg`:

```go
bin := page. MustElement("img"). MustResource()
fmt. Println(bin)
```
