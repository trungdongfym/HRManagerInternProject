import { FindOptions, Op, Sequelize } from 'sequelize';
import { IFormQueryParams, ITokenPayload } from '../../../../commons/interfaces';
import { ISendMail } from '../../../../commons/interfaces/sendMail';
import { db } from '../../../../configs/database';
import { FormLib, UserDB } from '../../../../libs/database/mysql';
import HttpErrors from '../../../../libs/error/httpErrors';
import { sendMail } from '../../../../libs/notify/sendMail.lib';
import {
   FormScope,
   FormStoreAssociation,
   FormStoreStatusEnum,
   FormTypeEnum,
} from '../../../../models/form.model';
import { RolesEnum, rolesRankMap } from '../../../../models/roles.model';
import { checkFieldContaint } from '../../../../utils/object.utils';
import { getAssociationObject } from '../forms.model';
import { filterProbFormFactory, IProbationaryForm, probFormDataFactory } from './probForm.model';

class ProbFormService {
   public async createToAllUser(formRaw: any, actor: ITokenPayload) {
      const probFormData = probFormDataFactory(formRaw);
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
         const mailArray: string[] = [];
         const bulkProbForm = users.map((user) => {
            const { userID, email } = user;
            mailArray.push(email);
            const cloneForm = JSON.parse(JSON.stringify(probFormData));
            cloneForm.ownerID = userID;
            return cloneForm;
         });
         const probFormCreated = await FormLib.bulkCreate(bulkProbForm, FormTypeEnum.ProbationaryForm);
         // Change status form store
         formStore.status = FormStoreStatusEnum.public;
         const sendMailPayload: ISendMail = {
            from: actor.email,
            subject: `Đánh giá định kỳ hàng năm`,
            to: mailArray,
            text: 'Mẫu đánh giá định kì hàng năm đã được tạo, mọi người vào hệ thống để hoàn thành nhé!',
         };
         sendMail(sendMailPayload).catch((err) => {
            console.log(err?.message || 'Error send mail!');
         });
         await formStore.save();
         return probFormCreated;
      } catch (error) {
         throw error;
      }
   }

   public async updateToAllUser(formCode: string, formRaw: any, userActor: ITokenPayload) {
      const probFormData = probFormDataFactory(formRaw);
      try {
         const formStore = await db.FormStore.findOne({ where: { formCode: formCode } });
         if (!formStore) {
            throw HttpErrors.NotFound('Not Found formCode!');
         }
         if (rolesRankMap[userActor.role] > rolesRankMap[RolesEnum.Drirector]) {
            formStore.createrID = userActor.userID;
         } else if (formStore.createrID !== userActor.userID) {
            throw HttpErrors.Forbiden('Not Permission!');
         }
         const formUpdated = await FormLib.findAndUpdate(
            { formCode: formCode },
            probFormData,
            FormTypeEnum.ProbationaryForm
         );
         return formUpdated;
      } catch (error) {
         throw error;
      }
   }

   // For employee to update the form
   public async updateForm(formID: string, formRaw: any, userActor: ITokenPayload) {
      const probFormData = probFormDataFactory(formRaw); //generate probFormData for include associate
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
            probFormData,
            FormTypeEnum.ProbationaryForm
         );
         return formUpdated;
      } catch (error) {
         throw error;
      }
   }

   // get forms
   public async getProbForms(queryParams: IFormQueryParams<IProbationaryForm>, actor: ITokenPayload) {
      const { filter, page, pageSize, search, sort } = queryParams;

      // Only admin, drirector, HR or Actor is owner of form is pass
      if (actor.role === RolesEnum.Manager || actor.role === RolesEnum.Employee) {
         if (!filter?.ownerID) {
            throw HttpErrors.Forbiden(`You don't have permission to get this resource!`);
         } else {
            if (filter.ownerID !== actor.userID) {
               throw HttpErrors.Forbiden(`You don't have permission to get this resource!`);
            }
         }
      }
      const findOptions: FindOptions = {
         raw: true,
      };
      try {
         let isPagination = false;
         let isSkipDB = false;
         if (checkFieldContaint(queryParams, ['page', 'pageSize'])) {
            isPagination = true;
         }
         if (isPagination && !search && !filter) {
            findOptions.offset = pageSize * page;
            findOptions.limit = pageSize;
            isSkipDB = true;
         }
         if (filter) {
            // generate for nested object in include association
            const filterApply = filterProbFormFactory(filter);
            findOptions.where = filterApply as any;
         }
         if (search) {
            // Get an object have the key refer to form store for attribute selection from populate formstore
            const associateFormStoreObject = getAssociationObject(
               FormStoreAssociation.formBelongsToFormStore
            );
            const formStoreKey = Object.keys(associateFormStoreObject);
            // add prefix for field search to access to include association
            search.field = search.field.map((val) => {
               if (formStoreKey.includes(val)) {
                  return associateFormStoreObject[val];
               }
               return `form.${val}`;
            });
            findOptions.where = {
               ...findOptions.where,
               [Op.and]: [
                  Sequelize.literal(
                     `MATCH (${search.field.join(',')}) AGAINST ('${search.value.split(/\s+/).join(',')}')`
                  ),
               ],
            };
         }
         if (sort) {
            findOptions.order = [Sequelize.literal(`${sort.field.join(',')} ${sort.type}`)];
         }
         interface userPaginationType {
            rows: db.Form[];
            count: number;
         }
         let probForms: db.Form[] | userPaginationType;
         if (isPagination) {
            probForms = await db.Form.scope(FormScope.populateProbForm).findAndCountAll(findOptions);
            if (isPagination && !isSkipDB) {
               // limit and skip hand made :v, củ chuối
               probForms.rows = probForms.rows.slice(page * pageSize, pageSize * page + pageSize);
            }
         } else {
            probForms = await db.Form.scope(FormScope.populateProbForm).findAll(findOptions);
         }
         return probForms;
      } catch (error) {
         throw error;
      }
   }

   public async getForm(formID: string, actor: ITokenPayload) {
      try {
         if (!formID) {
            throw HttpErrors.BadRequest('formID is required!');
         }
         const probForm = await db.Form.scope(FormScope.populateProbForm).findByPk(formID);
         if (!probForm) {
            throw HttpErrors.NotFound(`Probationary form with formID ${formID} not exists!`);
         }
         if (actor.role === RolesEnum.Manager || actor.role === RolesEnum.Employee) {
            if (probForm.ownerID !== actor.userID) {
               throw HttpErrors.Forbiden(`You don't have permission to get this resource!`);
            }
         }
         return probForm;
      } catch (error) {
         throw error;
      }
   }
}

export default ProbFormService;
