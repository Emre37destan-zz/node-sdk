# Top.gg Node SDK

Top.<span>gg API ile etkileşim için resmi bir modül

# Kurulum

`yarn add @top-gg/sdk` or `npm i @top-gg/sdk`

# Tanıtım

Temel istemci Topgg.Api'dir ve Top.<span>gg simgenizi alır ve size API ile etkileşim kurmak için birçok yöntem sağlar.

En İyi.<span>gg jetonunuz `top.gg/bot/(BOT_ID)/webhooks` adresinde ve jeton kopyalanırken bulunabilir.

Web kancalarını Topgg.Webhook aracılığıyla da ayarlayabilirsiniz, bunun nasıl yapılacağına ilişkin örneklere aşağıdan bakın!

# Bağlantılar

[Belgeler](https://topgg.js.org)

[API Referansı](https://docs.top.gg) | [GitHub](https://github.com/Emre37destan/node-sdk) | [NPM](https://npmjs.com/package/@top-gg/sdk) | [Discord Sunucusu](https://discord.gg/EYHTgJX)

# Popüler Örnekler

## Otomatik Gönderme istatistikleri

Botunuzun istatistiklerini (sunucu sayısı, parça sayısı) göndermenin kolay bir yolunu arıyorsanız, kontrol edin [`topgg-autoposter`](https://npmjs.com/package/topgg-autoposter)

```js
const client = Discord.Client() // Your discord.js client or any other
const { AutoPoster } = require('topgg-autoposter')

AutoPoster('topgg-token', client)
  .on('posted', () => {
    console.log('Posted stats to Top.gg!')
  })
```
Bununla sunucu sayınız ve parça sayınız En Üstte yayınlanacaktır.<span>gg

## Web kancası sunucusu

```js
const express = require('express')
const Topgg = require('@top-gg/sdk')

const app = express() // Ekspres uygulamanız

const webhook = new Topgg.Webhook('topggauth123') // Top.gg web kancası yetkilendirmenizi ekleyin (bot belirteci değil)

app.post('/dblwebhook', webhook.listener(vote => {
  // oy sizin oy nesnenizdir
  console.log(vote.user) // 221221226561929217
})) // ara yazılımı ekle

app.listen(3000) // senin portun
```
Bu örnekte, webhook kontrol paneliniz şöyle görünmelidir:
![](https://i.imgur.com/wFlp4Hg.png)
