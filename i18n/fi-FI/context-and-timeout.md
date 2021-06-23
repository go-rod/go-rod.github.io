# Konteksti ja aikakatkaisu

Golangissa käytämme yleensä [Kontekstiä](https://golang.org/pkg/context/) pitkäaikaisten tehtävien keskeyttämiseen. Turska käyttää kontekstiä käsittelemään peruutuksia IO estämistoiminnoissa, useimmiten se on aikakatkaistu. Teidän on kiinnitettävä erityistä huomiota heihin.

Jos Context ei ole tuttu, lue [Ymmärrä konteksti](understand-context.md) ensin.

## Peruutus

Esimerkiksi alla oleva koodi luo tyhjän sivun ja navigoi sen "github.com":

```go
page := rod.New().MustConnect().MustPage()
page.MustNavigate("http://github.com")
```

Nyt oletamme, että haluamme peruuttaa `MustNavigate` jos se kestää yli 2 sekuntia. Turkissa voimme tehdä jotain tällaista:

```go
sivu := rod.New().MustConnect().MustPage()

ctx, peruuta := konteksti.WithCancel(context.Background())
sivuPeruuta := sivu.Context(ctx)

go func() {
    time. leep(2 * aikaa.Second)
    cancel()
}()

pageWithCancel.MustNavigate("http://github.com") // peruutetaan 2 sekunnin kuluttua
```

Käytämme `sivua. Konteksti` luoda matala klooni `sivun`. Aina kun kutsumme `perumaan`, `sivun käynnistämä toiminto
peruutetaan` se voi olla mikä tahansa operaatio, ei vain `MustNavigoi`. Alkuperä `sivu` ei vaikuta, jos käytämme sitä soittaa toimintoihin, joita ei peruuteta.

Tämä tyyli ei ole erikoinen sauvalle, voit löytää samankaltaisia sovellusliittymiä kuten [Pyydetty.WithContext](https://golang.org/pkg/net/http/#Request.WithContext) standardikirjastossa.

Koska `pageWithPeruuta` ja `sivu` ovat toisistaan riippumattomia. peruutus ei vaikuta `sivun` käynnistämiin toimintoihin:

```go
sivu.MustNavigate("http://github.com") // ei peruuta 2 sekunnin kuluttua
```

## Aikakatkaisu

Yllä oleva koodi on vain tapa aikaistaa toiminto. Vuonna Golang, aikakatkaisu on yleensä vain erikoistapaus peruutus. Koska se on niin hyödyllistä, loimme auttajan tekemään saman asian edellä, sitä kutsutaan `Aikakatkaisu`, joten yllä olevaa koodia voidaan vähentää kuten alla:

```go
sivu := rod.New().MustConnect().MustPage()
sivu.Timeout(2 * time.Second).MustNavigate("http://github.com")
```

The `page.Timeout(2 * time.Second)` on edellinen `sivuPeruuta`. Ei vain `Sivu`, `Selain` ja `Elementti` on myös samaa asiayhteyttä.

## Tunnista aikakatkaisu

Mistä tiedän, onko toimenpide ajallisesti päättynyt vai ei? Vuonna Golang, aikakatkaisu on yleensä eräänlainen virhe. Se ei ole erikoista turskalle. Edellä olevaa koodia varten voimme tehdä tämän havaita aikakatkaisu:

```go
sivu := rod.New().MustConnect().MustPage()

err := rod.Try(func() {
    page.Timeout(2 * time.Second).MustNavigate("http://github.com")
})
jos virheitä. s(virhe, konteksti. eadlineExceeded) {
    // code for timeout error
} muuten jos err ! nil {
    // koodi muuntyyppisille virheille
}
```

Täällä käytämme `rod.Yritä` kääri toiminto, joka voi heittää aikakatkaisun virhe.

Puhumme enemmän virheen luovuttamisesta [Virheen käsittely](error-handling.md).
