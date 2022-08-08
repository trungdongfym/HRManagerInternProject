"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bscrypt = require("bcrypt");
const app_const_1 = require("../../commons/constants/app.const");
class BcryptLib {
    static async bcryptHash(dataHash) {
        try {
            const dataHashed = await bscrypt.hash(dataHash, app_const_1.AppConst.BCRYPT_SALT_ROUND);
            return dataHashed;
        }
        catch (error) {
            throw error;
        }
    }
    static bcryptHashSync(dataHash) {
        try {
            const dataHashed = bscrypt.hashSync(dataHash, app_const_1.AppConst.BCRYPT_SALT_ROUND);
            return dataHashed;
        }
        catch (error) {
            throw error;
        }
    }
    static async bcryptCompare(dataCheck, dataHash) {
        try {
            const isValid = await bscrypt.compare(dataCheck, dataHash);
            return isValid;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.default = BcryptLib;
