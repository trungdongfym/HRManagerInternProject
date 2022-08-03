import { CustomRouter } from '../../../../libs/router/customRouter';
import Validate from '../../../../middlewares/validate.middleware';
import { RolesEnum } from '../../../../models/roles.model';
import ProbFormController from './probForm.controller';
import ProbFormValidate from './probForm.validate';

const probFormCtrl = new ProbFormController();

CustomRouter.post(
   '/probationaryForms',
   [Validate.validateBody(ProbFormValidate.createProbFormToAllSchema), probFormCtrl.createAll],
   { preventRoles: [RolesEnum.Employee, RolesEnum.Manager] }
);

export default 'probationaryForm';
