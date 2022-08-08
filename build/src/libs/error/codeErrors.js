"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CodeError {
    static BasicError = {
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        409: 'Conflict',
        500: 'Internal Server Error',
    };
    static UPLOAD_FAIL = 'Upload Fail';
    static JWT_EXPIRE = 'jwt expire';
    static JWT_INVALID = 'jwt invalid';
}
exports.default = CodeError;
