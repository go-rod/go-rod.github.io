# Tratamento de erros

Nos capítulos anteriores, vimos muitos `deve` métodos prefixados como `MustNavigate`, `MustElement`, etc. Todos eles têm versões não fixas como `Navegar`, `Elemento`, etc. A principal diferença entre eles é como lidam com erros. They all have non-prefixed versions like `Navigate`, `Element`, etc. The main difference between them is how they handle errors. Não é especial para a Rod, você pode encontrá-la na biblioteca padrão como [regex. MustComile](https://golang.org/pkg/regexp/#MustCompile).

Os métodos como `MustNavigate` e `MustElement` são comumente usados no código de exemplo ou script rápido. São úteis para trabalhos como testes de fumo, monitoramento do site, teste de ponta a ponta, etc. Vagas com muita incerteza, como sucata na Web, a versão não pré-fixa será uma melhor escolha. Jobs with lots of uncertainty, such as web scraping, the non-prefixed version will be a better choice.

A versão prefixada é apenas a versão não prefixada que está dentro de um verificador de erro. Aqui está o código fonte do `Elemento de Deve`, como você pode ver, apenas chama o elemento `` com várias linhas extras para o pânico se não for `nil`:

```go
// Page ...
type Page rod. Page

// MustElement ...
func (p *Page) MustElement(selector string) *rod. Element {
    el, err := (*rod. Page)(p). Element(selector)
    if err != nil {
        panic(err)
    }
    return el
}
```

## Obter o valor de erro

Os dois blocos de código abaixo estão quase fazendo a mesma coisa em dois estilos.

O estilo abaixo é a maneira padrão de lidar com erros:

```go
page := rod. New(). MustConnect(). MustPage("https://example.com")

el, err := page. Element("a")
if err != nil {
    panic(err)
}
html, err := el.HTML()
if err != nil {
    panic(err)
}
fmt. Println(html)
```

Podemos usar `rod. Tente` para pegar o erro dos `Precisa` métodos prefixados `MustElement` e `MustHTML`. O estilo abaixo geralmente acabará em menos código, mas ele também pode recuperar erros extras:

```go
page := rod. New(). MustConnect(). MustPage("https://example.com")

err := rod. Try(func() {
    fmt. Println(page. MustElement("a"). MustHTML())
})
panic(err)
```

## Verifique o tipo de erro

Usamos a maneira padrão de verificar os tipos de erro, sem mágica.

Replace the `panic` in the above code with `handleError`:

```go
func main() {
    _, err := page. Element("a")
    handleError(err)
}

func handleError(err error) {
    var evalErr *rod. ErrEval
    if errors. Is(err, context. DeadlineExceeded) { // timeout error
        fmt. Println("timeout err")
    } else if errors. As(err, &evalErr) { // eval error
        fmt. Println(evalErr. LineNumber)
    } else if err != nil {
        fmt.
```
