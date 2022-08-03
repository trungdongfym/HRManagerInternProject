import { CustomRouter } from '../../../libs/router/customRouter';
import Validate from '../../../middlewares/validate.middleware';
import { rolesArray, RolesEnum } from '../../../models/roles.model';
import FormController from './forms.controller';
import FormValidate from './forms.validate';

const formCtrl = new FormController();

CustomRouter.patch(
   '/updateFormStatus/:formID',
   [Validate.validateBody(FormValidate.updateFormStatusSchema), formCtrl.updateStatus],
   {
      roles: rolesArray,
   }
);

CustomRouter.delete('/forms/:formCode', [formCtrl.deleteForms], {
   roles: rolesArray,
   preventRoles: [RolesEnum.Employee],
});

CustomRouter.delete('/form/:formID', [formCtrl.deleteOneForm], {
   roles: rolesArray,
   preventRoles: [RolesEnum.Employee],
});

CustomRouter.post(
   '/formStore',
   [Validate.validateBody(FormValidate.createFormStoreSchema), formCtrl.createFormStore],
   {
      preventRoles: [RolesEnum.Employee, RolesEnum.Drirector],
   }
);

CustomRouter.patch(
   '/formStore/:formCode',
   [Validate.validateBody(FormValidate.updateFormStoreSchema), formCtrl.updateFormStore],
   {
      preventRoles: [RolesEnum.Employee, RolesEnum.Drirector],
   }
);

CustomRouter.get(
   '/reportForms',
   [Validate.validateQueryParams(FormValidate.queryReportFormSchema), formCtrl.reportForm],
   {
      requireAuth: false,
   }
);

export default 'forms';
