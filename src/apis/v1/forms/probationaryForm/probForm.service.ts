import { Op } from 'sequelize';
import { ITokenPayload } from '../../../../commons/interfaces';
import { db } from '../../../../configs/database';
import { FormLib, UserDB } from '../../../../libs/database/mysql';
import HttpErrors from '../../../../libs/error/httpErrors';
import { FormStoreStatusEnum, FormTypeEnum } from '../../../../models/form.model';
import { RolesEnum, rolesRankMap } from '../../../../models/roles.model';
import { probFormDataFactory } from './probForm.model';

class ProbFormService {
   public async createToAllUser(formRaw: any, actor: ITokenPayload) {
      const probFormData = probFormDataFactory(formRaw);
      console.log(probFormData);
      try {
         const { formCode } = probFormData;
         const formStore = await db.FormStore.findOne({ where: { formCode: formCode } });
         if (!formStore) {
            throw HttpErrors.BadRequest('formCode not exists!');
         }
         // Check formtype of form store
         if (formStore.formType !== FormTypeEnum.ProbationaryForm) {
            throw HttpErrors.BadRequest('FormType invalid!');
         }
         if (formStore.status === FormStoreStatusEnum.public) {
            throw HttpErrors.BadRequest('FormStore is published!');
         }
         // Check role and permission of actor
         if (
            rolesRankMap[actor.role] < rolesRankMap[RolesEnum.Drirector] &&
            formStore.createrID !== actor.userID
         ) {
            throw HttpErrors.Forbiden('Not Permission!');
         }
         const users = await UserDB.getAll({
            where: {
               role: { [Op.notIn]: [RolesEnum.Admin, RolesEnum.Drirector] },
            },
            raw: true,
         });

         const bulkProbForm = users.map((user) => {
            const { userID } = user;
            const cloneForm = JSON.parse(JSON.stringify(probFormData));
            cloneForm.ownerID = userID;
            return cloneForm;
         });
         const probFormCreated = await FormLib.bulkCreate(bulkProbForm, FormTypeEnum.ProbationaryForm);
         // Change status form store
         formStore.status = FormStoreStatusEnum.public;
         await formStore.save();
         return probFormCreated;
      } catch (error) {
         throw error;
      }
   }
}

export default ProbFormService;
