import { CustomRouter } from '../../libs/router/customRouter';
import Validate from '../../middlewares/validate.middleware';
import { rolesArray, RolesEnum } from '../../models/roles.model';
import AnualFormValidate from './anualReviewForms/anualForm.validate';
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

export default 'forms';
