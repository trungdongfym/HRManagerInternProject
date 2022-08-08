"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const regex_const_1 = require("../../../commons/constants/regex.const");
const roles_model_1 = require("../../../models/roles.model");
class UserValidate {
    static createUserSchema = Joi.object().keys({
        staffCode: Joi.string().trim().required(),
        firstName: Joi.string().trim().required(),
        lastName: Joi.string().trim().required(),
        phone: Joi.string().trim().regex(regex_const_1.default.regexPhoneNumber).allow(''),
        cmnd: Joi.string().trim().allow(''),
        numberBHXH: Joi.string().trim().allow(''),
        address: Joi.string().trim().allow(''),
        email: Joi.string()
            .trim()
            .email({ tlds: { allow: false } })
            .required(),
        password: Joi.string().regex(regex_const_1.default.regexPassword).required(),
        confirmPassword: Joi.ref('password'),
        role: Joi.string()
            .valid(...roles_model_1.rolesArray)
            .default(roles_model_1.RolesEnum.Employee)
            .required(),
    });
    static updateUserSchema = Joi.object().keys({
        staffCode: Joi.string().trim(),
        firstName: Joi.string().trim(),
        lastName: Joi.string().trim(),
        phone: Joi.string().trim().regex(regex_const_1.default.regexPhoneNumber).allow(''),
        avatar: Joi.string().trim().allow(''),
        cmnd: Joi.string().trim().allow(''),
        numberBHXH: Joi.string().trim().allow(''),
        address: Joi.string().trim().allow(''),
        email: Joi.string()
            .trim()
            .email({ tlds: { allow: false } }),
        role: Joi.string().valid(...roles_model_1.rolesArray),
        managerID: Joi.string().uuid({ version: 'uuidv4', separator: '-' }).allow('', null),
    });
    static loginSchema = Joi.object().keys({
        email: Joi.string()
            .trim()
            .email({ tlds: { allow: false } })
            .required(),
        password: Joi.string().regex(regex_const_1.default.regexPassword).required(),
        confirmPassword: Joi.ref('password'),
    });
    static adminQueryUserParamsSchema = Joi.object()
        .keys({
        user: Joi.object().keys({
            staffCode: Joi.string().trim(),
            email: Joi.string()
                .trim()
                .email({ tlds: { allow: false } }),
        }),
        page: Joi.when('pageSize', {
            is: Joi.exist(),
            then: Joi.number().required(),
            otherwise: Joi.forbidden().error(new Error('Page and pageSize must go together')),
        }),
        pageSize: Joi.number().when('user', {
            is: Joi.exist(),
            then: Joi.forbidden().error(new Error('The user field cannot appear with the pageSize and page fields')),
        }),
        requireManager: Joi.boolean(),
        roles: Joi.array()
            .items(Joi.valid(...roles_model_1.rolesArray))
            .min(1),
    })
        .and('page', 'pageSize');
    static userQueryParamsSchema = Joi.object().keys({
        userID: Joi.string().uuid({ version: 'uuidv4', separator: '-' }),
        requireManager: Joi.boolean(),
    });
}
exports.default = UserValidate;
