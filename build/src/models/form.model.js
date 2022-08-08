"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormStoreStatusArray = exports.FormTypeArray = exports.FormStatusArray = exports.FormStoreAssociation = exports.formAssociations = exports.FormStoreStatusEnum = exports.FormScope = exports.FormTypeEnum = exports.FormStatusEnum = void 0;
var FormStatusEnum;
(function (FormStatusEnum) {
    FormStatusEnum["open"] = "open";
    FormStatusEnum["review"] = "review";
    FormStatusEnum["reject"] = "reject";
    FormStatusEnum["approve"] = "approve";
})(FormStatusEnum = exports.FormStatusEnum || (exports.FormStatusEnum = {}));
var FormTypeEnum;
(function (FormTypeEnum) {
    FormTypeEnum["AnnualReviewForm"] = "annualReviewForm";
    FormTypeEnum["ProbationaryForm"] = "probationaryForm";
})(FormTypeEnum = exports.FormTypeEnum || (exports.FormTypeEnum = {}));
var FormScope;
(function (FormScope) {
    FormScope["populateAnnualForm"] = "populateAnnualForm";
    FormScope["populateProbForm"] = "populateProbForm";
})(FormScope = exports.FormScope || (exports.FormScope = {}));
var FormStoreStatusEnum;
(function (FormStoreStatusEnum) {
    FormStoreStatusEnum["public"] = "public";
    FormStoreStatusEnum["private"] = "private";
})(FormStoreStatusEnum = exports.FormStoreStatusEnum || (exports.FormStoreStatusEnum = {}));
var formAssociations;
(function (formAssociations) {
    formAssociations["formBelongsToOwner"] = "owner";
    formAssociations["ownerHasManyForm"] = "forms";
    formAssociations["formBelongsToReviewer"] = "reviewer";
    formAssociations["reviewerHasManyForm"] = "forms";
    formAssociations["formBelongsToFormStore"] = "formStore";
})(formAssociations = exports.formAssociations || (exports.formAssociations = {}));
var FormStoreAssociation;
(function (FormStoreAssociation) {
    FormStoreAssociation["formBelongsToFormStore"] = "formStore";
    FormStoreAssociation["formStorehasManyForm"] = "forms";
})(FormStoreAssociation = exports.FormStoreAssociation || (exports.FormStoreAssociation = {}));
const x = {
    search: {
        field: ['title'],
        value: 'title fulltext search',
    },
    filter: {
        status: 'public',
        formCode: 'formStoreId',
        year: 2022,
        ownerID: 'uuidv4',
        reviewerID: 'uuidv4',
    },
    sort: {
        field: ['string'],
        type: 'ASC',
    },
    page: 0,
    pageSize: 6,
};
exports.FormStatusArray = Object.values(FormStatusEnum);
exports.FormTypeArray = Object.values(FormTypeEnum);
exports.FormStoreStatusArray = Object.values(FormStoreStatusEnum);
