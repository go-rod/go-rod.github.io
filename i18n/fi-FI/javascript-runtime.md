# Käynnistä Javascript

Voimme käyttää sauva arvioida satunnaista javascript koodi sivulla. Kuten käyttää sitä lukea tai muokata HTML-sisältöä sivun.

## Nähdä sivulla

Esimerkiksi käytä `Page.Eval` asettaaksesi globaalin arvon:

```go
sivu.MustEval(`window.a = {name: 'jack'}`)
```

Voimme käyttää js toiminto siirtää arvon json argumentit:

```go
avain := "a"
tiedot := kartta[string]merkki{"name": "jack"}
sivu.MustEval(`(k, val) => {
    ikkuna[k] = val
}`, avain, data)
```

Saadaksesi palautetun arvon Eval:

```go
val := sivu.MustEval(`a`).Get("nimi").Str()
fmt.Println(val) // output: jack
```

## Määritä globaali funktio

The `Page.Evaluate` -menetelmä suorittaa funktion, jos sen uloin on funktion määritelmä.

Esimerkiksi jäljempänä oleva `testi` -toiminto suoritetaan välittömästi, sitä ei käsitellä funktion määritelmänä:

```go
sivu.MustEval(`function test() { alert('ok') }`)

sivu.MustEval(`test()`) // panic testiä ei ole määritelty
```

Globaalin funktion `testin` määrittämiseksi voit koodata näin, koska uloin on tehtävä, ei funktion määritelmä:

```go
sivu.MustEval(`test = toiminto () { alert('ok') }`)

sivu.MustEval(`test()`)
```

## Tunnista elementti

`Element.Eval` on samanlainen `Page.Eval`, mutta `tämä` objekti on asetettu nykyiseen elementtiin. Esimerkiksi, meillä on `<button>Lähetä</button>` sivulla, voimme lukea tai muokata elementin JS: llä:

```go
el := sivu.MustElement("painike")
el.MustEval(`this.innerText = "Apply"`) // Muokkaa sisältöä
txt := el.MustEval(`this.innerText`).Str()
fmt.Println(txt) // Tutkimustuotos: Lisää
```

## Alenna Go-funktiot sivulle

Voimme käyttää `Page.Expose` altistaa callback toiminnot sivulle. Esimerkiksi, tässä me paljastaa funktion auttaa sivua laskea md5 hash:

```go
page.MustExpose("md5", funktio(g gson.JSON) (interface{}, error) {
    return md5.Sum([]byte(g.Str()), nil
})
```

Nyt sivu voi vedota tähän menetelmään ikkunan objektissa:

```go
hash := sivu.MustEval(`window.md5 ("testi")`).Str()
```
