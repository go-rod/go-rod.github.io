# Tratamento de erros

Nos capítulos anteriores, vimos muitos `deve` métodos prefixados como `MustNavigate`, `MustElement`, etc. Todos eles têm versões não fixas como `Navegar`, `Elemento`, etc. A principal diferença entre eles é como lidam com erros. Não é especial para a Rod, você pode encontrá-la na biblioteca padrão como [regex.MustComile](https://golang.org/pkg/regexp/#MustCompile).

Os métodos como `MustNavigate` e `MustElement` são comumente usados no código de exemplo ou script rápido. São úteis para trabalhos como testes de fumo, monitoramento do site, teste de ponta a ponta, etc. Vagas com muita incerteza, como sucata na Web, a versão não pré-fixa será uma melhor escolha.

A versão prefixada é apenas a versão não prefixada que está dentro de um verificador de erro. Aqui está o código fonte do `Elemento de Deve`, como você pode ver, apenas chama o elemento `` com várias linhas extras para o pânico se não for `nil`:

```go
Função (p *Página) Deve(seletores ...string) *Elemento {
    el, err := p.Element(seletores...)
    if err != nil {
        pânico (err)
    }
    return el
}
```

## Obter o valor de erro

Os dois blocos de código abaixo estão quase fazendo a mesma coisa em dois estilos.

O estilo abaixo é a maneira padrão de lidar com erros:

```go
página := rod.New().MustConnect().MustPage("https://example.com")

el, err := page. lement("a")
if err ! nil {
    handleError(err)
    return
}
html, err := el. TML()
se err != nil {
    handleError(err)
    return
}
fmt.Println(html)
```

Podemos usar `rod.Tente` para pegar o erro dos `Precisa` métodos prefixados `MustElement` e `MustHTML`. O estilo abaixo geralmente acabará em menos código, mas ele também pode recuperar erros extras:

```go
página := rod.New().MustConnect().MustPage("https://example.com")

err := rod.Try(func() {
    fmt.Println(page.MustElement("a").MustHTML())
})
handleError(err)
```

## Verifique o tipo de erro

Usamos a maneira padrão de verificar os tipos de erro, sem mágica.

O `handleError` no código acima pode parecer como:

```go
func handleError(erro err) {
    var evalErr *rod.ErrEval
    if errors.Is(err, contexto. eadlineExceeded) { // erro de timeout
        fmt.Println("timeout err")
    } else se erros. s(err, &evalErr) { // erro eval
        fmt.Println(evalErr. ineNumber)
    } senão se err != nil {
        fmt. rintln("não é possível lidar com ", err)
    }
}
```
