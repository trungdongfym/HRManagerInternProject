"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const interfaces_1 = require("../../../../commons/interfaces");
const form_model_1 = require("../../../../models/form.model");
const forms_model_1 = require("../forms.model");
const probForm_model_1 = require("./probForm.model");
class ProbFormValidate {
    static createProbFormToAllSchema = Joi.object().keys({
        formCode: Joi.string().required(),
        durationTime: Joi.number().integer().positive(),
        startTime: Joi.date(),
        position: Joi.string(),
        comments: Joi.string(),
        workResult: Joi.string(),
    });
    static updateProbFormToAllSchema = Joi.object().keys({
        durationTime: Joi.number().integer().positive(),
        startTime: Joi.date(),
        position: Joi.string(),
        comments: Joi.string(),
        workResult: Joi.string(),
    });
    static updateFormSchema = Joi.object().keys({
        durationTime: Joi.number().integer().positive(),
        startTime: Joi.date(),
        position: Joi.string(),
        comments: Joi.string(),
        workResult: Joi.string(),
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
            position: Joi.string(),
            ownerID: Joi.string().uuid({ version: 'uuidv4', separator: '-' }),
            reviewerID: Joi.string().uuid({ version: 'uuidv4', separator: '-' }),
        }),
        sort: Joi.object().keys({
            field: Joi.array()
                .items(Joi.valid(probForm_model_1.probFormObject.createdAt, probForm_model_1.probFormObject.sendTime, probForm_model_1.probFormObject.numReject))
                .min(1)
                .single()
                .default([])
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
exports.default = ProbFormValidate;
