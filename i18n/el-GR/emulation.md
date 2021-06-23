# Προσομοίωση

Ράβδος παρέχει διάφορους τρόπους για να μιμηθούν το περιβάλλον για σελίδες.

## Συσκευές

Για να ορίσετε την προβολή, τον παράγοντα χρήστη, τον προσανατολισμό, κλπ ταυτόχρονα για μια σελίδα, μπορείτε να χρησιμοποιήσετε τις προκαθορισμένες συσκευές:

```go
page.MustEmulate(devices.IPhone6or7or8Plus)
```

Ή ορίστε τη δική σας συσκευή:

```go
page.MustEmulate(devices.Device{
  Title:          "iPhone 4",
  Capabilities:   []string{"touch", "mobile"},
  UserAgent:      "Mozilla/5.0 (iPhone; CPU iPhone OS 7_1_2 like Mac OS X)",
  AcceptLanguage: "en",
  Screen: devices.Screen{
    DevicePixelRatio: 2,
    Horizontal: devices.ScreenSize{
      Width:  480,
      Height: 320,
    },
    Vertical: devices.ScreenSize{
      Width:  320,
      Height: 480,
    },
  },
})
```

Ελέγξτε τον πηγαίο κώδικα των προκαθορισμένων συσκευών, τα πεδία θα πρέπει να εξηγήσουν τα ίδια.

