import { db } from '../../configs/database';
import { User } from '../../apis/users/users.model';
import {
   ValidationError,
   SaveOptions,
   UpdateOptions,
   DestroyOptions,
   FindOptions,
} from 'sequelize';
import HttpErrors from '../error/httpErrors';
import { StatusCodes } from 'http-status-codes';
import CodeError from '../error/codeErrors';

class UserDB {
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

   public static async updateByID(userID: string, data: User, options?: UpdateOptions) {
      const defaultOptions: UpdateOptions = {
         logging: false,
         where: {
            userID: userID,
         },
      };
      const optionsApply: UpdateOptions = {
         ...defaultOptions,
         ...options,
      };

      try {
         const userUpdated = await db.User.update(data, optionsApply);
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
   public static async getUserByAnyField(filterField: User, options?: FindOptions) {
      const defaultOptions: FindOptions = {
         logging: false,
         raw: true,
         where: { ...filterField },
         attributes: {
            // select attr
            exclude: ['password'],
         },
         include: [
            // populate
            {
               association: db.User.associations['manager'],
               as: 'manager',
               attributes: {
                  exclude: ['password'],
               },
            },
         ],
      };
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
   public static async getUserByID(filterField: User, options?: FindOptions) {
      const defaultOptions: FindOptions = {
         logging: false,
         raw: true,
         where: { userID: filterField.userID },
         include: [
            // populate
            {
               association: db.User.associations['manager'],
               as: 'manager',
               attributes: {
                  exclude: ['password'],
               },
            },
         ],
      };
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
   public static async getAll(options: FindOptions) {
      try {
         const users = await db.User.findAll(options);
         return users;
      } catch (error) {
         throw error;
      }
   }
}

export default UserDB;
