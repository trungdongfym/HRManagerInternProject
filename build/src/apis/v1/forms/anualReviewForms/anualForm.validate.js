"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const interfaces_1 = require("../../../../commons/interfaces");
const form_model_1 = require("../../../../models/form.model");
const forms_model_1 = require("../forms.model");
const anualForm_model_1 = require("./anualForm.model");
class AnualFormValidate {
    static createFormToAllSchema = Joi.object().keys({
        formCode: Joi.string().required(),
        year: Joi.number().min(2000).max(new Date().getFullYear()),
        review: Joi.string().allow(null, ''),
        department: Joi.string(),
        point: Joi.number().positive().min(0).max(10).allow(null, ''),
    });
    static updateFormToAllSchema = Joi.object().keys({
        year: Joi.number().min(2000).max(new Date().getFullYear()),
        review: Joi.string().allow(null, ''),
        point: Joi.number().positive().min(0).max(10).allow(null, ''),
        department: Joi.string(),
    });
    static updateFormSchema = Joi.object().keys({
        review: Joi.string().allow(null, ''),
        point: Joi.number().positive().min(0).max(10).allow(null, ''),
        department: Joi.string(),
    });
    static queryFormSchema = Joi.object()
        .keys({
        search: Joi.object().keys({
            field: Joi.array().items(Joi.valid(forms_model_1.formStoreObject.title)).single().default([]).min(1).required(),
            value: Joi.string().required(),
        }),
        filter: Joi.object().keys({
            status: Joi.string().valid(...form_model_1.FormStatusArray),
            formCode: Joi.string(),
            year: Joi.number().min(2000).max(new Date().getFullYear()),
            ownerID: Joi.string().uuid({ version: 'uuidv4', separator: '-' }),
            reviewerID: Joi.string().uuid({ version: 'uuidv4', separator: '-' }),
        }),
        sort: Joi.object().keys({
            field: Joi.array()
                .items(Joi.valid(anualForm_model_1.annualFormObject.createdAt, anualForm_model_1.annualFormObject.sendTime, anualForm_model_1.annualFormObject.numReject))
                .single()
                .default([])
                .min(1)
                .required(),
            type: Joi.string()
                .valid(...interfaces_1.sortTypeArray)
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
exports.default = AnualFormValidate;
