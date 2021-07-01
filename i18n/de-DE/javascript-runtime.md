# Javascript Laufzeit

Wir können Rod verwenden, um zufälligen Javascript-Code auf der Seite auszuwerten. So wie es zum Lesen oder Ändern des HTML-Inhalts der Seite.

## Eval auf der Seite

Verwende zum Beispiel `Seite.Eval` um globalen Wert zu setzen:

```go
page.MustEval(`window.a = {name: 'jack'}`)
```

Wir können eine js-Funktion verwenden, um den Wert als json-Argumente zu übergeben:

```go
key := "a"
data := map[string]string{"name": "jack"}
page.MustEval(`(k, val) => {
    window[k] = val
}`, key, data)
```

Um den Rückgabewert von Eval zu erhalten:

```go
val := page.MustEval(`a`).Get("name").Str()
fmt.Println(val) // Ausgabe: jack
```

## Globale Funktion definieren

Die `Page.Evaluate` Methode wird die Funktion ausführen, wenn es sich um eine Funktionsdefinition handelt.

Zum Beispiel wird die `Test` Funktion unten sofort ausgeführt, sie wird nicht als Funktionsdefinition behandelt:

```go
page.MustEval(`function test() { alert('ok') }`)

page.MustEval(`test()`) // Panic mit nicht definiertem Test
```

Um die globale Funktion `Test` zu definieren, können Sie auf diese Weise kodieren, da die äußerste Randlage eine Aufgabe ist und keine Funktionsdefinition:

```go
page.MustEval(`test = function () { alert('ok') }`)

page.MustEval(`test()`)
```

## Auswertung eines Elements

`Element.Eval` ist ähnlich mit `Seite.Eval`, aber mit dem `dieses` Objekt auf das aktuelle Element gesetzt. Zum Beispiel haben wir ein `<button>Senden</button>` auf der Seite, wir können das Element mit JS lesen oder ändern:

```go
el := page.MustElement("button")
el.MustEval(`this.innerText = "Anwenden"`) // Inhalt ändern
txt := el.MustEval(`this.innerText`).Str()
fmt.Println(txt) // Ausgabe: Anwenden
```

## Geh-Funktionen der Seite anzeigen

Wir können `Page.Expose` verwenden, um Callback-Funktionen der Seite auszublenden. Zum Beispiel setzen wir hier eine Funktion aus, die der Seite hilft, um den md5-Hash zu berechnen:

```go
page.MustExpose("md5", func(g gson.JSON) (Interface{}, error) {
    return md5.Sum([]byte(g.Str()))), nil
})
```

Nun kann die Seite diese Methode im Fensterobjekt aufrufen:

```go
hash := page.MustEval(`window.md5("test")`).Str()
```
