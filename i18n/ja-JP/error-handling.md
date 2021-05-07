# エラー処理

前の章では、 `MustNavigate` 、 `MustElement`、 `MustElement`などの多くの接頭辞付きメソッドを見てきました。 これらはすべて、 `ナビゲート`、 `エレメント`などのような接頭辞のないバージョンがあります。 彼らの主な違いは、どのように エラーを処理するかです。 Rod にとっては特別ではありません。 [regex.MustCompile](https://golang.org/pkg/regexp/#MustCompile) のような標準ライブラリで見つけることができます。

`MustNavigate` や `MustElement` のようなメソッドは、コード例やクイックスクリプトで一般的に使用されます。 煙のテスト、現場監視、エンドツーエンドのテストなどの仕事に役立ちます。 Webスクレイピングのような不確実性の多いジョブは、接頭辞なしのバージョンは、より良い選択になります。

接頭辞付きバージョンはエラーチェッカーでラップされた接頭辞なしのバージョンのみです。 Here's the source code of the `MustElement`, as you can see it just calls the `Element` with several extra lines to panic if err is not `nil`:

```go
func (p *ページ) MustElement(selectors ...string) *Element {
    el, err := p.Element(selectors...)
    if err != nil {
        panic(err)
    }
    return el
}
```

## エラー値を取得する

以下の2つのコードブロックは、ほぼ2つのスタイルで同じことをしています。

以下のスタイルはエラーを処理するGoの標準的な方法です:

```go
page := rod.New().MustConnect().MustPage("https://example.com")

el, err := page.Element("a")
if err != nil {
    handleError(err)
    return
}
html, err := el.HTML()
if err != nil {
    handleError(err)
    return
}
fmt.Println(html)
```

`rod.Try` to catch the error from the `must` prefixed methods `MustElement` and `MustHTML`. 以下のスタイルは通常より少ないコードで終わりますが、追加のエラーも発生する可能性があります。

```go
page := rod.New().MustConnect().MustPage("https://example.com")

err := rod.Try(func() {
    fmt.Println(page.MustElement("a").MustHTML())
})
handleError(error)
```

## エラーの種類を確認する

エラーの種類を確認するためにGoの標準的な方法を使用します。

上記のコードの `handleError` は次のようになります。

```go
func handleError(err error) {
    var evalErr *rod.ErrEval
    if errors.Is(err, context.DeadlineExceeded) { // timeout error
        fmt.Println("timeout err")
    } else if errors.As(err, &evalErr) { // eval error
        fmt.Println(evalErr.LineNumber)
    } else if err != nil {
        fmt.Println("can't handle", err)
    }
}
```
