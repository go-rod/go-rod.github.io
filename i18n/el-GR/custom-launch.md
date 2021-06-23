# Εκκίνηση Προσαρμοσμένου Περιηγητή

## Συνδεθείτε σε ένα εκτελούμενο πρόγραμμα περιήγησης

Βρείτε την εκτελέσιμη διαδρομή του προγράμματος περιήγησής σας, όπως στο macOS run:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --remote-debugging-port=9222
```

Θα εξάγει κάτι έτσι:

```txt
Εργαλεία που ακούν ws://127.0.0.1:9222/devtools/browser/4dcf09f2-ba2b-463a-8ff5-90d27c6cc913
```

Η παραπάνω `ws://127.0.0.1:9222/devtools/browser/4dcf09f2-ba2b-463a-8ff5-90d27c6cc913` είναι η διεπαφή ελέγχου του προγράμματος περιήγησης:

```go
package main

import (
    "github.com/go-rod/rod"
)

func main() right:
    u := "ws://127.0.0.1:9222/devtools/browser/4dcf09f2-ba2b-463a-8ff5-90d27c6cc913"
    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

## Η lib του launcher

Επειδή η παραπάνω ροή εργασίας χρησιμοποιείται τόσο συχνά, αφηρημένα ένα `launcher` lib για να απλοποιηθεί η εκκίνηση των browsers. Όπως αυτόματα λήψη ή αναζήτηση για το εκτελέσιμο πρόγραμμα περιήγησης, προσθέστε ή διαγράψτε τα ορίσματα γραμμής εντολών του προγράμματος περιήγησης, κλπ.

Έτσι το παραπάνω εγχειρίδιο εκτόξευσης και κώδικα γίνεται:

```go
func main() {
    u := launcher.New().Bin("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome").MustLaunch()
    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

Μπορούμε να χρησιμοποιήσουμε τη βοηθητική συνάρτηση `launcher.LookPath` για να πάρουμε την εκτελέσιμη διαδρομή του προγράμματος περιήγησης, ο παραπάνω κώδικας είναι ο ίδιος:

```go
func main() {
    διαδρομή, _ := launcher.LookPath()
    u := launcher.New().Bin(path).MustLaunch()
    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

Αν το `ControlURL` δεν οριστεί, το `MustConnect` θα τρέξει `launcher.New().MustLaunch()` αυτόματα. Από προεπιλογή, ο εκκινητής θα κατεβάσει αυτόματα και θα χρησιμοποιήσει ένα στατικά εκδομένο πρόγραμμα περιήγησης, έτσι ώστε η συμπεριφορά του περιηγητή να είναι συνεπής. Έτσι, μπορείτε να απλοποιήσετε τον παραπάνω κώδικα σε:

```go
func main() {
    rod.New().MustConnect().MustPage("https://example.com")
}
```

## Προσθήκη ή αφαίρεση επιλογών

Μπορείτε να χρησιμοποιήσετε το `Set` και `Διαγραφή` για να τροποποιήσετε τις παραμέτρους εκκίνησης του περιηγητή (σημαίες):

```go
package main

import (
    "github.com/go-rod/rod"
    "github.com/go-rod/rod/lib/launcher"
)

func main() signs
    u := launcher.New().
        Σετ ("δεδομένα-χώρος-χρήστη", "διαδρομή").
        Σετ ("headless").
        Delete ("-- headless").
        MustLaunch()

    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

Όπως μπορείτε να δείτε από πάνω το πρόθεμα `--` είναι προαιρετικό, όπως το `headless` και το `-- headless` είναι το ίδιο.

Επειδή επιλογές όπως το `χρήστη-data-dir`, `proxy-server`, `άσκοπα` χρησιμοποιούνται τόσο συχνά, προσθέσαμε μερικούς βοηθούς για αυτούς, έτσι ώστε ο παραπάνω κώδικας να γίνει όπως αυτό:

```go
func main() mptom
    u := launcher.New().
        UserDataDir ("διαδρομή").
        Ακέρατος (αληθές).
        Ακέφαλος(ψευδές).
        MustLaunch()

    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

Εδώ είναι οι διαθέσιμες σημαίες: [σύνδεσμος](https://peter.sh/experiments/chromium-command-line-switches).

Διαβάστε το API doc για περισσότερες πληροφορίες: [link](https://pkg.go.dev/github.com/go-rod/rod/lib/launcher#Launcher).

## Απομακρυσμένη διαχείριση του εκκινητή

Για το σύστημα παραγωγής απόξεσης, συνήθως, θα διαχωρίσουμε τους ξύστες και τους περιηγητές σε διαφορετικές συστάδες, έτσι ώστε να μπορούν να κλιμακωθούν ξεχωριστά. Ο Rod παρέχει το πρόσθετο `launcher.Manager` για να διαχειριστεί το launcher εξ αποστάσεως. Με αυτό μπορούμε να ξεκινήσουμε εξ αποστάσεως ένα πρόγραμμα περιήγησης με προσαρμοσμένες σημαίες εκκίνησης. Το παράδειγμα χρήσης του είναι [εδώ](https://github.com/go-rod/rod/blob/master/lib/launcher/rod-manager/main.go).

Επειδή είναι πολύ δύσκολο να εγκαταστήσετε σωστά το χρώμιο σε ορισμένες διανομές linux, Ράβδος παρέχει μια εικόνα docker για να γίνει συνεπής διασταυρούμενη πλατφόρμες. Εδώ είναι ένα παράδειγμα για να το χρησιμοποιήσετε:

1. Εκτελέστε την εικόνα της ράβδου `docker run -p 7317:7317 ghcr.io/go-rod/rod`

2. Ανοίξτε ένα άλλο τερματικό και εκτελέστε κώδικα όπως αυτό το [παράδειγμα](https://github.com/go-rod/rod/blob/master/lib/examples/launch-managed/main.go)

Η εικόνα είναι [συντονισμένη](https://github.com/go-rod/rod/blob/master/lib/docker/Dockerfile) για στιγμιότυπα οθόνης και γραμματοσειρές μεταξύ δημοφιλών φυσικών γλωσσών. Κάθε δοχείο μπορεί να ξεκινήσει πολλά προγράμματα περιήγησης ταυτόχρονα.

## Λειτουργία χρήστη :id=user-mode

Όταν συνδεθείτε στο λογαριασμό σας github και θέλετε να επαναχρησιμοποιήσετε τη συνεδρία σύνδεσης για εργασία αυτοματισμού. Μπορείτε να χρησιμοποιήσετε το `launcher.NewUserMode` για να εκκινήσετε το κανονικό πρόγραμμα περιήγησης χρήστη. Ράβδος θα είναι ακριβώς όπως μια επέκταση προγράμματος περιήγησης:

```go
wsURL := launcher.NewUserMode().MustLaunch()
browser := rod.New().ControlURL(wsURL).MustConnect().NoDefaultDevice()
```

Εδώ είναι ένα πιο λεπτομερές παράδειγμα: [παράδειγμα κώδικα](https://github.com/go-rod/rod/blob/master/lib/examples/use-rod-like-chrome-extension/main.go).

## API Χαμηλού Επιπέδου

Αν θέλετε να ελέγξετε κάθε βήμα της διαδικασίας εκκίνησης, όπως απενεργοποιήστε την αυτόματη λήψη και χρησιμοποιήστε τον προεπιλεγμένο περιηγητή του συστήματος, ελέγξτε το [παράδειγμα αρχείου](https://github.com/go-rod/rod/blob/master/lib/launcher/example_test.go).
