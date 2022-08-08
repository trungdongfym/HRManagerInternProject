"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../../../configs/database");
const sequelize_1 = require("sequelize");
const httpErrors_1 = require("../../error/httpErrors");
const http_status_codes_1 = require("http-status-codes");
const codeErrors_1 = require("../../error/codeErrors");
const object_utils_1 = require("../../../utils/object.utils");
class UserDB {
    // Options general use for find method
    static defaultFindUserOptions = {
        logging: false,
        attributes: {
            // select attr
            exclude: ['password'],
        },
    };
    static async createOne(user, options) {
        const defaultOptions = {
            logging: false,
        };
        const optionsApply = {
            ...defaultOptions,
            ...options,
        };
        try {
            const newUser = new database_1.db.User(user);
            const userSaved = await newUser.save(optionsApply);
            return userSaved;
        }
        catch (error) {
            const dbErr = httpErrors_1.default.IODataBase(error?.message || 'Save User error!');
            if (error instanceof sequelize_1.ValidationError) {
                dbErr.setStatus = http_status_codes_1.StatusCodes.CONFLICT;
                dbErr.setCode = codeErrors_1.default.BasicError[http_status_codes_1.StatusCodes.CONFLICT];
            }
            throw dbErr;
        }
    }
    static async findAndupdateByID(data, options) {
        const defaultOptions = {
            logging: false,
            userID: options.where.userID,
        };
        // Default return old docs
        const newDocs = options?.newDocs || false;
        delete options?.newDocs;
        const optionsUpdateApply = {
            ...defaultOptions,
            ...options,
        };
        try {
            let userUpdated = null;
            if (!newDocs) {
                // Find old docs
                userUpdated = await database_1.db.User.findOne({
                    where: { userID: defaultOptions.userID },
                    logging: false,
                });
                // if user not exists
                if (!userUpdated) {
                    return userUpdated;
                }
            }
            const result = await database_1.db.User.update(data, optionsUpdateApply);
            if (result[0] !== 1) {
                return null;
            }
            if (newDocs) {
                userUpdated = await database_1.db.User.findOne({
                    where: { userID: defaultOptions.userID },
                    logging: false,
                });
            }
            return userUpdated;
        }
        catch (error) {
            const dbErr = httpErrors_1.default.IODataBase(error?.message || 'Save User error!');
            if (error instanceof sequelize_1.ValidationError) {
                dbErr.setStatus = http_status_codes_1.StatusCodes.CONFLICT;
                dbErr.setCode = codeErrors_1.default.BasicError[http_status_codes_1.StatusCodes.CONFLICT];
            }
            throw dbErr;
        }
    }
    static async deleteUserByAnyField(filterField, options) {
        const defaultOptions = {
            logging: false,
            where: {
                ...filterField,
            },
        };
        const optionsApply = {
            ...defaultOptions,
            ...options,
        };
        try {
            const userDeleted = await database_1.db.User.destroy(optionsApply);
            return userDeleted;
        }
        catch (error) {
            const dbErr = httpErrors_1.default.IODataBase(error?.message || 'Save User error!');
            if (error instanceof sequelize_1.ValidationError) {
                dbErr.setStatus = http_status_codes_1.StatusCodes.CONFLICT;
                dbErr.setCode = codeErrors_1.default.BasicError[http_status_codes_1.StatusCodes.CONFLICT];
            }
            throw dbErr;
        }
    }
    static async findById(userID, options) {
        try {
            const user = await database_1.db.User.findByPk(userID, options);
            return user;
        }
        catch (error) {
            throw error;
        }
    }
    static async findOneByAnyField(filterField, options) {
        const defaultOptions = UserDB.defaultFindUserOptions;
        defaultOptions.attributes = null;
        defaultOptions.where = { ...filterField };
        const optionsApply = {
            ...defaultOptions,
            ...options,
        };
        try {
            const user = await database_1.db.User.findOne(optionsApply);
            return user;
        }
        catch (error) {
            throw error;
        }
    }
    static async findByAnyField(filterField, options) {
        const defaultOptions = UserDB.defaultFindUserOptions;
        defaultOptions.where = { ...filterField };
        const optionsApply = {
            ...defaultOptions,
            ...options,
        };
        try {
            const users = await database_1.db.User.findAll(optionsApply);
            return users;
        }
        catch (error) {
            throw error;
        }
    }
    static async findAndPopulateById(userID, options) {
        const defaultOptions = {
            logging: false,
            raw: true,
            where: { userID: userID },
            include: [
                // populate
                {
                    association: database_1.db.User.associations['manager'],
                    as: 'manager',
                    attributes: ['userID', 'firstName', 'lastName', 'email', 'phone', 'avatar', 'role'],
                    on: { userID: { [sequelize_1.Op.eq]: sequelize_1.Sequelize.col('user.managerID') } },
                },
            ],
        };
        const optionsApply = {
            ...defaultOptions,
            ...options,
        };
        try {
            const users = await database_1.db.User.findOne(optionsApply);
            return users;
        }
        catch (error) {
            throw error;
        }
    }
    static async getAll(options) {
        try {
            const users = await database_1.db.User.findAll({
                logging: false,
                ...options,
            });
            return users;
        }
        catch (error) {
            throw error;
        }
    }
    /**
     *
     * @param user Data user check
     * @param userID UserID owner of Data user
     * @returns errorMessage of field if a field is exists, otherwise return null;
     */
    static async checkUserUnique(user, userID) {
        const errorMessage = {};
        const { email, staffCode, cmnd } = user;
        const uniqueField = ['email', 'staffCode', 'cmnd'];
        try {
            // Check field unique is exists
            const userUniqueField = (0, object_utils_1.pickField)(user, uniqueField);
            const users = await database_1.db.User.findAll({ where: userUniqueField });
            for (const user of users) {
                if (user.userID !== userID) {
                    if (email && email === user.email) {
                        errorMessage['email'] = 'Email is exists!';
                    }
                    if (staffCode && staffCode === user.staffCode) {
                        errorMessage['staffCode'] = 'StaffCode is exists!';
                    }
                    if (cmnd && cmnd === user.cmnd) {
                        errorMessage['cmnd'] = 'Cmnd is exists!';
                    }
                }
                if (Object.keys(errorMessage).length === uniqueField.length) {
                    return errorMessage;
                }
            }
            if (Object.keys(errorMessage).length > 0) {
                return errorMessage;
            }
            return null;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.default = UserDB;
