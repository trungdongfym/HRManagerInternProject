"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const httpErrors_1 = require("../libs/error/httpErrors");
const file_lib_1 = require("../libs/fileHandle/file.lib");
class Validate {
    static validateBody(validationSchema) {
        return async (req, res, next) => {
            const data = req.body;
            try {
                const dataValidated = await Validate.validateData(validationSchema, data);
                req.body = dataValidated;
                next();
            }
            catch (error) {
                if (req.file) {
                    file_lib_1.default.removeFile(req.file.path).catch((err) => {
                        console.log(err);
                    });
                }
                next(error);
            }
        };
    }
    static validateQueryParams(validationSchema) {
        return async (req, res, next) => {
            const data = req.query?.qs ?? req.query; // qs for qs libary
            try {
                const queryParam = await Validate.validateData(validationSchema, data);
                req.query = queryParam;
                next();
            }
            catch (error) {
                const err = httpErrors_1.default.BadRequest(error?.message || 'Unknow Error!');
                next(err);
            }
        };
    }
    static validateData = async (validationSchema, data) => {
        try {
            const value = await validationSchema.validateAsync(data);
            return value;
        }
        catch (error) {
            if (error?.isJoi) {
                throw httpErrors_1.default.BadRequest(error.message);
            }
            throw httpErrors_1.default.ServerError(error?.message || 'Unknow Error!');
        }
    };
}
exports.default = Validate;
