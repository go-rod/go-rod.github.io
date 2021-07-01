# Por qué Barra

Hay muchos proyectos grandes, pero nadie es perfecto, elija el mejor que se ajuste a sus necesidades es importante.

## Comparado con otras librerías

### Chromedp

Teóricamente, Rod debería realizar más rápido y consumir menos memoria que Chromedp.

[Chromedp][chromedp] utiliza el navegador del sistema por defecto, puede causar problemas si actualiza accidentalmente el navegador.

[Chromedp][chromedp] utiliza un buffer [de tamaño fijo](https://github.com/chromedp/chromedp/blob/b56cd66/target.go#L69-L73) para eventos, puede causar bloqueo en alta concurrencia. Debido a que Chromedp usa un solo circuito de eventos, los controladores de eventos lentos se bloquearán mutuamente. Rod no tiene estos problemas porque se basa en [goob](https://github.com/ysmood/goob).

Chromedp decodificará cada mensaje del navegador, la barra es decodificada a la demanda, por lo que Rod funciona mejor, especialmente para eventos de red pesados.

Chromedp utiliza lib WebSocket de tercera parte, que tiene [1MB de sobrecarga](https://github.com/chromedp/chromedp/blob/b56cd66f9cebd6a1fa1283847bbf507409d48225/conn.go#L43-L54) para cada cliente de cdp, si quieres controlar miles de navegadores remotos, puede convertirse en un problema. Debido a esta limitación, si evalúa un script js mayor de 1MB, Chromedp se bloqueará, aquí hay un ejemplo de lo fácil que puedes bloquear a Chromedp: [gist](https://gist.github.com/ysmood/0d5b2c878ecbdb598776af7d3d305b79).

Cuando se produce un accidente, Chromedp abandonará el proceso del navegador zombie en Windows y Mac.

Rod es más configurable, como puede incluso reemplazar la librería WebSocket con la librería que desee.

Para comparar el código directo, puede consultar [aquí](https://github.com/go-rod/rod/tree/master/lib/examples/compare-chromedp). Si compara el ejemplo llamado `lógica` entre [varilla](https://github.com/go-rod/rod/tree/master/lib/examples/compare-chromedp/logic/main.go) y [chromedp](https://github.com/chromedp/examples/blob/master/logic/main.go), averiguará lo simple que es la vara.

Con Chromedp, tienes que usar sus tareas detalladas como DSL para manejar la lógica del código. Chromedp utiliza varios envoltorios para manejar la ejecución con contexto y opciones, lo que hace muy difícil entender su código cuando ocurren errores. Las interfaces altamente usadas hacen que los tipos estáticos sean inútiles al rastrear problemas. En contraste, Rod utiliza el menor número de interfaces posible.

Rod tiene menos dependencias, una estructura de código más simple, y una mejor automatización de pruebas. Deberías encontrar más fácil contribuir con código a Rod. Por lo tanto en comparación con Chromedp, Rod tiene el potencial de tener funciones más agradables de la comunidad en el futuro.

Otro problema de Chromedp es su arquitectura se basa en [DOM node id](https://chromedevtools.github.io/devtools-protocol/tot/DOM/#type-NodeId), puppeteer y varilla se basan en [id de objeto remoto](https://chromedevtools.github.io/devtools-protocol/tot/Runtime/#type-RemoteObjectId). En consecuencia, no solo es [lento](https://github.com/puppeteer/puppeteer/issues/2936) y también evita que Chromedp agregue funciones de alto nivel que estén acopladas al tiempo de ejecución. Por ejemplo, este [ticket](https://github.com/chromedp/chromedp/issues/72) había abierto por 3 años. Incluso después de que esté cerrado, todavía no puede evaluar js expreso en el elemento dentro de un iframe. Además, Chromedp mantiene una [copia](https://github.com/chromedp/chromedp/blob/e2970556e3d05f3259c464faeed1ec0e862f0560/target.go#L375-L376) de todos los nodos en la memoria. Causará la condición de carrera entre la lista local de NodeID y [DOM.documentUpdated](https://chromedevtools.github.io/devtools-protocol/tot/DOM/#event-documentUpdated), lo que puede causar problemas confusos como [#762](https://github.com/chromedp/chromedp/issues/762).

### Títere

[Puppeteer][puppeteer] descifrará JSON cada mensaje del navegador, Rod es decode-on-demand, por lo que teóricamente Rod actuará mejor, especialmente para eventos de red pesada.

Con bombeador, tienes que manejar promise/async/await a muchos, esto hace que el elegante diseño de la interfaz [fluent](https://en.wikipedia.org/wiki/Fluent_interface) sea muy difícil. Las pruebas de fin a fin requieren muchas operaciones de sincronización para simular entradas humanas, porque Puppeteer está basado en Nodejs todas las operaciones IO son llamadas asíncronas, por lo que normalmente la gente termina escribiendo toneladas de asíncrono/espera. Si te olvidas de escribir una `espera`, normalmente es doloroso depurar la Promise. La sobrecarga crece cuando su proyecto crece.

Rod es seguro de tipo por defecto y tiene mejores comentarios internos sobre cómo funciona Rod. Tiene enlaces de tipo para todos los extremos en el protocolo Devtools.

Rod desactivará los eventos de dominio siempre que sea posible, puppeteer siempre habilitará todos los dominios. Consumirá muchos recursos al conducir un navegador remoto.

Rod soporta la cancelación y el tiempo de espera mejor, esto puede ser crítico si desea manejar miles de páginas. Por ejemplo, para simular `haga clic en` tenemos que enviar solicitudes de cdp serval, con [Promise](https://stackoverflow.com/questions/29478751/cancel-a-vanilla-ecmascript-6-promise-chain) no puede conseguir algo como "sólo enviar la mitad de las solicitudes de cdp", pero con el [contexto](https://golang.org/pkg/context/) que podemos.

### Jugador

Rod y [Playwright](https://github.com/microsoft/playwright) fueron publicados por primera vez casi al mismo tiempo. La mayoría de las comparaciones entre Rod y Puppeteer siguen siendo fieles a Playwright, porque tanto Playwright como el Puppeteer son mantenidos por casi los mismos colaboradores.

Como Playwright afirmó en su doc "Playwright permite pruebas fiables de extremo a extremo para aplicaciones web modernas", el enfoque del proyecto es probar. Pero el enfoque para Rod es más general, tanto para la automatización web como para el raspado, lo que hace que el diseño se centre más en la flexibilidad y el rendimiento.

Uno de los objetivos arquitectónicos de Rod es hacer que sea más fácil para todos contribuir y convertirlo en un proyecto puramente comunitario, es una de las razones por las que elegí Golang y la licencia del MIT. Typescript es una buena opción, pero si revisas las opciones de diseño de Playwright, [`cualquier`](https://www.typescriptlang.org/docs/handbook/basic-types.htmvl#any) y [tipos de unión](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html#union-types) están en todas partes, si intenta saltar al código fuente de la página [. lick](https://playwright.dev/#version=v1.6.2&path=docs%2Fapi.md&q=pageclickselector-options), `d.ts` archivos te permitirán entender la realidad del typescript. Golang definitivamente no es lo suficientemente bueno, pero normalmente introduce menos deuda tecnológica que nodo. tipografía s, si quieres que elija cuál utilizar para QA o Infra que no esté familiarizado con la codificación para automatizar pruebas de punto a extremo o monitoreo de sitio, Yo elegiría a Golang.

Su esfuerzo de soporte entre navegadores es fabuloso. Pero hoy en día, HTML5 está bien adoptado por las principales marcas, es difícil decir que la complejidad que trae puede pesar los beneficios. ¿Se convertirán los parches [del navegador cruzado](https://github.com/microsoft/playwright/tree/master/browser_patches) en una carga en el futuro? Los problemas de seguridad para los navegadores parcheados es otra preocupación. También hace difícil probar versiones antiguas de Firefox o Safari. Esperemos que no sea un exceso de ingeniería.

### Selenium

[Selenium](https://www.selenium.dev/) se basa en [protocolo de controlador web](https://www.w3.org/TR/webdriver/) el cual tiene muchas menos funciones comparadas con [protocolo devtools](https://chromedevtools.github.io/devtools-protocol). Tal como no puede manejar [DOM de sombra cerrada](https://github.com/sukgu/shadow-automation-selenium/issues/7#issuecomment-563062460). No hay forma de guardar páginas como PDF. No hay soporte para herramientas como [Perfiler](https://chromedevtools.github.io/devtools-protocol/tot/Profiler/) o [Rendimiento](https://chromedevtools.github.io/devtools-protocol/tot/Performance/), etc.

Harder para configurar y mantener debido a dependencias extra como un controlador de navegador.

Aunque selenium se vende para un mejor soporte entre navegadores, normalmente es muy difícil hacer que funcione para todos los navegadores principales.

Hay muchos artículos sobre "selenium vs marioneta", usted puede tratar la vara como la versión de Golang de Puppeteer.

### Ciprés

[Cypress](https://www.cypress.io/) es muy limitado, para la sombra cerrada o iframes entre dominios es casi inutilizable. Lee su [documento de limitación](https://docs.cypress.io/guides/references/trade-offs.html) para más detalles.

Si desea cooperar con nosotros para crear un marco de trabajo de pruebas enfocado en Rod para superar la limitación del ciprensa, póngase en contacto con nosotros.

## Qué significa Rod

Rod es el nombre del dispositivo de control para la puppetería, como el lápiz marrón en la imagen de abajo:

![vara](https://user-images.githubusercontent.com/1415488/80178856-31cd8880-863a-11ea-83e9-64f84be3282d.png ":size=200")

El significado es que somos el títere, el navegador es la marioneta, usamos la barra para controlar la marioneta.

[chromedp]: https://github.com/chromedp/chromedp
[puppeteer]: https://github.com/puppeteer/puppeteer
