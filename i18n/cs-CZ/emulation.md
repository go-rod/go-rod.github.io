# Emulace

Rod poskytuje různé způsoby, jak napodobit životní prostředí pro stránky.

## Zařízení

Pro nastavení zobrazení, uživatelského agenta, orientace apod. můžete použít předdefinované zařízení:

```go
page.MustEmulate(devices.IPhone6or7or8Plus)
```

Nebo definujte vlastní zařízení:

```go
page.MustEmulate(zařízení). evice{
  Titul: "iPhone 4",
  Vlastnosti: []string{"touch", "mobile"},
  Uživatelský Agent: "Mozilla/5. (iPhone; CPU iPhone OS 7_1_2 jako Mac OS X)",
  Přijmout jazyk: "c",
  Screen: zařízení. creen{
    DevicePixelPio: 2,
    Horizontal: zařízení. creenSize{
      Width:  480,
      Height: 320,
    },
    Vertikální: zařízeníVelikost obrazovky{
      Width:  320,
      Height: 480,
    },
  },
})
```

Zkontrolujte zdrojový kód předdefinovaných zařízení, pole by se měla sama vysvětlovat.

Můžete také nastavit výchozí zařízení pro všechny stránky pomocí [Browser.DefaultDevice](https://pkg.go.dev/github.com/go-rod/rod#Browser.DefaultDevice).

Emulace je ve výchozím nastavení aktivována (pomocí [zařízení. aptopWithMDPIScreen](https://github.com/go-rod/rod/blob/bc44c39c9b4352c15d00bef6f6a1071205d2c388/lib/devices/list.go#L616) , které přepíše výchozí nastavení prohlížeče, což je lepší z hlediska soudržnosti (tj. pomáhá reprodukovat testy).

Můžete vypnout funkci Emulace zařízení, která přesouvá zvláštní zařízení _Vymazat_ do prohlížeče `Browser.DefaultDevice`.

```go
browser.DefaultDevice(devices.Clear)
```

Nebo můžete použít pomocníka [Browser.NoDefaultDevice](https://pkg.go.dev/github.com/go-rod/rod#Browser.NoDefaultDevice).

## Uživatelský agent

Pokud chcete zadat uživatelského agenta pro určitou stránku, použijte [Page.SetUserAgent](https://pkg.go.dev/github.com/go-rod/rod#Page.SetUserAgent).

## Zobrazení

Pokud chcete zadat zobrazení pro konkrétní stránku, použijte [Page.SetViewport](https://pkg.go.dev/github.com/go-rod/rod#Page.SetViewport).

## Lokální a časové pásmo

Můžete použít spouštěcí env pro nastavení všech stránek:

```go
u := launcher.New().Env("TZ=America/New_York").MustConnect()
prohlížeč := rod.New().ControlURL(u).MustConnect()
```

Nebo můžete použít [EmulationSetTimezoneOverride](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetTimezoneOverride) nebo [EmulationSetLocaleOverride](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetLocaleOverride) pro nastavení určité stránky:

```go
proto.EmulationSetTimezoneOverride{TimezoneID: "America/New_York"}.Call(strana)
```

## Práva

Použít [BrowserGrantPermissions](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#BrowserGrantPermissions)

## Geolokace

Použít [EmulationSetGeolocationOverride](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetGeolocationOverride)

## Barevné schéma a média

Použít [EmulationSetEmulatedMedia](https://pkg.go.dev/github.com/go-rod/rod/lib/proto#EmulationSetEmulatedMedia)

```go
proto.EmulationSetEmulatedMedia{
    Media: "screen",
    Vlastnosti: []*proto.EmulationMediaFeature{
        {"prefers-color-scheme", "dark"},
    },
}.Call(page)
```

## Zabránit detekci bota

Obvykle je lepší učinit bezhlavý prohlížeč zcela průhledným na stránce, aby stránka nevěděla, zda je ovládán lidským nebo robotem. V některých případech může některá stránka použít klienta js k detekci, zda je stránka ovládána člověkem nebo robotem, záhlaví WebGL, WebDriver nebo http požadavků. Můžete ručně vyrobit js lib pro skrytí všech stop, nebo jen použít lib [skryté](https://github.com/go-rod/stealth): [příklad kódu](https://github.com/go-rod/stealth/blob/master/examples_test.go).

Pokud pro vás `skryté` lib nefunguje, můžete spustit běžný uživatelský prohlížeč pomocí `spouštěče. ewUserMode`: [uživatelský mód](custom-launch.md?id=user-mode).

Pro otestování konfigurace můžete použít nástroje jako [https://bot.sannysoft.com](https://bot.sannysoft.com).

## Otisk prohlížeče

Odebírání otisků prstů prohlížečem není detekcí botů. K identifikaci prohlížečů používá různé triky k shromažďování jedinečných atributů prohlížeče. Webová stránka ji může použít ke sledování uživatelů, i když nejsou přihlášeni, je také široce využívána k označování bezhlavých škrabáků. Například, různí uživatelé obvykle nainstalují různá písma na své OS, to můžeme použít k rozlišení různých uživatelů. Dalším příkladem by bylo použití plátna k vykreslení textu, různí uživatelé obvykle budou mít různé grafické procesory, grafické ovladače nebo OSS budou mít vliv na výsledek vykresleného obrázku.

Obvykle můžete spustit více instancí prohlížeče, abyste měli různé otisky prstů. Pokud chcete použít jediný prohlížeč pro uložení paměti a CPU, musíte ručně přepsat API pro plátno, písma atd.

Můžete použít open-source projekty jako [FingerprintJS](https://github.com/fingerprintjs/fingerprintjs/) k otestování vaší konfigurace.
