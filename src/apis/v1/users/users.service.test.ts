import { db } from '../../../configs/database';
import TokenLib from '../../../libs/authentication/token.lib';
import { S3Lib } from '../../../libs/aws';
import { UserDB } from '../../../libs/database/mysql';
import { RedisLib } from '../../../libs/database/redis';
import HttpErrors from '../../../libs/error/httpErrors';
import FileLib from '../../../libs/fileHandle/file.lib';
import BcryptLib from '../../../libs/hash/bscrypt.lib';
import { RolesEnum } from '../../../models/roles.model';
import { User } from './users.model';
import UserService from './users.service';

const userService = new UserService();

describe('User service', () => {
   describe('Create user', () => {
      const user: User = {
         email: 'trungdongfym@gmail.com',
         role: RolesEnum.Drirector,
         avatar: {} as any, //fake Express.Multer.File
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

         UserDB.checkUserUnique = jest.fn(() => Promise.resolve(errorObject)); // Conflict
         FileLib.removeFile = jest.fn(() => Promise.reject(true));
         /*
            Test for unique field,
            Due to  user.avatar is an Express.Multer.File => removeFile called
         */
         await expect(userService.create(user)).rejects.toThrowError(
            new RegExp(`(?=.*${errorObject.email}.*){1}(?=.*${errorObject.staffCode}.*){1}`)
         );
         expect(FileLib.removeFile).toHaveBeenCalled();
      });

      test('Should throw exception server internal error', async () => {
         UserDB.checkUserUnique = jest.fn(() => Promise.resolve(null));
         FileLib.removeFile = jest.fn(() => Promise.reject(true));
         S3Lib.uploadFile = jest.fn(() => Promise.resolve(mockS3ResultUpload));
         S3Lib.deleteFile = jest.fn(() => Promise.resolve(true)) as any;
         UserDB.createOne = jest.fn(() => Promise.resolve(null)); // => Error, return value must be an object
         /*
            Test for error write to db,
            Due to  user.avatar is an Express.Multer.File => removeFile called
            Due to  user.avatar is an Express.Multer.File =>  S3Lib.uploadFile,S3Lib.deleteFile called
         */
         await expect(userService.create(user)).rejects.toThrowError(HttpErrors);
         expect(FileLib.removeFile).toHaveBeenCalledTimes(1);
         expect(S3Lib.uploadFile).toHaveBeenCalledTimes(1);
         expect(S3Lib.deleteFile).toHaveBeenCalledTimes(1);
      });

      test('Create succesful, should return a user object', async () => {
         UserDB.checkUserUnique = jest.fn(() => Promise.resolve(null));
         FileLib.removeFile = jest.fn(() => Promise.reject(true));
         S3Lib.uploadFile = jest.fn(() => Promise.resolve(mockS3ResultUpload));
         UserDB.createOne = jest.fn(() => Promise.resolve(user)) as any;

         /*
            Test for write to db successful,
            Due to  user.avatar is an Express.Multer.File => removeFile called
         */
         user.avatar = {} as any;
         await expect(userService.create(user)).resolves.toEqual(user);
         expect(S3Lib.uploadFile).toHaveBeenCalledTimes(1);
         expect(FileLib.removeFile).toHaveBeenCalledTimes(1);
      });
   });

   describe('Update user', () => {
      const user: User = {
         email: 'trungdongfym@gmail.com',
         role: RolesEnum.Drirector,
         avatar: {} as any, //fake Express.Multer.File
         staffCode: 'dr01',
      };

      const mockS3ResultUpload = {
         Location: 'https://krazykidsradio.s3-us-west-2.amazonaws.com/Parlez-vous%2BFrancais.mp3',
         Bucket: 'krazykidsradio',
         Key: 'Parlez-vous+Francais.mp3',
         ETag: '"f3ecd67cf9ce17a7792ba3adaee93638-11"',
      };

      test('Should throw exception forbiden', async () => {
         const userMock: User = {
            email: 'trungdongfym@gmail.com',
            role: RolesEnum.Drirector,
            avatar: {} as any, //fake Express.Multer.File
            staffCode: 'dr01',
         };
         /*
            Test for protect field user
            Only admin have permission change role and mangerID
         */
         await expect(userService.update(userMock, '', RolesEnum.Drirector)).rejects.toThrowError();
         await expect(userService.update(userMock, '', RolesEnum.Employee)).rejects.toThrowError();
         await expect(userService.update(userMock, '', RolesEnum.HR)).rejects.toThrowError();
         await expect(userService.update(userMock, '', RolesEnum.Manager)).rejects.toThrowError();
      });

      test('Should throw exception conflict', async () => {
         const errorObject = {
            email: 'Email is exists',
            staffCode: 'StaffCode is exists',
         };

         UserDB.checkUserUnique = jest.fn(() => Promise.resolve(errorObject)); // Conflict
         FileLib.removeFile = jest.fn(() => Promise.reject(true));
         /*
            Test change field unique
         */
         await expect(userService.update(user, '', RolesEnum.Admin)).rejects.toThrowError(
            new RegExp(`(?=.*${errorObject.email}.*){1}(?=.*${errorObject.staffCode}.*){1}`)
         );
         expect(FileLib.removeFile).toHaveBeenCalled();
      });

      test('Create succesful, should return a user updated object', async () => {
         const userInstance = new db.User(user);
         UserDB.checkUserUnique = jest.fn(() => Promise.resolve(null));
         FileLib.removeFile = jest.fn(() => Promise.reject(true));
         S3Lib.uploadFile = jest.fn(() => Promise.resolve(mockS3ResultUpload));
         S3Lib.deleteFile = jest.fn(() => Promise.resolve(true)) as any;
         UserDB.findAndupdateByID = jest.fn(() => Promise.resolve(userInstance)) as any;
         UserDB.findById = jest.fn(() => Promise.resolve(user)) as any;
         /*
            Test for write to db successful,
            for admin change
         */
         const userMockAdmin: User = {
            email: 'trungdongfym@gmail.com',
            role: RolesEnum.Drirector,
            avatar: {} as any, //fake Express.Multer.File
            staffCode: 'dr01',
         };
         await expect(userService.update(userMockAdmin, '', RolesEnum.Admin)).resolves.toEqual(user);

         /*
            Test for write to db successful,
            for not admin change
         */
         const userMockNoAmin: User = {
            email: 'trungdongfym@gmail.com',
            avatar: {} as any, //fake Express.Multer.File
            firstName: 'trung',
         };
         await expect(userService.update(userMockNoAmin, '', RolesEnum.Drirector)).resolves.toEqual(user);
         await expect(userService.update(userMockNoAmin, '', RolesEnum.Employee)).resolves.toEqual(user);
         await expect(userService.update(userMockNoAmin, '', RolesEnum.Manager)).resolves.toEqual(user);
         await expect(userService.update(userMockNoAmin, '', RolesEnum.HR)).resolves.toEqual(user);

         expect(S3Lib.uploadFile).toBeCalled();
         expect(FileLib.removeFile).toBeCalled();
         expect(S3Lib.deleteFile).toBeCalled();
      });
   });

   describe('User login', () => {
      // Fake data
      const userAccount = {
         email: 'trungdong@gmail.com',
         password: 'Ledong1',
      };

      const user: User = {
         email: 'trungdongfym@gmail.com',
         role: RolesEnum.Drirector,
         avatar: {} as any, //fake Express.Multer.File
         staffCode: 'dr01',
      };
      const userInstance = new db.User(user);
      //End fake data
      beforeEach(() => {
         RedisLib.setAccessToken = jest.fn(() => Promise.resolve('ok'));
         BcryptLib.bcryptHash = jest.fn((data) => Promise.resolve(data));
         BcryptLib.bcryptCompare = jest.fn((dataCheck, data) => Promise.resolve(data === dataCheck));
      });

      test('Should Email or password incorrect', async () => {
         // wrong email
         UserDB.findOneByAnyField = jest.fn(() => null);
         await expect(userService.UserLogin(userAccount)).rejects.toThrow(
            HttpErrors.NotFound('Email or password incorrect!')
         );

         // Wrong password
         userAccount.password = userInstance.password + '#1';
         UserDB.findOneByAnyField = jest.fn(() => Promise.resolve(userInstance));
         await expect(userService.UserLogin(userAccount)).rejects.toThrow(
            HttpErrors.NotFound('Email or password incorrect!')
         );
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
         jest.spyOn(TokenLib, 'signToken').mockImplementation(() => accessTokenFake);
         // End fake data

         // Make correct password
         userInstance.setDataValue('password', await BcryptLib.bcryptHash(userAccount.password));
         const mockGetAccessToken = jest.fn((accessTokenFake: string) => Promise.resolve(accessTokenFake));
         UserDB.findOneByAnyField = jest.fn(() => Promise.resolve(userInstance));
         RedisLib.getAccessToken = jest.fn(() => mockGetAccessToken(accessTokenFake));

         // In case in redis have access token
         const userLoginDataHaveOldToken = await userService.UserLogin(userAccount);
         expect(userLoginDataHaveOldToken).toMatchObject({
            user: userObject,
            accessToken: accessTokenFake,
         });
         expect(TokenLib.signToken).not.toHaveBeenCalled();
         expect(RedisLib.setAccessToken).not.toHaveBeenCalled();

         /*
            In case in redis don't have access token
            tokenLib.signToken must be called
            RedisLib.setAccessToken must be called
         */
         RedisLib.getAccessToken = jest.fn(() => mockGetAccessToken(null));
         const userLoginDataNotHaveOldToken = await userService.UserLogin(userAccount);
         expect(userLoginDataNotHaveOldToken).toMatchObject({
            user: userObject,
            accessToken: accessTokenFake,
         });
         expect(TokenLib.signToken).toHaveBeenCalled();
         expect(RedisLib.setAccessToken).toHaveBeenCalled();
      });
   });
});
