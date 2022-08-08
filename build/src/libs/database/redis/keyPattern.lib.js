"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RedisKeyPattern {
    static accessTokenKey(userID) {
        return `AccessToken_User:${userID}`;
    }
}
exports.default = RedisKeyPattern;
