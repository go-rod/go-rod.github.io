# Context și timp

În Golang, de obicei folosim [Context](https://golang.org/pkg/context/) pentru a abandona sarcini de lungă durată. Rod folosește Context pentru a face față anulărilor pentru operațiunile de blocare IO, de cele mai multe ori este expirat. Trebuie să le acordaţi o atenţie deosebită.

Dacă nu sunteți familiarizat cu Context, vă rugăm să citiți [Înțelegeți Context](understand-context.md) mai întâi.

## Anulare

De exemplu, codul de mai jos creează o pagină goală şi navighează către "github.com":

```go
page := rod.New().MustConnect().MustPage()
page.MustNavigate("http://github.com")
```

Acum, să presupunem că vrem să anulăm `MustNavigate` dacă durează mai mult de 2 secunde. În Rod putem face ceva de genul acesta:

```go
pagina := rod.New().MustConnect().MustPage()

ctx, anulați := context.WithCancel(context.Background())
pageWithCancel := page.Context(ctx)

go func() {
    time. Somn (2 * timp.Secundă)
    anulel()
}()

pageWithCancel.MustNavigate("http://github.com") // va fi anulat după 2 secunde
```

Folosim `page.Context` pentru a crea o clonă superficială a paginii ``. Ori de câte ori apelăm `anulați`, operațiunile declanșate de `pageWithCancel` vor fi anulate, poate fi orice operație, nu doar `MustNavigate`. Pagina de origine `` nu va fi afectată, dacă o folosim pentru a apela operațiuni, acestea nu vor fi anulate.

Acest stil nu este special pentru Rod, puteţi găsi API-uri similare ca [Request.WithContext](https://golang.org/pkg/net/http/#Request.WithContext) în biblioteca standard.

Deoarece `pageWithCancel` și `pagina` sunt independente una față de cealaltă, operațiunile declanșate de `pagina` nu vor fi afectate de anulare:

```go
page.MustNavigate("http://github.com") // nu va fi anulat după 2 secunde
```

## Expirare

Codul de mai sus este doar un mod de a expira o operație. În Golang, perioada de expirare este de obicei doar un caz special de anulare. Pentru că este atât de util, am creat un ajutor pentru a face același lucru mai sus, se numește `Timeout`, astfel încât codul de mai sus să poată fi redus ca mai jos:

```go
pagina := rod.New().MustConnect().MustPage()
page.Timeout(2 * time.Second).MustNavigate("http://github.com")
```

Pagina `Timeout(2 * time.Secundă)` este `pageWithCancel` anterior. Nu doar `Pagină`, `Browser` și `Element` au aceleași ajutoare de context.

## Detectează timeout

Cum știu dacă o operație este expirată sau nu? În Golang, timpul expirat este de obicei un tip de eroare. Nu este special pentru Rod. Pentru codul de mai sus putem face acest lucru pentru a detecta timpul:

```go
pagina := rod.New().MustConnect().MustPage()

err := rod.Try(func() {
    page.Timeout(2 * time.Secd).MustNavigate("http://github.com")
})
dacă erorile. s(eroare, context. eadlineExceeded) {
    // cod pentru eroare timeout
} altfel dacă erori! cod nil {
    // pentru alte tipuri de erori
}
```

Aici folosim `roz.Încercaţi` pentru a completa funcţia care poate arunca o eroare de timeout.

Vom vorbi mai mult despre transmiterea erorilor la [gestionarea erorilor](error-handling.md).
