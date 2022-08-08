"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const customRouter_1 = require("../../../libs/router/customRouter");
const validate_middleware_1 = require("../../../middlewares/validate.middleware");
const roles_model_1 = require("../../../models/roles.model");
const forms_controller_1 = require("./forms.controller");
const forms_validate_1 = require("./forms.validate");
const formCtrl = new forms_controller_1.default();
customRouter_1.CustomRouter.patch('/updateFormStatus/:formID', [validate_middleware_1.default.validateBody(forms_validate_1.default.updateFormStatusSchema), formCtrl.updateStatus], {
    roles: roles_model_1.rolesArray,
});
customRouter_1.CustomRouter.delete('/formStore/:formCode', [formCtrl.deleteForms], {
    roles: roles_model_1.rolesArray,
    preventRoles: [roles_model_1.RolesEnum.Employee],
});
customRouter_1.CustomRouter.delete('/form/:formID', [formCtrl.deleteOneForm], {
    roles: roles_model_1.rolesArray,
    preventRoles: [roles_model_1.RolesEnum.Employee],
});
customRouter_1.CustomRouter.post('/formStore', [validate_middleware_1.default.validateBody(forms_validate_1.default.createFormStoreSchema), formCtrl.createFormStore], {
    preventRoles: [roles_model_1.RolesEnum.Employee, roles_model_1.RolesEnum.Drirector],
});
customRouter_1.CustomRouter.patch('/formStore/:formCode', [validate_middleware_1.default.validateBody(forms_validate_1.default.updateFormStoreSchema), formCtrl.updateFormStore], {
    preventRoles: [roles_model_1.RolesEnum.Employee, roles_model_1.RolesEnum.Drirector],
});
customRouter_1.CustomRouter.get('/formStore', [validate_middleware_1.default.validateQueryParams(forms_validate_1.default.queryFormStoreSchema), formCtrl.getFormStore], {
    preventRoles: [roles_model_1.RolesEnum.Employee, roles_model_1.RolesEnum.Drirector],
});
customRouter_1.CustomRouter.get('/reportForms', [validate_middleware_1.default.validateQueryParams(forms_validate_1.default.queryReportFormSchema), formCtrl.reportForm], {
    requireAuth: false,
});
exports.default = 'forms';