Μπορείτε επίσης να ορίσετε την προεπιλεγμένη συσκευή για όλες τις σελίδες χρησιμοποιώντας το [Browser.DefaultDevice](https://pkg.go.dev/github.com/go-rod/rod#Browser.DefaultDevice).

Η εξομοίωση ενεργοποιείται από προεπιλογή (χρησιμοποιώντας τις [συσκευές. aptopWithMDPIScreen](https://github.com/go-rod/rod/blob/bc44c39c9b4352c15d00bef6f6a1071205d2c388/lib/devices/list.go#L616) συσκευή), η οποία παρακάμπτει μερικές από τις προεπιλεγμένες ρυθμίσεις του προγράμματος περιήγησης, η οποία είναι καλύτερη από την άποψη της συνοχής (δηλαδή, βοηθά στην αναπαραγωγή δοκιμών).

Μπορείτε να απενεργοποιήσετε τη δυνατότητα εξομοίωσης συσκευής που περνά την ειδική _Εκκαθάριση_ συσκευή στο `Browser.DefaultDevice`.

```go
ΠροεπιλογήΣυσκευή(devices.Clear)
```

Ή μπορείτε απλά να χρησιμοποιήσετε το [Browser.NoDefaultDevice](https://pkg.go.dev/github.com/go-rod/rod#Browser.NoDefaultDevice) βοηθός.

## Παράγοντας χρήστη

Αν θέλετε να καθορίσετε ένα user-agent για μια συγκεκριμένη σελίδα, χρησιμοποιήστε [Page.SetUserAgent](https://pkg.go.dev/github.com/go-rod/rod#Page.SetUserAgent).

## Θύρα

Αν θέλετε να καθορίσετε τη θύρα προβολής για μια συγκεκριμένη σελίδα, χρησιμοποιήστε [Page.SetViewport](https://pkg.go.dev/github.com/go-rod/rod#Page.SetViewport).

## Τοπική ζώνη και ζώνη ώρας

Μπορείτε να χρησιμοποιήσετε το env εκκίνησης για να ορίσετε για όλες τις σελίδες:

```go
u := launcher.New().Env ("TZ=America/New_York").MustConnect()
browser := rod.New().ControlURL(u).MustConnect()
```

Ή μπορείτε να χρησιμοποιήσετε το [EmulationSetTimezoneOverride](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetTimezoneOverride) ή [EmulationSetLocaleOverride](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetLocaleOverride) για να ορίσετε για μια συγκεκριμένη σελίδα:

```go
proto.EmulationSetTimezoneOverride{TimezoneID: "America/New_York"}.Call(σελίδα)
```

## Δικαιώματα

Χρήση [Χορηγήσεων προγράμματος περιήγησης](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#BrowserGrantPermissions)

## Γεωτοποθεσία

Χρήση του [EmulationSetGeolocationOverride](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetGeolocationOverride)

## Συνδυασμός χρωμάτων και πολυμέσα

Χρήση [EmulationSetEmulatedMedia](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetEmulatedMedia)

```go
proto.EmulationSetEmulatedMedia{
    Media: "screen",
    Χαρακτηριστικά: []*proto.EmulationMediaFeatureŞ
        {"prefers-color-scheme", "dark"},
    },
}.Κλήση(σελίδα)
```

## Αποτροπή ανίχνευσης bot

Συνήθως είναι καλύτερο να κάνετε τον απρόσωπο περιηγητή εντελώς διαφανή για τη σελίδα, έτσι ώστε η σελίδα να μην μπορεί να πει αν ελέγχεται από έναν άνθρωπο ή ένα ρομπότ. Σε ορισμένες περιπτώσεις, κάποια σελίδα θα μπορούσε να χρησιμοποιήσει client js για να εντοπίσει αν η σελίδα είναι ο έλεγχος από έναν άνθρωπο ή ένα ρομπότ, τέτοια WebGL, WebDriver, ή http κεφαλίδες αιτήσεων. Μπορείς να κατασκευάσεις μια js lib για να κρύψεις όλα τα ίχνη, ή απλά να χρησιμοποιήσεις lib [stealth](https://github.com/go-rod/stealth): [code example](https://github.com/go-rod/stealth/blob/master/examples_test.go).

Αν η `stealth` lib δεν λειτουργεί για εσάς, μπορείτε να εκκινήσετε το κανονικό πρόγραμμα περιήγησης χρήστη με `launcher. ewUserMode`: [Λειτουργία χρήστη](custom-launch.md?id=user-mode).

Μπορείτε να χρησιμοποιήσετε εργαλεία όπως [https://bot.sannysoft.com](https://bot.sannysoft.com) για να δοκιμάσετε τις ρυθμίσεις σας.

## Περιηγητής δακτυλικού αποτυπώματος

Η λήψη δακτυλικών αποτυπωμάτων περιηγητή δεν είναι ανίχνευση bot. Χρησιμοποιεί διάφορα κόλπα για να συλλέξει μοναδικά χαρακτηριστικά του προγράμματος περιήγησης για την αναγνώριση των προγραμμάτων περιήγησης. Η ιστοσελίδα μπορεί να το χρησιμοποιήσει για να παρακολουθεί τους χρήστες, ακόμη και όταν δεν είναι συνδεδεμένοι, χρησιμοποιείται επίσης ευρέως για την επισήμανση ακέραιων ξύστες. Για παράδειγμα, διαφορετικοί χρήστες συνήθως θα εγκαταστήσουν διαφορετικές γραμματοσειρές στο λειτουργικό τους σύστημα, μπορούμε να το χρησιμοποιήσουμε για να διακρίνουμε διαφορετικούς χρήστες. Ένα άλλο παράδειγμα θα ήταν η χρήση του καμβά για την απόδοση κειμένου, διαφορετικοί χρήστες συνήθως θα έχουν διαφορετικές GPUs, γραφικοί οδηγοί, ή OSes, όλοι θα επηρεάσουν το αποτέλεσμα της εικόνας που παρέχεται.

Συνήθως μπορείτε να εκκινήσετε πολλαπλές περιπτώσεις του προγράμματος περιήγησης για να έχετε διαφορετικά δακτυλικά αποτυπώματα. Αν θέλετε να χρησιμοποιήσετε ένα μόνο πρόγραμμα περιήγησης για να αποθηκεύσετε μνήμη και CPU, θα πρέπει να παρακάμψετε χειροκίνητα το API για καμβά, γραμματοσειρές, κλπ.

Μπορείτε να χρησιμοποιήσετε έργα ανοιχτού κώδικα όπως το [FingerprintJS](https://github.com/fingerprintjs/fingerprintjs/) για να ελέγξετε τις ρυθμίσεις σας.
