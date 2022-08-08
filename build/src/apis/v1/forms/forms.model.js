"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssociationObject = exports.formStoreObject = void 0;
exports.formStoreObject = {
    formCode: 'formCode',
    title: 'title',
    formType: 'formType',
    status: 'status',
    describe: 'status',
    note: 'note',
    createrID: 'createrID',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
};
// To get object have value refer to include association
/**
 *
 * @param association FormStoreAssociation
 * @param include include attribute
 * @param exclude exclude attribute
 * @returns {object} An object have value access to an association table
 */
const getAssociationObject = (association, include, exclude) => {
    const res = {};
    for (const [key, _] of Object.entries(exports.formStoreObject)) {
        if (include) {
            if (include.includes(key)) {
                res[key] = `${association}.${key}`;
            }
        }
        else {
            res[key] = `${association}.${key}`;
        }
        if (exclude && res[key] && exclude.includes(key)) {
            delete res[key];
        }
    }
    return res;
};
exports.getAssociationObject = getAssociationObject;
__exportStar(require("./anualReviewForms/anualForm.model"), exports);
__exportStar(require("./probationaryForm/probForm.model"), exports);
