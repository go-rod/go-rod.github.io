# Commencer avec le Tige

## Exigences

[Golang](https://golang.org/) est la seule exigence, vous n'avez même pas besoin de savoir quoi que ce soit sur le HTML.

Si vous n'avez jamais utilisé Golang, [installez](https://golang.org/doc/install) et vous pouvez le maîtriser en heures: [Une visite guidée](https://tour.golang.org/welcome).

## Premier programme

Utilisons Rod pour ouvrir une page et en prendre une capture d'écran, d'abord, créez un fichier "main.go" avec le contenu ci-dessous:

```go
package main

import "github.com/go-rod/rod"

func main() {
    page := rod.New().MustConnect().MustPage("https://www.wikipedia.org/")
    page.MustWaitLoad().MustScreenshot("a.png")
}
```

Le `rod.New` crée un objet de navigateur, le `MustConnect` se lance et se connecte à un navigateur. Le `MustPage` crée un objet de page, c'est comme un onglet de page dans le navigateur. Le `MustWaitLoad` attend que la page soit complètement chargée. La `MustScreenshot` prend une capture d'écran de la page.

Créer un module :

```bash
go env -w GOPROXY=https://goproxy.io,direct
go mod init learn-rod
go mod tidy
```

Exécuter le module :

```bash
allez exécuter.
```

Le programme affichera une capture d'écran "a.png" comme celle ci-dessous:

![premier programme](first-program.png)

## Voir ce qui est sous la capuche

Pour les développeurs seniors, vous pouvez sauter tout et lire ce fichier : [lien](https://github.com/go-rod/rod/blob/master/examples_test.go).

Par défaut, Rod désactivera l'interface utilisateur du navigateur pour maximiser les performances. Mais lors du développement d'une tâche d'automatisation, nous nous soucions plus de la facilité de débogage. Rod fournit de nombreuses solutions pour vous aider à déboguer le code.

Nous allons créer un fichier de configuration ".rod" dans le répertoire de travail courant. Le contenu est :

```txt
afficher
```

Cela signifie "afficher l'interface utilisateur du navigateur au premier plan". Avant d'exécuter le module à nouveau, ajoutons `time.Sleep(temps. notre)` jusqu'à la fin du code pour qu'il ne soit pas trop rapide pour que nos yeux l'attrapent, le code de "main.

```go
package main

import (
    "time"

    "github.com/go-rod/rod"
)

func main() {
    page := rod.New().MustConnect().MustPage("https://www.wikipedia.org/")
    page.MustWaitLoad().MustScreenshot("a.png")
    time.Sleep(time.Hour)
```

Si vous exécutez le module à nouveau, vous devriez voir un navigateur comme ceci :

![afficher](show.png)

Appuyez sur [CTRL + C](https://en.wikipedia.org/wiki/Control-C) sur le clavier pour arrêter le programme.

## Saisie et clic

Nous allons automatiser le site Web pour rechercher le mot clé "terre". Un site web peut avoir beaucoup de champs de saisie ou de boutons, nous devons indiquer au programme celui à manipuler. Habituellement, nous utilisons [Devtools](https://developers.google.com/web/tools/chrome-devtools/) pour nous aider à localiser l'élément que nous voulons contrôler. ajoutons une nouvelle configuration au fichier ".rod" pour activer les Devtools, maintenant il devient :

```txt
show
devtools
```

Exécutez le « main ». o" encore, déplacez votre souris vers le champ de saisie et cliquez avec le bouton droit de la souris au-dessus de lui, vous verrez le menu contextuel, puis cliquez sur le "inspect":

![inspecter](inspect.png)

Vous devriez voir le `<entrée id="searchInput` comme ci-dessous:

![input](input.png)

Faites un clic droit pour copier le sélecteur [css](css-selector.md) comme l'image ci-dessus. Le contenu de votre presse-papiers sera "#searchInput". Nous l'utiliserons pour localiser l'élément pour entrer le mot clé. Maintenant le "main.go" devient :

```go
import de

principal du paquet (
    "time"

    "github. om/go-rod/rod"
)

func main() {
    page := rod.New().MustConnect().MustPage("https://www.wikipedia. rg/").MustWindowFullscreen()

    page.MustElement("#searchInput").MustInput("earth")

    page.MustWaitLoad().MustScreenshot("a.png")
    time.Sleep(time.Hour)
}
```

Le `MustWindowFullscreen` redimensionne la fenêtre du navigateur pour faciliter le débogage. Nous utilisons `MustElement` et le sélecteur que nous avons copié depuis le panneau Devtools pour obtenir l'élément que nous voulons manipuler. Le `MustElement` attend automatiquement jusqu'à ce que l'élément apparaisse, donc nous n'avons pas besoin d'utiliser `MustWaitLoad` avant lui. Puis nous appelons le `MustInput` pour entrer le mot clé "earth" dedans. Si vous relancez le "main.go", vous devriez voir le résultat comme ci-dessous:

![après-entrée](after-input.png)

Similaire au champ de saisie, nous allons faire un clic droit sur le bouton de recherche pour copier le sélecteur :

![recherche-btn](search-btn.png)

![sélecteur de recherche](search-btn-selector.png)

Ajoute ensuite du code pour cliquer sur le bouton de recherche, maintenant le "main.go" ressemble à :

```go
package main

import "github.com/go-rod/rod"

func main() {
    page := rod.New().MustConnect().MustPage("https://www.wikipedia.org/").MustWindowFullscreen()

    page.MustElement("#searchInput").MustInput("earth")
    page.MustElement("#search-form > fieldset > button").MustClick()

    page.MustWaitLoad().MustScreenshot("a.png")
}
```

Si nous recommençons le module, le "a.png" affichera le résultat de la recherche :

![page de la terre](earth-page.png)

## Ralentissement du mouvement et de la trace visuelle

Les opérations automatisées sont trop rapides pour que les yeux humains puissent être attrapés, pour les déboguer nous en général activons les configurations de ralentissements et de traces visuelles, mettons à jour le ". fichier od" :

```txt
afficher
slow=1s
trace
```

Puis relancer le module, maintenant chaque action attendra 1 seconde avant son exécution. Sur la page, vous verrez la trace de débogage générée par Rod comme ci-dessous:

![Trace](trace.png)

Comme vous pouvez le voir sur le bouton de recherche, Rod créera un curseur de souris.

Sur console, vous verrez le journal des traces comme ci-dessous:

```txt
[rod] 2020/11/11 11:11:11 [eval] {"js":"rod.element","params":["#searchInput"]}
[rod] 2020/11/11 11:11:11 [eval] {"js":"rod. isible", this":"input#searchInput"}
[rod] 2020/11/11 11:11:11 [input] faire défiler dans la vue
[rod] 2020/11/11 11:11:11 [input] terre d'entrée
[rod] 2020/11/11 11:11:11 [eval] {"js":"tr. élément","params":["#search-form > fieldset > button"]}
[rod] 2020/11/11 11:11 [eval] {"js":"rod.visible","this":"button.pure-button. ure-button-primary-progressive"}
[rod] 20/11/11/11 11:11:11 [input] défilez dans la vue
[rod] 2020/11/11 11:11:11 [input] clic gauche
```

## Autre que le fichier ".rod"

Le ". le fichier od" est juste un raccourci pour certaines API couramment utilisées, vous pouvez également les définir manuellement dans le code, comme le « lent », le code à définir est comme la tige `. ew().SlowMotion(2 * time.Second)`. Vous pouvez également utiliser une variable d'environnement pour la configurer, comme sur Mac ou Linux : `rod=show go main.go`.

## Obtenir le contenu du texte

Rod fournit beaucoup de méthodes pratiques pour récupérer le contenu de la page.

Essayons d'obtenir la description de la Terre, utilisons la même technique que celle utilisée précédemment pour copier le sélecteur dans les Devtools:

![obtenir du texte](get-text.png)

La méthode que nous utilisons est `MustText`, voici le code complet :

```go
import du paquet main

(
    "fmt"

    "github. om/go-rod/rod"
)

func main() {
    page := rod. ew().MustConnect().MustPage("https://www.wikipedia.org/")

    page.MustElement("#searchInput"). ustInput("earth")
    page.MustElement("#search-form > fieldset > button").MustClick()

    el := page. ustElement("#mw-content-text > div.mw-parser-output > p:nth-child(6)")
    fmt.Println(el.MustText())
}
```

Si nous recommençons le module, nous devrions voir la console produire quelque chose comme :

```txt
La Terre est la troisième planète du Soleil et le seul objet astronomique connu pour abriter la vie.
...
```

## Obtenir le contenu de l'image

Identique au texte obtenu, nous pouvons également obtenir des images de la page, obtenons le sélecteur de l'image de la Terre et utilisons `MustResource` pour obtenir le binaire de l'image:

![get-image](get-image.png)

Le code complet est :

```go
import du paquet principal

(
    "github.com/go-rod/rod"
    "github. om/go-rod/lib/utils"
)

func main() {
    page := rod. ew().MustConnect().MustPage("https://www.wikipedia.org/")

    page.MustElement("#searchInput").MustInput("earth")
    page. ustElement("#search-form > fieldset > button").MustClick()

    el := page.MustElement("#mw-content-text > div.mw-parser-output > table. nfobox > tbody > tr:nth-child(1) > td > a > img")
    _ = utils. utputFile("b.png", el.MustResource())
}
```

Le fichier de sortie "b.png" doit être :

![terre](earth.png)
