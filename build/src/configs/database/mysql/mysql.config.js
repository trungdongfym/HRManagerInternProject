"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = exports.connectMySql = void 0;
const sequelize_1 = require("sequelize");
const app_config_1 = require("../../app.config");
const mysqlConfig = app_config_1.default.ENV.DATABASES.MYSQL;
const sequelize = new sequelize_1.Sequelize(mysqlConfig.database, mysqlConfig.username, mysqlConfig.password, {
    host: mysqlConfig.host,
    dialect: 'mysql',
    logging: false,
});
exports.sequelize = sequelize;
async function connectMySql() {
    try {
        await sequelize.authenticate();
        console.log('Mysql connect successfully!');
        return sequelize;
    }
    catch (error) {
        throw error;
    }
}
exports.connectMySql = connectMySql;
