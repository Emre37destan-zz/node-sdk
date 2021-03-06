"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Webhook = void 0;
const raw_body_1 = __importDefault(require("raw-body"));
/**
 * Top.gg Web kancası
 * @example
 * ```js
 * const express = gerektirir('express')
 * const { Webhook } = require(`@top-gg/sdk`)
 *
 * const APP = express()
 * const wh = new Webhook('webhookauth123')
 *
 * app.post('/dblwebhook', wh.listener(VOTE => {
 * // oy, oy nesnenizdir, ör.
 * console.log(vote.user) // => 321714991050784770
 * }))
 *
 * app.listen(80)
 *
 * // Bu durumda, TopGG Webhook kontrol paneliniz şöyle görünmelidir:
 * // URL = http://your.server.ip:80/dblwebhook
 * // Authorization: webhookauth123
 * ```
 * @link {@link https://docs.top.gg/resources/webhooks/#schema | Web kancası Veri Şeması}
 * @link {@bağ https://docs.top.gg/resources/webhoooks | Web kancası Belgeleri}
 */
class Webhook {
    /**
     * Yeni bir web kancası istemci örneği oluşturun
     * @param yetkilendirme İstekleri doğrulamak için Web kancası yetkilendirmesi
     */
    constructor(authorization, options = {}) {
        var _a;
        this.authorization = authorization;
        this.options = {
            error: (_a = options.error) !== null && _a !== void 0 ? _a : console.error,
        };
    }
    _formatIncoming(body) {
        var _a;
        const out = { ...body };
        if (((_a = body === null || body === void 0 ? void 0 : body.query) === null || _a === void 0 ? void 0 : _a.length) > 0)
            out.query = Object.fromEntries(new URLSearchParams(body.query));
        return out;
    }
    _parseRequest(req, res) {
        return new Promise((resolve) => {
            if (this.authorization &&
                req.headers.authorization !== this.authorization)
                return res.status(403).json({ error: "Yetkisiz" });
            // parse json
            if (req.body)
                return resolve(this._formatIncoming(req.body));
            raw_body_1.default(req, {}, (error, body) => {
                if (error)
                    return res.status(422).json({ error: "Hatalı biçimlendirilmiş istek" });
                try {
                    const parsed = JSON.parse(body.toString("utf8"));
                    resolve(this._formatIncoming(parsed));
                }
                catch (err) {
                    res.status(400).json({ error: "Geçersiz gövde" });
                    resolve(false);
                }
            });
        });
    }
    /**
     * Listening function for handling webhook requests
     * @example
     * ```js
     * app.post('/webhook', wh.listener((vote) => {
     *   console.log(vote.user) // => 395526710101278721
     * }))
     * ```
     * @param fn Vote handling function, this function can also throw an error to allow for the webhook to resend from Top.gg
     * @example
     * ```js
     * // Throwing an error to resend the webhook
     * app.post('/webhook/', wh.listener((vote) => {
     *   // for example, if your bot is offline, you should probably not handle votes and try again
     *   if (bot.offline) throw new Error('Bot offline')
     * }))
     * ```
     * @returns An express request handler
     */
    listener(fn) {
        return async (req, res, next) => {
            var _a, _b;
            const response = await this._parseRequest(req, res);
            if (!response)
                return;
            try {
                await fn(response, req, res, next);
                if (!res.headersSent) {
                    res.sendStatus(204);
                }
            }
            catch (err) {
                (_b = (_a = this.options).error) === null || _b === void 0 ? void 0 : _b.call(_a, err);
                res.sendStatus(500);
            }
        };
    }
    /**
     * Middleware function to pass to express, sets req.vote to the payload
     * @deprecated Use the new {@link Webhook.listener | .listener()} function
     * @example
     * ```js
     * app.post('/dblwebhook', wh.middleware(), (req, res) => {
     *   // req.vote is your payload e.g
     *   console.log(req.vote.user) // => 395526710101278721
     * })
     * ```
     */
    middleware() {
        return async (req, res, next) => {
            const response = await this._parseRequest(req, res);
            if (!response)
                return;
            res.sendStatus(204);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore deprecated unsafe assignment
            req.vote = response;
            next();
        };
    }
}
exports.Webhook = Webhook;
