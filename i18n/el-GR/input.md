# Input

Ράβδος παρέχει πολλές μεθόδους για την προσομοίωση των ανθρώπινων εισροών, όπως το κλικ του ποντικιού ή το πάτημα του πληκτρολογίου.

## Κλικ ποντικιού

Για να προσομοιώσετε το ποντίκι κάντε κλικ σε ένα στοιχείο:

```go
// left click
page.MustElement("button").MustClick()

// right click
page.MustElement("button").Click(proto.InputMouseButtonRight)
```

## Text input

Για προσομοίωση της εισόδου:

```go
el := page.MustElement(`[type="text"]`)
el.MustInput("Jack")

fmt.Println(el.MustText()) // χρησιμοποιήστε MustText για να λάβετε το κείμενο
```

## Αφαίρεση κειμένου από μια εισαγωγή

Απλά προσομοιώστε πώς ένα ανθρώπινο το κάνει, επιλέξτε όλο το κείμενο και αντικαταστήστε το με ένα κενό string:

```go
page.MustElement(`[type="text"]`).MustSelectAllText().MustInput("")
```

Μπορείτε να χρησιμοποιήσετε το `SelectText` για να αντικαταστήσετε ένα τμήμα του κειμένου.

## Είσοδος χρόνου

Οι υποστηριζόμενοι τύποι εισόδου είναι η [ημερομηνία](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date), [datetime-local](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local), [μήνας](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/month), και [time](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time).

```go
page.MustElement(`[type="date"]`).MustInputTime(time.Now())
```

## Πλαίσιο

Απλά κάντε κλικ σαν άνθρωπος:

```go
el := page.MustElement(`[type="checkbox"]`)

// ελέγξτε το αν δεν είναι επιλεγμένο
if !el.MustProperty("checked").Bool() {
    el.MustClick()
}
```

## Επιλογή επιλογών

Επιλέξτε επιλογές σε [`<select>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select).

Ο παρακάτω κώδικας θα επιλέξει επιλογές που περιέχουν το κείμενο "B" ή "C":

```go
page.MustElement("select").MustSelect("B", "C")
```

Μπορείτε επίσης να χρησιμοποιήσετε regex ή css επιλογέα για να επιλέξετε επιλογές:

```go
page.MustElement("select").Select([]string{`^B$`}, true, rod.SelectorTypeRegex)

// ορίστε ψευδές για να αποεπιλέξετε
page.MustElement("select").Select([]string{`[value="c"]`}, false, rod.SelectorTypeCSSSector)
```

## Ορισμός αρχείων

Χρησιμοποιήστε `SetFiles` για να ορίσετε αρχεία για την είσοδο του αρχείου [](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file):

```go
pag.MustElement(`[type=file]`).MustSetFiles("a.jpg", "b.pdf")
```

## Ποντικί, πληκτρολόγιο και αφή

Μπορείς επίσης να χρησιμοποιήσεις τη σελίδα `page.Mouse`, `page.Keyboard`, or `page.Touch` για να προσομοιώσεις χαμηλού επιπέδου εισροές. Όπως μπορείτε να αναζητήσετε το τεστ της μονάδας για να σύρετε για να μάθετε πώς να προσομοιώσετε σύρετε.
