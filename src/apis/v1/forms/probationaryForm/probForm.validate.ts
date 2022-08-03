import * as Joi from 'joi';
import { IFormQueryParams, sortTypeArray } from '../../../../commons/interfaces';
import { FormStatusArray } from '../../../../models/form.model';
import { rolesArray } from '../../../../models/roles.model';
import { formStoreObject } from '../forms.model';
import { IProbationaryForm, probFormObject } from './probForm.model';

class ProbFormValidate {
   public static createProbFormToAllSchema: Joi.ObjectSchema<IProbationaryForm> = Joi.object().keys({
      formCode: Joi.string().required(),
      durationTime: Joi.number().integer().positive(),
      startTime: Joi.date(),
      position: Joi.string().valid(...rolesArray),
      comments: Joi.string(),
      workResult: Joi.string(),
   });

   public static updateProbFormToAllSchema: Joi.ObjectSchema<IProbationaryForm> = Joi.object().keys({
      durationTime: Joi.number().integer().positive(),
      startTime: Joi.date(),
      position: Joi.string().valid(...rolesArray),
      comments: Joi.string(),
      workResult: Joi.string(),
   });

   public static updateFormSchema: Joi.ObjectSchema<IProbationaryForm> = Joi.object().keys({
      durationTime: Joi.number().integer().positive(),
      startTime: Joi.date(),
      position: Joi.string().valid(...rolesArray),
      comments: Joi.string(),
      workResult: Joi.string(),
   });

   public static queryFormSchema: Joi.ObjectSchema<IFormQueryParams<IProbationaryForm>> = Joi.object()
      .keys({
         search: Joi.object().keys({
            field: Joi.array().items(Joi.valid(formStoreObject.title)).min(1).required(),
            value: Joi.string().required(),
         }),
         filter: Joi.object().keys({
            status: Joi.string().valid(...FormStatusArray),
            formCode: Joi.string(),
            position: Joi.string().valid(...rolesArray),
            ownerID: Joi.string().uuid({ version: 'uuidv4', separator: '-' }),
            reviewerID: Joi.string().uuid({ version: 'uuidv4', separator: '-' }),
         }),
         sort: Joi.object().keys({
            field: Joi.array()
               .items(Joi.valid(probFormObject.createdAt, probFormObject.sendTime, probFormObject.numReject))
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

export default ProbFormValidate;
