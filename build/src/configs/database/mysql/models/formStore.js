"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const form_model_1 = require("../../../../models/form.model");
const mysql_config_1 = require("../mysql.config");
const form_1 = require("./form");
const user_1 = require("./user");
class FormStore extends sequelize_1.Model {
    static Form;
    static Creater;
    static associate() {
        FormStore.associations[form_model_1.FormStoreAssociation.formStorehasManyForm] = FormStore.hasMany(form_1.default, {
            foreignKey: 'formCode',
            onDelete: 'CASCADE',
            as: form_model_1.FormStoreAssociation.formStorehasManyForm,
        });
        FormStore.associations[form_model_1.FormStoreAssociation.formBelongsToFormStore] = form_1.default.belongsTo(FormStore, {
            foreignKey: 'formCode',
            onDelete: 'CASCADE',
            as: form_model_1.FormStoreAssociation.formBelongsToFormStore,
        });
        user_1.default.associations['creater'] = user_1.default.hasMany(FormStore, {
            foreignKey: 'createrID',
            onDelete: 'SET NULL',
            as: 'creater',
        });
        FormStore.Creater = FormStore.belongsTo(user_1.default, {
            foreignKey: 'createrID',
            onDelete: 'SET NULL',
            as: 'creater',
        });
    }
}
FormStore.init({
    formCode: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM(...form_model_1.FormStoreStatusArray),
        defaultValue: form_model_1.FormStoreStatusEnum.private,
    },
    title: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    formType: {
        type: sequelize_1.DataTypes.ENUM(...form_model_1.FormTypeArray),
        allowNull: false,
    },
    describe: {
        type: sequelize_1.DataTypes.TEXT,
    },
    note: {
        type: sequelize_1.DataTypes.TEXT,
    },
    createrID: {
        type: sequelize_1.DataTypes.UUID,
    },
}, {
    sequelize: mysql_config_1.sequelize,
    modelName: 'formstore',
    tableName: 'formstore',
    indexes: [
        {
            type: 'FULLTEXT',
            name: 'search_formStore_title_index',
            fields: ['title'],
        },
    ],
});
FormStore.associate();
exports.default = FormStore;
