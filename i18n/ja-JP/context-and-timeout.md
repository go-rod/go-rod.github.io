# コンテキストとタイムアウト

Golangでは、通常 [Context](https://golang.org/pkg/context/) を使用して、長時間実行されているタスクを中断します。 RodはContextを使用して、IOブロッキング操作のキャンセルを処理します。 ほとんどの場合タイムアウトします。 あなたは彼らに特別な注意を払う必要があります。

コンテキストに慣れていない場合は、最初に [コンテキストを理解する](understand-context.md) を読んでください。

## キャンセル

例えば、以下のコードは空白のページを作成し、"github.com"に移動します。

```go
page := rod.New().MustConnect().MustPage()
page.MustNavigate("http://github.com")
```

次に、2秒以上かかる場合、 `MustNavigate` をキャンセルするとします。 Rodでは次のようなことができます。

```go
page := rod.New().MustConnect().MustPage()

ctx, cancel := context.WithCancel(context.Background())
pageWithCancel := page.Context(ctx)

go func() {
    time.Sleep(2 * time.Second)
    cancel()
}()

pageWithCancel.MustNavigate("http://github.com") // will be canceled after 2 seconds
```

`page.Context` を使用して、 `ページ` の浅いクローンを作成します。 Whenever we call the `cancel`, the operations triggered by the `pageWithCancel` will be canceled, it can be any operation, not just `MustNavigate`. オリジン `ページ` は影響を受けません。 操作を呼び出すために使用するとキャンセルされることはありません。

このスタイルは Rod にとって特別なものではありません。 標準ライブラリに [Request.WithContext](https://golang.org/pkg/net/http/#Request.WithContext) のような API があります。

Because `pageWithCancel` and `page` are independent to each other, operations triggered by `page` will not be affected by the cancellation:

```go
page.MustNavigate("http://github.com") // 2 秒後にキャンセルされません
```

## タイムアウト

上記のコードは、操作をタイムアウトするための単なる方法です。 Golangでは、タイムアウトは通常、キャンセルの特別なケースです。 とても便利なので、上記でも同じことを行うためのヘルパーを作成しました。 これは `タイムアウト`と呼ばれるため、上記のコードは以下のように削減できます。

```go
page := rod.New().MustConnect().MustPage()
page.Timeout(2 * time.Second).MustNavigate("http://github.com")
```

`page.Timeout(2 * time.Second)` は直前の `pageWithCancel` です。 `ページ`、 `ブラウザー` 、 `要素` だけでなく、コンテキストヘルパーも同じです。

## 検出のタイムアウト

操作がタイムアウトかどうかを確認するにはどうすればよいですか? Golangでは、タイムアウトは通常エラーのタイプです。 ロッドにとっては特別なことではありません。 上のコードでは、タイムアウトを検出するためにこれを行うことができます。

```go
page := rod.New().MustConnect().MustPage()

err := rod.Try(func() {
    page.Timeout(2 * time.Second).MustNavigate("http://github.com")
})
if errors.Is(err, context.DeadlineExceeded) {
    // code for timeout error
} else if err != nil {
    // code for other types of error
}
```

ここでは `rod.` を使って、タイムアウトエラーを投げる関数をラップしてみてください。

エラーハンドリングについては、 [エラーハンドリング](error-handling.md) で詳しく説明します。
