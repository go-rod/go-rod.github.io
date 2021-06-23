# Χειρισμός Σφάλματος

Στα προηγούμενα κεφάλαια, έχουμε δει πολλές `Πρέπει` προκαθορισμένες μεθόδους όπως `MustNavigate`, `MustElement`, κλπ. Όλοι έχουν μη προκαθορισμένες εκδόσεις όπως `Πλοηγηθείτε`, `Στοιχείο`, κλπ. Η κύρια διαφορά μεταξύ τους είναι το πώς χειρίζονται σφάλματα. Δεν είναι ιδιαίτερο για τον Ράβδο, μπορείτε να το βρείτε στην τυπική βιβλιοθήκη όπως [regex.MustCompile](https://golang.org/pkg/regexp/#MustCompile).

Οι μέθοδοι όπως το `MustNavigate` και το `MustElement` χρησιμοποιούνται συνήθως σε κώδικα παράδειγμα ή γρήγορο scripting. Είναι χρήσιμες για εργασίες όπως δοκιμές καπνού, παρακολούθηση τοποθεσίας, δοκιμή από άκρο σε άκρο, κ.λπ. Εργασίες με πολλές αβεβαιότητες, όπως web scraping, η μη προκαθορισμένη έκδοση θα είναι μια καλύτερη επιλογή.

Η προκαθορισμένη έκδοση είναι μόνο η μη προκαθορισμένη έκδοση τυλιγμένη με έναν έλεγχο σφαλμάτων. Εδώ είναι ο πηγαίος κώδικας του `MustElement`, όπως μπορείτε να το δείτε απλά καλεί το `Στοιχείο` με πολλές επιπλέον γραμμές για να πανικοβληθεί, αν err δεν είναι `nil`:

```go
func (p *Page) MustElement(selectors ...string) *Element mptom
    el, err := p.Element(selectors...)
    εάν err != nil {
        panic(err)
    }
    επιστρέφει el
}
```

## Λάβετε την τιμή σφάλματος

Τα δύο μπλοκ κώδικα παρακάτω κάνουν σχεδόν το ίδιο πράγμα σε δύο στυλ.

Το παρακάτω στυλ είναι ο τυπικός τρόπος χειρισμού σφαλμάτων του Go:

```go
page := rod.New().MustConnect().MustPage("https://example.com")

el, err := σελίδα. lement("a")
εάν err ! nil mptom
    handleError(err)
    return
}
html, err := el. TML()
εάν err != nil {
    handleError(err)
    επιστρέψτε
}
fmt.Println(html)
```

Μπορούμε να χρησιμοποιήσουμε το `rod.Try` για να πιάσουμε το σφάλμα από τις `Must` προκαθορισμένες μεθόδους `MustElement` και `MustHTML`. Το παρακάτω στυλ θα καταλήξει συνήθως σε λιγότερο κώδικα, αλλά μπορεί επίσης να πιάσει επιπλέον λάθη:

```go
page := rod.New().MustConnect().MustPage("https://example.com")

err := rod.Try(func() mptom
    fmt.Println(page.MustElement("a").MustHTML())
})
handleError(err)
```

## Ελέγξτε τον τύπο σφάλματος

Χρησιμοποιούμε τον τυπικό τρόπο του Go's για να ελέγξουμε τους τύπους σφαλμάτων, χωρίς μαγεία.

Το `handleError` στον παραπάνω κώδικα μπορεί να μοιάζει με:

```go
func handleError(err error) {
    var evalErr *rod.ErrEval
    if errors.Is(err, context. eadlineExceeded) {/ σφάλμα χρονικού ορίου
        fmt.Println ("σφάλμα χρονικού ορίου")
    } αλλιώς εάν υπάρχουν σφάλματα. s(err, &evalErr) {// eval error
        fmt.Println(evalErr. ineNumber)
    } αλλιώς αν err != nil {
        fmt. rintln ("αδυναμία διαχείρισης", err)
    }
}
```
