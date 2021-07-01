# الشبكة

## طلبات Hijack

يمكنك استخدام Rod لخطف أي HTTP أو HTTPS حركة المرور.

عملية اختطاف واحدة برمتها هي:

```text
   المتصفح --req-> قضيب ---> خادم ---> قضيب --res-> المتصفح
```

عندما يريد المتصفح إرسال طلب إلى خادم، سوف يرسل الطلب إلى رود أولا، ثم سيتصرف Rod مثل وكيل لإرسال الطلب إلى الخادم الفعلي وإرجاع الرد إلى المتصفح. `--req->` و `--res->` هي الأجزاء التي يمكن تعديلها.

على سبيل المثال، لإستبدال ملف `اختبار.js` استجابة من الخادم يمكننا القيام بشيء مثل هذا:

```go
المتصفح := rod.New().MustConnect()

جهاز التوجيه := browser.Hijackrequests()

router.MustAdd("*/test.js", func(ctx *rod.Hijack) {
    ctx.MustLoadResponse()
    ctx.Response.SetBody(`console. og("ملف js تم تبديله")`)
})

اذهب إلى router.Run()

صفحة := browser.MustPage("https://test.com/")

// Hijack الطلبات تحت نطاق صفحة
page.Hijackrequests()
```

لمزيد من المعلومات، تحقق من [اختبارات الخطف](https://github.com/go-rod/rod/blob/master/hijack_test.go)
