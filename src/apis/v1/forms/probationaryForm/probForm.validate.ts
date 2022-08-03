import * as Joi from 'joi';
import { IProbationaryForm } from './probForm.model';

class ProbFormValidate {
   public static createProbFormToAllSchema: Joi.ObjectSchema<IProbationaryForm> = Joi.object().keys({
      formCode: Joi.string().required(),
      durationTime: Joi.number().integer().positive(),
      startTime: Joi.date(),
      position: Joi.string(),
      comments: Joi.string(),
      workResult: Joi.string(),
   });
}

export default ProbFormValidate;
