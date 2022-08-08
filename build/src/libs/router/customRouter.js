"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = exports.CustomRouter = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const roles_model_1 = require("../../models/roles.model");
const router = (0, express_1.Router)();
exports.router = router;
var requestMethodEnum;
(function (requestMethodEnum) {
    requestMethodEnum["get"] = "get";
    requestMethodEnum["post"] = "post";
    requestMethodEnum["put"] = "put";
    requestMethodEnum["patch"] = "patch";
    requestMethodEnum["delete"] = "delete";
    requestMethodEnum["use"] = "use";
})(requestMethodEnum || (requestMethodEnum = {}));
class CustomRouter {
    /**
     *
     * @param path
     * @param arrayFn
     * @param routesOptions requireAuth default is true
     */
    static get(path, arrayFn, routesOptions) {
        CustomRouter.routerHandle(requestMethodEnum.get, path, arrayFn, routesOptions);
    }
    /**
     *
     * @param path
     * @param arrayFn
     * @param routesOptions requireAuth default is true
     */
    static post(path, arrayFn, routesOptions) {
        CustomRouter.routerHandle(requestMethodEnum.post, path, arrayFn, routesOptions);
    }
    /**
     *
     * @param path
     * @param arrayFn
     * @param routesOptions requireAuth default is true
     */
    static put(path, arrayFn, routesOptions) {
        CustomRouter.routerHandle(requestMethodEnum.put, path, arrayFn, routesOptions);
    }
    /**
     *
     * @param path
     * @param arrayFn
     * @param routesOptions requireAuth default is true
     */
    static patch(path, arrayFn, routesOptions) {
        CustomRouter.routerHandle(requestMethodEnum.patch, path, arrayFn, routesOptions);
    }
    /**
     *
     * @param path
     * @param arrayFn
     * @param routesOptions requireAuth default is true
     */
    static delete(path, arrayFn, routesOptions) {
        CustomRouter.routerHandle(requestMethodEnum.delete, path, arrayFn, routesOptions);
    }
    /**
     *
     * @param path
     * @param arrayFn
     * @param routesOptions requireAuth default is true
     */
    static use(path, arrayFn, routesOptions) {
        CustomRouter.routerHandle(requestMethodEnum.use, path, arrayFn, routesOptions);
    }
    /**
     *
     * @param method get | post | patch | put | delete | use
     * @param path path string
     * @param arrayFn An array of function RequestHandler, the last element of the array is the endpoint
     * @param routesOptions Default value roles: Pass all roles, requireAuth: true -> Required accesstoken
     *
     * @returns void
     * @note If routesOptions have requireAuth: false then all other options have no effect
     *
     */
    static routerHandle(method, path, arrayFn, routesOptions) {
        if (!Array.isArray(arrayFn)) {
            arrayFn = [arrayFn];
        }
        const optionsApply = {
            //default options value
            roles: roles_model_1.rolesArray,
            requireAuth: true,
            ...routesOptions,
        };
        if (optionsApply.requireAuth) {
            if (optionsApply.roles || optionsApply.preventRoles) {
                const authMiddle = auth_middleware_1.default.verifyRoles(optionsApply.roles, optionsApply.preventRoles);
                arrayFn.unshift(authMiddle);
            }
            //First check
            arrayFn.unshift(auth_middleware_1.default.verifyAccessToken);
        }
        if (!path && method === requestMethodEnum.use) {
            router[method](arrayFn);
            return;
        }
        if (path) {
            router[method](path, arrayFn);
            return;
        }
    }
}
exports.CustomRouter = CustomRouter;
