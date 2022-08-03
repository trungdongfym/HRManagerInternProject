import { ManagedUpload } from 'aws-sdk/clients/s3';
import { StatusCodes } from 'http-status-codes';
import { FindOptions, Op, Sequelize } from 'sequelize';
import { IAdminQueryUserParams, IUserQueryParams } from '../../../commons/interfaces';
import AppConfig from '../../../configs/app.config';
import { db } from '../../../configs/database';
import { signToken } from '../../../libs/authentication/token.lib';
import { S3Lib } from '../../../libs/aws';
import { UserDB } from '../../../libs/database/mysql';
import { RedisLib } from '../../../libs/database/redis';
import CodeError from '../../../libs/error/codeErrors';
import HttpErrors from '../../../libs/error/httpErrors';
import FileLib from '../../../libs/fileHandle/file.lib';
import { bcryptCompare } from '../../../libs/hash/bscrypt.lib';
import { RolesEnum } from '../../../models/roles.model';
import { tokenEnum } from '../../../models/token.model';
import { userProtectFieldArray } from '../../../models/user.model';
import { checkData, checkFieldContaint } from '../../../utils/object.utils';
import { IUserAccount, IUserLoginPayload, User } from './users.model';

class UserService {
   public async create(user: User) {
      let resUploadS3: ManagedUpload.SendData = null;
      let fileAvatar: Express.Multer.File =
         checkData(user.avatar) === 'Object' ? (user.avatar as Express.Multer.File) : null;
      try {
         const errorMessage = await UserDB.checkUserUnique(user);
         if (errorMessage) {
            throw HttpErrors.Conflict(JSON.stringify(errorMessage));
         }
         if (fileAvatar) {
            resUploadS3 = await S3Lib.uploadFile(fileAvatar);
            user.avatar = resUploadS3.Key; //save key s3 to DB
         }
         const userCreated = await UserDB.createOne(user);
         if (!userCreated) {
            throw HttpErrors.IODataBase('Server Internal Error!');
         }
         if (fileAvatar) {
            FileLib.removeFile(fileAvatar.path).catch((err) => {
               console.log(err);
            });
         }
         return userCreated;
      } catch (error) {
         // create fail then reset
         if (fileAvatar) {
            FileLib.removeFile(fileAvatar.path).catch((err) => {
               console.log(err);
            });
         }
         if (resUploadS3) {
            S3Lib.deleteFile(resUploadS3.Key).catch((err) => {
               console.log(err);
            });
         }
         throw error;
      }
   }

   public async update(userUpdate: User, userID: string, role: string) {
      let resUploadS3: ManagedUpload.SendData = null;
      let fileAvatar: Express.Multer.File =
         checkData(userUpdate.avatar) === 'Object' ? (userUpdate.avatar as Express.Multer.File) : null;
      try {
         // Only admin have permission change role and manger
         if (role !== RolesEnum.Admin && checkFieldContaint(userUpdate, userProtectFieldArray)) {
            throw HttpErrors.Forbiden(CodeError.BasicError[StatusCodes.FORBIDDEN]);
         }
         if (Object.hasOwn(userUpdate, 'managerID')) {
            // Convert to null if managerID = '' or undefined
            if (!userUpdate.managerID && userUpdate.managerID === '') {
               userUpdate.managerID = null;
            }
         }
         const errorMessage = await UserDB.checkUserUnique(userUpdate, userID);
         if (errorMessage) {
            throw HttpErrors.Conflict(JSON.stringify(errorMessage));
         }
         if (fileAvatar) {
            resUploadS3 = await S3Lib.uploadFile(fileAvatar);
            userUpdate.avatar = resUploadS3.Key; //save key s3 to DB
         }
         const oldRecord = await UserDB.findAndupdateByID(userUpdate, {
            newDocs: false,
            where: {
               userID: userID,
            },
         });
         // Remove file local
         if (fileAvatar) {
            FileLib.removeFile(fileAvatar.path).catch((err) => {
               console.log(err);
            });
         }
         // Delete old file
         if (resUploadS3) {
            S3Lib.deleteFile(oldRecord.getDataValue('avatar') as string).catch((err) => {
               console.log(err);
            });
         }
         const newRecord = await UserDB.findById(userID, { logging: false });
         return newRecord;
      } catch (error) {
         if (fileAvatar) {
            FileLib.removeFile(fileAvatar.path).catch((err) => {
               console.log(err);
            });
         }
         if (resUploadS3) {
            S3Lib.deleteFile(resUploadS3.Key).catch((err) => {
               console.log(err);
            });
         }
         throw error;
      }
   }

