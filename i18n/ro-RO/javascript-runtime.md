# Execuție Javascript

Putem folosi Rod pentru a evalua codul de javascript aleatoriu de pe pagină. Așa cum o folosiți pentru a citi sau modifica conținutul HTML al paginii.

## Eval pe pagină

Folosiți de exemplu `Page.Eval` pentru a seta valoarea globală:

```go
page.MustEval(`window.a = {name: 'jack'}`)
```

Putem folosi o functie js pentru a pasa valoarea ca argumente json:

```go
key := "a"
data := map[string]string{"name": "jack"}
page.MustEval(`(k, val) => {
    window[k] = val
}`, key, data)
```

Pentru a obține valoarea returnată de la Eval:

```go
val := page.MustEval(`a`).Get("name").Str()
fmt.Println(val) // output: jack
```

## Definește o funcție globală

Metoda `Page.Evaluează` va executa funcția în cazul în care ultraperiferica sa este o definiție a funcției.

De exemplu, funcția `test` de mai jos va fi executată imediat, nu va fi tratată ca o definiție a funcției:

```go
page.MustEval(`function test() { alert('ok') }`)

page.MustEval(`test()`) // panică cu test nedefinit
```

Pentru a defini testul funcției globale `` poți codifica așa, deoarece ultraperifericitatea este o atribuire, nu o definiție a funcției:

```go
page.MustEval(`test = function () { alert('ok') }`)

page.MustEval(`test()`)
```

## Eval pe un element

`Element.Eval` este similar cu `Page.Eval`, dar cu `acest obiect` setat pe elementul curent. De exemplu, avem un `<button>Trimiteți</button>` pe pagină, putem citi sau modifica elementul cu JS:

```go
el := page.MustElement("button")
el.MustEval(`this.innerText = "Apply"`) // Modifică conţinutul
txt := el.MustEval(`this.innerText`).Str()
fmt.Println(txt) // output: Aplică
```

## Expune funcţii de acces la pagină

Putem folosi `Page.Expune` pentru a expune funcțiile de apel invers la pagină. For example, here we expose a function to help the page to calculate md5 hash:

```go
page.MustExpose("md5", func(g gson.JSON) (interface{}, error) {
    return md5.Sum([]byte(g.Str())), nil
})
```

Acum, pagina poate invoca această metodă în obiectul fereastră:

```go
hash := page.MustEval(`window.md5("test")`).Str()
```
