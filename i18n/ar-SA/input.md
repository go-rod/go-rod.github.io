# Input

يوفر Rod الكثير من الطرق لمحاكاة المدخلات البشرية، مثل النقر فوق الماوس أو الصحافة على لوحة المفاتيح.

## انقر فوق الفأرة

لمحاكاة الماوس انقر فوق عنصر:

```go
// left click
page.MustElement("button").MustClick()

// right click
page.MustElement("button").Click(proto.InputMouseButtonRight)
```

## Text input

لمحاكاة المدخلات:

```go
el := page.MustElement(`[type="text"]`)
el.MustInput("جاك")

fmt.Println(el.MustText()) // استخدم MustText للحصول على النص
```

## إزالة النص من الإدخال

فقط محاكاة كيف يقوم الإنسان بذلك، حدد كل النص واستبداله بسلسلة فارغة:

```go
page.MustElement(`[type="text"]`).MustSelectAllText().MustInput("")
```

يمكنك استخدام `SelectText` لاستبدال جزء من النص.

## إدخال الوقت

أنواع الإدخال المدعومة هي [تاريخ](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date)، [تاريخ الوقت المحلي](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local)، [شهر](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/month)، و [الوقت](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time).

```go
page.MustElement(`[type="date"]`).MustInputTime(time.Now())
```

## خانة

فقط انقر عليها كإنسان:

```go
el := page.MustElement(`[type="checkbox"]`)

// تحقق منها إذا لم يتم التحقق
إذا كان !el.MustProperty("checked").Bool() {
    el.MustClick()
}
```

## حدد الخيارات

حدد الخيارات في [`<select>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select).

سيقوم الرمز أدناه بتحديد الخيارات التي تحتوي على النص "B" أو "C":

```go
page.MustElement("elect").MustSelect("B", "C")
```

يمكنك أيضًا استخدام regex أو css المحدد لتحديد الخيارات:

```go
page.MustElement("select").Select([]string{`^B$`}, true, rod.SelectorTypeRegex)

// تعيين خطأ لإلغاء تحديد
الصفحة MustElement("elect").Select([]string{`[value="c"]`}, false, rod.SelectorTypeCSSSector)
```

## تعيين الملفات

استخدم `إعدادات الملفات` لتعيين الملفات لـ [إدخال الملفات](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file):

```go
pag.MustElement(`[type=file]`).MustSetFiles("a.jpg", "b.pdf")
```

## الفأرة ولوحة المفاتيح ولمس

يمكنك أيضًا استخدام `page.Mouse`أو `page.Keyboard`أو `page.Touch` لمحاكاة المدخلات ذات المستوى المنخفض. مثل يمكنك البحث عن اختبار الوحدة للسحب لتعلم كيفية محاكاة السحب.
