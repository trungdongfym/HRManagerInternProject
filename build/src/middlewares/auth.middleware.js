"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const token_lib_1 = require("../libs/authentication/token.lib");
const redis_1 = require("../libs/database/redis");
const httpErrors_1 = require("../libs/error/httpErrors");
const typeError_1 = require("../libs/error/typeError");
const roles_model_1 = require("../models/roles.model");
const token_model_1 = require("../models/token.model");
class Auth {
    /**
     *
     * @param roles Roles to pass
     * @param preventRoles Roles to prevent
     * @returns RequestHandler
     */
    static verifyRoles(roles, preventRoles) {
        return (req, res, next) => {
            const accessToken = token_lib_1.default.getToken(req);
            const { token } = accessToken;
            try {
                const payloadToken = token_lib_1.default.verifyToken(token_model_1.tokenEnum.ACCESS_TOKEN, token);
                // Attach real user to req for next use
                req.user = payloadToken;
                const forbiddenErr = httpErrors_1.default.Forbiden('Forbiden!');
                // if the token of admin, let's pass
                if (payloadToken.role === roles_model_1.RolesEnum.Admin) {
                    next();
                    return;
                }
                // Check prevent roles
                if (preventRoles && preventRoles.includes(payloadToken.role)) {
                    res.status(forbiddenErr.status).json(forbiddenErr.message);
                    return;
                }
                if (roles && !roles.includes(payloadToken.role)) {
                    forbiddenErr.setMessage = 'Not permission!';
                    res.status(forbiddenErr.status).json(forbiddenErr.message);
                    return;
                }
                next();
            }
            catch (error) {
                const err = error;
                res.status(err.status || 500).json(err.message || 'Unknow error!');
            }
        };
    }
    static verifyPersonalPrivacy(prsonalPrivacyID) {
        return async (req, res, next) => {
            if (!prsonalPrivacyID) {
                const badRequest = httpErrors_1.default.BadRequest('UserID not exists!');
                res.status(badRequest.status).json(badRequest.message);
                return;
            }
            const { user } = req;
            try {
                if (!user) {
                    const err = httpErrors_1.default.Unauthorized('User Not Found In Request!');
                    next(err);
                    return;
                }
                const { userID, role } = user;
                // If admin is full permission
                if (role === roles_model_1.RolesEnum.Admin) {
                    next();
                    return;
                }
                if (prsonalPrivacyID !== userID) {
                    const notPermissionErr = httpErrors_1.default.Forbiden('Not permission!');
                    next(notPermissionErr);
                    return;
                }
                next();
            }
            catch (error) {
                next(error);
            }
        };
    }
    // Check access token is valid
    static async verifyAccessToken(req, res, next) {
        try {
            const accessToken = token_lib_1.default.getToken(req);
            // Check token exists
            if (!accessToken) {
                const notPermissionErr = httpErrors_1.default.Unauthorized('Unauthorized!');
                res.status(notPermissionErr.status).json(notPermissionErr.message);
                return;
            }
            const { scheme, token } = accessToken;
            if (!/^Bearer/.test(scheme)) {
                const tokenErr = httpErrors_1.default.InvalidToken('Token Scheme Invalid!');
                res.status(tokenErr.status).json(tokenErr.message);
                return;
            }
            const payloadDecode = token_lib_1.default.decodeToken(token);
            const userID = payloadDecode.userID;
            const unAuthorized = httpErrors_1.default.Unauthorized('Invalid Token', typeError_1.default.TOKEN_ERROR);
            if (!userID) {
                res.status(unAuthorized.status).json(unAuthorized.message);
                return;
            }
            const tokenUserInDB = await redis_1.RedisLib.getAccessToken(userID);
            // Check token have in DB
            if (!tokenUserInDB || tokenUserInDB !== token) {
                res.status(unAuthorized.status).json(unAuthorized.message);
                return;
            }
            next();
        }
        catch (error) {
            next(error);
        }
    }
}
exports.default = Auth;
