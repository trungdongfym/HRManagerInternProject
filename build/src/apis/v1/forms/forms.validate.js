"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const interfaces_1 = require("../../../commons/interfaces");
const form_model_1 = require("../../../models/form.model");
const forms_model_1 = require("./forms.model");
class FormValidate {
    static createFormStoreSchema = Joi.object().keys({
        formCode: Joi.string().required(),
        title: Joi.string().required(),
        formType: Joi.string()
            .valid(...form_model_1.FormTypeArray)
            .required(),
        describe: Joi.string(),
        note: Joi.string(),
    });
    static updateFormStoreSchema = Joi.object().keys({
        title: Joi.string(),
        formType: Joi.string().valid(...form_model_1.FormTypeArray),
        describe: Joi.string(),
        note: Joi.string(),
    });
    static updateFormStatusSchema = Joi.object().keys({
        status: Joi.string().valid(...form_model_1.FormStatusArray),
    });
    static queryReportFormSchema = Joi.object().keys({
        filter: Joi.object().keys({
            formCode: Joi.string(),
            formType: Joi.string().valid(...form_model_1.FormTypeArray),
        }),
        detailsField: Joi.array()
            .items(Joi.valid(form_model_1.formAssociations.formBelongsToOwner, form_model_1.formAssociations.formBelongsToReviewer, form_model_1.formAssociations.formBelongsToFormStore))
            .single()
            .default([])
            .unique(),
    });
    static queryFormStoreSchema = Joi.object()
        .keys({
        search: Joi.object().keys({
            field: Joi.array().items(Joi.valid(forms_model_1.formStoreObject.title)).single().default([]).min(1).required(),
            value: Joi.string().required(),
        }),
        filter: Joi.object().keys({
            status: Joi.string().valid(...form_model_1.FormStoreStatusArray),
            formType: Joi.string().valid(...form_model_1.FormTypeArray),
            createrID: Joi.string().uuid({ version: 'uuidv4', separator: '-' }),
        }),
        sort: Joi.object().keys({
            field: Joi.array()
                .items(Joi.valid(forms_model_1.formStoreObject.createdAt, forms_model_1.formStoreObject.updatedAt))
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
exports.default = FormValidate;
