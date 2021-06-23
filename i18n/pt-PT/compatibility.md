# Compatibilidade

## S.O

Você deve ser capaz de compilar e executar Rod sem problemas em todas as plataformas principais que Golang suporta. Em algumas plataformas, talvez você precise instalar o navegador manualmente, o Rod não pode garantir que o navegador baixado automaticamente funcionará. Se você deseja que o Rod suporte uma plataforma, por favor, crie um problema para ela.

É muito fácil google como instalar o navegador no seu sistema, por exemplo, no Ubuntu ou Debian você vai encontrar algo assim para instalar o navegador:

```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
apt install ./google-chrome-stable_current_amd64.deb
```

No CentOS:

```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm
yum localinstall -y google-chrome-stable_current_x86_64.rpm
```

Em Alpino:

```bash
apk adicionar crómio
```

## Navegadores suportados

Cajado deve funcionar com qualquer navegador que suporte o [DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/).

- Microsoft Edge é suportada.
- Firefox [está suportando](https://wiki.mozilla.org/Remote) este protocolo.
- O Safari ainda não tem nenhum plano para suportá-lo.
- O IE não o apoiará.

## Versão do protocolo cdp e navegador

O protocolo cdp é sempre o mesmo que o [launcher.DefaultRevision](https://pkg.go.dev/github.com/go-rod/rod/lib/launcher#DefaultRevision). Se Rod não conseguir encontrar seu navegador local, ele baixará a versão do navegador do `launcher.DefaultRevision`.

Cada versão de Rod só garante trabalhar com seu `launcher.DefaultRevision` do navegador.

## API Versioning

[Semver](https://semver.org/) é usado.

Antes de `v1.0.0` sempre que a segunda seção mudou, tais como `v0.1.0` para `v0. .0`, deve haver algumas mudanças na API pública, como mudanças de nomes de função ou tipos de parâmetros. Se apenas a última seção alterada, nenhuma API pública será alterada.

Você pode usar a versão de comparação do Github para ver o changelog automatizado, por exemplo, [comparar v0.75.2 com v0.76.0](https://github.com/go-rod/rod/compare/v0.75.2...v0.76.0).

## Versão de referência da API

Vá para [aqui](https://pkg.go.dev/github.com/go-rod/rod?tab=versions).

## Verso do documento

Nós usamos o github para gerenciar a documentação, é fácil de ver qualquer versão da documentação:

1. Clonar o repositório [do projeto](https://github.com/go-rod/go-rod.github.io.git)
2. Git check-out para o commit que está próximo da data de lançamento da versão Rod que deseja
3. Instale o [docsify-cli](https://docsify.js.org/#/quickstart)
4. Na raiz do repo executar `docsify serve -o`
