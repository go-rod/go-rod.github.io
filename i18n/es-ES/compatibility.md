# Compatibilidad

## SO

Debes ser capaz de compilar y ejecutar Rod sin problemas en todas las plataformas principales que Golang soporta. En algunas plataformas, puede que necesite instalar el navegador manualmente, Rod no puede garantizar que el navegador descargado automáticamente funcionará siempre Si quieres que Rod sea compatible con una plataforma, por favor plantea un problema para ella.

Es muy fácil de Google cómo instalar el navegador en tu sistema, por ejemplo, en Ubuntu o Debian encontrará algo así para instalar el navegador:

```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
apt install ./google-chrome-stable_current_amd64.deb
```

En CentOS:

```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm
yum localinstall -y google-chrome-stable_current_x86_64.rpm
```

En Alpine:

```bash
apk agregar cromo
```

## Navegadores soportados

Rod debería funcionar con cualquier navegador que soporte [DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/).

- Microsoft Edge es compatible.
- Firefox está [apoyando](https://wiki.mozilla.org/Remote) este protocolo.
- Safari todavía no tiene ningún plan para soportarlo.
- IE no lo soportará.

## Navegador y versión del protocolo cdp

El protocolo cdp siempre es el mismo que [launcher.DefaultRevision](https://pkg.go.dev/github.com/go-rod/rod/lib/launcher#DefaultRevision). Si Rod no puede encontrar su navegador local, descargará la versión del navegador del `launcher.DefaultRevision`.

Cada versión de Rod solo garantiza trabajar con su `launcher.DefaultRevision` del navegador.

## API Versioning

[Semver](https://semver.org/) es usado.

Antes de `v1.0.0` cada vez que la segunda sección cambió, por ejemplo `v0.1.0` a `v0. .0`, debe haber algunos cambios públicos de la API, tales como cambios de nombres de función o tipos de parámetros. Si sólo se modificara la última sección, no se modificará ninguna API pública.

Puede usar la comparación de lanzamiento de GiHub para ver el registro de cambios automatizado, por ejemplo, [comparar v0.75.2 con v0.76.0](https://github.com/go-rod/rod/compare/v0.75.2...v0.76.0).

## Versionado de referencia API

Ve a [aquí](https://pkg.go.dev/github.com/go-rod/rod?tab=versions).

## Versionado del sitio Doc

Utilizamos github para administrar el documento, es fácil ver cualquier versión del documento:

1. Clona el doc [repo](https://github.com/go-rod/go-rod.github.io.git)
2. Realizar checkout al commit que está cerca de la fecha de liberación de la versión de Rod que desea
3. Instalar [docsify-cli](https://docsify.js.org/#/quickstart)
4. En la raíz del repo ejecute `docsify serve -o`
