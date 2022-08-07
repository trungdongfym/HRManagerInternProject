import { Request, Response } from 'express';
import { ITokenPayload } from '../../../commons/interfaces';
import HttpErrors from '../../../libs/error/httpErrors';
import { IUserAccount, User } from './users.model';
import UserService from './users.service';

const userService = new UserService();

class UserController {
   public async createUser(req: Request, res: Response) {
      const newUser: User = req.body;
      if (req.file) {
         newUser.avatar = req.file;
      }
      try {
         const userCreated = await userService.create(newUser);
         res.json(userCreated);
      } catch (error) {
         res.status(error?.status || 500).json(error?.message || 'Unknow error!');
      }
   }
   public async updateUser(req: Request, res: Response) {
      const userUpdate: User = req.body;
      const { userID } = req.params;
      const { user: userAction } = req as any;
      const { role } = (userAction as User) || {};
      if (req.file) {
         userUpdate.avatar = req.file;
      }
      try {
         const userUpdated = await userService.update(userUpdate, userID, role);
         res.json(userUpdated);
      } catch (error) {
         res.status(error?.status || 500).json(error?.message || 'Unknow error!');
      }
   }

   public async loginUser(req: Request, res: Response) {
      const userAccount: IUserAccount = req.body;
      try {
         const loginData = await userService.UserLogin(userAccount);
         res.json(loginData);
      } catch (error) {
         res.status(error?.status || 500).json(error?.message || 'Unknow error!');
      }
   }

   public async logoutUser(req: Request, res: Response) {
      try {
         const { user } = req as any;
         const result = await userService.UserLogout(user);
         const resultLogout = {
            status: true,
            message: 'Logout successfully',
         };
         if (!result) {
            resultLogout.status = false;
            resultLogout.message = 'Logout failure';
         }
         res.json(resultLogout);
      } catch (error) {
         res.status(error?.status || 500).json(error?.message || 'Unknow error!');
      }
   }

   public async getUsers(req: Request, res: Response) {
      const queryParam = req.query;
      const { user } = req as any;
      const { role } = user as ITokenPayload;
      try {
         const users = await userService.getUsers(queryParam, role);
         res.json({
            data: users,
            meta: queryParam,
         });
      } catch (error) {
         res.status(error?.status || 500).json(error?.message || 'Unknow error!');
      }
   }

   public async getUser(req: Request, res: Response) {
      const userParam = req.query;
      try {
         const user = await userService.getUserInfo(userParam);
         res.json({
            data: user,
            meta: userParam,
         });
      } catch (error) {
         res.status(error?.status || 500).json(error?.message || 'Unknow error!');
      }
   }

   public async deleteUser(req: Request, res: Response) {
      try {
         const { userID } = req.params;
         const result = await userService.delete(userID);
         res.json({
            status: result === 1,
            message: result === 1 ? `Delete success userID: ${userID}` : `Delete failure userID: ${userID}`,
         });
      } catch (error) {
         res.status(error?.status || 500).json(error?.message || 'Unknow error!');
      }
   }
}

export default UserController;
