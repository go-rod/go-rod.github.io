# Χρόνος Εκτέλεσης JavaScript

Μπορούμε να χρησιμοποιήσουμε το Rod για να αξιολογήσουμε τυχαίο κώδικα javascript στη σελίδα. Όπως το χρησιμοποιήσετε για να διαβάσετε ή να τροποποιήσετε το περιεχόμενο HTML της σελίδας.

## Ο Eval στη σελίδα

Για παράδειγμα, χρησιμοποιήστε το `Page.Eval` για να ορίσετε καθολική αξία:

```go
page.MustEval(`() => window.a = {name: 'jack'}`)
```

Μπορούμε να χρησιμοποιήσουμε μια λειτουργία js για να περάσουμε την αξία ως json επιχειρήματα:

```go
κλειδί := "a"
δεδομένα := χάρτης[string]συμβολοσειρά{"όνομα": "jack"}
σελίδα.MustEval(`(k, val) => ↑
    παράθυρο[k] = val
}`, key, data)
```

Για να λάβετε την επιστρεφόμενη τιμή από το Eval:

```go
val := page.MustEval(`() => a`).Get("name").Str()
fmt.Println(val) // output: jack
```

## Eval on an element

`Element.Eval` is similar with `Page.Eval`, but with the `this` object set to the current element. For example, we have a `<button>Submit</button>` on the page, we can read or modify the element with JS:

```go
el := page.MustElement("button")
el.MustEval(`() => this.innerText = "Apply"`) // Modify the content
txt := el.MustEval(`() => this.innerText`).Str()
fmt.Println(txt) // output: Apply
```

## Expose Go functions to the page

We can use `Page.Expose` to expose callback functions to the page. For example, here we expose a function to help the page to calculate md5 hash:

```go
page.MustExpose("md5", func(g gson.JSON) (interface{}, error) {
    return md5.Sum([]byte(g.Str())), nil
})
```

Now the page can invoke this method on the window object:

```go
hash := page.MustEval(`() => window.md5("test")`).Str()
```
