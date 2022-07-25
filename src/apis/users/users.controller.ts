import { Request, Response } from 'express';
import { User } from './users.model';
import UserService from './users.service';

const userService = new UserService();

class UserController {
   public createUser(req: Request, res: Response) {
      const newUser: User = req.body;
      const { user } = req as any;
      const { role } = (user as User) || {};
      try {
         const userCreated = userService.create(newUser, role);
         res.json(userCreated);
      } catch (error) {
         res.status(error?.status || 500).json(error?.message || 'Unknow error!');
      }
   }
   public updateUser(req: Request, res: Response) {
      const userUpdate: User = req.body;
      const { userID } = req.params;
      try {
         const userUpdated = userService.update(userUpdate, userID);
         res.json(userUpdated);
      } catch (error) {
         res.status(error?.status || 500).json(error?.message || 'Unknow error!');
      }
   }
}

export default UserController;
