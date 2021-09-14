# Περιηγητές & Σελίδες

Είναι διαισθητικό να χρησιμοποιείτε το Rod για να ελέγχετε ταυτόχρονα πολλαπλά προγράμματα περιήγησης ή σελίδες.

## Πολλαπλά προγράμματα περιήγησης

Για να ξεκινήσετε πολλαπλά προγράμματα περιήγησης:

```go
browser1:= rod.New().MustConnect()
browser2 := rod.New().MustConnect()
```

Όλα τα APIs είναι ασφαλή, ίδια έργα για πολλαπλές ρουτίνες Go .

Μπορείτε επίσης να χρησιμοποιήσετε ανώνυμη λειτουργία για να εκκινήσετε πολλαπλά προγράμματα περιήγησης:

```go
browser1 := rod.New().MustConnect()
browser2 := browser1.MustIncognito()
```

Εκκίνηση προγραμμάτων περιήγησης με διαφορετικά ορίσματα εκκίνησης:

```go
browser1:= rod.New().ControlURL(
    launcher.New().Headless(false).MustLaunch()
).MustConnect()

browser1:= rod.New().ControlURL(
    launcher.New().UserDataDir("path").MustLaunch()
).MustConnect()
```

## Πολλαπλές σελίδες

To launch multiple pages for a browser:

```go
browser := rod.New().MustConnect()
σελίδα1 := browser.MustPage("http://a.com")
σελίδα2 := browser.MustPage("http://b.com")
```

If a browser already has several pages open and you don't have references to them, you can use [Browser.Pages()](https://pkg.go.dev/github.com/go-rod/rod#Browser.Pages) to get a [Pages](https://pkg.go.dev/github.com/go-rod/rod#Pages) struct which is a list of tabs and/or windows with several helpful methods attached, such as [Pages.Find()](https://pkg.go.dev/github.com/go-rod/rod#Pages.Find), [Pages.FindByURL()](https://pkg.go.dev/github.com/go-rod/rod#Pages.FindByURL), [Pages.First()](https://pkg.go.dev/github.com/go-rod/rod#Pages.First), etc. Once you get a reference to the page you want you can use [Page.Activate()](https://pkg.go.dev/github.com/go-rod/rod#Page.Activate) to focus it. If you are clicking a link opens a new page then you can use [Page.WaitOpen](https://pkg.go.dev/github.com/go-rod/rod#Page.WaitOpen) to grab a reference to the new window as soon as it is launched.

## Σύμπλεγμα σελίδας

We can use PagePool to help concurrently control and reuse pages.

Check this [example](https://github.com/go-rod/rod/blob/46baf3aad803ed5cd8671aa325cbae4e297a89a4/examples_test.go#L533)

## Πισίνα προγράμματος περιήγησης

The tests in Rod is a good example of managing a pool of browsers to run tests concurrently. That's why the tests can finish in seconds. Check the code [here](https://github.com/go-rod/rod/blob/46baf3aad803ed5cd8671aa325cbae4e297a89a4/setup_test.go#L59).
