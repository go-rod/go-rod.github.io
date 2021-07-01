# المتصفحات & الصفحات

من البديهي استخدام Rod للتحكم في العديد من المتصفحات أو الصفحات في نفس الوقت.

## متصفحات متعددة

لبدء متصفحات متعددة:

```go
المتصفح1 := rod.New().MustConnect()
المتصفح2 := rod.New().MustConnect()
```

جميع واجهات برمجة التطبيقات آمنة للموضوع، نفس الأعمال لتعدد الروتينيات.

يمكنك أيضا استخدام وضع التخفي لتشغيل متصفحات متعددة:

```go
المتصفح1 := rod.New().MustConnect()
المتصفح2 := المتصفح.MustIncognito()
```

تشغيل المتصفحات مع حجج تشغيل مختلفة:

```go
المتصفح1 := rod.New().ControlURL(
    launcher.New().Headless(false).MustLaunch()
).MustConnect()

المتصفح1 := rod.New().ControlURL(
    launcher.New().UserDataDir("path").MustLaunch()
).MustConnect()
```

## صفحات متعددة

للتحكم في صفحات متعددة للمتصفح:

```go
المتصفح := rod.New().MustConnect()
صفحة 1 := المتصفح.MustPage("http://a.com")
صفحة 2 := المتصفح.MustPage("http://b.com")
```

## مخزن الصفحات

يمكننا استخدام PagePool للمساعدة في نفس الوقت في التحكم في الصفحات وإعادة استخدامها.

تحقق من هذا [المثال](https://github.com/go-rod/rod/blob/46baf3aad803ed5cd8671aa325cbae4e297a89a4/examples_test.go#L533)

## مخزن المتصفح

والاختبارات في رود مثال جيد على إدارة مجموعة من المتصفحات لتشغيل الاختبارات في نفس الوقت. لهذا السبب يمكن أن تنتهي الاختبارات في ثوان. تحقق من الكود [هنا](https://github.com/go-rod/rod/blob/46baf3aad803ed5cd8671aa325cbae4e297a89a4/setup_test.go#L59).
