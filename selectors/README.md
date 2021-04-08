# Selectors

Rod provides lots of methods to get elements. Their names are all prefixed with
`MustElement` or `Element`. If you use an IDE after you type `Element`, you will
see all the available selectors like below:

![ide-selectors](ide-selectors.png)

If you hover the cursor over the method, you will see the doc of it like below:

![ide-doc](ide-doc.png)

Usually, you only need some basic knowledge of [CSS Selector](css-selector) to achieve the automation task you want to do.
In the rest of the documentation we will only use CSS Selector to get elements from the page.

## By text content

Use `ElementR` to match elements with specific text content, such as select the search input in the screenshot below:

![match-text](match-text.png)

```go
page.MustElementR("input", "Search or jump")
page.MustElementR("input", "/click/i") // use the case-insensitive flag "i"
```

Since we use [js regex](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp), we don't have to match the whole text context.
The text to match is what you actually see on the website, not the source code, compare 1 and 2 in the screenshot below. You can use the `copy` helper in Devtools to copy the text to your clipboard (look at the 4):

![copy-text](copy-text.png)

## By XPath

CSS selector is the recommended way to selector elements, such as you cannot use XPath to select [rendered text](https://stackoverflow.com/questions/51992258/xpath-to-find-pseudo-element-after-in-side-a-div-element-with-out-any-content/51993454).
But sometimes XPath may be handier for programmers coming from other languages.
Use the `ElementX` for XPath:

```go
page.MustElementX("//h2")
```

## By Javascript

If you have a complex query or you want to use a high-level query engine, such as [jQuery](https://jquery.com/):

```go
page.MustElementByJS(`jQuery('option:selected')[0]`)
```

Actually, if you check the source code of other selectors, such as `Element` or `ElementR`, they are all based on `ElementByJS`,
and `ElementByJS` is based on `Page.Evaluate`, for more details about how to evaluate js, check the [Javascript Runtime](/javascript-runtime.md).
Usually, you use `ElementByJS` to create your own selector to extend Rod.

## Select list of elements

The names of the methods to get multiple elements are all prefixed with `MustElements` or `Elements`.
One key difference between a single-selector and a multi-selector is the single-selector will wait for the
element to appear. If a multi-selector doesn't find anything, it will immediately return an empty list.

## Traverse element tree

There are also some handy selectors to select elements inside or around an element, such as
`MustParent`, `MustNext`, `MustPrevious`, etc.

Here's an example of how we use various selectors to retrieve contents from a page:

```go
// On awesome-go page, finding the specified section sect,
// and retrieving the associated projects from the page.
func main() {
	page := rod.New().MustConnect().MustPage("https://github.com/avelino/awesome-go")

	section := page.MustElementR("p", "Selenium and browser control tools").MustNext()

	// get children elements of an element
	projects := section.MustElements("li")

	for _, project := range projects {
		link := project.MustElement("a")
		log.Printf(
			"project %s (%s): '%s'",
			link.MustText(),
			link.MustProperty("href"),
			project.MustText(),
		)
	}
}
```

## Get elements from iframes

For example we have want to get the button from the nested iframes:

![iframes](iframes.png)

The code will look like:

```go
frame01 := page.MustElement("iframe").MustFrame()
iframe02 := iframe01.MustElement("iframe").MustFrame()
frame02.MustElement("button")
```

## Search elements

There's another powerful helper to get elements, the `MustSearch`. It's less precise than the selectors mentioned above,
but it's handy if you want to get elements from deep nested iframes or shadow-doms.

The functionality is the same as the [Devtools' Search for nodes](https://developers.google.com/web/tools/chrome-devtools/dom#search), you can use it to find out what keyword to use to select the element you want,
like the screenshot below:

![search](search.png)

To get the same element from the [Get elements from iframes](#get-elements-from-iframes), we can simply code like this:

```go
page.MustSearch("button")
```

## Race selectors

Rod encourage sleep-free automation to reduce flakiness.
When an action has multiple results, we don't use sleep to wait for the page to redirect or settle down.
For example, when we login a page, the password maybe incorrect, we want to handle the success and failure separately.
We should avoid code like below:

```go
func main() {
	page := rod.New().MustConnect().MustPage("https://leetcode.com/accounts/login/")

	page.MustElement("#id_login").MustInput("username")
	page.MustElement("#id_password").MustInput("password").MustPress(input.Enter)

	time.Sleep(10 * time.Second) // Please avoid the use of time.Sleep!

	if page.MustHas(".nav-user-icon-base") {
		// print the username after successful login
		fmt.Println(*el.MustAttribute("title"))
	} else if page.MustHas("[data-cy=sign-in-error]") {
		// when wrong username or password
		fmt.Println(el.MustText())
	}
}
```

Instead we should code like this:

```go
func main() {
	page := rod.New().MustConnect().MustPage("https://leetcode.com/accounts/login/")

	page.MustElement("#id_login").MustInput("username")
	page.MustElement("#id_password").MustInput("password").MustPress(input.Enter)

	// It will keep polling until one selector has found a match
	page.Race().Element(".nav-user-icon-base").MustHandle(func(e *rod.Element) {
		// print the username after successful login
		fmt.Println(*e.MustAttribute("title"))
	}).Element("[data-cy=sign-in-error]").MustHandle(func(e *rod.Element) {
		// when wrong username or password
		panic(e.MustText())
	}).MustDo()
}
```
