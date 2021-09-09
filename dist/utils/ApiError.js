"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tips = {
    401: "Bu uç nokta için bir Tokene ihtiyacınız var",
    403: "Bu uç noktaya erişiminiz yok",
};
/**
 * API Error
 */
class TopGGAPIError extends Error {
    constructor(code, text, response) {
        if (code in tips) {
            super(`${code} ${text} (${tips[code]})`);
        }
        else {
            super(`${code} ${text}`);
        }
        this.response = response;
    }
}
exports.default = TopGGAPIError;
