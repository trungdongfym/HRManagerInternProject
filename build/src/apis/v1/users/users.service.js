"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const sequelize_1 = require("sequelize");
const app_config_1 = require("../../../configs/app.config");
const database_1 = require("../../../configs/database");
const token_lib_1 = require("../../../libs/authentication/token.lib");
const aws_1 = require("../../../libs/aws");
const mysql_1 = require("../../../libs/database/mysql");
const redis_1 = require("../../../libs/database/redis");
const codeErrors_1 = require("../../../libs/error/codeErrors");
const httpErrors_1 = require("../../../libs/error/httpErrors");
const file_lib_1 = require("../../../libs/fileHandle/file.lib");
const bscrypt_lib_1 = require("../../../libs/hash/bscrypt.lib");
const roles_model_1 = require("../../../models/roles.model");
const token_model_1 = require("../../../models/token.model");
const user_model_1 = require("../../../models/user.model");
const object_utils_1 = require("../../../utils/object.utils");
class UserService {
    async create(user) {
        let resUploadS3 = null;
        let fileAvatar = (0, object_utils_1.checkData)(user.avatar) === 'Object' ? user.avatar : null;
        try {
            const errorMessage = await mysql_1.UserDB.checkUserUnique(user);
            if (errorMessage) {
                throw httpErrors_1.default.Conflict(JSON.stringify(errorMessage));
            }
            if (fileAvatar) {
                resUploadS3 = await aws_1.S3Lib.uploadFile(fileAvatar);
                user.avatar = resUploadS3.Key; //save key s3 to DB
            }
            const userCreated = await mysql_1.UserDB.createOne(user);
            if (!userCreated) {
                throw httpErrors_1.default.IODataBase('Server Internal Error!');
            }
            if (fileAvatar) {
                file_lib_1.default.removeFile(fileAvatar.path).catch((err) => { });
            }
            return userCreated;
        }
        catch (error) {
            // create fail then reset
            if (fileAvatar) {
                file_lib_1.default.removeFile(fileAvatar.path).catch((err) => { });
            }
            if (resUploadS3) {
                aws_1.S3Lib.deleteFile(resUploadS3.Key).catch((err) => { });
            }
            throw error;
        }
    }
    async update(userUpdate, userID, role) {
        let resUploadS3 = null;
        let fileAvatar = (0, object_utils_1.checkData)(userUpdate.avatar) === 'Object' ? userUpdate.avatar : null;
        try {
            // Only admin have permission change role and manger
            if (role !== roles_model_1.RolesEnum.Admin && (0, object_utils_1.checkFieldContaint)(userUpdate, user_model_1.userProtectFieldArray)) {
                throw httpErrors_1.default.Forbiden(codeErrors_1.default.BasicError[http_status_codes_1.StatusCodes.FORBIDDEN]);
            }
            if (Object.hasOwn(userUpdate, 'managerID')) {
                // Convert to null if managerID = '' or undefined
                if (!userUpdate.managerID && userUpdate.managerID === '') {
                    userUpdate.managerID = null;
                }
            }
            const errorMessage = await mysql_1.UserDB.checkUserUnique(userUpdate, userID);
            if (errorMessage) {
                throw httpErrors_1.default.Conflict(JSON.stringify(errorMessage));
            }
            if (fileAvatar) {
                resUploadS3 = await aws_1.S3Lib.uploadFile(fileAvatar);
                userUpdate.avatar = resUploadS3.Key; //save key s3 to DB
            }
            const oldRecord = await mysql_1.UserDB.findAndupdateByID(userUpdate, {
                newDocs: false,
                where: {
                    userID: userID,
                },
            });
            // Remove file local
            if (fileAvatar) {
                file_lib_1.default.removeFile(fileAvatar.path).catch((err) => { });
            }
            // Delete old file
            if (resUploadS3) {
                aws_1.S3Lib.deleteFile(oldRecord.getDataValue('avatar')).catch((err) => { });
            }
            const newRecord = await mysql_1.UserDB.findById(userID, { logging: false });
            return newRecord;
        }
        catch (error) {
            if (fileAvatar) {
                file_lib_1.default.removeFile(fileAvatar.path).catch((err) => { });
            }
            if (resUploadS3) {
                aws_1.S3Lib.deleteFile(resUploadS3.Key).catch((err) => { });
            }
            throw error;
        }
    }
    async UserLogin(userAccount) {
        try {
            const { email, password } = userAccount;
            const user = await mysql_1.UserDB.findOneByAnyField({ email: email }, { include: null });
            const notFoundErr = httpErrors_1.default.NotFound('Email or password incorrect!');
            if (!user) {
                throw notFoundErr;
            }
            if (!(await bscrypt_lib_1.default.bcryptCompare(password, user.password))) {
                throw notFoundErr;
            }
            const jwtConfig = app_config_1.default.ENV.SECURITY.JWT;
            const oldAccessToken = await redis_1.RedisLib.getAccessToken(user.userID);
            //If token is exist then don't sign and use oldAccessToken
            const accessToken = oldAccessToken
                ? oldAccessToken
                : token_lib_1.default.signToken(token_model_1.tokenEnum.ACCESS_TOKEN, user.toJSON());
            const userLoginData = {
                userID: user.userID,
                staffCode: user.staffCode,
                email: user.email,
                fullName: user.fullName,
                cmnd: user.cmnd,
                numberBHXH: user.numberBHXH,
                phone: user.phone,
                address: user.address,
                avatar: user.avatar,
                role: user.role,
            };
            // save token to redis if don't have oldAccessToken
            if (!oldAccessToken) {
                await redis_1.RedisLib.setAccessToken(user.userID, accessToken, {
                    EX: jwtConfig.ACCESS_TOKEN_EXPIRE,
                    NX: true,
                });
            }
            return {
                accessToken: accessToken,
                user: userLoginData,
            };
        }
        catch (error) {
            throw error;
        }
    }
    async UserLogout(actor) {
        try {
            const { userID } = actor;
            const res = await redis_1.RedisLib.deleteAccessToken(userID);
            return res;
        }
        catch (error) {
            throw error;
        }
    }
    async getUserInfo(queryParam) {
        try {
            const findParam = {
                logging: false,
                attributes: {
                    exclude: ['managerID', 'deletedAt', 'password'],
                },
            };
            if (queryParam.requireManager) {
                findParam.include = {
                    association: database_1.db.User.associations['manager'],
                    as: 'manager',
                    attributes: ['firstName', 'lastName', 'email', 'phone', 'avatar', 'role'],
                    on: { userID: { [sequelize_1.Op.eq]: 'user.managerID' } },
                };
            }
            return await mysql_1.UserDB.findById(queryParam.userID, findParam);
        }
        catch (error) {
            throw error;
        }
    }
    async getUsers(queryParam, role) {
        const { user, page, pageSize, requireManager, roles } = queryParam;
        const findOptions = {
            logging: false,
            attributes: {
                exclude: ['managerID', 'deletedAt', 'password'],
            },
        };
        try {
            if (role !== roles_model_1.RolesEnum.Admin) {
                throw httpErrors_1.default.Forbiden(codeErrors_1.default.BasicError[http_status_codes_1.StatusCodes.FORBIDDEN]);
            }
            let flagCheckSkipDB = false;
            let isPagination = false;
            if ((0, object_utils_1.checkFieldContaint)(queryParam, ['page', 'pageSize'])) {
                isPagination = true;
            }
            // with user attribute, no pagination
            if (isPagination && !user && !roles) {
                findOptions.offset = pageSize * page;
                findOptions.limit = pageSize;
                flagCheckSkipDB = true;
            }
            if (user) {
                findOptions.where = { ...user };
            }
            if (roles) {
                findOptions.where = {
                    ...findOptions.where,
                    role: { [sequelize_1.Op.in]: roles },
                };
            }
            if (requireManager) {
                findOptions.include = [
                    {
                        association: database_1.db.User.associations['manager'],
                        as: 'manager',
                        attributes: ['userID', 'firstName', 'lastName', 'email', 'phone', 'avatar', 'role'],
                        on: { userID: { [sequelize_1.Op.eq]: sequelize_1.Sequelize.col('user.managerID') } },
                    },
                ];
            }
            let users;
            if (isPagination) {
                users = await database_1.db.User.findAndCountAll(findOptions);
                if (isPagination && !flagCheckSkipDB) {
                    // limit and skip hand made :v, củ chuối
                    users.rows = users.rows.slice(page * pageSize, pageSize * page + pageSize);
                }
            }
            else {
                users = await database_1.db.User.findAll(findOptions);
            }
            // const test = await db.User.scope('populateManager').findAll();
            // return test;
            return users;
        }
        catch (error) {
            throw error;
        }
    }
    async delete(userID) {
        try {
            const result = await mysql_1.UserDB.deleteUserByAnyField({ userID: userID });
            return result;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.default = UserService;
