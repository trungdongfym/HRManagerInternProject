"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const S3 = require("aws-sdk/clients/s3");
const app_config_1 = require("../app.config");
const s3Config = app_config_1.default.ENV.AWS.S3;
const s3 = new S3({
    region: s3Config.BUCKET_REGION,
    credentials: {
        accessKeyId: s3Config.ACCESS_KEYID,
        secretAccessKey: s3Config.SECRET_ACCESS_KEY,
    },
});
exports.default = s3;
