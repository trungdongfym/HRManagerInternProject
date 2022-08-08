"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const form_model_1 = require("../../../../models/form.model");
const mysql_config_1 = require("../mysql.config");
const form_1 = require("./form");
class AnnualReviewForm extends form_1.default {
    static Form;
    static associate() {
        form_1.default.associations[form_model_1.FormTypeEnum.AnnualReviewForm] = form_1.default.hasOne(AnnualReviewForm, {
            foreignKey: 'formID',
            onDelete: 'CASCADE',
            as: form_model_1.FormTypeEnum.AnnualReviewForm,
        });
        AnnualReviewForm.Form = AnnualReviewForm.belongsTo(form_1.default, {
            as: 'form',
            foreignKey: 'formID',
            onDelete: 'CASCADE',
            constraints: false,
        });
    }
}
AnnualReviewForm.init({
    formID: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    department: {
        type: sequelize_1.DataTypes.STRING,
    },
    year: {
        type: sequelize_1.DataTypes.INTEGER({ length: 4 }),
        allowNull: false,
    },
    review: {
        type: sequelize_1.DataTypes.STRING,
    },
    point: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0,
        allowNull: true,
    },
}, {
    sequelize: mysql_config_1.sequelize,
    tableName: 'AnnualReviewForm',
    modelName: 'AnnualReviewForm',
    timestamps: false,
});
AnnualReviewForm.associate();
exports.default = AnnualReviewForm;
