"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SES = require("aws-sdk/clients/ses");
const app_config_1 = require("../app.config");
const sesConfig = app_config_1.default.ENV.AWS.SES;
const ses = new SES({
    region: sesConfig.SES_REGION,
    credentials: {
        accessKeyId: sesConfig.ACCESS_KEYID,
        secretAccessKey: sesConfig.SECRET_ACCESS_KEY,
    },
});
exports.default = ses;
