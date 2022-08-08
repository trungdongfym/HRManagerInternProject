"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_config_1 = require("../../configs/app.config");
const token_model_1 = require("../../models/token.model");
const jwt = require("jsonwebtoken");
const object_utils_1 = require("../../utils/object.utils");
const httpErrors_1 = require("../error/httpErrors");
const codeErrors_1 = require("../error/codeErrors");
const typeError_1 = require("../error/typeError");
class TokenLib {
    static signToken(type, data) {
        const jwtConfig = app_config_1.default.ENV.SECURITY.JWT;
        let token;
        const payload = (0, object_utils_1.pickField)(data, jwtConfig.FIELD_PAYLOAD);
        try {
            switch (type) {
                case token_model_1.tokenEnum.ACCESS_TOKEN:
                    token = jwt.sign(payload, jwtConfig.ACCESS_TOKEN_SECRET, {
                        expiresIn: jwtConfig.ACCESS_TOKEN_EXPIRE,
                    });
                    break;
                case token_model_1.tokenEnum.REFRESH_TOKEN:
                    token = jwt.sign(payload, jwtConfig.REFRESH_TOKEN_SECRET, {
                        expiresIn: jwtConfig.REFRESH_TOKEN_EXPIRE,
                    });
                    break;
                default:
                    throw httpErrors_1.default.ServerError('Token type invalid!');
            }
            return token;
        }
        catch (error) {
            throw error;
        }
    }
    static verifyToken(type, token) {
        const jwtConfig = app_config_1.default.ENV.SECURITY.JWT;
        let payload;
        try {
            switch (type) {
                case token_model_1.tokenEnum.ACCESS_TOKEN:
                    payload = jwt.verify(token, jwtConfig.ACCESS_TOKEN_SECRET);
                    break;
                case token_model_1.tokenEnum.REFRESH_TOKEN:
                    payload = jwt.verify(token, jwtConfig.REFRESH_TOKEN_SECRET);
                    break;
                default:
                    throw httpErrors_1.default.ServerError('Token type invalid!');
            }
        }
        catch (error) {
            const err = new httpErrors_1.default({
                code: codeErrors_1.default.JWT_EXPIRE,
                type: typeError_1.default.TOKEN_ERROR,
                message: error.message,
            });
            if (error instanceof jwt.TokenExpiredError) {
                err.setMessage = 'Token is Exprired!';
                throw err;
            }
            if (error instanceof jwt.JsonWebTokenError) {
                err.setMessage = error.message;
                err.setCode = codeErrors_1.default.JWT_INVALID;
                throw err;
            }
            err.setCode = codeErrors_1.default.BasicError[500];
            err.setType = typeError_1.default.HTTP_ERROR;
            err.message = error?.message || 'Unknow error!';
            throw err;
        }
        return payload;
    }
    static getToken(req) {
        const splitToken = req.get('authorization')?.split(' ');
        if (!splitToken) {
            return null;
        }
        return {
            scheme: splitToken[0],
            token: splitToken[1],
        };
    }
    static decodeToken(token, options) {
        try {
            const decoded = jwt.decode(token, options);
            return decoded;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.default = TokenLib;
