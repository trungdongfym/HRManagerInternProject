import { NextFunction, Request, Response } from 'express';
import { CustomRouter } from '../../libs/router/customRouter';
import Auth from '../../middlewares/auth.middleware';
import Validate from '../../middlewares/validate.middleware';
import { rolesArray, RolesEnum } from '../../models/roles.model';
import UserController from './users.controller';
import UserValidate from './users.validate';

const userController = new UserController();

// /api/v1/users
CustomRouter.post(
   '/users',
   [Validate.validateBody(UserValidate.createUserSchema), userController.createUser],
   {
      roles: [RolesEnum.Admin],
   }
);

CustomRouter.patch(
   '/users/:userID',
   [
      userController.updateUser,
      (req: Request, res: Response, next: NextFunction) => {
         const { userID } = req.params;
         return Auth.verifyPersonalPrivacy(userID);
      },
      Validate.validateBody(UserValidate.updateUserSchema),
   ],
   {
      roles: rolesArray,
      personalPrivacy: true, // Only the owner of the account or admin can pass
   }
);

// /api/v1/login

CustomRouter.post('/login', [], {
   requireAuth: false,
});

export default 'users';
