"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const form_model_1 = require("../../../../models/form.model");
const mysql_config_1 = require("../mysql.config");
const form_1 = require("./form");
class ProbationaryForm extends form_1.default {
    static Form;
    static associate() {
        form_1.default.associations[form_model_1.FormTypeEnum.ProbationaryForm] = form_1.default.hasOne(ProbationaryForm, {
            foreignKey: 'formID',
            onDelete: 'CASCADE',
            as: form_model_1.FormTypeEnum.ProbationaryForm,
        });
        ProbationaryForm.Form = ProbationaryForm.belongsTo(form_1.default, {
            as: 'form',
            foreignKey: 'formID',
            constraints: false,
        });
    }
}
ProbationaryForm.init({
    formID: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    durationTime: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
    },
    startTime: {
        type: sequelize_1.DataTypes.DATE,
    },
    position: {
        type: sequelize_1.DataTypes.STRING,
    },
    comments: {
        type: sequelize_1.DataTypes.STRING,
    },
    workResult: {
        type: sequelize_1.DataTypes.STRING,
    },
}, {
    sequelize: mysql_config_1.sequelize,
    tableName: 'ProbationaryForm',
    modelName: 'ProbationaryForm',
    timestamps: false,
});
ProbationaryForm.associate();
exports.default = ProbationaryForm;
