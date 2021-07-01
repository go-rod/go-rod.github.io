# Runtime Javascript

Possiamo usare Rod per valutare il codice javascript casuale sulla pagina. Come usarlo per leggere o modificare il contenuto HTML della pagina.

## Evale sulla pagina

Per esempio usa `Page.Eval` per impostare il valore globale:

```go
page.MustEval(`window.a = {name: 'jack'}`)
```

Possiamo usare una funzione js per passare il valore come argomenti json:

```go
key := "a"
data := map[string]string{"name": "jack"}
page.MustEval(`(k, val) => {
    window[k] = val
}`, key, data)
```

Per ottenere il valore restituito da Eval:

```go
val := page.MustEval(`a`).Get("name").Str()
fmt.Println(val) // output: jack
```

## Definisci una funzione globale

Il metodo `Page.Evaluate` esegue la funzione se la sua più esterna è una definizione di funzione.

Ad esempio, la funzione `test` qui sotto verrà eseguita immediatamente, non sarà trattata come una definizione di funzione:

```go
page.MustEval(`function test() { alert('ok') }`)

page.MustEval(`test()`) // panic with test not defined
```

Per definire la funzione globale `test` puoi codificare così, perché l'esterno è un'assegnazione, non una definizione di funzione:

```go
page.MustEval(`test = function () { alert('ok') }`)

page.MustEval(`test()`)
```

## Evale su un elemento

`Element.Eval` è simile con `Page.Eval`, ma con `questo` oggetto impostato sull'elemento corrente. Ad esempio, abbiamo un `<button>Invia</button>` sulla pagina, possiamo leggere o modificare l'elemento con JS:

```go
el := page.MustElement("button")
el.MustEval(`this.innerText = "Apply"`) // Modifica il contenuto
txt := el.MustEval(`this.innerText`).Str()
fmt.Println(txt) // output: Applica
```

## Esporre le funzioni Go alla pagina

Possiamo usare `Page.Expose` per esporre le funzioni di callback alla pagina. Ad esempio, qui esponiamo una funzione per aiutare la pagina a calcolare l'hash md5:

```go
page.MustExpose("md5", func(g gson.JSON) (interface{}, error) {
    return md5.Sum([]byte(g.Str())), nil
})
```

Ora la pagina può invocare questo metodo sull'oggetto finestra:

```go
hash := page.MustEval(`window.md5("test")`).Str()
```
