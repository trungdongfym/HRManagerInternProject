"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const bscrypt_lib_1 = require("../../../../libs/hash/bscrypt.lib");
const roles_model_1 = require("../../../../models/roles.model");
const app_config_1 = require("../../../app.config");
const mysql_config_1 = require("../mysql.config");
class User extends sequelize_1.Model {
    // define association
    static associate() {
        User.associations['manager'] = User.hasOne(User, {
            foreignKey: 'managerID',
            onDelete: 'SET NULL',
            as: 'manager',
        });
    }
}
User.init({
    userID: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
    staffCode: {
        type: sequelize_1.DataTypes.STRING(30),
        allowNull: false,
        unique: true,
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    fullName: {
        type: sequelize_1.DataTypes.VIRTUAL,
        get() {
            return `${this.firstName} ${this.lastName}`;
        },
    },
    phone: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    avatar: {
        type: sequelize_1.DataTypes.STRING,
        get() {
            if (!this.getDataValue('avatar')) {
                return null;
            }
            return `${app_config_1.default.ENV.AWS.S3.BASE_URL_AVATAR}/${this.getDataValue('avatar')}`;
        },
    },
    cmnd: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
    },
    numberBHXH: sequelize_1.DataTypes.STRING,
    address: sequelize_1.DataTypes.STRING,
    email: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        set(password) {
            this.setDataValue('password', bscrypt_lib_1.default.bcryptHashSync(password));
        },
    },
    role: {
        type: sequelize_1.DataTypes.ENUM(...roles_model_1.rolesArray),
        allowNull: false,
        defaultValue: roles_model_1.RolesEnum.Employee,
    },
}, {
    sequelize: mysql_config_1.sequelize,
    modelName: 'User',
    tableName: 'User',
    paranoid: true,
    scopes: {
        populateManager: {
            include: [
                {
                    model: User,
                    as: 'manager',
                    attributes: ['userID', 'firstName', 'lastName', 'email', 'phone', 'avatar', 'role'],
                    on: { userID: { [sequelize_1.Op.eq]: sequelize_1.Sequelize.col('user.managerID') } },
                },
            ],
        },
    },
});
User.associate();
exports.default = User;
