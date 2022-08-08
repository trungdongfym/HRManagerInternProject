"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormStore = exports.AnnualReviewForm = exports.ProbationaryForm = exports.Form = exports.User = void 0;
const user_1 = require("./user");
exports.User = user_1.default;
const form_1 = require("./form");
exports.Form = form_1.default;
const ProbationaryForm_1 = require("./ProbationaryForm");
exports.ProbationaryForm = ProbationaryForm_1.default;
const AnnualReviewForm_1 = require("./AnnualReviewForm");
exports.AnnualReviewForm = AnnualReviewForm_1.default;
const formStore_1 = require("./formStore");
exports.FormStore = formStore_1.default;
const form_model_1 = require("../../../../models/form.model");
const forms_model_1 = require("../../../../apis/v1/forms/forms.model");
form_1.default.addScope(form_model_1.FormScope.populateAnnualForm, {
    raw: true,
    attributes: [
        ...forms_model_1.annualFormFieldToMerge,
        ...Object.values((0, forms_model_1.getAssociationObject)(form_model_1.FormStoreAssociation.formBelongsToFormStore, null, [
            'createdAt',
            'updatedAt',
            'formType',
            'status',
        ])),
    ],
    include: [
        {
            model: AnnualReviewForm_1.default,
            as: form_model_1.FormTypeEnum.AnnualReviewForm,
            attributes: [],
            required: true,
        },
        {
            model: formStore_1.default,
            association: formStore_1.default.associations[form_model_1.FormStoreAssociation.formBelongsToFormStore],
            as: form_model_1.FormStoreAssociation.formBelongsToFormStore,
            attributes: [],
            required: true,
        },
    ],
});
form_1.default.addScope(form_model_1.FormScope.populateProbForm, {
    raw: true,
    attributes: [
        ...forms_model_1.probFieldToSelectAttr,
        ...Object.values((0, forms_model_1.getAssociationObject)(form_model_1.FormStoreAssociation.formBelongsToFormStore, null, [
            'createdAt',
            'updatedAt',
            'formType',
            'status',
        ])),
    ],
    include: [
        {
            model: ProbationaryForm_1.default,
            as: form_model_1.FormTypeEnum.ProbationaryForm,
            attributes: [],
            required: true,
        },
        {
            model: formStore_1.default,
            association: formStore_1.default.associations[form_model_1.FormStoreAssociation.formBelongsToFormStore],
            as: form_model_1.FormStoreAssociation.formBelongsToFormStore,
            attributes: [],
            required: true,
        },
    ],
});
