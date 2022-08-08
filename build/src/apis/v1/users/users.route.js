"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const customRouter_1 = require("../../../libs/router/customRouter");
const auth_middleware_1 = require("../../../middlewares/auth.middleware");
const upload_middleware_1 = require("../../../middlewares/upload.middleware");
const validate_middleware_1 = require("../../../middlewares/validate.middleware");
const roles_model_1 = require("../../../models/roles.model");
const users_controller_1 = require("./users.controller");
const users_validate_1 = require("./users.validate");
const userController = new users_controller_1.default();
// /api/v1/users
customRouter_1.CustomRouter.post('/users', [
    upload_middleware_1.default.uploadImage('avatar', './public'),
    validate_middleware_1.default.validateBody(users_validate_1.default.createUserSchema),
    userController.createUser,
], {
    roles: [roles_model_1.RolesEnum.Admin],
});
// update user
customRouter_1.CustomRouter.patch('/users/:userID', [
    upload_middleware_1.default.uploadImage('avatar', './public'),
    (req, res, next) => {
        const { userID } = req.params;
        // only owner of userID in req.params or admin is pass
        return auth_middleware_1.default.verifyPersonalPrivacy(userID)(req, res, next);
    },
    validate_middleware_1.default.validateBody(users_validate_1.default.updateUserSchema),
    userController.updateUser,
], {
    roles: roles_model_1.rolesArray,
});
// /api/v1/login
customRouter_1.CustomRouter.post('/login', [validate_middleware_1.default.validateBody(users_validate_1.default.loginSchema), userController.loginUser], {
    requireAuth: false,
});
customRouter_1.CustomRouter.delete('/logout', [userController.logoutUser]);
customRouter_1.CustomRouter.get('/users', [validate_middleware_1.default.validateQueryParams(users_validate_1.default.adminQueryUserParamsSchema), userController.getUsers], {
    requireAuth: true,
    roles: [roles_model_1.RolesEnum.Admin],
});
customRouter_1.CustomRouter.get('/user', [
    validate_middleware_1.default.validateQueryParams(users_validate_1.default.userQueryParamsSchema),
    (req, res, next) => {
        const { userID } = req.query;
        // only owner of userID in req.params or admin is pass
        return auth_middleware_1.default.verifyPersonalPrivacy(userID)(req, res, next);
    },
    userController.getUser,
], {
    roles: roles_model_1.rolesArray,
});
customRouter_1.CustomRouter.delete('/users/:userID', [userController.deleteUser], {
    roles: [roles_model_1.RolesEnum.Admin],
});
exports.default = 'users';
