"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterProbFormFactory = exports.probFormDataFactory = exports.probFieldToSelectAttr = exports.probFormObject = void 0;
const form_model_1 = require("../../../../models/form.model");
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
const probFormFakeData = {
    durationTime: `${form_model_1.FormTypeEnum.ProbationaryForm}.durationTime`,
    startTime: `${form_model_1.FormTypeEnum.ProbationaryForm}.startTime`,
    position: `${form_model_1.FormTypeEnum.ProbationaryForm}.position`,
    comments: `${form_model_1.FormTypeEnum.ProbationaryForm}.comments`,
    workResult: `${form_model_1.FormTypeEnum.ProbationaryForm}.workResult`,
};
// a object contain all properties of IAnualFormData
exports.probFormObject = {
    ...formFakeData,
    ...probFormFakeData,
};
const keysProbForm = Object.keys(probFormFakeData);
exports.probFieldToSelectAttr = Object.values(exports.probFormObject);
function probFormDataFactory(anualFormData) {
    const keysForm = Object.keys(formFakeData);
    const keysData = Object.keys(anualFormData);
    const result = {};
    for (const keyData of keysData) {
        if (keysForm.includes(keyData)) {
            result[keyData] = anualFormData[keyData];
        }
        else if (keysProbForm.includes(keyData)) {
            if (!result[form_model_1.FormTypeEnum.ProbationaryForm]) {
                result[form_model_1.FormTypeEnum.ProbationaryForm] = {};
            }
            result[form_model_1.FormTypeEnum.ProbationaryForm][keyData] = anualFormData[keyData];
        }
    }
    return result;
}
exports.probFormDataFactory = probFormDataFactory;
function filterProbFormFactory(filterData) {
    const filterDataClone = JSON.parse(JSON.stringify(filterData));
    for (const [key, val] of Object.entries(filterDataClone)) {
        // Generate new key for nested associations access
        if (keysProbForm.includes(key)) {
            delete filterDataClone[key];
            filterDataClone[`$${probFormFakeData[key]}$`] = val;
        }
    }
    return filterDataClone;
}
exports.filterProbFormFactory = filterProbFormFactory;
