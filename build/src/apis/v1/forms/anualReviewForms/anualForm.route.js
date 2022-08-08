"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const customRouter_1 = require("../../../../libs/router/customRouter");
const validate_middleware_1 = require("../../../../middlewares/validate.middleware");
const roles_model_1 = require("../../../../models/roles.model");
const anualForm_controller_1 = require("./anualForm.controller");
const anualForm_validate_1 = require("./anualForm.validate");
const anualFromCtrl = new anualForm_controller_1.default();
customRouter_1.CustomRouter.post('/annualReviewForms', [validate_middleware_1.default.validateBody(anualForm_validate_1.default.createFormToAllSchema), anualFromCtrl.createAll], { preventRoles: [roles_model_1.RolesEnum.Employee, roles_model_1.RolesEnum.Manager] });
customRouter_1.CustomRouter.patch('/annualReviewForms/:formCode', [validate_middleware_1.default.validateBody(anualForm_validate_1.default.updateFormToAllSchema), anualFromCtrl.updateAll], { preventRoles: [roles_model_1.RolesEnum.Employee, roles_model_1.RolesEnum.Manager] });
customRouter_1.CustomRouter.patch('/annualReviewForm/:formID', [validate_middleware_1.default.validateBody(anualForm_validate_1.default.updateFormSchema), anualFromCtrl.updateOne], {
    roles: roles_model_1.rolesArray,
});
customRouter_1.CustomRouter.get('/annualReviewForms', [validate_middleware_1.default.validateQueryParams(anualForm_validate_1.default.queryFormSchema), anualFromCtrl.getForms], {
    roles: roles_model_1.rolesArray,
});
customRouter_1.CustomRouter.get('/annualReviewForm', [anualFromCtrl.getForm], {
    roles: roles_model_1.rolesArray,
});
exports.default = 'annualReviewForms';
