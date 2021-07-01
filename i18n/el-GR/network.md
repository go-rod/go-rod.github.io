# Δίκτυο

## Αιτήσεις Hijack

Μπορείτε να χρησιμοποιήσετε το Rod για να αποκρύψετε οποιαδήποτε κίνηση HTTP ή HTTPS.

Η όλη διαδικασία της πειρατείας ένα αίτημα:

```text
   browser --req-> rod ---> server ---> rod --res-> browser
```

Όταν το πρόγραμμα περιήγησης θέλει να στείλει ένα αίτημα σε ένα διακομιστή, θα στείλει πρώτα το αίτημα στο Rod, τότε το Rod θα ενεργήσει όπως ένας διαμεσολαβητής για να στείλει το αίτημα στον πραγματικό διακομιστή και να επιστρέψει την απάντηση στο πρόγραμμα περιήγησης. Το `--req->` και `--res->` είναι τα μέρη που μπορούν να τροποποιηθούν.

Για παράδειγμα, για να αντικαταστήσουμε ένα αρχείο `test.js` απόκριση από το διακομιστή μπορούμε να κάνουμε κάτι έτσι:

```go
browser := rod.New().MustConnect()

δρομολογητής := browser.HijackRequests()

router.MustAdd("*/test.js", func(ctx *rod.Hijack) mptom
    ctx.MustLoadResponse()
    ctx.Response.SetBody(`console. og("js file replaced")`)
})

go router.Run()

page := browser.MustPage("https://test.com/")

// Hijack requests under the scope of a page
page.HijackRequests()
```

Για περισσότερες πληροφορίες, ελέγξτε τις [δοκιμές hijack](https://github.com/go-rod/rod/blob/master/hijack_test.go)
