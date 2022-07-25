import * as Joi from 'joi';
import Regex from '../../commons/constants/regex.const';
import { rolesArray, RolesEnum } from '../../models/roles.model';
import { User } from './users.model';

class UserValidate {
   public static createUserSchema: Joi.ObjectSchema<User> = Joi.object().keys({
      staffCode: Joi.string().trim().required(),
      firstName: Joi.string().trim().required(),
      lastName: Joi.string().trim().required(),
      phone: Joi.string().trim().regex(Regex.regexPhoneNumber).allow(''),
      avatar: Joi.string().trim().allow(''),
      cmnd: Joi.string().trim().allow(''),
      numberBHXH: Joi.string().trim().allow(''),
      address: Joi.string().trim().allow(''),
      email: Joi.string()
         .trim()
         .email({ tlds: { allow: false } })
         .required(),
      password: Joi.string().regex(Regex.regexPassword).required(),
      confirmPassword: Joi.ref('password'),
      role: Joi.string()
         .valid(...rolesArray)
         .default(RolesEnum.Employee)
         .required(),
   });

   public static updateUserSchema: Joi.ObjectSchema<User> = Joi.object().keys({
      staffCode: Joi.string().trim(),
      firstName: Joi.string().trim(),
      lastName: Joi.string().trim(),
      phone: Joi.string().trim().regex(Regex.regexPhoneNumber).allow(''),
      avatar: Joi.string().trim().allow(''),
      cmnd: Joi.string().trim().allow(''),
      numberBHXH: Joi.string().trim().allow(''),
      address: Joi.string().trim().allow(''),
      email: Joi.string()
         .trim()
         .email({ tlds: { allow: false } }),
      role: Joi.string()
         .valid(...rolesArray)
         .default(RolesEnum.Employee)
         .required(),
   });

   public static loginSchema: Joi.ObjectSchema<User> = Joi.object().keys({
      email: Joi.string()
         .trim()
         .email({ tlds: { allow: false } })
         .required(),
      password: Joi.string().regex(Regex.regexPassword).required(),
      confirmPassword: Joi.ref('password'),
   });
}

export default UserValidate;
