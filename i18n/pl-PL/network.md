# Sieć

## Żądania Hijack

Możesz użyć Rod do hijack dowolnego ruchu HTTP lub HTTPS.

Cały proces porywania jednego żądania:

```text
   przeglądarka --req-> rod ---> serwer ---> rod --res-> przeglądarka
```

Gdy przeglądarka chce wysłać żądanie do serwera, najpierw wyśle żądanie do Roda, wtedy Rod będzie działał jak proxy, aby wysłać żądanie do rzeczywistego serwera i zwrócić odpowiedź do przeglądarki. `--req->` i `--res->` to części, które można modyfikować.

Na przykład, aby zastąpić odpowiedź pliku `test.js` z serwera, możemy zrobić coś takiego:

```go
przeglądarka := rod.New().MustConnect()

router := browser.HijackRequests()

router.MustAdd("*/test.js", func(ctx *rod.Hijack) {
    ctx.MustLoadResponse()
    ctx.Response.SetBody(`konsola. og("js file replaced")`)
})

idź router.Run()

strona := browser.MustPage("https://test.com/")

// Hijack requesty pod kątem strony
page.HijackRequests()
```

Aby uzyskać więcej informacji sprawdź [testy hijack](https://github.com/go-rod/rod/blob/master/hijack_test.go)
