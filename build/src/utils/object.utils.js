"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkFieldContaint = exports.checkData = exports.pickField = void 0;
/**
 * @description Select the specified property in an object
 * @param dataObject  Target object
 * @param pickFieldArray Array field
 * @return An object
 */
function pickField(dataObject, pickFieldArray) {
    const objectKeys = Object.keys(dataObject);
    const resObject = {};
    for (const keyPick of pickFieldArray) {
        if (objectKeys.includes(keyPick)) {
            resObject[keyPick] = dataObject[keyPick];
        }
    }
    return resObject;
}
exports.pickField = pickField;
function checkData(data) {
    let res = Object.prototype.toString.apply(data);
    res = res.slice(8, -1);
    return res;
}
exports.checkData = checkData;
/**
 *
 * @param objectCheck Object check
 * @param fieldsCheck Field check
 * @returns true if Field check exists in Object check, otherwise false
 */
function checkFieldContaint(objectCheck, fieldsCheck) {
    if (!Array.isArray(fieldsCheck))
        fieldsCheck = [fieldsCheck];
    for (const field of fieldsCheck) {
        if (Object.prototype.hasOwnProperty.call(objectCheck, field)) {
            return true;
        }
    }
    return false;
}
exports.checkFieldContaint = checkFieldContaint;
