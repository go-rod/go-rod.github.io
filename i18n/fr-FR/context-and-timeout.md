# Contexte et délai d'attente

Sur Golang, nous utilisons généralement [Contexte](https://golang.org/pkg/context/) pour abandonner les tâches à long terme. Rod utilise le contexte pour gérer les annulations pour les opérations de blocage des E/S, la plupart du temps il a expiré. Vous devez y accorder une attention particulière.

Si vous n'êtes pas familier avec le contexte, veuillez lire [Comprendre le contexte](understand-context.md) d'abord.

## Annulation

Par exemple, le code ci-dessous crée une page vide et navigue vers le "github.com":

```go
page := rod.New().MustConnect().MustPage()
page.MustNavigate("http://github.com")
```

Maintenant, supposons que nous voulions annuler le `MustNavigate` si cela prend plus de 2 secondes. À Rod, nous pouvons faire quelque chose comme ceci:

```go
page := rod.New().MustConnect().MustPage()

ctx, cancel := context.WithCancel(context.Background())
pageWithCancel := page.Context(ctx)

go func() {
    time.Sleep(2 * time.Second)
    cancel()
}()

// The 2 lines below share the same context, they will be canceled after 2 seconds in total
pageWithCancel.MustNavigate("http://github.com") 
pageWithCancel.MustElement("body")  
```

Nous utilisons la `page.Context` pour créer un clone peu profond de la `page`. Whenever we call the `cancel`, all the sub operations triggered by the `pageWithCancel` will be canceled, it can be any operation, not just `MustNavigate`. La page d'origine `` ne sera pas affectée, si nous l'utilisons pour les opérations d'appel, elles ne seront pas annulées.

Ce style n'est pas spécial pour Rod, vous pouvez trouver des API similaires comme [Request.WithContext](https://golang.org/pkg/net/http/#Request.WithContext) dans la bibliothèque standard.

Parce que `pageWithCancel` et `page` sont indépendants les uns des autres, les opérations déclenchées par `page` ne seront pas affectées par l'annulation :

```go
page.MustNavigate("http://github.com") // ne sera pas annulé après 2 secondes
```

## Délai d'expiration

Le code ci-dessus est juste un moyen d'expirer une opération. Dans le Golang, le délai d'expiration n'est généralement qu'un cas particulier d'annulation. Parce que c'est si utile, nous avons créé un assistant pour faire la même chose ci-dessus, il s'appelle `Timeout`, donc le code ci-dessus peut être réduit comme ci-dessous:

```go
page := rod.New().MustConnect().MustPage()
page.Timeout(2 * time.Second).MustNavigate("http://github.com")
```

La `page.Timeout(2 * time.Second)` est la `pageWithCancel` précédente. Pas seulement `Page`, `Browser` et `Elément` ont les mêmes aides de contexte.

## Cancel timeout

If you want to keep using the same instance after some operation, you can use the `Page.CancelTimeout` helper to cancel the timeout:

```go
page.
    Timeout(2 * time.Second).MustElement("a").
    CancelTimeout().
    MustElement("b") // This line won't be affected by the 2 seconds timeout.
```

## Detect timeout

How do I know if an operation is timed out or not? In Golang, timeout is usually a type of error. It's not special for Rod. For the code above we can do this to detect timeout:

```go
page := rod.New().MustConnect().MustPage()

err := rod.Try(func() {
    page.Timeout(2 * time.Second).MustNavigate("http://github.com")
})
if errors.Is(err, context.DeadlineExceeded) {
    fmt.Println("timeout error")
} else if err != nil {
    fmt.Println("other types of error")
}
```

Here we use `rod.Try` to wrap the function that may throw a timeout error.

We will talk more about error handing at [Error Handling](error-handling.md).
