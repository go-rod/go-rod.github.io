# Συμβάντα

Τα συμβάντα είναι ενέργειες ή εμφανίσεις που συμβαίνουν στο πρόγραμμα περιήγησης που ελέγχετε, για το οποίο σας λέει ο φυλλομετρητής ώστε να μπορείτε να ανταποκριθείτε σε αυτούς κατά κάποιο τρόπο εάν το επιθυμείτε. Όπως όταν αφήνουμε τη σελίδα να πλοηγηθεί σε ένα νέο URL, μπορούμε να εγγραφούμε στα συμβάντα που θα γνωρίζουμε όταν ολοκληρωθεί η πλοήγηση ή όταν γίνεται απόδοση της σελίδας.

## Αναμονή για ένα συμβάν μία φορά

Ας προσπαθήσουμε να πλοηγηθούμε σε μια σελίδα και να περιμένουμε μέχρι το δίκτυο της σελίδας να είναι σχεδόν αδρανής:

```go
func main() mptom
    page := rod.New().MustConnect().MustPage()

    περίμενε := page.MustWaitNavigation()
    page.MustNavigate("https://www.wikipedia.org/")
    wait()
}
```

Χρησιμοποιούμε το `MustWaitNavigation` για να εγγράφουμε το γεγονός σε αδράνεια δικτύου. The reason why the subscription is before the navigation not after is because the code to trigger navigation will take time to execute, during that time the event may have already happened. Μετά την `MustNavigate` καλούμε τη συνάρτηση `περίμενε` για να μπλοκάρει τον κώδικα μέχρι να συμβεί το επόμενο γεγονός σε αδράνεια δικτύου.

Η ράβδος παρέχει πολλούς άλλους βοηθούς γεγονότων, τα ονόματα συναρτήσεων είναι όλα προκαθορισμένα με `MustWait` ή `Περιμένετε`.

## Αποκτήστε τις λεπτομέρειες της εκδήλωσης

Μερικοί τύποι εκδηλώσεων μεταφέρουν λεπτομέρειες για το ίδιο το γεγονός. Όπως μεταβείτε σε μια διεύθυνση url και χρησιμοποιήστε το γεγονός για να λάβετε τον κωδικό κατάστασης απόκρισης του αιτήματος πλοήγησης:

```go
func main() {
    page := rod.New().MustConnect().MustPage()

    e := proto.NetworkResponseReceived{}
    περίμενε := page.WaitEvent(&e)
    page.MustNavigate("https://www.wikipedia.org/")
    wait()

    fmt.Println(e.Response.Status)
}
```

## Χειρισμός πολλαπλών συμβάντων

Αν θέλετε να χειριστείτε όλα τα γεγονότα ενός τύπου, όπως ακούστε για όλες τις εκδηλώσεις της εξόδου της κονσόλας της σελίδας, μπορούμε να κάνουμε κάτι σαν αυτό:

```go
go page.EachEvent(func(e *proto.RuntimeConsoleAPICalled) ņ
    fmt.Println(page.MustObjectsToJSON(e.Args))
})()
```

Για να εγγραφείτε ταυτόχρονα σε πολλαπλούς τύπους γεγονότων, όπως ο συνδρομητής `RuntimeConsoleAPICalled` και `PageLoadEventFired`:

```go
go page.EachEvent(func(e *proto.RuntimeConsoleAPICalled) ņ
    fmt.Println(page.MustObjectsToJSON(e.Args))
}, func(e *proto.PageLoadEventFired) mptom
    fmt.Println ("loaded")
})()
```

## Διακοπή της συνδρομής

Οποιαδήποτε λειτουργία σε ράβδο που μπλοκ μπορούν να ακυρωθούν με το [context](context-and-timeout.md), δεν είναι ειδική για γεγονότα. Εκτός αυτού, μπορείτε επίσης να σταματήσετε την εκδήλωση επιστρέφοντας true από τον χειριστή γεγονότων, για παράδειγμα:

```go
wait := page.EachEvent(func(e *proto.PageLoadEventFired) (stop bool) {
    return true
})
page.MustNavigate("https://example.com")
wait()
```

Αν δεν επιστρέψουμε αληθές, η αναμονή θα συνεχίσει να περιμένει τα `PageLoadEventFired` events και να μπλοκάρει το πρόγραμμα για πάντα. Αυτό είναι στην πραγματικότητα ο κώδικας για το πώς λειτουργεί η `σελίδα.Αναμονή γεγονότων`.

## Διαθέσιμα συμβάντα

Όλοι οι τύποι εκδηλώσεων υλοποιούν το `proto.Event` interface, μπορείτε να το χρησιμοποιήσετε για να βρείτε όλα τα γεγονότα. Συνήθως, το IDE θα φιλτράρει αυτόματα από τη διασύνδεση. Όπως θέλουμε να δούμε όλα τα γεγονότα στο πεδίο της Σελίδας, μπορούμε να δημιουργήσουμε ένα αντικείμενο κενής σελίδας και να χρησιμοποιήσουμε το `WaitEvent(proto. vent)` για να εμφανίσετε και να φιλτράρετε όλους τους τύπους εκδηλώσεων, όπως το στιγμιότυπο οθόνης παρακάτω:

![λίστα εκδηλώσεων](event-list.png)

Μπορείτε επίσης να χρησιμοποιήσετε αυτό το [site](https://chromedevtools.github.io/devtools-protocol/tot/Page) για να περιηγηθείτε στα γεγονότα.
