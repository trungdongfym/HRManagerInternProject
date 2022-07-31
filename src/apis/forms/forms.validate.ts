import * as Joi from 'joi';
import { FormStatusArray } from '../../models/form.model';
import { IForm } from './forms.model';

class FormValidate {
   public static updateFormStatusSchema: Joi.ObjectSchema<IForm> = Joi.object().keys({
      status: Joi.string().valid(...FormStatusArray),
   });
}

export default FormValidate;
