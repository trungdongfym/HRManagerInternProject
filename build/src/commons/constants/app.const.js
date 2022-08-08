"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConst = void 0;
class AppConst {
    static ENV_DIR = '\\environment\\';
    static API_PREFIX = 'api';
    static API_VERSION = 'v1';
    static BCRYPT_SALT_ROUND = 10;
    // if header have this field server will no compress
    static NO_COMPRESS_HEADER = 'x-no-compression';
    static PATH_FOLDER_API = 'D:\\Projects\\HRManagerment\\src\\apis\\';
}
exports.AppConst = AppConst;
