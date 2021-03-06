# لماذا الغضب

هناك الكثير من المشاريع الرائعة، ولكن لا أحد يتصف بالكمال، يختار أفضل المشاريع التي تناسب احتياجاتك مهمة.

## مقارنة بالرموز الأخرى

### كرودب

من الناحية النظرية، ينبغي أن يؤدي رود أداء أسرع ويستهلك ذاكرة أقل من كروميدب.

[Chromedp][chromedp] يستخدم متصفح النظام بشكل افتراضي، ويمكن أن يسبب مشاكل إذا قمت بترقية المتصفح عن طريق الخطأ.

[Chromedp][chromedp] يستخدم [مخزن مؤقت ذي حجم ثابت](https://github.com/chromedp/chromedp/blob/b56cd66/target.go#L69-L73) للأحداث، يمكن أن يسبب قفل الطريق المسدود في العملة العالية. لأن Chromedp يستخدم حلقة حدث واحدة ، فإن معالجات الحدث البطيئة ستمنع بعضها البعض. Rod ليس لديه هذه المشكلات لأنه يعتمد على [goob](https://github.com/ysmood/goob).

سيفك كرودب JSON ترميز كل رسالة من المتصفح، القضيب هو فك شفرة عند الطلب، لذلك يعمل Rod بشكل أفضل، خاصة في أحداث الشبكة الثقيلة.

يستخدم Chromedp الجزء الثالث من WebSocket lib الذي يحتوي على [1MB على](https://github.com/chromedp/chromedp/blob/b56cd66f9cebd6a1fa1283847bbf507409d48225/conn.go#L43-L54) لكل عميل cdp ، إذا أردت التحكم في آلاف المتصفحات البعيدة يمكن أن تصبح مشكلة. بسبب هذا التقييد، إذا قمت بتقييم سكريبت js أكبر من 1 ميغابايت، سيتحطم Chromedp ، إليك مثال على مدى سهولة تحطم Chromedp: [gist](https://gist.github.com/ysmood/0d5b2c878ecbdb598776af7d3d305b79).

عندما يحدث تحطم، سيترك Chromedp عملية متصفح الزومبي على ويندوز وماك.

Rod أكثر قابلية للتكوين، مثل يمكنك حتى استبدال لعبة WebSocket باللوحة التي تحب.

للمقارنة بين التعليمات البرمجية المباشرة يمكنك التحقق [هنا](https://github.com/go-rod/rod/tree/master/lib/examples/compare-chromedp). إذا قمت بمقارنة المثال المسمى `منطق` بين [قضيب](https://github.com/go-rod/rod/tree/master/lib/examples/compare-chromedp/logic/main.go) و [كرومدب](https://github.com/chromedp/examples/blob/master/logic/main.go)، سوف تعرف مدى بساطة القضيب.

مع Chromedp، يجب عليك استخدام المهام الشبيهة بDSL في التعامل مع منطق البرمجة. يستخدم Chromedp عدة غلاف للتعامل مع التنفيذ مع السياق والخيارات، مما يجعل من الصعب جدا فهم تعليماتهم البرمجية عندما تحدث الأخطاء. الوجوه الشديدة الاستخدام تجعل الأنواع الثابتة عديمة الفائدة عند تتبع المشكلات. وعلى النقيض من ذلك، يستخدم رود أقل عدد ممكن من الوصلات البينية.

Rod لديه تبعيات أقل، وهيكل شفرات أبسط وأتمتة أفضل للاختبار. يجب أن تجد أنه من الأسهل المساهمة في البرمجة إلى رود. ولذلك فإن رود، بالمقارنة مع كرودب، لديها القدرة على أن يكون لها المزيد من الوظائف اللطيفة من المجتمع المحلي في المستقبل.

مشكلة أخرى في Chromedp هي معماريتهم المبنية على [DOM العقدة المعرف](https://chromedevtools.github.io/devtools-protocol/tot/DOM/#type-NodeId)، تعتمد الدمى والقضيب على [معرف الكائن البعيد](https://chromedevtools.github.io/devtools-protocol/tot/Runtime/#type-RemoteObjectId). ونتيجة لذلك، فهي ليست فقط [أبطأ](https://github.com/puppeteer/puppeteer/issues/2936) وتمنع أيضا كرودب من إضافة وظائف عالية المستوى مقترنة بوقت التشغيل. على سبيل المثال، هذه التذكرة [](https://github.com/chromedp/chromedp/issues/72) قد فتحت لمدة 3 سنوات. حتى بعد إغلاقه، لا يزال لا يمكنك تقييم التعبير js على العنصر داخل iframe. بالإضافة إلى ذلك، يحتفظ Chromedp بـ [نسخة](https://github.com/chromedp/chromedp/blob/e2970556e3d05f3259c464faeed1ec0e862f0560/target.go#L375-L376) من جميع العقد في الذاكرة. سيسبب حالة سباق بين قائمة NodeID المحلية و [DOM.documentUpdated](https://chromedevtools.github.io/devtools-protocol/tot/DOM/#event-documentUpdated)، مما قد يسبب مشاكل مربكة مثل [#762](https://github.com/chromedp/chromedp/issues/762).

### التلميذ

[الدمية][puppeteer] سيقوم JSON بفك شفرة كل رسالة من المتصفح، Rod هو فك الشفرة عند الطلب، لذلك من الناحية النظرية سوف يؤدي الرود أداء أفضل، خاصة لأحداث الشبكة الثقيلة.

مع الدمى ، يجب عليك التعامل مع الوعد/async/الانتظار كثيراً، مما يجعل تصميم واجهة أنيقة [بطلاقة](https://en.wikipedia.org/wiki/Fluent_interface) صعباً للغاية. إنهاء الاختبارات يتطلب الكثير من عمليات المزامنة لمحاكاة المدخلات البشرية، لأن التلميذ يعتمد على نوديجس جميع عمليات IO هي مكالمات ناسفة، لذلك عادةً ينتهي الناس إلى طباعة أطنان من الـ async/الانتظار. إذا نسيت كتابة `بانتظار`، فمن المؤلم عادة تصحيح التسرب من الوعد. تنمو النفقات العامة عندما ينمو مشروعك.

الرود هو نوع آمن بشكل افتراضي، ولديه تعليقات داخلية أفضل حول كيفية عمل رود نفسه. يحتوي على نوع من الارتباطات لجميع نقاط النهاية في بروتوكول Devtool.

سيقوم Rod بتعطيل أحداث النطاق كلما كان ذلك ممكناً، سيتمكن الدمى دائماً من تمكين جميع النطاقات. سوف تستهلك الكثير من الموارد عند قيادة متصفح بعيد.

Rod يدعم الإلغاء والمهلة بشكل أفضل، هذا يمكن أن يكون حاسم إذا كنت ترغب في التعامل مع الآلاف من الصفحات. على سبيل المثال، لمحاكاة `انقر فوق` علينا إرسال طلبات cdp الخادم، مع [وعود](https://stackoverflow.com/questions/29478751/cancel-a-vanilla-ecmascript-6-promise-chain) لا يمكنك تحقيق شيء مثل "إرسال نصف طلبات cdp فقط"، ولكن مع سياق [](https://golang.org/pkg/context/) يمكننا ذلك.

### مشاهدة

Rod and [Playwright](https://github.com/microsoft/playwright) نشرت لأول مرة تقريبا في نفس الوقت. وتبقى معظم المقارنات بين الرود والدمية صادقة مع برايت اللعب لأن كلا من الرايت والدمية يحافظ عليه نفس المساهمين تقريبا.

وكما قال Playwright في دوك "Playwright" الخاص بهم "Playwright يمكّن من إجراء اختبار موثوق من النهاية لتطبيقات الويب الحديثة". يركز المشروع على الاختبار. ولكن التركيز بالنسبة للرود أكثر عمومية، سواء بالنسبة للتشغيل الآلي للشبكة أو للتخريد، مما يجعل التصميم أكثر تركيزا على المرونة والأداء.

ويتمثل أحد أهداف الرود المعمارية في تيسير مساهمة الجميع وجعله مشروعا مجتمعيا محضا، هذا أحد الأسباب الكبيرة التي جعلتني اخترت جولانغ ورخصة معهد ماساتشوستس للتكنولوجيا. نوع سكريبت هو خيار جميل، ولكن إذا قمت بالتحقق من خيارات تصميم Playwright، [`أي`](https://www.typescriptlang.org/docs/handbook/basic-types.htmvl#any) و [أنواع النقابات](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html#union-types) في كل مكان، إذا حاولت القفز إلى التعليمات البرمجية المصدرية في صفحة [. اضغط](https://playwright.dev/#version=v1.6.2&path=docs%2Fapi.md&q=pageclickselector-options)، `d.ts` ملفات ستسمح لك بفهم حقيقة الطباعة النصية . ومن المؤكد أن جولانغ ليس جيداً بما فيه الكفاية، ولكنه عادة ما يقدم ديناً تقنياً أقل من العقدة. s طابع, إذا كنت تريد مني أن أختار أي واحد لاستخدامه لجودة الجودة أو إنفرا غير مألوف في البرمجة لأتمتة الاختبار من النهاية إلى النهاية أو مراقبة الموقع. سأختار جولانغ.

وجهودهم لتقديم الدعم عبر المتصفحين مذهلة. لكن هذه الأيام، HTML5 تم تبنيها بشكل جيد من قبل العلامات التجارية الرئيسية، من الصعب القول بأن التعقيد الذي يجلبه يمكن أن يوزن الفوائد. هل سيصبح [التصحيحات عبر المتصفح](https://github.com/microsoft/playwright/tree/master/browser_patches) عبئا في المستقبل؟ مشاكل الأمان للمتصفحات المصححة مصدر قلق آخر. كما أنه يجعل من الصعب اختبار الإصدارات القديمة من فايرفوكس أو سفاري. آمل أنه ليس مبالغة في الهندسة.

### Selenium

[سيلنيوم](https://www.selenium.dev/) يعتمد على [بروتوكول محرك الويب](https://www.w3.org/TR/webdriver/) الذي يحتوي على وظائف أقل بكثير مقارنة بـ [بروتوكول ديفيد](https://chromedevtools.github.io/devtools-protocol). مثل أنه لا يستطيع التعامل مع [الظل المغلق](https://github.com/sukgu/shadow-automation-selenium/issues/7#issuecomment-563062460). لا توجد طريقة لحفظ الصفحات كـ PDF. لا يوجد دعم لأدوات مثل [الملف الشخصي](https://chromedevtools.github.io/devtools-protocol/tot/Profiler/) أو [الأداء](https://chromedevtools.github.io/devtools-protocol/tot/Performance/)، إلخ.

أصعب من إعداد وصيانة بسبب تبعيات إضافية مثل مشغل المتصفح.

على الرغم من أن السيلينيوم يبيع نفسه لدعم أفضل عبر المتصفح، من الصعب جداً جعله يعمل لجميع المتصفحات الرئيسية.

هناك الكثير من المقالات حول "السيلينيوم ضد الدمى "، يمكنك التعامل مع القضيب كنسخة من الجولانغ للتلميذ.

### ضغطة

[Cypress](https://www.cypress.io/) محدود جداً، لأن مملكة الظل المغلقة أو إطارات ifraain المغلقة يكاد يكون غير قابل للاستخدام. اقرأ [الحد الأدنى](https://docs.cypress.io/guides/references/trade-offs.html) للمزيد من التفاصيل.

إذا كنت ترغب في التعاون معنا لإنشاء قاعدة إطارية للاختبار تركز على الرب للتغلب على قيود السيبرس، يرجى الاتصال بنا.

## ماذا يعني الرود

Rod هو اسم جهاز التحكم للدمى ، مثل عصا بني في الصورة أدناه:

![قضيب](https://user-images.githubusercontent.com/1415488/80178856-31cd8880-863a-11ea-83e9-64f84be3282d.png ":size=200")

والمعنى هو أننا الدمى ، المتصفح هو الدمية ، نحن نستخدم القضيب للتحكم في الدمية .

[chromedp]: https://github.com/chromedp/chromedp
[puppeteer]: https://github.com/puppeteer/puppeteer
