"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redisConnect_1 = require("../../../configs/database/redis/redisConnect");
const keyPattern_lib_1 = require("./keyPattern.lib");
class RedisLib {
    /**
     *
     * @param userID
     * @param accessToken
     * @param options NX: If the key exists then do nothing. Default is false
     * @returns
     */
    static async setAccessToken(userID, accessToken, options = { NX: false }) {
        try {
            const result = await redisConnect_1.redisClient.set(keyPattern_lib_1.default.accessTokenKey(userID), accessToken, {
                EX: options.EX,
                NX: options.NX,
            });
            return result;
        }
        catch (error) {
            throw error;
        }
    }
    static async getAccessToken(userID) {
        try {
            const result = await redisConnect_1.redisClient.get(keyPattern_lib_1.default.accessTokenKey(userID));
            return result;
        }
        catch (error) {
            throw error;
        }
    }
    static async deleteAccessToken(userID) {
        try {
            const result = await redisConnect_1.redisClient.del(keyPattern_lib_1.default.accessTokenKey(userID));
            return result;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.default = RedisLib;
