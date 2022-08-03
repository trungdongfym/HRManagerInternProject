import { db } from '../../../configs/database';
import { User } from '../../../apis/v1/users/users.model';
import {
   ValidationError,
   SaveOptions,
   UpdateOptions,
   DestroyOptions,
   FindOptions,
   Sequelize,
   Op,
} from 'sequelize';
import HttpErrors from '../../error/httpErrors';
import { StatusCodes } from 'http-status-codes';
import CodeError from '../../error/codeErrors';
import { IFindAndUpdateByIdOptions } from '../../../commons/interfaces';
import { pickField } from '../../../utils/object.utils';

class UserDB {
   // Options general use for find method
   static defaultFindUserOptions: FindOptions = {
      logging: false,
      attributes: {
         // select attr
         exclude: ['password'],
      },
   };

   public static async createOne(user: User, options?: SaveOptions) {
      const defaultOptions: SaveOptions = {
         logging: false,
      };
      const optionsApply: SaveOptions = {
         ...defaultOptions,
         ...options,
      };
      try {
         const newUser = new db.User(user);
         const userSaved = await newUser.save(optionsApply);
         return userSaved;
      } catch (error) {
         const dbErr = HttpErrors.IODataBase(error?.message || 'Save User error!');
         if (error instanceof ValidationError) {
            dbErr.setStatus = StatusCodes.CONFLICT;
            dbErr.setCode = CodeError.BasicError[StatusCodes.CONFLICT];
         }
         throw dbErr;
      }
   }

   public static async findAndupdateByID(data: User, options: IFindAndUpdateByIdOptions) {
      const defaultOptions = {
         logging: false,
         userID: options.where.userID,
      };
      // Default return old docs
      const newDocs = options?.newDocs || false;
      delete options?.newDocs;

      const optionsUpdateApply: UpdateOptions = {
         ...defaultOptions,
         ...options,
      };

      try {
         let userUpdated: db.User = null;
         if (!newDocs) {
            // Find old docs
            userUpdated = await db.User.findOne({
               where: { userID: defaultOptions.userID },
               logging: false,
            });
            // if user not exists
            if (!userUpdated) {
               return userUpdated;
            }
         }
         const result = await db.User.update(data, optionsUpdateApply);
         if (result[0] !== 1) {
            return null;
         }
         if (newDocs) {
            userUpdated = await db.User.findOne({
               where: { userID: defaultOptions.userID },
               logging: false,
            });
         }
         return userUpdated;
      } catch (error) {
         const dbErr = HttpErrors.IODataBase(error?.message || 'Save User error!');
         if (error instanceof ValidationError) {
            dbErr.setStatus = StatusCodes.CONFLICT;
            dbErr.setCode = CodeError.BasicError[StatusCodes.CONFLICT];
         }
         throw dbErr;
      }
   }

   public static async deleteUserByAnyField(filterField: User, options?: DestroyOptions) {
      const defaultOptions: UpdateOptions = {
         logging: false,
         where: {
            ...filterField,
         },
      };
      const optionsApply: UpdateOptions = {
         ...defaultOptions,
         ...options,
      };
      try {
         const userDeleted = await db.User.destroy(optionsApply);
         return userDeleted;
      } catch (error) {
         const dbErr = HttpErrors.IODataBase(error?.message || 'Save User error!');
         if (error instanceof ValidationError) {
            dbErr.setStatus = StatusCodes.CONFLICT;
            dbErr.setCode = CodeError.BasicError[StatusCodes.CONFLICT];
         }
         throw dbErr;
      }
   }

   public static async findById(userID: string, options?: Omit<FindOptions<User>, 'where'>) {
      try {
         const user = await db.User.findByPk(userID, options);
         return user;
      } catch (error) {
         throw error;
      }
   }

   public static async findOneByAnyField(filterField: User, options?: FindOptions) {
      const defaultOptions = UserDB.defaultFindUserOptions;
      defaultOptions.attributes = null;
      defaultOptions.where = { ...filterField };
      const optionsApply: FindOptions = {
         ...defaultOptions,
         ...options,
      };
      try {
         const user = await db.User.findOne(optionsApply);
         return user;
      } catch (error) {
         throw error;
      }
   }

   public static async findByAnyField(filterField: User, options?: FindOptions) {
      const defaultOptions: FindOptions = UserDB.defaultFindUserOptions;
      defaultOptions.where = { ...filterField };
      const optionsApply: FindOptions = {
         ...defaultOptions,
         ...options,
      };
      try {
         const users = await db.User.findAll(optionsApply);
         return users;
      } catch (error) {
         throw error;
      }
   }
   public static async findAndPopulateById(userID: string, options?: FindOptions) {
      const defaultOptions: FindOptions = {
         logging: false,
         raw: true,
         where: { userID: userID },
         include: [
            // populate
            {
               association: db.User.associations['manager'],
               as: 'manager',
               attributes: ['userID', 'firstName', 'lastName', 'email', 'phone', 'avatar', 'role'],
               on: { userID: { [Op.eq]: Sequelize.col('user.managerID') } },
            },
         ],
      };
      const optionsApply: FindOptions = {
         ...defaultOptions,
         ...options,
      };
      try {
         const users = await db.User.findOne(optionsApply);
         return users;
      } catch (error) {
         throw error;
      }
   }

   public static async getAll(options: FindOptions) {
      try {
         const users = await db.User.findAll({
            logging: false,
            ...options,
         });
         return users;
      } catch (error) {
         throw error;
      }
   }
   /**
    *
    * @param user Data user check
    * @param userID UserID owner of Data user
    * @returns errorMessage of field if a field is exists, otherwise return null;
    */
   public static async checkUserUnique(user: User, userID?: string) {
      const errorMessage: any = {};
      const { email, staffCode, cmnd } = user;
      const uniqueField = ['email', 'staffCode', 'cmnd'];
      try {
         // Check field unique is exists
         const userUniqueField = pickField(user, uniqueField);
         const users = await db.User.findAll({ where: userUniqueField });
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
      } catch (error) {
         throw error;
      }
   }
}

export default UserDB;
