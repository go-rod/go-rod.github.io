# تشغيل متصفح مخصص

## الاتصال بمتصفح قيد التشغيل

ابحث عن المسار القابل للتنفيذ للمتصفح الخاص بك، مثل تشغيل macOS:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --Remote-debugging-port=9222
```

وستنتج شيئا من هذا القبيل:

```txt
تستمع الأدوات على العنوان التالي: w://127.0.0.1:9222/devtools/browser/4dcf09f2-ba2b-463a-8ff5-90d27c6c913
```

`ws://127.0.0.1:9222/devtools/browser/4dcf09f2-ba2b-463a-8ff5-90d27c6cc913` هو واجهة التحكم في المتصفح:

```go
استيراد الحزمة الرئيسية

(
    "github.com/go-rod/rod"
)

func main() {
    u := "ws://127.0.0.1:9222/devtools/browser/4dcf09f2-ba2b-463a-8ff5-90d27c6cc913"
    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

## لوحة المشغل

نظرًا لأن سير العمل أعلاه يتم استخدامه في كثير من الأحيان، فإننا نلخص `مشغل` لتبسيط إطلاق المتصفحات. مثل التحميل التلقائي أو البحث عن الجهاز التنفيذي للمتصفح، إضافة أو حذف حجج سطر الأوامر التنفيذي للمتصفح، إلخ.

لذا يصبح الإطلاق اليدوي والشفرة المذكورة أعلاه:

```go
تموج main() {
    u := launcher.New().Bin("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome").MustLaunch()
    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")

```

يمكننا استخدام وظيفة المساعد `المشغل.LookPath` للحصول على المسار التنفيذي للمتصفح، الرمز أعلاه هو نفسه:

```go
func main() {
    المسار _ := launcher.LookPath()
    u := launcher.New().Bin(path).MustLaunch()
    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

إذا لم يتم تعيين `ControlURL` ، سيتم تشغيل `MustConnect` `launcher.New().MustLaunch()` تلقائيا. بشكل افتراضي، سيقوم المشغل تلقائياً بتنزيل واستخدام متصفح محمول بشكل ثابت حتى يكون سلوك المتصفح متسقاً. لذا يمكنك تبسيط التعليمات البرمجية أعلاه في:

```go
تمرين الرئيسي() {
    rod.New().MustConnect().MustPage("https://example.com")
}
```

## إضافة أو إزالة الخيارات

يمكنك استخدام `مجموعة` و `حذف` لتعديل حجج تشغيل المتصفح (الأعلام):

```go
استيراد الحزمة الرئيسية

(
    "github.com/go-rod/rod"
    "github.com/go-rod/rod/lib/launcher
)

func main() {
    u := launcher.New.
        Set("userer-data-dir", "path").
        الإعداد("بدون رأس").
        حذف("--بدون رأس").
        MustLaunch()

    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

كما ترون من أعلى `--` البادئة اختيارية، مثل `بلا رأس` و `--بلا رأس` هي نفسها.

لأن الخيارات مثل `المستخدم-البيانات-dir`، `بروكسي-سيرفر`، `لا رأس` غالبا ما يتم استخدامها، أضفنا بعض المساعدين لهم، لذلك يمكن أن تصبح التعليمات البرمجية أعلاه مثل هذا:

```go
تمسك الرئيسي() {
    u := launcher.New.
        UserDataDir("path").
        هلا (صحيح).
        هيرمينيس (مزيف).
        MustLaunch()

    rod.New().ControlURL(u).MustConnect().MustPage("https://example.com")
}
```

فيما يلي الأعلام المتاحة: [رابط](https://peter.sh/experiments/chromium-command-line-switches).

اقرأ API doc لمزيد من المعلومات: [رابط](https://pkg.go.dev/github.com/go-rod/rod/lib/launcher#Launcher).

## إدارة المشغل عن بعد

في نظام خردة الإنتاج، عادةً، سنقوم بتقسيم الناطحات والمتصفحات إلى مجموعات مختلفة بحيث يمكن قياسها بشكل منفصل. يوفر Rod الوحدة النمطية `مشغل .Manager` لإدارة المشغل عن بعد. مع ذلك يمكننا تشغيل متصفح عن بعد مع أعلام الإطلاق المخصصة. المثال لاستخدامه هو [هنا](https://github.com/go-rod/rod/blob/master/lib/launcher/rod-manager/main.go).

لأنه من الصعب جداً تثبيت الكروم بشكل صحيح على بعض توزيعات لينوكس، يوفر رود صورة مرفأ لجعله متماسكاً عبر المنصات. إليك مثال لاستخدامه:

1. تشغيل صورة القضيب `docker تشغيل -p 7317:7317 ghcr.io/go-rod/rod`

2. افتح محطة طرفية أخرى وقم بتشغيل التعليمات البرمجية مثل هذا المثال [](https://github.com/go-rod/rod/blob/master/lib/examples/launch-managed/main.go)

الصورة [تم ضبطها](https://github.com/go-rod/rod/blob/master/lib/docker/Dockerfile) لقطات الشاشة والخطوط بين اللغات الطبيعية الشائعة. ويمكن لكل حاوية أن تطلق متصفحات متعددة في نفس الوقت.

## وضع المستخدم :id=user-mode

عند تسجيل الدخول إلى حساب github الخاص بك، تريد إعادة استخدام جلسة تسجيل الدخول لمهمة التشغيل الآلي. يمكنك استخدام `مشغل .NewUserMode` لتشغيل متصفح المستخدم العادي الخاص بك. سيكون الرود مثل ملحق المتصفح:

```go
wsURL := launcher.NewUserMode().MustLaunch()
المتصفح := rod.New().ControlURL(wsURL).MustConnect().NoDefaultDevice()
```

إليك مثال أكثر تفصيلاً: [مثال التعليمات البرمجية](https://github.com/go-rod/rod/blob/master/lib/examples/use-rod-like-chrome-extension/main.go).

## API مستوى منخفض

إذا كنت ترغب في التحكم في كل خطوة من عملية الإطلاق، مثل تعطيل التحميل التلقائي واستخدام المتصفح الافتراضي للنظام، تحقق من [مثال الملف](https://github.com/go-rod/rod/blob/master/lib/launcher/example_test.go).
