import { CustomRouter } from '../../../../libs/router/customRouter';
import Validate from '../../../../middlewares/validate.middleware';
import { rolesArray, RolesEnum } from '../../../../models/roles.model';
import ProbFormController from './probForm.controller';
import ProbFormValidate from './probForm.validate';

const probFormCtrl = new ProbFormController();

CustomRouter.post(
   '/probationaryForms',
   [Validate.validateBody(ProbFormValidate.createProbFormToAllSchema), probFormCtrl.createAll],
   { preventRoles: [RolesEnum.Employee, RolesEnum.Manager] }
);

CustomRouter.patch(
   '/probationaryForms/:formCode',
   [Validate.validateBody(ProbFormValidate.updateProbFormToAllSchema), probFormCtrl.updateAll],
   { preventRoles: [RolesEnum.Employee, RolesEnum.Manager] }
);

CustomRouter.patch(
   '/probationaryForm/:formID',
   [Validate.validateBody(ProbFormValidate.updateFormSchema), probFormCtrl.updateOne],
   {
      roles: rolesArray,
   }
);

CustomRouter.get(
   '/probationaryForms',
   [Validate.validateQueryParams(ProbFormValidate.queryFormSchema), probFormCtrl.getForms],
   {
      roles: rolesArray,
   }
);

CustomRouter.get('/probationaryForm', [probFormCtrl.getForm], {
   roles: rolesArray,
});

export default 'probationaryForm';
