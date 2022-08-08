"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../../../configs/database");
const token_lib_1 = require("../../../libs/authentication/token.lib");
const aws_1 = require("../../../libs/aws");
const mysql_1 = require("../../../libs/database/mysql");
const redis_1 = require("../../../libs/database/redis");
const httpErrors_1 = require("../../../libs/error/httpErrors");
const file_lib_1 = require("../../../libs/fileHandle/file.lib");
const bscrypt_lib_1 = require("../../../libs/hash/bscrypt.lib");
const roles_model_1 = require("../../../models/roles.model");
const users_service_1 = require("./users.service");
const userService = new users_service_1.default();
describe('User service', () => {
    describe('Create user', () => {
        const user = {
            email: 'trungdongfym@gmail.com',
            role: roles_model_1.RolesEnum.Drirector,
            avatar: {},
            staffCode: 'dr01',
        };
        const mockS3ResultUpload = {
            Location: 'https://krazykidsradio.s3-us-west-2.amazonaws.com/Parlez-vous%2BFrancais.mp3',
            Bucket: 'krazykidsradio',
            Key: 'Parlez-vous+Francais.mp3',
            ETag: '"f3ecd67cf9ce17a7792ba3adaee93638-11"',
        };
        test('Should throw exception conflict', async () => {
            const errorObject = {
                email: 'Email is exists',
                staffCode: 'StaffCode is exists',
            };
            mysql_1.UserDB.checkUserUnique = jest.fn(() => Promise.resolve(errorObject)); // Conflict
            file_lib_1.default.removeFile = jest.fn(() => Promise.reject(true));
            /*
               Test for unique field,
               Due to  user.avatar is an Express.Multer.File => removeFile called
            */
            await expect(userService.create(user)).rejects.toThrowError(new RegExp(`(?=.*${errorObject.email}.*){1}(?=.*${errorObject.staffCode}.*){1}`));
            expect(file_lib_1.default.removeFile).toHaveBeenCalled();
        });
        test('Should throw exception server internal error', async () => {
            mysql_1.UserDB.checkUserUnique = jest.fn(() => Promise.resolve(null));
            file_lib_1.default.removeFile = jest.fn(() => Promise.reject(true));
            aws_1.S3Lib.uploadFile = jest.fn(() => Promise.resolve(mockS3ResultUpload));
            aws_1.S3Lib.deleteFile = jest.fn(() => Promise.resolve(true));
            mysql_1.UserDB.createOne = jest.fn(() => Promise.resolve(null)); // => Error, return value must be an object
            /*
               Test for error write to db,
               Due to  user.avatar is an Express.Multer.File => removeFile called
               Due to  user.avatar is an Express.Multer.File =>  S3Lib.uploadFile,S3Lib.deleteFile called
            */
            await expect(userService.create(user)).rejects.toThrowError(httpErrors_1.default);
            expect(file_lib_1.default.removeFile).toHaveBeenCalledTimes(1);
            expect(aws_1.S3Lib.uploadFile).toHaveBeenCalledTimes(1);
            expect(aws_1.S3Lib.deleteFile).toHaveBeenCalledTimes(1);
        });
        test('Create succesful, should return a user object', async () => {
            mysql_1.UserDB.checkUserUnique = jest.fn(() => Promise.resolve(null));
            file_lib_1.default.removeFile = jest.fn(() => Promise.reject(true));
            aws_1.S3Lib.uploadFile = jest.fn(() => Promise.resolve(mockS3ResultUpload));
            mysql_1.UserDB.createOne = jest.fn(() => Promise.resolve(user));
            /*
               Test for write to db successful,
               Due to  user.avatar is an Express.Multer.File => removeFile called
            */
            user.avatar = {};
            await expect(userService.create(user)).resolves.toEqual(user);
            expect(aws_1.S3Lib.uploadFile).toHaveBeenCalledTimes(1);
            expect(file_lib_1.default.removeFile).toHaveBeenCalledTimes(1);
        });
    });
    describe('Update user', () => {
        const user = {
            email: 'trungdongfym@gmail.com',
            role: roles_model_1.RolesEnum.Drirector,
            avatar: {},
            staffCode: 'dr01',
        };
        const mockS3ResultUpload = {
            Location: 'https://krazykidsradio.s3-us-west-2.amazonaws.com/Parlez-vous%2BFrancais.mp3',
            Bucket: 'krazykidsradio',
            Key: 'Parlez-vous+Francais.mp3',
            ETag: '"f3ecd67cf9ce17a7792ba3adaee93638-11"',
        };
        test('Should throw exception forbiden', async () => {
            const userMock = {
                email: 'trungdongfym@gmail.com',
                role: roles_model_1.RolesEnum.Drirector,
                avatar: {},
                staffCode: 'dr01',
            };
            /*
               Test for protect field user
               Only admin have permission change role and mangerID
            */
            await expect(userService.update(userMock, '', roles_model_1.RolesEnum.Drirector)).rejects.toThrowError();
            await expect(userService.update(userMock, '', roles_model_1.RolesEnum.Employee)).rejects.toThrowError();
            await expect(userService.update(userMock, '', roles_model_1.RolesEnum.HR)).rejects.toThrowError();
            await expect(userService.update(userMock, '', roles_model_1.RolesEnum.Manager)).rejects.toThrowError();
        });
        test('Should throw exception conflict', async () => {
            const errorObject = {
                email: 'Email is exists',
                staffCode: 'StaffCode is exists',
            };
            mysql_1.UserDB.checkUserUnique = jest.fn(() => Promise.resolve(errorObject)); // Conflict
            file_lib_1.default.removeFile = jest.fn(() => Promise.reject(true));
            /*
               Test change field unique
            */
            await expect(userService.update(user, '', roles_model_1.RolesEnum.Admin)).rejects.toThrowError(new RegExp(`(?=.*${errorObject.email}.*){1}(?=.*${errorObject.staffCode}.*){1}`));
            expect(file_lib_1.default.removeFile).toHaveBeenCalled();
        });
        test('Create succesful, should return a user updated object', async () => {
            const userInstance = new database_1.db.User(user);
            mysql_1.UserDB.checkUserUnique = jest.fn(() => Promise.resolve(null));
            file_lib_1.default.removeFile = jest.fn(() => Promise.reject(true));
            aws_1.S3Lib.uploadFile = jest.fn(() => Promise.resolve(mockS3ResultUpload));
            aws_1.S3Lib.deleteFile = jest.fn(() => Promise.resolve(true));
            mysql_1.UserDB.findAndupdateByID = jest.fn(() => Promise.resolve(userInstance));
            mysql_1.UserDB.findById = jest.fn(() => Promise.resolve(user));
            /*
               Test for write to db successful,
               for admin change
            */
            const userMockAdmin = {
                email: 'trungdongfym@gmail.com',
                role: roles_model_1.RolesEnum.Drirector,
                avatar: {},
                staffCode: 'dr01',
            };
            await expect(userService.update(userMockAdmin, '', roles_model_1.RolesEnum.Admin)).resolves.toEqual(user);
            /*
               Test for write to db successful,
               for not admin change
            */
            const userMockNoAmin = {
                email: 'trungdongfym@gmail.com',
                avatar: {},
                firstName: 'trung',
            };
            await expect(userService.update(userMockNoAmin, '', roles_model_1.RolesEnum.Drirector)).resolves.toEqual(user);
            await expect(userService.update(userMockNoAmin, '', roles_model_1.RolesEnum.Employee)).resolves.toEqual(user);
            await expect(userService.update(userMockNoAmin, '', roles_model_1.RolesEnum.Manager)).resolves.toEqual(user);
            await expect(userService.update(userMockNoAmin, '', roles_model_1.RolesEnum.HR)).resolves.toEqual(user);
            expect(aws_1.S3Lib.uploadFile).toBeCalled();
            expect(file_lib_1.default.removeFile).toBeCalled();
            expect(aws_1.S3Lib.deleteFile).toBeCalled();
        });
    });
    describe('User login', () => {
        // Fake data
        const userAccount = {
            email: 'trungdong@gmail.com',
            password: 'Ledong1',
        };
        const user = {
            email: 'trungdongfym@gmail.com',
            role: roles_model_1.RolesEnum.Drirector,
            avatar: {},
            staffCode: 'dr01',
        };
        const userInstance = new database_1.db.User(user);
        //End fake data
        beforeEach(() => {
            redis_1.RedisLib.setAccessToken = jest.fn(() => Promise.resolve('ok'));
            bscrypt_lib_1.default.bcryptHash = jest.fn((data) => Promise.resolve(data));
            bscrypt_lib_1.default.bcryptCompare = jest.fn((dataCheck, data) => Promise.resolve(data === dataCheck));
        });
        test('Should Email or password incorrect', async () => {
            // wrong email
            mysql_1.UserDB.findOneByAnyField = jest.fn(() => null);
            await expect(userService.UserLogin(userAccount)).rejects.toThrow(httpErrors_1.default.NotFound('Email or password incorrect!'));
            // Wrong password
            userAccount.password = userInstance.password + '#1';
            mysql_1.UserDB.findOneByAnyField = jest.fn(() => Promise.resolve(userInstance));
            await expect(userService.UserLogin(userAccount)).rejects.toThrow(httpErrors_1.default.NotFound('Email or password incorrect!'));
        });
        test('Should login successful', async () => {
            // Fake data
            const accessTokenFake = 'access token fake';
            const userAccount = {
                email: 'trungdong@gmail.com',
                password: 'Ledong1',
            };
            const userObject = userInstance.toJSON();
            delete userObject.password;
            jest.spyOn(token_lib_1.default, 'signToken').mockImplementation(() => accessTokenFake);
            // End fake data
            // Make correct password
            userInstance.setDataValue('password', await bscrypt_lib_1.default.bcryptHash(userAccount.password));
            const mockGetAccessToken = jest.fn((accessTokenFake) => Promise.resolve(accessTokenFake));
            mysql_1.UserDB.findOneByAnyField = jest.fn(() => Promise.resolve(userInstance));
            redis_1.RedisLib.getAccessToken = jest.fn(() => mockGetAccessToken(accessTokenFake));
            // In case in redis have access token
            const userLoginDataHaveOldToken = await userService.UserLogin(userAccount);
            expect(userLoginDataHaveOldToken).toMatchObject({
                user: userObject,
                accessToken: accessTokenFake,
            });
            expect(token_lib_1.default.signToken).not.toHaveBeenCalled();
            expect(redis_1.RedisLib.setAccessToken).not.toHaveBeenCalled();
            /*
               In case in redis don't have access token
               tokenLib.signToken must be called
               RedisLib.setAccessToken must be called
            */
            redis_1.RedisLib.getAccessToken = jest.fn(() => mockGetAccessToken(null));
            const userLoginDataNotHaveOldToken = await userService.UserLogin(userAccount);
            expect(userLoginDataNotHaveOldToken).toMatchObject({
                user: userObject,
                accessToken: accessTokenFake,
            });
            expect(token_lib_1.default.signToken).toHaveBeenCalled();
            expect(redis_1.RedisLib.setAccessToken).toHaveBeenCalled();
        });
    });
});
