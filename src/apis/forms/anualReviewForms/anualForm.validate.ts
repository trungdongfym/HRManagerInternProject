import * as Joi from 'joi';
import { FormStatusArray } from '../../../models/form.model';
import { IAnnualReviewForm } from './anualForm.model';

class AnualFormValidate {
   public static createFormToAllSchema: Joi.ObjectSchema<IAnnualReviewForm> = Joi.object().keys({
      formCode: Joi.string().min(3).required(),
      title: Joi.string().required(),
      year: Joi.date().required(),
      review: Joi.string().allow(null, ''),
      point: Joi.number().positive().min(0).max(10).allow(null, ''),
   });

   public static updateFormToAllSchema: Joi.ObjectSchema<IAnnualReviewForm> = Joi.object().keys({
      title: Joi.string(),
      year: Joi.date(),
      status: Joi.string().valid(...FormStatusArray),
      review: Joi.string().allow(null, ''),
      point: Joi.number().positive().min(0).max(10).allow(null, ''),
   });

   public static updateFormSchema: Joi.ObjectSchema<IAnnualReviewForm> = Joi.object().keys({
      review: Joi.string().allow(null, ''),
      point: Joi.number().positive().min(0).max(10).allow(null, ''),
   });
}

export default AnualFormValidate;
