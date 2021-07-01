# الصياغة

يوفر رود طرقا مختلفة لمحاكاة البيئة للصفحات.

## الأجهزة

لتعيين طريقة العرض، وكيل المستخدم، التوجيه، إلخ في نفس الوقت لصفحة ما، يمكنك استخدام الأجهزة المحددة مسبقاً:

```go
page.MustEmulate(devices.IPhone6or7or8Plus)
```

أو حدد جهازك الخاص:

```go
page.MustEmulate(أجهزة). evice{
  العنوان: "iPhone 4",
  القدرات: []السلسلة{"touch", "متنقل"}،
  وكيل المستخدم: "Mozilla/5. (iPhone; CPU iPhone OS 7_1_2 مثل Mac OS X)",
  قبول اللغة: "en",
  الشاشة: الأجهزة. إنشاء
    DevicePixelRatio: 2,
    أفقي: أجهزة. حجم الإنشاء{
      Width:  480,
      Height: 320,
    },
    عمودي: أجهزة.شاشة{
      Width:  320,
      Height: 480,
    },
  },
})
```

تحقق من رمز المصدر للأجهزة المحددة مسبقاً، يجب أن تفسر الحقول نفسها بنفسها.

يمكنك أيضا تعيين الجهاز الافتراضي لجميع الصفحات باستخدام [Browser.DefaultDevice](https://pkg.go.dev/github.com/go-rod/rod#Browser.DefaultDevice).

يتم تنشيط الصياغة بشكل افتراضي (باستخدام [الأجهزة. جهاز aptopWithMDPISen](https://github.com/go-rod/rod/blob/bc44c39c9b4352c15d00bef6f6a1071205d2c388/lib/devices/list.go#L616) )، الذي يتجاوز بعض إعدادات المتصفح الافتراضية، والذي هو أفضل من حيث الاتساق (أي أنه يساعد على إعادة إنتاج الاختبارات).

يمكنك تعطيل خاصية محاكاة الجهاز تمرير جهاز _مسح_ الخاص إلى `Browser.DefaultDevice`.

```go
المتصفح.DefaultDevice(devices.clear)
```

أو يمكنك فقط استخدام [Browser.NoDefaultDevice](https://pkg.go.dev/github.com/go-rod/rod#Browser.NoDefaultDevice) المساعد.

## وكيل المستخدم

إذا كنت ترغب في تحديد وكيل المستخدم لصفحة محددة، استخدم [Page.SetUserAgent](https://pkg.go.dev/github.com/go-rod/rod#Page.SetUserAgent).

## مشاهدة

إذا كنت ترغب في تحديد طريقة العرض لصفحة محددة، استخدم [Page.SetViewport](https://pkg.go.dev/github.com/go-rod/rod#Page.SetViewport).

## المحلية والمنطقة الزمنية

يمكنك استخدام تشغيل env لتعيين جميع الصفحات:

```go
u := launcher.New().Env("TZ=America/New_York").MustConnect()
المتصفح := rod.New().ControlURL(u).MustConnect()
```

أو يمكنك استخدام [EmulationSetTimezoneOverride](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetTimezoneOverride) أو [EmulationSetLocaleOverride](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetLocaleOverride) لتعيين صفحة معينة:

```go
المبدئي.EmulationSetTimezoneOverride{TimezoneID: "America/New_York"}.Call(صفحة)
```

## الأذونات

استخدم [تصاريح المتصفح](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#BrowserGrantPermissions)

## تحديد الموقع

استخدم [EmulationSetGeolocationOverride](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetGeolocationOverride)

## نظام الألوان والوسائط

استخدم [EmulationSetEmulatedMedia](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetEmulatedMedia)

```go
المبدئي.EmulationSetEmulatedMedia{
    الوسائط: "الشاشة"،
    الميزات: []*proto.EmulationMediaFeature{
        {"تفضيل ألوان-scheme"، "dark"},
    },
}.Call(صفحة)
```

## منع اكتشاف البوت

عادة ما يكون من الأفضل جعل المتصفح الذي لا رأسه شفافاً تماماً للصفحة بحيث لا تستطيع الصفحة معرفة ما إذا كان يتحكم فيه إنسان أو روبوت. في بعض الحالات، يمكن لبعض الصفحات استخدام js العميل للكشف عما إذا كانت الصفحة يتحكم فيها إنسان أو روبوت، مثل عناوين ويب WebGL، أو WebDoperver، أو ألعاب الطلبات. يمكنك تصنيع لعبة js لإخفاء جميع التأثير، أو فقط استخدام لفظ [السرقة](https://github.com/go-rod/stealth): [مثال التعليمات البرمجية](https://github.com/go-rod/stealth/blob/master/examples_test.go).

إذا لم يعمل لك `الستيك` ، يمكنك فقط تشغيل متصفح المستخدم العادي مع `مشغل. وضع ewUserMode`: [وضع المستخدم](custom-launch.md?id=user-mode).

يمكنك استخدام أدوات مثل [https://bot.sannysoft.com](https://bot.sannysoft.com) لاختبار الإعدادات الخاصة بك.

## بصمة المتصفح

بصمة المتصفح ليست كشف بوت يستخدم عدة خدع لجمع سمات فريدة من نوعها للمتصفح لتحديد المتصفحات. يمكن للموقع أن يستخدمه لتتبع المستخدمين حتى عندما لا يتم تسجيل دخولهم، فإنه يستخدم أيضا على نطاق واسع لوضع علامات على ناطحات بلا رأس. على سبيل المثال، عادة ما يقوم مستخدمون مختلفون بتثبيت خطوط مختلفة على نظام التشغيل الخاص بهم، يمكننا استخدام هذا للتمييز بين مستخدمين مختلفين. مثال آخر هو استخدام الكانفاس لتقديم النصوص، وعادة ما يكون لدى مستخدمين مختلفين وحدات عالمية مختلفة، سائقو الرسوم البيانية أو برمجيات المصدر المفتوح، سيؤثرون جميعا على نتيجة الصورة المقدمة.

عادة يمكنك تشغيل العديد من نماذج المتصفح للحصول على بصمات أصابع مختلفة. إذا كنت ترغب في استخدام متصفح واحد لحفظ الذاكرة والمعالج ، يجب عليك تجاوز واجهة برمجة التطبيقات يدوياً للقماش والخطوط، إلخ.

يمكنك استخدام مشاريع مفتوحة المصدر مثل [الأصابع](https://github.com/fingerprintjs/fingerprintjs/) لاختبار الإعدادات الخاصة بك.
