import { Op } from 'sequelize';
import { ITokenPayload } from '../../../commons/interfaces';
import { db } from '../../../configs/database';
import { FormLib, UserDB } from '../../../libs/database/mysql';
import HttpErrors from '../../../libs/error/httpErrors';
import { FormStatusEnum, FormTypeEnum } from '../../../models/form.model';
import { RolesEnum, rolesRankMap } from '../../../models/roles.model';
import { IForm } from '../forms.model';
import { anualFormDataFactory } from './anualForm.model';

class AnualFormService {
   public async createToAllUser(formRaw: any, userActor: ITokenPayload) {
      const anualFormData = anualFormDataFactory(formRaw);
      try {
         anualFormData.createrID = userActor.userID;
         const { formCode } = anualFormData;
         const formCodeExist = await db.Form.findOne({ where: { formCode: formCode }, logging: false });
         if (formCodeExist) {
            throw HttpErrors.Conflict('formCode is exists!');
         }
         const users = await UserDB.getAll({
            where: {
               role: { [Op.notIn]: [RolesEnum.Admin, RolesEnum.Drirector] },
            },
            raw: true,
         });
         const bulkAnualForm = users.map((user) => {
            const { userID } = user;
            const cloneForm = JSON.parse(JSON.stringify(anualFormData));
            cloneForm.ownerID = userID;
            return cloneForm;
         });
         const anualFormCreated = await FormLib.bulkCreate(bulkAnualForm, FormTypeEnum.AnnualReviewForm);
         return anualFormCreated;
      } catch (error) {
         throw error;
      }
   }

   public async updateToAllUser(formCode: string, formRaw: any, userActor: ITokenPayload) {
      const anualFormData = anualFormDataFactory(formRaw);
      try {
         const formToCheckActor = await db.Form.findOne({ where: { formCode: formCode }, logging: false });
         if (!formToCheckActor) {
            throw HttpErrors.NotFound('Not Found formCode!');
         }
         if (rolesRankMap[userActor.role] > rolesRankMap[RolesEnum.Drirector]) {
            anualFormData.createrID = userActor.userID;
         } else if (formToCheckActor.createrID !== userActor.userID) {
            throw HttpErrors.Forbiden('Not Permission!');
         }
         const formUpdated = await FormLib.findAndUpdate(
            { formCode: formCode },
            anualFormData,
            FormTypeEnum.AnnualReviewForm
         );
         return formUpdated;
      } catch (error) {
         throw error;
      }
   }

   // For employee to update the form
   public async updateForm(formID: string, formRaw: any, userActor: ITokenPayload) {
      const anualFormData = anualFormDataFactory(formRaw);
      const formToCheckActor = await db.Form.findOne({ where: { formID: formID }, logging: false });
      if (!formToCheckActor) {
         throw HttpErrors.NotFound('Not Found formID!');
      }
      // Check only owner or rank >= Drirector can update
      if (
         rolesRankMap[userActor.role] < rolesRankMap[RolesEnum.Drirector] &&
         formToCheckActor.ownerID !== userActor.userID
      ) {
         throw HttpErrors.Forbiden('Not Permission!');
      }
      try {
         const formUpdated = await FormLib.findByIdAndUpdate(
            formID,
            anualFormData,
            FormTypeEnum.AnnualReviewForm
         );
         return formUpdated;
      } catch (error) {
         throw error;
      }
   }
}

export default AnualFormService;
