# Gestion des erreurs

Dans les chapitres précédents, nous avons vu beaucoup de méthodes `Doit` être préfixées comme `MustNavigate`, `MustElement`, etc. Ils ont tous des versions non préfixées comme `Naviguer`, `Élément`, etc. La principale différence entre eux est la manière dont ils gèrent les erreurs. Ce n'est pas spécial pour Rod, vous pouvez le trouver dans la bibliothèque standard comme [regex.MustCompile](https://golang.org/pkg/regexp/#MustCompile).

Les méthodes comme `MustNavigate` et `MustElement` sont couramment utilisées dans le code exemple ou le script rapide. Ils sont utiles pour des travaux tels que le test de fumée, la surveillance du site, le test de bout en bout, etc. Des emplois avec beaucoup d'incertitude, comme le ferraillage de web, la version non préfixée sera un meilleur choix.

La version préfixée est juste la version non préfixée avec un vérificateur d'erreur. Voici le code source du `MustElement`, comme vous pouvez le voir il appelle juste l'élément `` avec plusieurs lignes supplémentaires pour paniquer si l'erreur n'est pas `nil`:

```go
func (p *Page) MustElement(selectors ...string) *Element {
    el, err := p.Element(selectors...)
    if err != nil {
        panique(err)
    }
    return el
}
```

## Obtenir la valeur de l'erreur

Les deux blocs de code ci-dessous font presque la même chose dans deux styles.

Le style ci-dessous est le moyen standard pour gérer les erreurs:

```go
page := rod.New().MustConnect().MustPage("https://example.com")

el, err := page. lement("a")
si erreur! nil {
    handleError(err)
    return
}
html, err := el. TML()
if err != nil {
    handleError(err)
    return
}
fmt.Println(html)
```

Nous pouvons utiliser `rod.Essayez` pour attraper l'erreur à partir des `doivent` méthodes préfixées `MustElement` et `MustHTML`. Le style ci-dessous finira généralement par moins de code, mais il peut aussi attraper des erreurs supplémentaires:

```go
page := rod.New().MustConnect().MustPage("https://example.com")

err := rod.Try(func() {
    fmt.Println(page.MustElement("a").MustHTML())
})
handleError(err)
```

## Vérifier le type d'erreur

Nous utilisons la méthode standard de Go's pour vérifier les types d'erreurs, pas de magie.

Le code `handleError` dans le code ci-dessus peut ressembler à :

```go
func handleError(errr error) {
    var evalErr *rod.ErrEval
    if errors.Is(err, contexte. eadlineExceeded) { // erreur timeout
        fmt.Println("timeout error")
    } sinon si erreurs. s(err, &evalErr) { // erreur eval
        fmt.Println(evalErr. ineNumber)
    } sinon si err != nil {
        fmt.
```
