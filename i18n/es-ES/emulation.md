# Emulación

Rod proporciona varias maneras de emular el ambiente para las páginas.

## Dispositivos

Para configurar la vista gráfica, agente de usuario, orientación, etc al mismo tiempo para una página, puede utilizar los dispositivos predefinidos:

```go
page.MustEmulate(devices.IPhone6or7or8Plus)
```

O define tu propio dispositivo:

```go
page.MustEmulate(devices. evice{
  Título: "iPhone 4",
  Capacidades: []string{"touch", "móvil"},
  UserAgent: "Mozilla/5. (iPhone; CPU iPhone OS 7_1_2 como Mac OS X)",
  AceptIdioma: "es",
  Pantalla: dispositivos. creen{
    DevicePixelRatio: 2,
    Horizontal: dispositivos. creenSize{
      Width:  480,
      Height: 320,
    },
    Vertical: devices.ScreenSize{
      Width:  320,
      Height: 480,
    },
  },
})
```

Compruebe el código fuente de los dispositivos predefinidos, los campos deben autoexplicarse.

También puede establecer el dispositivo predeterminado para todas las páginas usando [Browser.DefaultDevice](https://pkg.go.dev/github.com/go-rod/rod#Browser.DefaultDevice).

La emulación está activada por defecto (usando los [dispositivos. aptopWithMDPIScreen](https://github.com/go-rod/rod/blob/bc44c39c9b4352c15d00bef6f6a1071205d2c388/lib/devices/list.go#L616) dispositivo), que anula algunas de las configuraciones predeterminadas del navegador, que es mejor en términos de coherencia (es decir, ayuda a reproducir las pruebas).

Puede desactivar la función de Emulación de Dispositivo pasando el dispositivo especial _Limpiar_ al `Browser.DefaultDevice`.

```go
browser.DefaultDevice(devices.Clear )
```

O puede usar el helper [Browser.NoDefaultDevice](https://pkg.go.dev/github.com/go-rod/rod#Browser.NoDefaultDevice).

## Agente de usuario

Si desea especificar un agente de usuario para una página específica, utilice [Page.SetUserAgent](https://pkg.go.dev/github.com/go-rod/rod#Page.SetUserAgent).

## Ver

Si desea especificar la vista para una página específica, utilice [Page.SetViewport](https://pkg.go.dev/github.com/go-rod/rod#Page.SetViewport).

## Local y zona horaria

Puede utilizar el env de lanzamiento para todas las páginas:

```go
u := launcher.New().Env("TZ=America/New_.Uk").MustConnect()
browser := rod.New().ControlURL(u).MustConnect()
```

O puede usar [EmulationSetTimezoneOverride](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetTimezoneOverride) o [EmulationSetLocaleOverride](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetLocaleOverride) para establecer una página específica:

```go
proto.EmulationSetTimezoneOverride{TimezoneID: "América/Nuevo:"}.Llamar (página)
```

## Permisos

Utilice [permisos de Navegador](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#BrowserGrantPermissions)

## Geolocalización

Usa [EmulationSetGeolocationOverride](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetGeolocationOverride)

## Esquema de colores y medios

Usa [Emulación de Emulados](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetEmulatedMedia)

```go
proto.EmulationSetEmulatedMedia{
    Media: "screen",
    Características: []*proto.EmulationMediaFeature{
        {"prefers-color-scheme", "dark"},
    },
}.Call(page)
```

## Prevenir detección de bot

Normalmente es mejor hacer que el navegador sin cabeceras sea completamente transparente para la página de modo que la página no pueda saber si está controlado por un humano o robot . En algunos casos, alguna página podría usar js de cliente para detectar si la página es controlada por un humano o un robot, tal WebGL, WebDriver, o cabeceras de solicitudes http. Puedes crear una librería js para ocultar todos los rastros, o simplemente usar lib [stealth](https://github.com/go-rod/stealth): [código ejemplo](https://github.com/go-rod/stealth/blob/master/examples_test.go).

Si `la librería` no funciona para ti, solo puedes lanzar el navegador de usuario regular con `launcher. ewUserMode`: [Modo usuario](custom-launch.md?id=user-mode).

Puedes usar herramientas como [https://bot.sannysoft.com](https://bot.sannysoft.com) para probar tu configuración.

## Huella digital del navegador

La toma de huellas dactilares del navegador no es detección de bots. Utiliza varios trucos para recoger atributos únicos del navegador para identificar a los navegadores. El sitio web puede utilizarlo para rastrear usuarios incluso cuando no están conectados, también se utiliza ampliamente para marcar raspadores sin cabezas. Por ejemplo, diferentes usuarios normalmente instalarán diferentes fuentes en su sistema operativo, podemos utilizar esto para distinguir diferentes usuarios. Otro ejemplo sería usar el lienzo para representar texto, diferentes usuarios normalmente tendrán diferentes GPUs, controladores gráficos, o sistemas operativos, todos ellos afectarán al resultado de la imagen renderizada.

Normalmente puedes lanzar múltiples instancias del navegador para tener diferentes huellas digitales. Si desea utilizar un único navegador para ahorrar memoria y CPU, tiene que reemplazar manualmente la API para lienzos, fuentes, etc.

Puede utilizar proyectos de código abierto como [FingerprintJS](https://github.com/fingerprintjs/fingerprintjs/) para probar su configuración.
