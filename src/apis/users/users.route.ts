import { NextFunction, Request, Response } from 'express';
import { CustomRouter } from '../../libs/router/customRouter';
import Auth from '../../middlewares/auth.middleware';
import Upload from '../../middlewares/upload.middleware';
import Validate from '../../middlewares/validate.middleware';
import { rolesArray, RolesEnum } from '../../models/roles.model';
import UserController from './users.controller';
import UserValidate from './users.validate';

const userController = new UserController();

// /api/v1/users
CustomRouter.post(
   '/users',
   [
      Upload.uploadImage('avatar', './public'),
      Validate.validateBody(UserValidate.createUserSchema),
      userController.createUser,
   ],
   {
      roles: [RolesEnum.Admin],
   }
);

// update user
CustomRouter.patch(
   '/users/:userID',
   [
      Upload.uploadImage('avatar', './public'),
      (req: Request, res: Response, next: NextFunction) => {
         const { userID } = req.params;
         // only owner of userID in req.params or admin is pass
         return Auth.verifyPersonalPrivacy(userID)(req, res, next);
      },
      Validate.validateBody(UserValidate.updateUserSchema),
      userController.updateUser,
   ],
   {
      roles: rolesArray,
   }
);

// /api/v1/login

CustomRouter.post('/login', [Validate.validateBody(UserValidate.loginSchema), userController.loginUser], {
   requireAuth: false,
});

CustomRouter.delete('/logout/:userID', [
   (req: Request, res: Response, next: NextFunction) => {
      const { userID } = req.params;
      return Auth.verifyPersonalPrivacy(userID)(req, res, next);
   },
   userController.logoutUser,
]);

CustomRouter.get(
   '/users',
   [Validate.validateQueryParams(UserValidate.adminQueryUserParamsSchema), userController.getUsers],
   {
      requireAuth: true,
      roles: [RolesEnum.Admin],
   }
);

CustomRouter.get(
   '/user',
   [
      Validate.validateQueryParams(UserValidate.userQueryParamsSchema),
      (req: Request, res: Response, next: NextFunction) => {
         const { userID } = req.query;
         // only owner of userID in req.params or admin is pass
         return Auth.verifyPersonalPrivacy(userID as string)(req, res, next);
      },
      userController.getUser,
   ],
   {
      roles: rolesArray,
   }
);

CustomRouter.delete('/users/:userID', [userController.deleteUser], {
   roles: [RolesEnum.Admin],
});

export default 'users';
