import { ITokenPayload } from '../../commons/interfaces';
import { FormLib } from '../../libs/database/mysql';
import HttpErrors from '../../libs/error/httpErrors';
import { FormStatusEnum, FormTypeEnum } from '../../models/form.model';
import { RolesEnum, rolesRankMap } from '../../models/roles.model';
import { db } from '../../configs/database';
import { IForm } from './forms.model';

class FormService {
   public async updateFormStatus(formID: string, status: FormStatusEnum, userActor: ITokenPayload) {
      const formUpdate = await db.Form.findOne({ where: { formID: formID }, logging: false });
      if (!formUpdate) {
         throw HttpErrors.NotFound('Not Found formID!');
      }
      // generate permission for userActor
      const permission = {
         [formUpdate.ownerID]: [FormStatusEnum.review].filter((_) => {
            return formUpdate.status === FormStatusEnum.open;
         }),
         [formUpdate.reviewerID]: [FormStatusEnum.approve, FormStatusEnum.reject],
      };

      try {
         if (
            rolesRankMap[userActor.role] < rolesRankMap[RolesEnum.Drirector] &&
            !permission[userActor.userID]?.includes(status)
         ) {
            throw HttpErrors.Forbiden(`You don't permission update this form or form with status ${status}!`);
         }
         if (status === FormStatusEnum.review) {
            const detailUserActor = await db.User.findByPk(userActor.userID, { logging: false });
            if (!detailUserActor) {
               throw HttpErrors.ServerError('User active but not found in DB!');
            }
            if (!detailUserActor.managerID) {
               throw HttpErrors.NotFound(`You don't have manager!`);
            }
            formUpdate.set('status', status);
            formUpdate.set('sendTime', new Date());
            formUpdate.set('reviewerID', detailUserActor.managerID);
            const formUpdated = await formUpdate.save({ logging: false });
            return formUpdated;
         } else {
            if (status === FormStatusEnum.approve) {
               formUpdate.set('status', status);
               const formUpdated = await formUpdate.save({ logging: false });
               return formUpdated;
            }
            if (status === FormStatusEnum.reject) {
               const numReject = formUpdate.numReject;
               formUpdate.numReject = numReject + 1;
               formUpdate.status = FormStatusEnum.open;
               formUpdate.reviewerID = null;
               const formUpdated = await formUpdate.save({ logging: false });
               return formUpdated;
            }
         }
      } catch (error) {
         throw error;
      }
   }

   public async deleteForms(formCode: string, actor: ITokenPayload) {
      try {
         if (!formCode) {
            throw HttpErrors.BadRequest('FormCode is required!');
         }
         const formDelete = await FormLib.findByFormCode(formCode);
         if (!formDelete || formDelete.length === 0) {
            throw HttpErrors.NotFound('Not Found Forms!');
         }
         // Only rank role > Drirector or creater of form can delete
         if (
            rolesRankMap[actor.role] < rolesRankMap[RolesEnum.Drirector] &&
            formDelete[0].createrID !== actor.userID
         ) {
            throw HttpErrors.Forbiden(`You don't have permission to delete this form!`);
         }
         const res = await db.Form.destroy({
            where: {
               formCode: formCode,
            },
         });
         return res;
      } catch (error) {
         throw error;
      }
   }

   public async deleteForm(formID: string, actor: ITokenPayload) {
      try {
         if (!formID) {
            throw HttpErrors.BadRequest('formID is required!');
         }
         const formDelete = await FormLib.findById(formID);
         if (!formDelete) {
            throw HttpErrors.NotFound(`Not Found Form with formID: ${formID}!`);
         }
         // Only rank role > Drirector or creater of form can delete
         if (
            rolesRankMap[actor.role] < rolesRankMap[RolesEnum.Drirector] &&
            formDelete[0].createrID !== actor.userID
         ) {
            throw HttpErrors.Forbiden(`You don't have permission to delete this form!`);
         }
         const res = await db.Form.destroy({
            where: {
               formID: formID,
            },
         });
         return res;
      } catch (error) {
         throw error;
      }
   }
}

export default FormService;
