import { FindOptions, Includeable, Op, Sequelize } from 'sequelize';
import { IFormStoreQueryParams, IReportQueryParams, ITokenPayload } from '../../../commons/interfaces';
import { db } from '../../../configs/database';
import { FormLib } from '../../../libs/database/mysql';
import HttpErrors from '../../../libs/error/httpErrors';
import { formAssociations, FormStatusEnum, FormStoreStatusEnum } from '../../../models/form.model';
import { RolesEnum, rolesRankMap } from '../../../models/roles.model';
import { checkFieldContaint, pickField } from '../../../utils/object.utils';
import { IForm, IFormStore } from './forms.model';

class FormService {
   public async createFormStore(formStore: IFormStore, actor: ITokenPayload) {
      try {
         const { formCode } = formStore;
         const formCodeExist = await db.FormStore.findByPk(formCode);
         if (formCodeExist) {
            throw HttpErrors.Conflict('formCode is exists!');
         }
         formStore.createrID = actor.userID;
         const formStoreCreated = await db.FormStore.create(formStore);
         return formStoreCreated;
      } catch (error) {
         throw error;
      }
   }

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
         // Only reviewer can approve or reject
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
            const detailOwner = await db.User.findByPk(formUpdate.ownerID, { logging: false });
            if (!detailOwner) {
               throw HttpErrors.ServerError('User active but not found in DB!');
            }
            // If user dont have manager, but actor >= drirector then assign managerID to reviewerID
            if (!detailOwner.managerID) {
               detailOwner.managerID = userActor.userID;
            }

