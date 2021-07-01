# موارد الصفحة

يمكنك استخدام طريقة `Page.GetResource` للحصول على الملفات من هنا:

![موارد الصفحة](page-resources.png)

مثل الحصول على صورة:

```go
bin، خطأ := page.GetResource("https://test.com/a.png")
```

## مصدر العنصر

يمكنك أيضا استخدام طريقة `Element.Resource` للحصول على ملف السمة `src`. مثل العنصر `<img src="a.jpg">`، يمكنك استخدام التعليمة البرمجية مثل هذا للحصول على `a.jpg`:

```go
بن := page.MustElement("img").MustResource()
```
