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
    time. leep(2 * time.Second)
    cancel()
}()

pageWithCancel.MustNavigate("http://github.com") // sera annulé après 2 secondes
```

Nous utilisons la `page.Context` pour créer un clone peu profond de la `page`. Chaque fois que nous appelons le `annuler`, les opérations déclenchées par la `pageWithCancel` seront annulées, elle peut être n'importe quelle opération, pas seulement `MustNavigate`. La page d'origine `` ne sera pas affectée, si nous l'utilisons pour les opérations d'appel, elles ne seront pas annulées.

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

## Détecter le délai d'attente

Comment savoir si une opération est expirée ou non? Dans Golang, le délai est généralement un type d'erreur. Ce n'est pas spécial pour Rod. Pour le code ci-dessus, nous pouvons le faire pour détecter le timeout:

```go
page := rod.New().MustConnect().MustPage()

err := rod.Try(func() {
    page.Timeout(2 * time.Second).MustNavigate("http://github.com")
})
si des erreurs. s(err, contexte. eadlineExceeded) {
    // code for timeout error
} else if err ! nl {
    // code pour les autres types d'erreur
}
```

Ici, nous utilisons `rod.Essayez` pour envelopper la fonction qui peut déclencher une erreur de délai.

Nous parlerons plus de la gestion des erreurs à [Gestion des erreurs](error-handling.md).
