"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const form_model_1 = require("../../../../models/form.model");
const mysql_config_1 = require("../mysql.config");
const user_1 = require("./user");
class Form extends sequelize_1.Model {
    static associate() {
        Form.associations['Owner'] = user_1.default.hasMany(Form, {
            foreignKey: 'ownerID',
            onDelete: 'CASCADE',
            as: 'owner',
        });
        Form.associations['Reviewer'] = user_1.default.hasMany(Form, {
            foreignKey: 'reviewerID',
            onDelete: 'CASCADE',
            as: 'reviewer',
        });
        Form.associations[form_model_1.formAssociations.formBelongsToOwner] = Form.belongsTo(user_1.default, {
            foreignKey: 'ownerID',
            onDelete: 'CASCADE',
            as: form_model_1.formAssociations.formBelongsToOwner,
        });
        Form.associations[form_model_1.formAssociations.formBelongsToReviewer] = Form.belongsTo(user_1.default, {
            foreignKey: 'reviewerID',
            onDelete: 'CASCADE',
            as: form_model_1.formAssociations.formBelongsToReviewer,
        });
    }
}
Form.init({
    formID: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    formCode: {
        type: sequelize_1.DataTypes.STRING(30),
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM(...form_model_1.FormStatusArray.filter((val) => {
            return val !== form_model_1.FormStatusEnum.reject;
        })),
        defaultValue: form_model_1.FormStatusEnum.open,
    },
    numReject: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0,
    },
    sendTime: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    ownerID: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
}, {
    sequelize: mysql_config_1.sequelize,
    tableName: 'form',
    modelName: 'form',
    indexes: [
        {
            fields: ['formCode', 'ownerID'],
            unique: true,
            name: 'formCode_ownerID_unique_key',
        },
    ],
});
Form.associate();
exports.default = Form;
