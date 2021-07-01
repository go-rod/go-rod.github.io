# Resurse pagină

Poți folosi metoda `Page.GetResource` pentru a obține fișiere de aici:

![resurse de pagini](page-resources.png)

Cum să obțineți o imagine:

```go
bin, err := page.GetResource("https://test.com/a.png")
```

## Resursă de element

Poți folosi, de asemenea, metoda `Element.Resource` pentru a obține fișierul atributului `src`. Asemenea cu elementul `<img src="a.jpg">`, poți folosi un cod ca acesta pentru a obține `a.jpg`:

```go
bin := page.MustElement("img").MustResource()
```
