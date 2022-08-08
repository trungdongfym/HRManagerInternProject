"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_const_1 = require("../commons/constants/app.const");
const env_model_1 = require("../models/env.model");
process.env['NODE_CONFIG_DIR'] = __dirname + app_const_1.AppConst.ENV_DIR; // custom dir config
const config = require("config");
function getEnv() {
    const mode = process.env.NODE_ENV;
    let env;
    try {
        if (!mode) {
            env = config.get(env_model_1.EnvEnum.dev);
        }
        if (mode === env_model_1.EnvEnum.dev) {
            env = config.get(env_model_1.EnvEnum.dev);
        }
        if (mode === env_model_1.EnvEnum.staging) {
            env = config.get(env_model_1.EnvEnum.staging);
        }
        if (mode === env_model_1.EnvEnum.production) {
            env = config.get(env_model_1.EnvEnum.production);
        }
        if (mode === env_model_1.EnvEnum.test) {
            env = config.get(env_model_1.EnvEnum.test);
        }
    }
    catch (error) {
        console.log(error);
    }
    return env;
}
const AppConfig = {
    ENV: getEnv(),
};
exports.default = AppConfig;