   public async UserLogin(userAccount: IUserAccount) {
      try {
         const { email, password } = userAccount;
         const user = await UserDB.findOneByAnyField({ email: email }, { include: null });
         const notFoundErr = HttpErrors.NotFound('Email or password incorrect!');
         if (!user) {
            throw notFoundErr;
         }
         if (!(await bcryptCompare(password, user.password))) {
            throw notFoundErr;
         }
         const jwtConfig = AppConfig.ENV.SECURITY.JWT;

         const oldAccessToken = await RedisLib.getAccessToken(user.userID);
         //If token is exist then don't sign and use oldAccessToken
         const accessToken = oldAccessToken
            ? oldAccessToken
            : signToken(tokenEnum.ACCESS_TOKEN, user.toJSON());

         const userLoginData: IUserLoginPayload = {
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
            await RedisLib.setAccessToken(user.userID, accessToken, {
               EX: jwtConfig.ACCESS_TOKEN_EXPIRE,
               NX: true,
            });
         }
         return {
            accessToken: accessToken,
            user: userLoginData,
         };
      } catch (error) {
         throw error;
      }
   }

   public async UserLogout(userID: string) {
      try {
         const res = await RedisLib.deleteAccessToken(userID);
         return res;
      } catch (error) {
         throw error;
      }
   }

   public async getUserInfo(queryParam: IUserQueryParams) {
      try {
         const findParam: FindOptions = {
            logging: false,
            attributes: {
               exclude: ['managerID', 'deletedAt', 'password'],
            },
         };
         if (queryParam.requireManager) {
            findParam.include = {
               association: db.User.associations['manager'],
               as: 'manager',
               attributes: ['firstName', 'lastName', 'email', 'phone', 'avatar', 'role'],
               on: { userID: { [Op.eq]: 'user.managerID' } },
            };
         }
         return await UserDB.findById(queryParam.userID, findParam);
      } catch (error) {
         throw error;
      }
   }

   public async getUsers(queryParam: IAdminQueryUserParams, role: RolesEnum) {
      const { user, page, pageSize, requireManager, roles } = queryParam;
      const findOptions: FindOptions = {
         logging: false,
         attributes: {
            exclude: ['managerID', 'deletedAt', 'password'],
         },
      };
      try {
         if (role !== RolesEnum.Admin) {
            throw HttpErrors.Forbiden(CodeError.BasicError[StatusCodes.FORBIDDEN]);
         }
         let flagCheckSkipDB = false;
         let isPagination = false;
         if (checkFieldContaint(queryParam, ['page', 'pageSize'])) {
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
               role: { [Op.in]: roles },
            };
         }
         if (requireManager) {
            findOptions.include = [
               {
                  association: db.User.associations['manager'],
                  as: 'manager',
                  attributes: ['userID', 'firstName', 'lastName', 'email', 'phone', 'avatar', 'role'],
                  on: { userID: { [Op.eq]: Sequelize.col('user.managerID') } },
               },
            ];
         }
         interface userPaginationType {
            rows: db.User[];
            count: number;
         }
         let users: db.User[] | userPaginationType;
         if (isPagination) {
            users = await db.User.findAndCountAll(findOptions);
            if (isPagination && !flagCheckSkipDB) {
               // limit and skip hand made :v, củ chuối
               users.rows = users.rows.slice(page * pageSize, pageSize * page + pageSize);
            }
         } else {
            users = await db.User.findAll(findOptions);
         }
         // const test = await db.User.scope('populateManager').findAll();
         // return test;
         return users;
      } catch (error) {
         throw error;
      }
   }

   public async delete(userID: string) {
      try {
         const result = await UserDB.deleteUserByAnyField({ userID: userID });
         return result;
      } catch (error) {
         throw error;
      }
   }
}

export default UserService;
