# Kontext und Timeout

In Golang verwenden wir normalerweise [Context](https://golang.org/pkg/context/) um langfristige Aufgaben abzubrechen. Rod verwendet den Kontext, um Abbrechungen für IO-Blockierungen zu bewältigen, meistens ist es Timeout. Sie müssen ihnen besondere Aufmerksamkeit schenken.

Wenn Sie mit Context nicht vertraut sind, lesen Sie bitte [Kontext verstehen](understand-context.md) zuerst.

## Stornierung

Zum Beispiel erstellt der folgende Code eine leere Seite und navigiert ihn zu "github.com":

```go
page := rod.New().MustConnect().MustPage()
page.MustNavigate("http://github.com")
```

Angenommen, wir wollen `MustNavigate` abbrechen, wenn es mehr als 2 Sekunden dauert. In Rod können wir so etwas tun:

```go
Seite := rod.New().MustConnect().MustPage()

ctx, cancel := context.WithCancel(context.Background())
pageWithCancel := page.Context(ctx)

go func() {
    time. leep(2 * time.Second)
    cancel()
}()

pageWithCancel.MustNavigate("http://github.com") // wird nach 2 Sekunden abgebrochen
```

Wir verwenden die `-Seite.Context` um einen seichten Klon der `Seite` zu erstellen. Whenever we call the `cancel`, the operations triggered by the `pageWithCancel` will be canceled, it can be any operation, not just `MustNavigate`. Die Ursprung `-Seite` wird nicht beeinflusst, wenn wir sie für Operationen verwenden, werden sie nicht storniert.

Dieser Stil ist nicht besonders für Rod, Sie finden ähnliche APIs wie [Request.WithContext](https://golang.org/pkg/net/http/#Request.WithContext) in der Standardbibliothek.

Weil `pageWithCancel` und `Seite` voneinander unabhängig sind von `Seite` ausgelöste Operationen werden nicht von der Stornierung beeinflusst:

```go
page.MustNavigate("http://github.com") // wird nach 2 Sekunden nicht abgebrochen
```

## Timeout

Der obige Code ist nur eine Möglichkeit, eine Operation zu Timeout zu bearbeiten. In Golang ist Timeout in der Regel nur ein spezieller Fall von Stornierung. Weil es so nützlich ist, haben wir einen Helfer erstellt, um das Gleiche oben zu tun, es heißt `Timeout`, so dass der obige Code wie unten reduziert werden kann:

```go
Seite := rod.Neu().MustConnect().MustPage()
page.Timeout(2 * time.Second).MustNavigate("http://github.com")
```

Die `page.Timeout(2 * time.second)` ist die vorherige `pageWithCancel`. Nicht nur `Seite`, `Browser` und `Element` haben auch die gleichen Kontexthelfer.

## Timeout erkennen

Woher weiß ich, ob eine Operation zeitüberschreitend ist oder nicht? In Golang ist Timeout normalerweise eine Art von Fehler. Es ist nicht besonders für Rod. Für den obigen Code können wir dies tun, um Zeitüberschreitung zu erkennen:

```go
Seite := rod.New().MustConnect().MustPage()

err := rod.Try(func() {
    page.Timeout(2 * time.Second).MustNavigate("http://github.com")
})
wenn Fehler. s(Fehler, Kontext. eadlineExceeded) {
    // Code für Timeout-Fehler
} else if err ! nil {
    // Code für andere Fehlerarten
}
```

Hier verwenden wir `rot.` , um die Funktion zu verpacken, die einen Timeout-Fehler verursachen kann.

Wir sprechen mehr über die Fehlerbehebung unter [Error Handling](error-handling.md).
