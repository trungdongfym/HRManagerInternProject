"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const codeErrors_1 = require("./codeErrors");
const typeError_1 = require("./typeError");
class HttpErrors extends Error {
    type;
    code;
    status;
    message;
    constructor(ErrorOptions) {
        super();
        this.status = ErrorOptions.status || http_status_codes_1.StatusCodes.BAD_REQUEST;
        this.type = ErrorOptions.type || typeError_1.default.HTTP_ERROR;
        this.code = ErrorOptions.code || codeErrors_1.default.BasicError[http_status_codes_1.StatusCodes.BAD_REQUEST];
        this.message = ErrorOptions.message || 'Unknow error!';
    }
    set setMessage(message) {
        this.message = message;
    }
    set setCode(code) {
        this.code = code;
    }
    set setType(type) {
        this.message = type;
    }
    set setStatus(status) {
        this.status = status;
    }
    static BadRequest(message, type) {
        const errorOption = {
            status: http_status_codes_1.StatusCodes.BAD_REQUEST,
            code: codeErrors_1.default.BasicError[http_status_codes_1.StatusCodes.BAD_REQUEST],
            type: type || typeError_1.default.HTTP_ERROR,
            message: message,
        };
        return new HttpErrors(errorOption);
    }
    static Forbiden(message, type) {
        const errorOption = {
            status: http_status_codes_1.StatusCodes.FORBIDDEN,
            code: codeErrors_1.default.BasicError[http_status_codes_1.StatusCodes.FORBIDDEN],
            type: type || typeError_1.default.HTTP_ERROR,
            message: message,
        };
        return new HttpErrors(errorOption);
    }
    static Conflict(message, type) {
        const errorOption = {
            status: http_status_codes_1.StatusCodes.CONFLICT,
            type: type || typeError_1.default.HTTP_ERROR,
            code: codeErrors_1.default.BasicError[http_status_codes_1.StatusCodes.CONFLICT],
            message: message,
        };
        return new HttpErrors(errorOption);
    }
    static NotFound(message, type) {
        const errorOption = {
            status: http_status_codes_1.StatusCodes.NOT_FOUND,
            type: type || typeError_1.default.HTTP_ERROR,
            code: codeErrors_1.default.BasicError[http_status_codes_1.StatusCodes.NOT_FOUND],
            message: message,
        };
        return new HttpErrors(errorOption);
    }
    static Unauthorized(message, type) {
        const errorOption = {
            status: http_status_codes_1.StatusCodes.UNAUTHORIZED,
            type: type || typeError_1.default.HTTP_ERROR,
            code: codeErrors_1.default.BasicError[http_status_codes_1.StatusCodes.UNAUTHORIZED],
            message: message,
        };
        return new HttpErrors(errorOption);
    }
    static InvalidToken(message, type) {
        const errorOption = {
            status: http_status_codes_1.StatusCodes.BAD_REQUEST,
            type: type || typeError_1.default.TOKEN_ERROR,
            code: codeErrors_1.default.BasicError[http_status_codes_1.StatusCodes.BAD_REQUEST],
            message: message,
        };
        return new HttpErrors(errorOption);
    }
    static IODataBase(message) {
        const errorOption = {
            status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            type: typeError_1.default.DATABASE_ERROR,
            code: codeErrors_1.default.BasicError[http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR],
            message: message,
        };
        return new HttpErrors(errorOption);
    }
    static ServerError(message) {
        const errorOption = {
            status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            type: typeError_1.default.UNKNOW_ERROR,
            code: codeErrors_1.default.BasicError[http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR],
            message: message,
        };
        return new HttpErrors(errorOption);
    }
    static UploadError(message, type) {
        const errorOption = {
            status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
            type: type || typeError_1.default.UPLOAD_ERROR,
            code: codeErrors_1.default.UPLOAD_FAIL,
            message: message || 'Upload File Error!',
        };
        return new HttpErrors(errorOption);
    }
}
exports.default = HttpErrors;
