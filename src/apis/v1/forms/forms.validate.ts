import * as Joi from 'joi';
import { IFormStoreQueryParams, IReportQueryParams, sortTypeArray } from '../../../commons/interfaces';
import {
   formAssociations,
   FormStatusArray,
   FormStoreStatusArray,
   FormTypeArray,
} from '../../../models/form.model';
import { rolesArray } from '../../../models/roles.model';
import { formStoreObject, IForm, IFormStore } from './forms.model';

class FormValidate {
   public static createFormStoreSchema: Joi.ObjectSchema<IFormStore> = Joi.object().keys({
      formCode: Joi.string().required(),
      title: Joi.string().required(),
      formType: Joi.string()
         .valid(...FormTypeArray)
         .required(),
      describe: Joi.string(),
      note: Joi.string(),
   });
   public static updateFormStoreSchema: Joi.ObjectSchema<IFormStore> = Joi.object().keys({
      title: Joi.string(),
      formType: Joi.string().valid(...FormTypeArray),
      describe: Joi.string(),
      note: Joi.string(),
   });

   public static updateFormStatusSchema: Joi.ObjectSchema<IForm> = Joi.object().keys({
      status: Joi.string().valid(...FormStatusArray),
   });

   public static queryReportFormSchema: Joi.ObjectSchema<IReportQueryParams<IForm>> = Joi.object().keys({
      filter: Joi.object().keys({
         formCode: Joi.string(),
         formType: Joi.string().valid(...FormTypeArray),
      }),
      detailsField: Joi.array()
         .items(
            Joi.valid(
               formAssociations.formBelongsToOwner,
               formAssociations.formBelongsToReviewer,
               formAssociations.formBelongsToFormStore
            )
         )
         .single()
         .default([])
         .unique(),
   });

   public static queryFormStoreSchema: Joi.ObjectSchema<IFormStoreQueryParams> = Joi.object()
      .keys({
         search: Joi.object().keys({
            field: Joi.array().items(Joi.valid(formStoreObject.title)).single().default([]).min(1).required(),
            value: Joi.string().required(),
         }),
         filter: Joi.object().keys({
            status: Joi.string().valid(...FormStoreStatusArray),
            formType: Joi.string().valid(...FormTypeArray),
            createrID: Joi.string().uuid({ version: 'uuidv4', separator: '-' }),
         }),
         sort: Joi.object().keys({
            field: Joi.array()
               .items(Joi.valid(formStoreObject.createdAt, formStoreObject.updatedAt))
               .single()
               .default([])
               .min(1)
               .required(),
            type: Joi.string()
               .valid(...sortTypeArray)
               .required(),
         }),
         page: Joi.when('pageSize', {
            is: Joi.exist(),
            then: Joi.number().required(),
            otherwise: Joi.forbidden().error(new Error('Page and pageSize must go together')),
         }),
         pageSize: Joi.number(),
      })
      .and('page', 'pageSize');
}

export default FormValidate;
