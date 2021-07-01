# الأحداث

الأحداث هي أفعال أو أحداث تحدث في المتصفح الذي تتحكم فيه، الذي يخبرك به المتصفح حتى تتمكن من الرد عليها بطريقة ما إذا رغبت في ذلك. مثل عندما نسمح للصفحة بالتنقل إلى عنوان URL جديد، يمكننا الاشتراك في الأحداث لمعرفة متى اكتمل التنقل أو متى تم تقديم الصفحة.

## انتظر حدث مرة واحدة

دعونا نحاول الانتقال إلى صفحة والانتظار حتى تصبح شبكة الصفحة شبه خاملة:

```go
تمسك الرئيسي() {
    صفحة := rod.New().MustConnect().MustPage()

    انتظر := page.MustWaitNavigation()
    page.MustNavigate("https://www.wikipedia.org/")
    wait()
}
```

نحن نستخدم `MustWaitNavigation` للاشتراك في حدث الخمول عن الشبكة. السبب في أن الاشتراك قبل التنقل ليس بعد أن يكون لأن التعليمة البرمجية لتفعيل التنقل ستستغرق وقتاً لتنفيذها، خلال ذلك الوقت ربما يكون الحدث قد حدث بالفعل. بعد `MustNavigate` نتصل بدالة `الانتظار` لحجب التعليمات البرمجية حتى يحدث حدث الخمول التالي للشبكة .

يوفر Rod الكثير من مساعدي الأحداث الآخرين، جميع أسماء الدالة مسبقة مع `MustWit` أو `انتظر`.

## احصل على تفاصيل الحدث

بعض أنواع الأحداث تحمل تفاصيل عن الحدث نفسه. مثل الانتقال إلى عنوان URL واستخدام الحدث للحصول على رمز حالة الاستجابة لطلب التنقل:

```go
تمسك main() {
    صفحة := rod.New().MustConnect().MustPage()

    e := proto.NetworkResponsereceieived{}
    الانتظار := page.WaitEvent(&e)
    page.MustNavigate("https://www.wikipedia.org/")
    wait()

    fmt.Println', Response.Status)
}
```

## التعامل مع أحداث متعددة

إذا كنت ترغب في التعامل مع جميع الأحداث من نوع ما، مثل الاستماع لجميع أحداث إخراج وحدة التحكم في الصفحة، يمكننا القيام بشيء مثل هذا:

```go
انتقل إلى page.EachEvent(funct(e *proto.RuntimeConsoleAPICalled) {
    fmt.Println(page.MustObjectsToJSON<unk> Args))
})()
```

للاشتراك بأنواع متعددة من الأحداث في نفس الوقت، مثل الاشتراك `RuntimeConsoleAPICalled` و `PageLoadEventFired`:

```go
انتقل إلى page.EachEvent(funct(e *proto.RuntimeConsoleAPICalled) {
    fmt.Println(page.MustObjectsToJSON<unk> Args))
}, function(e *proto.PageLoadEventFired) {
    fmt.Println("loadaded")
})()
```

## إيقاف الاشتراك

أي دالة في Rod يمكن إلغاء الكتل مع السياق [](context-and-timeout.md)، إنها ليست خاصة للأحداث. بالإضافة إلى ذلك، يمكنك أيضا إيقاف الحدث عن طريق إعادة الصحيح من معالج الحدث، على سبيل المثال:

```go
انتظر := page.EachEvent(funct(e *proto.PageLoadEventFired) (إيقاف bool) {
    return true
})
page.MustNavigate("https://example.com")
wait()
```

إذا لم نعود صحيحًا، فالانتظار سيبقى في انتظار `أحداث PageLoadEventFired` وحظر البرنامج إلى الأبد. هذه في الواقع هي التعليمات البرمجية لكيفية عمل `الصفحة.WaitEven`.

## الأحداث المتاحة

جميع أنواع الأحداث تنفذ واجهة `المبدئي.الحدث` ، يمكنك استخدامها للعثور على جميع الأحداث. عادةً ما تقوم قاعدة البيانات بالتصفية تلقائيًا بتصفية الواجهة. مثل ما نريد أن نرى جميع الأحداث تحت نطاق الصفحة، يمكننا إنشاء عنصر صفحة فارغة واستخدام `WaitEvent(proto). vent)` لقائمة وتصفية جميع أنواع الأحداث مثل لقطة الشاشة أدناه:

![قائمة الأحداث](event-list.png)

يمكنك أيضا استخدام هذا الموقع [](https://chromedevtools.github.io/devtools-protocol/tot/Page) لتصفح الأحداث.
