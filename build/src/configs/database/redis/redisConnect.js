"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = exports.redisConnect = void 0;
const redis_1 = require("redis");
const app_config_1 = require("../../app.config");
const redisConfig = app_config_1.default.ENV.DATABASES.REDIS;
const redisConnectOptions = {
    socket: {
        host: redisConfig.host,
        port: redisConfig.port,
    },
    database: redisConfig.dbNumber,
};
if (redisConfig.username && redisConfig.password) {
    redisConnectOptions.username = redisConfig.username;
    redisConnectOptions.password = redisConfig.password;
}
const redisClient = (0, redis_1.createClient)(redisConnectOptions);
exports.redisClient = redisClient;
async function redisConnect() {
    redisClient.on('error', (err) => {
        console.log('Redis connect error::', err.message);
    });
    redisClient.on('connect', () => {
        redisClient.ACL_WHOAMI().then((user) => {
            console.log(`Redis connected to user: ${user}`);
        });
    });
    redisClient.on('ready', () => {
        console.log('Redis ready');
    });
    await redisClient.connect();
}
exports.redisConnect = redisConnect;
