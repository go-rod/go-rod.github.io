# Por que Cajado

Existem muitos grandes projetos, mas ninguém é perfeito, escolher o melhor que melhor se adapta às suas necessidades é importante.

## Comparado com outras bibliotecas

### Chromedp

Teoricamente, Rod deve executar mais rápido e consumir menos memória que Chromedp.

[Chromedp][chromedp] usa o navegador do sistema por padrão, isso pode causar problemas se você acidentalmente atualizar o navegador.

[Chromedp][chromedp] usa um [buffer de tamanho fixo](https://github.com/chromedp/chromedp/blob/b56cd66/target.go#L69-L73) para eventos, pode causar bloqueio na alta conmoeda. Como Chromedp usa um único loop de eventos, os manipuladores de eventos lentos vão bloquear um ao outro. Rod não tem estes problemas porque é baseado em [goob](https://github.com/ysmood/goob).

O Chromedp irá codificar todas as mensagens do navegador, a had é decodificada sob demanda, então o Rod executa melhor, especialmente para eventos de rede pesados.

Chromedp usa a biblioteca de WebSocket de terceira parte, que tem [1MB acima da cabeça](https://github.com/chromedp/chromedp/blob/b56cd66f9cebd6a1fa1283847bbf507409d48225/conn.go#L43-L54) para cada cliente cdp, Se você quiser controlar milhares de navegadores remotos, isso pode se tornar um problema. Por causa dessa limitação, se você avaliar um script de js maior do que 1MB, o Chromedp irá falhar, aqui está um exemplo de como você pode travar Chromedp: [gist](https://gist.github.com/ysmood/0d5b2c878ecbdb598776af7d3d305b79).

Quando um erro ocorrer, Chromedp deixará o processo de navegação zumbi no Windows e Mac.

Cajado é mais configurável, como você pode até substituir a biblioteca de WebSocket pela qual você gosta.

Para comparação direta de código, você pode verificar [aqui](https://github.com/go-rod/rod/tree/master/lib/examples/compare-chromedp). Se você comparar o exemplo chamado `lógica` entre [rod](https://github.com/go-rod/rod/tree/master/lib/examples/compare-chromedp/logic/main.go) e [cromosedp](https://github.com/chromedp/examples/blob/master/logic/main.go), você vai descobrir quão mais simples é o bastão.

Com Chromedp, você precisa usar seus DSLs detalhados para lidar com a lógica de código. Chromedp usa vários wrappers para lidar com a execução com contexto e opções, o que torna muito difícil entender seu código quando os bugs acontecem. As interfaces fortemente usadas tornam os tipos estáticos inúteis ao rastrear problemas. Em contraste, o Rod usa o menor número possível de interfaces.

O Rod tem menos dependências, uma estrutura de código mais simples e uma melhor automação de teste. Você deve achar mais fácil contribuir com código para a Rod. Portanto, em comparação com Chromedp, o Rode tem o potencial de ter funções mais legais da comunidade no futuro.

Outro problema de Chromedp é sua arquitetura baseada em [ID de nó DOM](https://chromedevtools.github.io/devtools-protocol/tot/DOM/#type-NodeId), puppeteer e haste são baseados no [ID do objeto remoto](https://chromedevtools.github.io/devtools-protocol/tot/Runtime/#type-RemoteObjectId). Consequentemente, não é apenas [mais lento](https://github.com/puppeteer/puppeteer/issues/2936) e também impede que Chromedp adicione funções de alto nível que são associadas ao tempo de execução. Por exemplo, este [ticket](https://github.com/chromedp/chromedp/issues/72) havia aberto por 3 anos. Mesmo depois de fechado, você ainda não consegue avaliar js expressos sobre o elemento dentro de um iframe. Além disso, Chromedp mantém uma [cópia](https://github.com/chromedp/chromedp/blob/e2970556e3d05f3259c464faeed1ec0e862f0560/target.go#L375-L376) de todos os nós da memória. Isto causará condição de corrida entre a lista local do NodeID e [DOM.documentAtualizado](https://chromedevtools.github.io/devtools-protocol/tot/DOM/#event-documentUpdated), o que pode causar problemas confusos como [#762](https://github.com/chromedp/chromedp/issues/762).

### Peitoral

[Puppeteer][puppeteer] irá decodificar todas as mensagens do navegador, Rod é decode-on-demand, então teoricamente Rod irá funcionar melhor, especialmente para eventos de rede pesados.

Com puppeteer, você tem que lidar com promessas/async/aguardar muito, torna o projeto elegante de [interface fluente](https://en.wikipedia.org/wiki/Fluent_interface) muito difícil. Testes de ponta a ponta requer um monte de operações de sincronização para simular entradas humanas, porque o Puppeteer se baseia em Nodejs todas as operações de IO são chamadas assíncronas, então, normalmente, as pessoas acabam digitando toneladas de async/await. Se você esquecer de escrever um `aguarde`, ele geralmente é doloroso depurar a promessa de vazamento. O excesso cresce quando o seu projeto cresce.

Cajado é seguro por padrão e tem melhores comentários internos sobre como o próprio Cajado funciona. Ele tem ligações de tipos para todos os pontos de extremidade no protocolo Devtools.

Rod irá desativar eventos de domínio sempre que possível, puppeteer irá sempre ativar todos os domínios. Irá consumir muitos recursos ao dirigir um navegador remoto.

Rod suporta o cancelamento e o tempo limite melhor, isso pode ser crítico se você quiser lidar com milhares de páginas. Por exemplo, para simular `clique` temos que enviar solicitações de cdp serval, com [Promessa](https://stackoverflow.com/questions/29478751/cancel-a-vanilla-ecmascript-6-promise-chain) você não pode alcançar algo como "enviar apenas metade das solicitações de cdp", mas com o [contexto](https://golang.org/pkg/context/) podemos.

### Reprodução

Cajado e [Playwright](https://github.com/microsoft/playwright) foram publicados pela primeira vez quase ao mesmo tempo. A maior parte das comparações entre Rod e Puppeteer permanece fiel ao Playwright, porque tanto Playwright como Puppeteer são mantidas por quase os mesmos contribuidores.

Como o Playwright é declarado em seu documento "Playwright permite testes confiáveis de ponta a ponta para aplicativos web modernos". O foco do projeto está testando. Mas o foco para Rod é mais geral, tanto para automação da web como para remoção, o que faz com que o design se centre mais na flexibilidade e no desempenho.

Um dos objetivos arquitetônicos de Roda é tornar mais fácil para todos contribuir e torná-lo um projeto comunitário puro. essa é uma grande razão pela qual escolhi a licença Golang e o MIT. Typescript é uma boa escolha, mas se você verificar as opções de design do Playwright, [`quaisquer`](https://www.typescriptlang.org/docs/handbook/basic-types.htmvl#any) e [tipos de união](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html#union-types) estão em qualquer lugar, se você tentar pular para o código fonte da página [. lick](https://playwright.dev/#version=v1.6.2&path=docs%2Fapi.md&q=pageclickselector-options), `d.ts` arquivos permitirá que você entenda a realidade do typescript. Golang definitivamente não é o suficiente, mas geralmente introduz menos dívida tecnológica do que o nó. typescript de s, se você quiser que eu escolha qual usar para QA ou Infra que não esteja familiarizado com codificação para automatizar o teste de ponta a ponta ou monitoramento do site, Eu escolheria Golang.

O seu esforço de apoio a cross-browser é fabuloso. Mas hoje em dia, o HTML5 é bem adotado pelas principais marcas, é difícil dizer que a complexidade que ele traz possa valer os benefícios. Os [patches de cross-browser](https://github.com/microsoft/playwright/tree/master/browser_patches) se tornarão um fardo no futuro? Problemas de segurança para navegadores alterados é outra preocupação. Ele também torna complicado testar versões antigas do Firefox ou do Safari. Espero que não seja engenharia em excesso.

### Selenium

[Selenium](https://www.selenium.dev/) é baseado no [protocolo de webdrive](https://www.w3.org/TR/webdriver/) que tem muito menos funções comparadas ao [protocolo devtools.](https://chromedevtools.github.io/devtools-protocol) Como ele não pode lidar com [fechado o DOM](https://github.com/sukgu/shadow-automation-selenium/issues/7#issuecomment-563062460). Não há como salvar páginas como PDF. Não há suporte para ferramentas como [Profiler](https://chromedevtools.github.io/devtools-protocol/tot/Profiler/) ou [Performance](https://chromedevtools.github.io/devtools-protocol/tot/Performance/), etc.

Mais difícil de configurar e manter devido a dependências extras, como um driver de navegador.

Embora o selenium se venda para um melhor suporte entre navegadores, geralmente é muito difícil fazê-lo funcionar com todos os principais navegadores.

Há muitos artigos sobre "selenium vs puppeteer", você pode tratar o bastão como a versão Golang do Puppeteer.

### Cicatriz

[Cypress](https://www.cypress.io/) é muito limitado, pois é quase inutilizável uma sombra fechada ou iframes entre domínios. Leia seu [documento de limitação](https://docs.cypress.io/guides/references/trade-offs.html) para mais detalhes.

Se você quiser cooperar conosco para criar um framework focado em testes no Rod para superar a limitação da ciberimprensa, entre em contato conosco.

## O que significa Bastão

Rod é o nome do dispositivo de controle para o puppetry, como o stick marrom na imagem abaixo:

![haste](https://user-images.githubusercontent.com/1415488/80178856-31cd8880-863a-11ea-83e9-64f84be3282d.png ":size=200")

O que quer dizer é que somos o filhote, o navegador é o filhote, nós usamos a vara para controlar o filhote.

[chromedp]: https://github.com/chromedp/chromedp
[puppeteer]: https://github.com/puppeteer/puppeteer
