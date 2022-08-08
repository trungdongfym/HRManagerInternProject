"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.databaseConfig = void 0;
const redisConnect_1 = require("./redis/redisConnect");
const mysql_config_1 = require("./mysql/mysql.config");
const db = require("./mysql/models");
exports.db = db;
async function databaseConfig() {
    try {
        await (0, mysql_config_1.connectMySql)();
        await (0, redisConnect_1.redisConnect)();
    }
    catch (error) {
        console.log(error);
    }
}
exports.databaseConfig = databaseConfig;
