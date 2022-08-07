import * as Joi from 'joi';
import Regex from '../../../commons/constants/regex.const';
import { IAdminQueryUserParams, IUserQueryParams } from '../../../commons/interfaces';
import { rolesArray, RolesEnum } from '../../../models/roles.model';
import { User } from './users.model';

class UserValidate {
   public static createUserSchema: Joi.ObjectSchema<User> = Joi.object().keys({
      staffCode: Joi.string().trim().required(),
      firstName: Joi.string().trim().required(),
      lastName: Joi.string().trim().required(),
      phone: Joi.string().trim().regex(Regex.regexPhoneNumber).allow(''),
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
      role: Joi.string().valid(...rolesArray),
      managerID: Joi.string().uuid({ version: 'uuidv4', separator: '-' }).allow('', null),
   });

   public static loginSchema: Joi.ObjectSchema<User> = Joi.object().keys({
      email: Joi.string()
         .trim()
         .email({ tlds: { allow: false } })
         .required(),
      password: Joi.string().regex(Regex.regexPassword).required(),
      confirmPassword: Joi.ref('password'),
   });

   public static adminQueryUserParamsSchema: Joi.ObjectSchema<IAdminQueryUserParams> = Joi.object()
      .keys({
         user: Joi.object().keys({
            staffCode: Joi.string().trim(),
            email: Joi.string()
               .trim()
               .email({ tlds: { allow: false } }),
            role: Joi.string().valid(...rolesArray),
         }),
         page: Joi.when('pageSize', {
            is: Joi.exist(),
            then: Joi.number().required(),
            otherwise: Joi.forbidden().error(new Error('Page and pageSize must go together')),
         }),
         pageSize: Joi.number().when('user', {
            is: Joi.exist(),
            then: Joi.forbidden().error(
               new Error('The user field cannot appear with the pageSize and page fields')
            ),
         }),
         requireManager: Joi.boolean(),
         roles: Joi.array()
            .items(Joi.valid(...rolesArray))
            .min(1),
      })
      .and('page', 'pageSize');

   public static userQueryParamsSchema: Joi.ObjectSchema<IUserQueryParams> = Joi.object().keys({
      userID: Joi.string().uuid({ version: 'uuidv4', separator: '-' }),
      requireManager: Joi.boolean(),
   });
}

export default UserValidate;
