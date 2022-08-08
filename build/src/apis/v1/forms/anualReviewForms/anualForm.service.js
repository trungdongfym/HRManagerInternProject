"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../../../../configs/database");
const mysql_1 = require("../../../../libs/database/mysql");
const httpErrors_1 = require("../../../../libs/error/httpErrors");
const sendMail_lib_1 = require("../../../../libs/notify/sendMail.lib");
const form_model_1 = require("../../../../models/form.model");
const roles_model_1 = require("../../../../models/roles.model");
const object_utils_1 = require("../../../../utils/object.utils");
const forms_model_1 = require("../forms.model");
const anualForm_model_1 = require("./anualForm.model");
class AnualFormService {
    async createToAllUser(formRaw, actor) {
        const anualFormData = (0, anualForm_model_1.anualFormDataFactory)(formRaw);
        try {
            const { formCode } = anualFormData;
            const formStore = await database_1.db.FormStore.findOne({ where: { formCode: formCode } });
            if (!formStore) {
                throw httpErrors_1.default.BadRequest('formCode not exists!');
            }
            // Check formtype of form store
            if (formStore.formType !== form_model_1.FormTypeEnum.AnnualReviewForm) {
                throw httpErrors_1.default.BadRequest('FormType invalid!');
            }
            if (formStore.status === form_model_1.FormStoreStatusEnum.public) {
                throw httpErrors_1.default.BadRequest('FormStore is published!');
            }
            // Check role and permission of actor
            if (roles_model_1.rolesRankMap[actor.role] < roles_model_1.rolesRankMap[roles_model_1.RolesEnum.Drirector] &&
                formStore.createrID !== actor.userID) {
                throw httpErrors_1.default.Forbiden('Not Permission!');
            }
            const users = await mysql_1.UserDB.getAll({
                where: {
                    role: { [sequelize_1.Op.notIn]: [roles_model_1.RolesEnum.Admin, roles_model_1.RolesEnum.Drirector] },
                },
                raw: true,
            });
            const mailArray = [];
            const bulkAnualForm = users.map((user) => {
                const { userID, email } = user;
                mailArray.push(email);
                const cloneForm = JSON.parse(JSON.stringify(anualFormData));
                cloneForm.ownerID = userID;
                return cloneForm;
            });
            const anualFormCreated = await mysql_1.FormLib.bulkCreate(bulkAnualForm, form_model_1.FormTypeEnum.AnnualReviewForm);
            // Change status form store
            formStore.status = form_model_1.FormStoreStatusEnum.public;
            const sendMailPayload = {
                from: actor.email,
                subject: `Annual review form`,
                to: mailArray,
                text: 'The annual review form has been created, everyone, please enter the system to complete it!',
            };
            (0, sendMail_lib_1.sendMail)(sendMailPayload).catch((err) => {
                console.log(err?.message || 'Error send mail!');
            });
            await formStore.save();
            return anualFormCreated;
        }
        catch (error) {
            throw error;
        }
    }
    async updateToAllUser(formCode, formRaw, userActor) {
        const anualFormData = (0, anualForm_model_1.anualFormDataFactory)(formRaw);
        try {
            const formStore = await database_1.db.FormStore.findOne({ where: { formCode: formCode } });
            if (!formStore) {
                throw httpErrors_1.default.NotFound('Not Found formCode!');
            }
            // rank role > rank Drirector is pass
            if (roles_model_1.rolesRankMap[userActor.role] >= roles_model_1.rolesRankMap[roles_model_1.RolesEnum.Drirector]) {
                formStore.createrID = userActor.userID;
            }
            else if (formStore.createrID !== userActor.userID) {
                throw httpErrors_1.default.Forbiden('Not Permission!');
            }
            const formUpdated = await mysql_1.FormLib.findAndUpdate({ formCode: formCode }, anualFormData, form_model_1.FormTypeEnum.AnnualReviewForm);
            return formUpdated;
        }
        catch (error) {
            throw error;
        }
    }
    // For employee to update the form
    async updateForm(formID, formRaw, userActor) {
        const anualFormData = (0, anualForm_model_1.anualFormDataFactory)(formRaw); //generate anualFormData for include associate
        const formToCheckActor = await database_1.db.Form.findOne({ where: { formID: formID }, logging: false });
        if (!formToCheckActor) {
            throw httpErrors_1.default.NotFound('Not Found formID!');
        }
        // Check only owner or rank >= Drirector can update
        if (roles_model_1.rolesRankMap[userActor.role] < roles_model_1.rolesRankMap[roles_model_1.RolesEnum.Drirector] &&
            formToCheckActor.ownerID !== userActor.userID) {
            throw httpErrors_1.default.Forbiden('Not Permission!');
        }
        try {
            const formUpdated = await mysql_1.FormLib.findByIdAndUpdate(formID, anualFormData, form_model_1.FormTypeEnum.AnnualReviewForm);
            return formUpdated;
        }
        catch (error) {
            throw error;
        }
    }
    // get forms
    async getAnnualForms(queryParams, actor) {
        const { filter = {}, page, pageSize, search, sort } = queryParams;
        // Only admin, drirector, HR or Actor is owner of form is pass
        if (actor.role === roles_model_1.RolesEnum.Manager || actor.role === roles_model_1.RolesEnum.Employee) {
            if (!filter?.ownerID) {
                filter.ownerID = actor.userID;
            }
            else {
                if (filter.ownerID !== actor.userID) {
                    throw httpErrors_1.default.Forbiden(`You don't have permission to get this resource!`);
                }
            }
        }
        const findOptions = {
            raw: true,
        };
        try {
            let isPagination = false;
            let isSkipDB = false;
            if ((0, object_utils_1.checkFieldContaint)(queryParams, ['page', 'pageSize'])) {
                isPagination = true;
            }
            if (isPagination && !search && Object.keys(filter).length > 0) {
                findOptions.offset = pageSize * page;
                findOptions.limit = pageSize;
                isSkipDB = true;
            }
            if (filter) {
                // generate for nested object in include association
                const filterApply = (0, anualForm_model_1.filterAnualFormFactory)(filter);
                findOptions.where = filterApply;
            }
            if (search) {
                const associateFormStoreObject = (0, forms_model_1.getAssociationObject)(form_model_1.FormStoreAssociation.formBelongsToFormStore);
                const formStoreKey = Object.keys(associateFormStoreObject);
                // add prefix for field search to access to include association
                search.field = search.field.map((val) => {
                    if (formStoreKey.includes(val)) {
                        return associateFormStoreObject[val];
                    }
                    return `form.${val}`;
                });
                findOptions.where = {
                    ...findOptions.where,
                    [sequelize_1.Op.and]: [
                        sequelize_1.Sequelize.literal(`MATCH (${search.field.join(',')}) AGAINST ('${search.value.split(/\s+/).join(',')}')`),
                    ],
                };
            }
            if (sort) {
                findOptions.order = [sequelize_1.Sequelize.literal(`${sort.field.join(',')} ${sort.type}`)];
            }
            let annualForms;
            if (isPagination) {
                annualForms = await database_1.db.Form.scope(form_model_1.FormScope.populateAnnualForm).findAndCountAll(findOptions);
                if (isPagination && !isSkipDB) {
                    // limit and skip hand made :v, củ chuối
                    annualForms.rows = annualForms.rows.slice(page * pageSize, pageSize * page + pageSize);
                }
            }
            else {
                annualForms = await database_1.db.Form.scope(form_model_1.FormScope.populateAnnualForm).findAll(findOptions);
            }
            return annualForms;
        }
        catch (error) {
            throw error;
        }
    }
    async getForm(formID, actor) {
        try {
            if (!formID) {
                throw httpErrors_1.default.BadRequest('formID is required!');
            }
            const annualForm = await database_1.db.Form.scope(form_model_1.FormScope.populateAnnualForm).findByPk(formID);
            if (!annualForm) {
                throw httpErrors_1.default.NotFound(`AnnualReviewForm form with formID ${formID} not exists!`);
            }
            if (actor.role === roles_model_1.RolesEnum.Manager || actor.role === roles_model_1.RolesEnum.Employee) {
                if (annualForm.ownerID !== actor.userID) {
                    throw httpErrors_1.default.Forbiden(`You don't have permission to get this resource!`);
                }
            }
            return annualForm;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.default = AnualFormService;
