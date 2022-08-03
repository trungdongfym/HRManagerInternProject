import * as Joi from 'joi';
import { IReportQueryParams } from '../../../commons/interfaces';
import { formAssociations, FormStatusArray, FormTypeArray } from '../../../models/form.model';
import { IForm, IFormStore } from './forms.model';

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
      detailsField: Joi.array().items(
         Joi.valid(
            formAssociations.formBelongsToOwner,
            formAssociations.formBelongsToReviewer,
            formAssociations.formBelongsToFormStore
         )
      ),
   });
}

export default FormValidate;
