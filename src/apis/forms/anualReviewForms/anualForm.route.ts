import { CustomRouter } from '../../../libs/router/customRouter';
import Validate from '../../../middlewares/validate.middleware';
import { rolesArray, RolesEnum } from '../../../models/roles.model';
import AnualFormController from './anualForm.controller';
import AnualFormValidate from './anualForm.validate';

const anualFromCtrl = new AnualFormController();

CustomRouter.post(
   '/anualReviewForms',
   [Validate.validateBody(AnualFormValidate.createFormToAllSchema), anualFromCtrl.createAll],
   { preventRoles: [RolesEnum.Employee, RolesEnum.Manager] }
);

CustomRouter.patch(
   '/anualReviewForms/:formCode',
   [Validate.validateBody(AnualFormValidate.updateFormToAllSchema), anualFromCtrl.updateAll],
   { preventRoles: [RolesEnum.Employee, RolesEnum.Manager] }
);

CustomRouter.patch(
   '/anualReviewForm/:formID',
   [Validate.validateBody(AnualFormValidate.updateFormSchema), anualFromCtrl.updateOne],
   {
      roles: rolesArray,
   }
);
export default 'anualReviewForms';
