import { StatusCodes } from 'http-status-codes';
import UserDB from '../../libs/database/user.lib';
import CodeError from '../../libs/error/codeErrors';
import HttpErrors from '../../libs/error/httpErrors';
import { RolesEnum } from '../../models/roles.model';
import { User } from './users.model';

class UserService {
   public async create(user: User, roles: any) {
      if (roles !== RolesEnum.Admin) {
         throw HttpErrors.Forbiden(CodeError.BasicError[StatusCodes.FORBIDDEN]);
      }
      try {
         const userCreated = await UserDB.createOne(user);
         return userCreated;
      } catch (error) {
         throw error;
      }
   }

   public async update(userUpdate: User, userID: string) {
      try {
         const userCreated = await UserDB.updateByID(userID, userUpdate);
         return userCreated;
      } catch (error) {
         throw error;
      }
   }
}

export default UserService;
