"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const s3_config_1 = require("../../configs/aws/s3.config");
const app_config_1 = require("../../configs/app.config");
const s3Config = app_config_1.default.ENV.AWS.S3;
class S3Lib {
    static async uploadFile(file, putObjectParams) {
        const fileStream = fs.createReadStream(file.path);
        const defaultUploadParams = {
            Bucket: s3Config.BUCKET_NAME,
            Body: fileStream,
            Key: file.filename,
            ACL: 'public-read',
            ContentType: file.mimetype,
        };
        const uploadParams = {
            ...defaultUploadParams,
            ...putObjectParams,
        };
        try {
            const res = await s3_config_1.default.upload(uploadParams).promise();
            return res;
        }
        catch (error) {
            throw error;
        }
    }
    static getStreamFile(key) {
        try {
            const getFileParams = {
                Bucket: s3Config.BUCKET_NAME,
                Key: key,
            };
            const fileStream = s3_config_1.default.getObject(getFileParams).createReadStream();
            return fileStream;
        }
        catch (error) {
            throw error;
        }
    }
    static async deleteFile(key) {
        try {
            const delFileParams = {
                Bucket: s3Config.BUCKET_NAME,
                Key: key,
            };
            const res = await s3_config_1.default.deleteObject(delFileParams).promise();
            return res;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.default = S3Lib;