            formUpdate.set('status', status);
            formUpdate.set('sendTime', new Date());
            formUpdate.set('reviewerID', detailOwner.managerID);
            const formUpdated = await formUpdate.save();
            return formUpdated;
         } else {
            if (status === FormStatusEnum.approve) {
               formUpdate.set('status', status);
               if (!formUpdate.reviewerID) {
                  formUpdate.set('reviewerID', userActor.userID);
               }
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

   public async deleteFormStore(formCode: string, actor: ITokenPayload) {
      try {
         if (!formCode) {
            throw HttpErrors.BadRequest('FormCode is required!');
         }
         const formStoreDelete = await db.FormStore.findByPk(formCode);
         if (!formStoreDelete) {
            throw HttpErrors.NotFound('Not Found Forms!');
         }
         // Only rank role > Drirector or creater of form can delete
         if (
            rolesRankMap[actor.role] < rolesRankMap[RolesEnum.Drirector] &&
            formStoreDelete.createrID !== actor.userID
         ) {
            throw HttpErrors.Forbiden(`You don't have permission to delete this form!`);
         }
         const res = await db.FormStore.destroy({
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

   public async updateFormStore(formCode: string, formStoreDataUpdate: IFormStore, actor: ITokenPayload) {
      try {
         if (!formCode) {
            throw HttpErrors.BadRequest('formCode is required!');
         }
         const formStoreUpdate = await db.FormStore.findByPk(formCode);
         if (
            formStoreUpdate.status === FormStoreStatusEnum.public &&
            checkFieldContaint(formStoreDataUpdate, 'formType')
         ) {
            throw HttpErrors.BadRequest(
               `Can't change formType of form with status ${formStoreUpdate.status}`
            );
         }
         if (
            rolesRankMap[actor.role] < rolesRankMap[RolesEnum.Drirector] &&
            actor.userID !== formStoreUpdate.createrID
         ) {
            throw HttpErrors.Forbiden('Not permission!');
         }
         // if actor update not the creater, then update creater
         if (actor.userID !== formStoreUpdate.createrID) {
            formStoreUpdate.createrID = actor.userID;
         }
         for (const [key, val] of Object.entries(formStoreDataUpdate)) {
            formStoreUpdate.set(key as any, val);
         }
         const formStoreUpdated = await formStoreUpdate.save();
         return formStoreUpdated;
      } catch (error) {
         throw error;
      }
   }

   public async getFormStore(formStoreQuery: IFormStoreQueryParams, actor: ITokenPayload) {
      try {
         const { search, filter, page, pageSize, sort } = formStoreQuery;
         if (filter && filter?.status === FormStoreStatusEnum.private) {
            if (rolesRankMap[actor.role] < rolesRankMap[RolesEnum.Drirector]) {
               // Only owner of form or rank of role > Drirector is pass
               if (filter.createrID && actor.userID !== filter.createrID) {
                  throw HttpErrors.Forbiden(`you don't have access to other form with status private!`);
               }
            }
         }
         const findOptions: FindOptions = {};

         if (filter) {
            findOptions.where = filter;
         }

         /*
         If the query filter don't have status attribute  and rank of role < Drirector 
         then only get formstore with status is public or formstore private his own
         */
         if (!filter?.status && rolesRankMap[actor.role] < rolesRankMap[RolesEnum.Drirector]) {
            findOptions.where = {
               ...findOptions.where,
               [Op.or]: [{ createrID: actor.userID }, { status: FormStoreStatusEnum.public }],
            };
         }

         let isPagination = false;
         let isSkipDB = false; // Check formstore is skip and limit by DB
         if (checkFieldContaint(formStoreQuery, ['page', 'pageSize'])) {
            isPagination = true;
         }
         // If the queryparam have filter and search and offset and skip => wrong result
         if (isPagination && !filter && !search) {
            findOptions.offset = page * pageSize;
            findOptions.limit = pageSize;
            isSkipDB = true;
         }

         if (search) {
            findOptions.where = {
               ...findOptions.where,
               [Op.and]: [
                  Sequelize.literal(
                     `MATCH(${search.field.join(',')}) AGAINST('${search.value.split(/\s+/).join(',')}')`
                  ),
               ],
            };
         }

         if (sort) {
            findOptions.order = [[Sequelize.literal(`${sort.field.join(',')}`), sort.type]];
         }

         interface userPaginationType {
            rows: db.FormStore[];
            count: number;
         }
         let formStores: db.FormStore[] | userPaginationType;
         if (isPagination) {
            formStores = await db.FormStore.findAndCountAll(findOptions);
            if (isPagination && !isSkipDB) {
               // limit and skip hand made :v, củ chuối
               formStores.rows = formStores.rows.slice(page * pageSize, pageSize * page + pageSize);
            }
         } else {
            formStores = await db.FormStore.findAll(findOptions);
         }
         return formStores;
      } catch (error) {
         throw error;
      }
   }

   // report form
   public async reportFormStatus(reportQuery: IReportQueryParams<IForm>) {
      try {
         const { filter, detailsField } = reportQuery;
         const findOptions: FindOptions = {
            attributes: ['status', [Sequelize.fn('COUNT', Sequelize.col('*')), 'quantity']],
            group: ['status'],
            raw: true,
         };

         let isFilterFormType = false;
         if (filter) {
            const filterApply = JSON.parse(JSON.stringify(filter));
            const filterAttribute = JSON.parse(JSON.stringify(filter));
            if (Object.hasOwn(filter, 'formType')) {
               isFilterFormType = true;
               filterApply[`$${formAssociations.formBelongsToFormStore}.formType$`] = filter['formType'];
               // To get field formType
               filterAttribute[`${formAssociations.formBelongsToFormStore}.formType`] = filter['formType'];
               delete filterApply['formType'];
               delete filterAttribute['formType'];
            }
            findOptions.where = filterApply;
            // add attribute for filter
            findOptions.attributes = [...(findOptions.attributes as any), ...Object.keys(filterAttribute)];
         }

         if (isFilterFormType) {
            findOptions.include = [
               {
                  association: db.Form.associations[formAssociations.formBelongsToFormStore],
                  as: formAssociations.formBelongsToFormStore,
                  attributes: [],
               },
            ];
         }

         let includeAttribute: Includeable[] = null;
         if (detailsField) {
            // Create include attribute for include association
            includeAttribute = (detailsField as Array<formAssociations>).map((field): Includeable => {
               return {
                  association: db.Form.associations[field],
                  as: field,
               };
            });
         }

         // Result of statistics
         const result = await db.Form.findAll({
            ...findOptions,
            include: [
               {
                  association: db.Form.associations[formAssociations.formBelongsToFormStore],
                  as: formAssociations.formBelongsToFormStore,
                  attributes: [],
               },
            ],
         });

         if (detailsField) {
            const resultDetail = result.map(async (value) => {
               const { status } = value;
               const usersAndForms = await db.Form.findAll({
                  where: {
                     ...findOptions.where,
                     status: status,
                  },
                  include: includeAttribute,
               });

               const detailData: Array<any> = [];
               // Get detail data
               for (const userAndForm of usersAndForms) {
                  const detailItem: any = {};
                  for (const field of detailsField) {
                     const detailField = userAndForm.get(field, { plain: true });
                     if (!detailField) {
                        continue;
                     }
                     // Filter field
                     if (
                        field === formAssociations.formBelongsToOwner ||
                        field === formAssociations.formBelongsToReviewer
                     ) {
                        detailItem[field] = pickField(detailField as any, [
                           'staffCode',
                           'fullName',
                           'email',
                           'role',
                        ]);
                     }

                     if (field === formAssociations.formBelongsToFormStore) {
                        detailItem[field] = pickField(detailField as any, [
                           'formCode',
                           'title',
                           'formType',
                           'describe',
                           'note',
                        ]);
                     }
                  }
                  if (Object.values(detailItem).length > 0) {
                     detailData.push(detailItem);
                  }
               }
               return { ...value, detailData: detailData };
            });
            return await Promise.all(resultDetail);
         }
         return result;
      } catch (error) {
         throw error;
      }
   }
}

export default FormService;
