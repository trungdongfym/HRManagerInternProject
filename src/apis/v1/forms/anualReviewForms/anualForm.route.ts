import { CustomRouter } from '../../../../libs/router/customRouter';
import Validate from '../../../../middlewares/validate.middleware';
import { rolesArray, RolesEnum } from '../../../../models/roles.model';
import AnualFormController from './anualForm.controller';
import AnualFormValidate from './anualForm.validate';

const anualFromCtrl = new AnualFormController();

CustomRouter.post(
   '/annualReviewForms',
   [Validate.validateBody(AnualFormValidate.createFormToAllSchema), anualFromCtrl.createAll],
   { preventRoles: [RolesEnum.Employee, RolesEnum.Manager] }
);

CustomRouter.patch(
   '/annualReviewForms/:formCode',
   [Validate.validateBody(AnualFormValidate.updateFormToAllSchema), anualFromCtrl.updateAll],
   { preventRoles: [RolesEnum.Employee, RolesEnum.Manager] }
);

CustomRouter.patch(
   '/annualReviewForm/:formID',
   [Validate.validateBody(AnualFormValidate.updateFormSchema), anualFromCtrl.updateOne],
   {
      roles: rolesArray,
   }
);

CustomRouter.get(
   '/annualReviewForms',
   [Validate.validateQueryParams(AnualFormValidate.queryFormSchema), anualFromCtrl.getForms],
   {
      roles: rolesArray,
   }
);

CustomRouter.get('/annualReviewForm', [anualFromCtrl.getForm], {
   roles: rolesArray,
});

export default 'annualReviewForms';
