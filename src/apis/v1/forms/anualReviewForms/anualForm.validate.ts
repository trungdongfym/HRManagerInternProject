import * as Joi from 'joi';
import { IFormQueryParams, IReportQueryParams, sortTypeArray } from '../../../../commons/interfaces';
import { formAssociations, FormStatusArray, FormTypeArray } from '../../../../models/form.model';
import { formStoreObject } from '../forms.model';
import { annualFormObject, IAnnualReviewForm } from './anualForm.model';

class AnualFormValidate {
   public static createFormToAllSchema: Joi.ObjectSchema<IAnnualReviewForm> = Joi.object().keys({
      formCode: Joi.string().required(),
      year: Joi.number().min(2000).max(new Date().getFullYear()).required(),
      review: Joi.string().allow(null, ''),
      department: Joi.string(),
      point: Joi.number().positive().min(0).max(10).allow(null, ''),
   });

   public static updateFormToAllSchema: Joi.ObjectSchema<IAnnualReviewForm> = Joi.object().keys({
      year: Joi.number().min(2000).max(new Date().getFullYear()),
      review: Joi.string().allow(null, ''),
      point: Joi.number().positive().min(0).max(10).allow(null, ''),
      department: Joi.string(),
   });

   public static updateFormSchema: Joi.ObjectSchema<IAnnualReviewForm> = Joi.object().keys({
      review: Joi.string().allow(null, ''),
      point: Joi.number().positive().min(0).max(10).allow(null, ''),
      department: Joi.string(),
   });

   public static queryFormSchema: Joi.ObjectSchema<IFormQueryParams<IAnnualReviewForm>> = Joi.object()
      .keys({
         search: Joi.object().keys({
            field: Joi.array().items(Joi.valid(formStoreObject.title)).min(1).required(),
            value: Joi.string().required(),
         }),
         filter: Joi.object().keys({
            status: Joi.string().valid(...FormStatusArray),
            formCode: Joi.string(),
            year: Joi.number().min(2000).max(new Date().getFullYear()),
            ownerID: Joi.string().uuid({ version: 'uuidv4', separator: '-' }),
            reviewerID: Joi.string().uuid({ version: 'uuidv4', separator: '-' }),
         }),
         sort: Joi.object().keys({
            field: Joi.array()
               .items(
                  Joi.valid(annualFormObject.createdAt, annualFormObject.sendTime, annualFormObject.numReject)
               )
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

export default AnualFormValidate;
