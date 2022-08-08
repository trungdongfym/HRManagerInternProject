"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const customRouter_1 = require("../../../../libs/router/customRouter");
const validate_middleware_1 = require("../../../../middlewares/validate.middleware");
const roles_model_1 = require("../../../../models/roles.model");
const probForm_controller_1 = require("./probForm.controller");
const probForm_validate_1 = require("./probForm.validate");
const probFormCtrl = new probForm_controller_1.default();
customRouter_1.CustomRouter.post('/probationaryForms', [validate_middleware_1.default.validateBody(probForm_validate_1.default.createProbFormToAllSchema), probFormCtrl.createAll], { preventRoles: [roles_model_1.RolesEnum.Employee, roles_model_1.RolesEnum.Manager] });
customRouter_1.CustomRouter.patch('/probationaryForms/:formCode', [validate_middleware_1.default.validateBody(probForm_validate_1.default.updateProbFormToAllSchema), probFormCtrl.updateAll], { preventRoles: [roles_model_1.RolesEnum.Employee, roles_model_1.RolesEnum.Manager] });
customRouter_1.CustomRouter.patch('/probationaryForm/:formID', [validate_middleware_1.default.validateBody(probForm_validate_1.default.updateFormSchema), probFormCtrl.updateOne], {
    roles: roles_model_1.rolesArray,
});
customRouter_1.CustomRouter.get('/probationaryForms', [validate_middleware_1.default.validateQueryParams(probForm_validate_1.default.queryFormSchema), probFormCtrl.getForms], {
    roles: roles_model_1.rolesArray,
});
customRouter_1.CustomRouter.get('/probationaryForm', [probFormCtrl.getForm], {
    roles: roles_model_1.rolesArray,
});
exports.default = 'probationaryForm';
