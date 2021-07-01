# التوافق

## نظام التشغيل

يجب أن تكون قادراً على تجميع وتشغيل رود بسلاسة على جميع المنصات الرئيسية التي يدعمها جولانغ. في بعض المنصات، قد تحتاج إلى تثبيت المتصفح يدوياً، لا يمكن لـ Rod ضمان أن يعمل المتصفح الذي يتم تنزيله تلقائياً دائماً. إذا كنت تريد أن يدعم رود منصة ، يرجى إثارة مشكلة لها.

من السهل جداً جوجل كيفية تثبيت المتصفح على النظام الخاص بك، على سبيل المثال على Ubuntu أو Debian سوف تجد شيئا مثل هذا لتثبيت المتصفح:

```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
تثبيت apt ./google-chrome-stable_current_amd64.deb
```

في المركز:

```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm
yum localinstall -y google-chrome-stable_current_x86_64.rpm
```

على جبال الألبين:

```bash
إضافة كروميوم apk
```

## المتصفحات المدعومة

يجب أن يعمل Rod مع أي متصفح يدعم [بروتوكول DevTools](https://chromedevtools.github.io/devtools-protocol/).

- ميكروسوفت إيدج مدعوم.
- فايرفوكس [يدعم](https://wiki.mozilla.org/Remote) هذا البروتوكول.
- سفاري ليس لديها أي خطة لدعمها حتى الآن.
- لن يدعمها IE.

## إصدار بروتوكول المتصفح و cdp

بروتوكول cdp هو دائماً نفس [launcher.DefaultReview](https://pkg.go.dev/github.com/go-rod/rod/lib/launcher#DefaultRevision). إذا لم يتمكن Rod من العثور على متصفحك المحلي، فإنه سيقوم بتنزيل نسخة المتصفح من `المشغل.DefaultReview`.

كل إصدار من Rod يضمن فقط العمل مع `launcher.DefaultReview` من المتصفح.

## API Versioning

[الفصل الدراسي](https://semver.org/) يستخدم

قبل `v1.0.0` كلما تغير القسم الثاني، مثل `v0.1.0` إلى `v0. .0`، يجب أن تكون هناك بعض التغييرات العامة في API ، مثل تغيير أسماء الدوال أو أنواع البارامترات. إذا تغير القسم الأخير فقط، لن يتغير أي واجهة برمجة التطبيقات العامة.

يمكنك استخدام مقارنة إصدار Github's لرؤية سجل التغييرات الآلي، على سبيل المثال، [قارن v0.75.2 مع v0.76.0](https://github.com/go-rod/rod/compare/v0.75.2...v0.76.0).

## إصدار مرجع API

انتقل إلى [هنا](https://pkg.go.dev/github.com/go-rod/rod?tab=versions).

## إصدار موقع Doc

نحن نستخدم github لإدارة المستند ، من السهل عرض أي نسخة من الوثيقة:

1. استنساخ مستودع الـ doc [](https://github.com/go-rod/go-rod.github.io.git)
2. قم بالدفع إلى الالتزام القريب من تاريخ الإصدار من الإصدار Rod الذي تريده
3. تثبيت [docsify-cli](https://docsify.js.org/#/quickstart)
4. في جذر ريبو الذي تم تشغيله `docsify Service -o`
