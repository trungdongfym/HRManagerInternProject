"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../../../configs/database");
const mysql_1 = require("../../../libs/database/mysql");
const httpErrors_1 = require("../../../libs/error/httpErrors");
const form_model_1 = require("../../../models/form.model");
const roles_model_1 = require("../../../models/roles.model");
const object_utils_1 = require("../../../utils/object.utils");
class FormService {
    async createFormStore(formStore, actor) {
        try {
            const { formCode } = formStore;
            const formCodeExist = await database_1.db.FormStore.findByPk(formCode);
            if (formCodeExist) {
                throw httpErrors_1.default.Conflict('formCode is exists!');
            }
            formStore.createrID = actor.userID;
            const formStoreCreated = await database_1.db.FormStore.create(formStore);
            return formStoreCreated;
        }
        catch (error) {
            throw error;
        }
    }
    async updateFormStatus(formID, status, userActor) {
        const formUpdate = await database_1.db.Form.findOne({ where: { formID: formID }, logging: false });
        if (!formUpdate) {
            throw httpErrors_1.default.NotFound('Not Found formID!');
        }
        // generate permission for userActor
        const permission = {
            [formUpdate.ownerID]: [form_model_1.FormStatusEnum.review].filter((_) => {
                return formUpdate.status === form_model_1.FormStatusEnum.open;
            }),
            // Only reviewer can approve or reject
            [formUpdate.reviewerID]: [form_model_1.FormStatusEnum.approve, form_model_1.FormStatusEnum.reject],
        };
        try {
            if (roles_model_1.rolesRankMap[userActor.role] < roles_model_1.rolesRankMap[roles_model_1.RolesEnum.Drirector] &&
                !permission[userActor.userID]?.includes(status)) {
                throw httpErrors_1.default.Forbiden(`You don't permission update this form or form with status ${status}!`);
            }
            if (status === form_model_1.FormStatusEnum.review) {
                const detailOwner = await database_1.db.User.findByPk(formUpdate.ownerID, { logging: false });
                if (!detailOwner) {
                    throw httpErrors_1.default.ServerError('User active but not found in DB!');
                }
                // If user dont have manager, but actor >= drirector then assign managerID to reviewerID
                if (!detailOwner.managerID) {
                    detailOwner.managerID = userActor.userID;
                }
                formUpdate.set('status', status);
                formUpdate.set('sendTime', new Date());
                formUpdate.set('reviewerID', detailOwner.managerID);
                const formUpdated = await formUpdate.save();
                return formUpdated;
            }
            else {
                if (status === form_model_1.FormStatusEnum.approve) {
                    formUpdate.set('status', status);
                    if (!formUpdate.reviewerID) {
                        formUpdate.set('reviewerID', userActor.userID);
                    }
                    const formUpdated = await formUpdate.save({ logging: false });
                    return formUpdated;
                }
                if (status === form_model_1.FormStatusEnum.reject) {
                    const numReject = formUpdate.numReject;
                    formUpdate.numReject = numReject + 1;
                    formUpdate.status = form_model_1.FormStatusEnum.open;
                    formUpdate.reviewerID = null;
                    const formUpdated = await formUpdate.save({ logging: false });
                    return formUpdated;
                }
            }
        }
        catch (error) {
            throw error;
        }
    }
    async deleteFormStore(formCode, actor) {
        try {
            if (!formCode) {
                throw httpErrors_1.default.BadRequest('FormCode is required!');
            }
            const formStoreDelete = await database_1.db.FormStore.findByPk(formCode);
            if (!formStoreDelete) {
                throw httpErrors_1.default.NotFound('Not Found Forms!');
            }
            // Only rank role > Drirector or creater of form can delete
            if (roles_model_1.rolesRankMap[actor.role] < roles_model_1.rolesRankMap[roles_model_1.RolesEnum.Drirector] &&
                formStoreDelete.createrID !== actor.userID) {
                throw httpErrors_1.default.Forbiden(`You don't have permission to delete this form!`);
            }
            const res = await database_1.db.FormStore.destroy({
                where: {
                    formCode: formCode,
                },
            });
            return res;
        }
        catch (error) {
            throw error;
        }
    }
    async deleteForm(formID, actor) {
        try {
            if (!formID) {
                throw httpErrors_1.default.BadRequest('formID is required!');
            }
            const formDelete = await mysql_1.FormLib.findById(formID);
            if (!formDelete) {
                throw httpErrors_1.default.NotFound(`Not Found Form with formID: ${formID}!`);
            }
            // Only rank role > Drirector or creater of form can delete
            if (roles_model_1.rolesRankMap[actor.role] < roles_model_1.rolesRankMap[roles_model_1.RolesEnum.Drirector] &&
                formDelete[0].createrID !== actor.userID) {
                throw httpErrors_1.default.Forbiden(`You don't have permission to delete this form!`);
            }
            const res = await database_1.db.Form.destroy({
                where: {
                    formID: formID,
                },
            });
            return res;
        }
        catch (error) {
            throw error;
        }
    }
    async updateFormStore(formCode, formStoreDataUpdate, actor) {
        try {
            if (!formCode) {
                throw httpErrors_1.default.BadRequest('formCode is required!');
            }
            const formStoreUpdate = await database_1.db.FormStore.findByPk(formCode);
            if (formStoreUpdate.status === form_model_1.FormStoreStatusEnum.public &&
                (0, object_utils_1.checkFieldContaint)(formStoreDataUpdate, 'formType')) {
                throw httpErrors_1.default.BadRequest(`Can't change formType of form with status ${formStoreUpdate.status}`);
            }
            if (roles_model_1.rolesRankMap[actor.role] < roles_model_1.rolesRankMap[roles_model_1.RolesEnum.Drirector] &&
                actor.userID !== formStoreUpdate.createrID) {
                throw httpErrors_1.default.Forbiden('Not permission!');
            }
            // if actor update not the creater, then update creater
            if (actor.userID !== formStoreUpdate.createrID) {
                formStoreUpdate.createrID = actor.userID;
            }
            for (const [key, val] of Object.entries(formStoreDataUpdate)) {
                formStoreUpdate.set(key, val);
            }
            const formStoreUpdated = await formStoreUpdate.save();
            return formStoreUpdated;
        }
        catch (error) {
            throw error;
        }
    }
    async getFormStore(formStoreQuery, actor) {
        try {
            const { search, filter, page, pageSize, sort } = formStoreQuery;
            if (filter && filter?.status === form_model_1.FormStoreStatusEnum.private) {
                if (roles_model_1.rolesRankMap[actor.role] < roles_model_1.rolesRankMap[roles_model_1.RolesEnum.Drirector]) {
                    // Only owner of form or rank of role > Drirector is pass
                    if (filter.createrID && actor.userID !== filter.createrID) {
                        throw httpErrors_1.default.Forbiden(`you don't have access to other form with status private!`);
                    }
                }
            }
            const findOptions = {};
            if (filter) {
                findOptions.where = filter;
            }
            /*
            If the query filter don't have status attribute  and rank of role < Drirector
            then only get formstore with status is public or formstore private his own
            */
            if (!filter?.status && roles_model_1.rolesRankMap[actor.role] < roles_model_1.rolesRankMap[roles_model_1.RolesEnum.Drirector]) {
                findOptions.where = {
                    ...findOptions.where,
                    [sequelize_1.Op.or]: [{ createrID: actor.userID }, { status: form_model_1.FormStoreStatusEnum.public }],
                };
            }
            let isPagination = false;
            let isSkipDB = false; // Check formstore is skip and limit by DB
            if ((0, object_utils_1.checkFieldContaint)(formStoreQuery, ['page', 'pageSize'])) {
                isPagination = true;
            }
            // If the queryparam have filter and search and offset and skip => wrong result
            if (isPagination && !filter && !search) {
                findOptions.offset = page * pageSize;
                findOptions.limit = pageSize;
                isSkipDB = true;
            }
            if (search) {
                findOptions.where = {
                    ...findOptions.where,
                    [sequelize_1.Op.and]: [
                        sequelize_1.Sequelize.literal(`MATCH(${search.field.join(',')}) AGAINST('${search.value.split(/\s+/).join(',')}')`),
                    ],
                };
            }
            if (sort) {
                findOptions.order = [[sequelize_1.Sequelize.literal(`${sort.field.join(',')}`), sort.type]];
            }
            let formStores;
            if (isPagination) {
                formStores = await database_1.db.FormStore.findAndCountAll(findOptions);
                if (isPagination && !isSkipDB) {
                    // limit and skip hand made :v, củ chuối
                    formStores.rows = formStores.rows.slice(page * pageSize, pageSize * page + pageSize);
                }
            }
            else {
                formStores = await database_1.db.FormStore.findAll(findOptions);
            }
            return formStores;
        }
        catch (error) {
            throw error;
        }
    }
    // report form
    async reportFormStatus(reportQuery) {
        try {
            const { filter, detailsField } = reportQuery;
            const findOptions = {
                attributes: ['status', [sequelize_1.Sequelize.fn('COUNT', sequelize_1.Sequelize.col('*')), 'quantity']],
                group: ['status'],
                raw: true,
            };
            let isFilterFormType = false;
            if (filter) {
                const filterApply = JSON.parse(JSON.stringify(filter));
                const filterAttribute = JSON.parse(JSON.stringify(filter));
                if (Object.hasOwn(filter, 'formType')) {
                    isFilterFormType = true;
                    filterApply[`$${form_model_1.formAssociations.formBelongsToFormStore}.formType$`] = filter['formType'];
                    // To get field formType
                    filterAttribute[`${form_model_1.formAssociations.formBelongsToFormStore}.formType`] = filter['formType'];
                    delete filterApply['formType'];
                    delete filterAttribute['formType'];
                }
                findOptions.where = filterApply;
                // add attribute for filter
                findOptions.attributes = [...findOptions.attributes, ...Object.keys(filterAttribute)];
            }
            if (isFilterFormType) {
                findOptions.include = [
                    {
                        association: database_1.db.Form.associations[form_model_1.formAssociations.formBelongsToFormStore],
                        as: form_model_1.formAssociations.formBelongsToFormStore,
                        attributes: [],
                    },
                ];
            }
            let includeAttribute = null;
            if (detailsField) {
                // Create include attribute for include association
                includeAttribute = detailsField.map((field) => {
                    return {
                        association: database_1.db.Form.associations[field],
                        as: field,
                    };
                });
            }
            // Result of statistics
            const result = await database_1.db.Form.findAll({
                ...findOptions,
                include: [
                    {
                        association: database_1.db.Form.associations[form_model_1.formAssociations.formBelongsToFormStore],
                        as: form_model_1.formAssociations.formBelongsToFormStore,
                        attributes: [],
                    },
                ],
            });
            if (detailsField) {
                const resultDetail = result.map(async (value) => {
                    const { status } = value;
                    const usersAndForms = await database_1.db.Form.findAll({
                        where: {
                            ...findOptions.where,
                            status: status,
                        },
                        include: includeAttribute,
                    });
                    const detailData = [];
                    // Get detail data
                    for (const userAndForm of usersAndForms) {
                        const detailItem = {};
                        for (const field of detailsField) {
                            const detailField = userAndForm.get(field, { plain: true });
                            if (!detailField) {
                                continue;
                            }
                            // Filter field
                            if (field === form_model_1.formAssociations.formBelongsToOwner ||
                                field === form_model_1.formAssociations.formBelongsToReviewer) {
                                detailItem[field] = (0, object_utils_1.pickField)(detailField, [
                                    'staffCode',
                                    'fullName',
                                    'email',
                                    'role',
                                ]);
                            }
                            if (field === form_model_1.formAssociations.formBelongsToFormStore) {
                                detailItem[field] = (0, object_utils_1.pickField)(detailField, [
                                    'formCode',
                                    'title',
                                    'formType',
                                    'describe',
                                    'note',
                                ]);
                            }
                        }
                        if (Object.values(detailItem).length > 0) {
                            detailData.push(detailItem);
                        }
                    }
                    return { ...value, detailData: detailData };
                });
                return await Promise.all(resultDetail);
            }
            return result;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.default = FormService;
