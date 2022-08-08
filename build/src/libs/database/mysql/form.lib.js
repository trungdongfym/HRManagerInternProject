"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../../../configs/database");
const mysql_config_1 = require("../../../configs/database/mysql/mysql.config");
const httpErrors_1 = require("../../../libs/error/httpErrors");
const object_utils_1 = require("../../../utils/object.utils");
class FormLib {
    static async create(formParams, formType) {
        try {
            const formCreated = await database_1.db.Form.create(formParams, {
                logging: false,
                include: [
                    {
                        association: database_1.db.Form.associations[formType],
                        as: formType,
                    },
                ],
            });
            return formCreated;
        }
        catch (error) {
            const err = httpErrors_1.default.IODataBase(error?.message || 'Create Form Error!');
            throw err;
        }
    }
    static async bulkCreate(formParams, formType) {
        const t = await mysql_config_1.sequelize.transaction({ logging: false });
        try {
            const formCreated = await database_1.db.Form.bulkCreate(formParams, {
                include: [
                    {
                        association: database_1.db.Form.associations[formType],
                        as: formType,
                    },
                ],
                transaction: t,
            });
            await t.commit();
            return formCreated;
        }
        catch (error) {
            console.log(error);
            await t.rollback();
            const err = httpErrors_1.default.IODataBase(error?.message || 'Create Form Error!');
            throw err;
        }
    }
    /**
     *
     * @param formType - If have formType -> populate to formType
     * @returns
     * @note Query use transaction must call in the same context.
     */
    static async findByIdAndUpdate(formID, updateParam, formType, findOptions) {
        try {
            const defaultOptions = {};
            if (formType) {
                defaultOptions.include = [
                    {
                        association: database_1.db.Form.associations[formType],
                        as: formType,
                    },
                ];
            }
            const form = await database_1.db.Form.findByPk(formID, { ...defaultOptions, ...findOptions });
            for (const [key, val] of Object.entries(updateParam)) {
                const prevVal = form.get(key, { plain: true });
                if ((0, object_utils_1.checkData)(prevVal) === 'Object' && formType) {
                    form.set(key, { ...prevVal, ...val });
                }
                else {
                    form.set(key, val);
                }
            }
            form.changed('updatedAt', true);
            const formUpdated = await form.save();
            await formUpdated[formType].save();
            return formUpdated;
        }
        catch (error) {
            const err = httpErrors_1.default.IODataBase(error?.message || 'Update Form Error!');
            throw err;
        }
    }
    /**
     *
     * @param formType - If have formType -> populate to formType
     * @returns
     * @note Query use transaction must call in the same context.
     */
    static async findAndUpdate(filter, updateParam, formType, findOptions) {
        const transaction = await mysql_config_1.sequelize.transaction({ autocommit: false, logging: false });
        try {
            const defaultOptions = {
                where: { ...filter },
                transaction: transaction,
            };
            if (formType) {
                defaultOptions.include = [
                    {
                        association: database_1.db.Form.associations[formType],
                        as: formType,
                    },
                ];
            }
            const anualForms = await database_1.db.Form.findAll({ ...defaultOptions, ...findOptions });
            /*
            Error here: map use a callback => create a new context, call query save in callback of map => error
            anualForms.map(async (anualForm) => {
               for (const [key, val] of Object.entries(updateParam)) {
                  const prevVal = anualForm.get(key, { plain: true });
                  if (checkData(prevVal) === 'Object') {
                     anualForm.set(key, { ...(prevVal as any), ...val });
                  } else {
                     anualForm.set(key, val);
                  }
               }
               await anualForm.save({ transaction: transaction });
               await (anualForm[formType] as db.AnnualReviewForm).save({ transaction: transaction });
            });
            */
            for (const anualForm of anualForms) {
                for (const [key, val] of Object.entries(updateParam)) {
                    const prevVal = anualForm.get(key, { plain: true });
                    if ((0, object_utils_1.checkData)(prevVal) === 'Object' && formType) {
                        anualForm.set(key, { ...prevVal, ...val });
                    }
                    else {
                        anualForm.set(key, val);
                    }
                }
                anualForm.changed('updatedAt', true);
                await anualForm.save({ transaction: transaction, logging: false });
                await anualForm[formType].save({
                    transaction: transaction,
                    logging: false,
                });
            }
            await transaction.commit();
            return anualForms;
        }
        catch (error) {
            await transaction.rollback();
            const err = httpErrors_1.default.IODataBase(error?.message || 'Update Form Error!');
            throw err;
        }
    }
    /**
     *
     * @param formType - If have formType -> populate to formType
     * @returns
     */
    static findByFormCode(formCode, formType, findOptions) {
        try {
            const defaultOptions = {
                where: {
                    formCode: formCode,
                },
            };
            if (formType) {
                defaultOptions.include = [
                    {
                        association: database_1.db.Form.associations[formType],
                        as: formType,
                    },
                ];
            }
            const forms = database_1.db.Form.findAll({ ...defaultOptions, ...findOptions });
            return forms;
        }
        catch (error) {
            throw error;
        }
    }
    /**
     *
     * @param formType - If have formType -> populate to formType
     * @returns
     */
    static findById(formID, formType, findOptions) {
        try {
            const defaultOptions = {};
            if (formType) {
                defaultOptions.include = [
                    {
                        association: database_1.db.Form.associations[formType],
                        as: formType,
                    },
                ];
            }
            const forms = database_1.db.Form.findByPk(formID, { ...defaultOptions, ...findOptions });
            return forms;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.default = FormLib;
