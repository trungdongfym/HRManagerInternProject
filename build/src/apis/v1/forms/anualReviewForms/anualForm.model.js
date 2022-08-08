"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterAnualFormFactory = exports.anualFormDataFactory = exports.annualFormFieldToMerge = exports.annualFormDataKeys = exports.annualFormObject = void 0;
const form_model_1 = require("../../../../models/form.model");
// Fake a form have full attribute of IAnualFormData
const formFakeData = {
    formID: 'formID',
    formCode: 'formCode',
    ownerID: 'ownerID',
    reviewerID: 'reviewerID',
    sendTime: 'sendTime',
    status: 'status',
    numReject: 'numReject',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
};
const anualFormFakeData = {
    department: `${form_model_1.FormTypeEnum.AnnualReviewForm}.department`,
    point: `${form_model_1.FormTypeEnum.AnnualReviewForm}.point`,
    review: `${form_model_1.FormTypeEnum.AnnualReviewForm}.review`,
    year: `${form_model_1.FormTypeEnum.AnnualReviewForm}.year`,
};
// a object contain all properties of IAnualFormData
exports.annualFormObject = {
    ...formFakeData,
    ...anualFormFakeData,
};
// a array contain all properties of IAnualFormData
exports.annualFormDataKeys = Object.keys(exports.annualFormObject);
exports.annualFormFieldToMerge = Object.values(exports.annualFormObject);
const keysAnualForm = Object.keys(anualFormFakeData);
function anualFormDataFactory(anualFormData) {
    const keysForm = Object.keys(formFakeData);
    const keysData = Object.keys(anualFormData);
    const result = {};
    for (const keyData of keysData) {
        if (keysForm.includes(keyData)) {
            result[keyData] = anualFormData[keyData];
        }
        else if (keysAnualForm.includes(keyData)) {
            if (!result[form_model_1.FormTypeEnum.AnnualReviewForm]) {
                result[form_model_1.FormTypeEnum.AnnualReviewForm] = {};
            }
            result[form_model_1.FormTypeEnum.AnnualReviewForm][keyData] = anualFormData[keyData];
        }
    }
    return result;
}
exports.anualFormDataFactory = anualFormDataFactory;
function filterAnualFormFactory(filterData) {
    const filterDataClone = JSON.parse(JSON.stringify(filterData));
    for (const [key, val] of Object.entries(filterDataClone)) {
        // Generate new key for nested associations access
        if (keysAnualForm.includes(key)) {
            delete filterDataClone[key];
            filterDataClone[`$${anualFormFakeData[key]}$`] = val;
        }
    }
    return filterDataClone;
}
exports.filterAnualFormFactory = filterAnualFormFactory;
