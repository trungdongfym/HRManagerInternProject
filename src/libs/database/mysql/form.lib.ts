import { FindOptions } from 'sequelize';
import { IAnnualReviewForm } from '../../../apis/v1/forms/forms.model';
import { db } from '../../../configs/database';
import { sequelize } from '../../../configs/database/mysql/mysql.config';
import HttpErrors from '../../../libs/error/httpErrors';
import { FormTypeEnum } from '../../../models/form.model';
import { checkData } from '../../../utils/object.utils';

class FormLib {
   public static async create(formParams: any, formType: FormTypeEnum) {
      try {
         const formCreated = await db.Form.create(formParams, {
            logging: false,
            include: [
               {
                  association: db.Form.associations[formType],
                  as: formType,
               },
            ],
         });
         return formCreated;
      } catch (error) {
         const err = HttpErrors.IODataBase(error?.message || 'Create Form Error!');
         throw err;
      }
   }

   public static async bulkCreate(formParams: any, formType: FormTypeEnum) {
      const t = await sequelize.transaction({ logging: false });
      try {
         const formCreated = await db.Form.bulkCreate(formParams, {
            include: [
               {
                  association: db.Form.associations[formType],
                  as: formType,
               },
            ],
            transaction: t,
         });
         await t.commit();
         return formCreated;
      } catch (error) {
         await t.rollback();
         const err = HttpErrors.IODataBase(error?.message || 'Create Form Error!');
         throw err;
      }
   }

   /**
    *
    * @param formType - If have formType -> populate to formType
    * @returns
    * @note Query use transaction must call in the same context.
    */
   public static async findByIdAndUpdate(
      formID: string,
      updateParam: any,
      formType?: FormTypeEnum,
      findOptions?: FindOptions
   ) {
      try {
         const defaultOptions: FindOptions = {};
         if (formType) {
            defaultOptions.include = [
               {
                  association: db.Form.associations[formType],
                  as: formType,
               },
            ];
         }
         const form = await db.Form.findByPk(formID, { ...defaultOptions, ...findOptions });
         for (const [key, val] of Object.entries(updateParam)) {
            const prevVal = form.get(key, { plain: true });
            if (checkData(prevVal) === 'Object' && formType) {
               form.set(key, { ...(prevVal as any), ...(val as any) });
            } else {
               form.set(key, val);
            }
         }
         form.changed('updatedAt', true);
         const formUpdated = await form.save();
         await (formUpdated[formType] as any).save();
         return formUpdated;
      } catch (error) {
         const err = HttpErrors.IODataBase(error?.message || 'Update Form Error!');
         throw err;
      }
   }

   /**
    *
    * @param formType - If have formType -> populate to formType
    * @returns
    * @note Query use transaction must call in the same context.
    */
   public static async findAndUpdate(
      filter: Partial<IAnnualReviewForm>,
      updateParam: object,
      formType?: FormTypeEnum,
      findOptions?: FindOptions
   ) {
      const transaction = await sequelize.transaction({ autocommit: false, logging: false });
      try {
         const defaultOptions: FindOptions = {
            where: { ...filter },
            transaction: transaction,
         };
         if (formType) {
            defaultOptions.include = [
               {
                  association: db.Form.associations[formType],
                  as: formType,
               },
            ];
         }
         const anualForms = await db.Form.findAll({ ...defaultOptions, ...findOptions });
         /*
         Error here: map use a callback => create a new context, call query save in callback of map => error
         anualForms.map(async (anualForm) => {
            for (const [key, val] of Object.entries(updateParam)) {
               const prevVal = anualForm.get(key, { plain: true });
               if (checkData(prevVal) === 'Object') {
                  anualForm.set(key, { ...(prevVal as any), ...val });
               } else {
                  anualForm.set(key, val);
               }
            }
            await anualForm.save({ transaction: transaction });
            await (anualForm[formType] as db.AnnualReviewForm).save({ transaction: transaction });
         });
         */
         for (const anualForm of anualForms) {
            for (const [key, val] of Object.entries(updateParam)) {
               const prevVal = anualForm.get(key, { plain: true });
               if (checkData(prevVal) === 'Object' && formType) {
                  anualForm.set(key, { ...(prevVal as any), ...val });
               } else {
                  anualForm.set(key, val);
               }
            }
            anualForm.changed('updatedAt', true);
            await anualForm.save({ transaction: transaction, logging: false });
            await (anualForm[formType] as any).save({
               transaction: transaction,
               logging: false,
            });
         }
         await transaction.commit();
         return anualForms;
      } catch (error) {
         await transaction.rollback();
         const err = HttpErrors.IODataBase(error?.message || 'Update Form Error!');
         throw err;
      }
   }
   /**
    *
    * @param formType - If have formType -> populate to formType
    * @returns
    */
   public static findByFormCode(formCode: string, formType?: FormTypeEnum, findOptions?: FindOptions) {
      try {
         const defaultOptions: FindOptions = {
            where: {
               formCode: formCode,
            },
         };
         if (formType) {
            defaultOptions.include = [
               {
                  association: db.Form.associations[formType],
                  as: formType,
               },
            ];
         }
         const forms = db.Form.findAll({ ...defaultOptions, ...findOptions });
         return forms;
      } catch (error) {
         throw error;
      }
   }

   /**
    *
    * @param formType - If have formType -> populate to formType
    * @returns
    */
   public static findById(formID: string, formType?: FormTypeEnum, findOptions?: Omit<FindOptions, 'Where'>) {
      try {
         const defaultOptions: Omit<FindOptions, 'Where'> = {};
         if (formType) {
            defaultOptions.include = [
               {
                  association: db.Form.associations[formType],
                  as: formType,
               },
            ];
         }
         const forms = db.Form.findByPk(formID, { ...defaultOptions, ...findOptions });
         return forms;
      } catch (error) {
         throw error;
      }
   }
}

export default FormLib;
