# Risorse Della Pagina

È possibile utilizzare il metodo `Page.GetResource` per ottenere i file da qui:

![page-resources](page-resources.png)

Come ottenere un'immagine:

```go
bin, err := page.GetResource("https://test.com/a.png")
```

## Risorsa elemento

Puoi anche usare il metodo `Element.Resource` per ottenere il file dell'attributo `src`. Ad esempio per l'elemento `<img src="a.jpg">`, puoi usare codice come questo per ottenere il `a.jpg`:

```go
bin := page.MustElement("img").MustResource()
```
