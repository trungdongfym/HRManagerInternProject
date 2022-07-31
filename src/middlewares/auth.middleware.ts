import { NextFunction, Request, RequestHandler, Response } from 'express';
import { User } from '../apis/users/users.model';
import { ITokenPayload } from '../commons/interfaces';
import { decodeToken, getToken, verifyToken } from '../libs/authentication/token.lib';
import { RedisLib } from '../libs/database/redis';
import HttpErrors from '../libs/error/httpErrors';
import TypeErrors from '../libs/error/typeError';
import { RolesEnum } from '../models/roles.model';
import { tokenEnum } from '../models/token.model';

class Auth {
   /**
    *
    * @param roles Roles to pass
    * @param preventRoles Roles to prevent
    * @returns RequestHandler
    */
   public static verifyRoles(roles?: Array<string>, preventRoles?: Array<string>): RequestHandler {
      return (req: Request, res: Response, next: NextFunction) => {
         const accessToken = getToken(req);
         const { token } = accessToken;
         try {
            const payloadToken = verifyToken(tokenEnum.ACCESS_TOKEN, token);

            // Attach real user to req for next use
            (req as any).user = payloadToken;
            const forbiddenErr = HttpErrors.Forbiden('Forbiden!');

            // if the token of admin, let's pass
            if (payloadToken.role === RolesEnum.Admin) {
               next();
               return;
            }
            // Check prevent roles
            if (preventRoles && preventRoles.includes(payloadToken.role)) {
               res.status(forbiddenErr.status).json(forbiddenErr.message);
               return;
            }
            if (roles && !roles.includes(payloadToken.role)) {
               forbiddenErr.setMessage = 'Not permission!';
               res.status(forbiddenErr.status).json(forbiddenErr.message);
               return;
            }
            next();
         } catch (error) {
            const err = error as HttpErrors;
            res.status(err.status || 500).json(err.message || 'Unknow error!');
         }
      };
   }

   public static verifyPersonalPrivacy(prsonalPrivacyID: string): RequestHandler {
      return async (req: Request, res: Response, next: NextFunction) => {
         if (!prsonalPrivacyID) {
            const badRequest = HttpErrors.BadRequest('UserID not exists!');
            res.status(badRequest.status).json(badRequest.message);
            return;
         }
         const { user } = req as any;
         try {
            if (!user) {
               const err = HttpErrors.Unauthorized('User Not Found In Request!');
               next(err);
               return;
            }
            const { userID, role } = user as User;
            // If admin is full permission
            if (role === RolesEnum.Admin) {
               next();
               return;
            }
            if (prsonalPrivacyID !== userID) {
               const notPermissionErr = HttpErrors.Forbiden('Not permission!');
               next(notPermissionErr);
               return;
            }
            next();
         } catch (error) {
            next(error);
         }
      };
   }

   // Check access token is valid
   public static async verifyAccessToken(req: Request, res: Response, next: NextFunction) {
      try {
         const accessToken = getToken(req);
         // Check token exists
         if (!accessToken) {
            const notPermissionErr = HttpErrors.Unauthorized('Unauthorized!');
            res.status(notPermissionErr.status).json(notPermissionErr.message);
            return;
         }
         const { scheme, token } = accessToken;
         if (!/^Bearer/.test(scheme)) {
            const tokenErr = HttpErrors.InvalidToken('Token Scheme Invalid!');
            res.status(tokenErr.status).json(tokenErr.message);
            return;
         }
         const payloadDecode: ITokenPayload = decodeToken(token);
         const userID = payloadDecode.userID;
         const unAuthorized = HttpErrors.Unauthorized('Invalid Token', TypeErrors.TOKEN_ERROR);

         if (!userID) {
            res.status(unAuthorized.status).json(unAuthorized.message);
            return;
         }

         const tokenUserInDB = await RedisLib.getAccessToken(userID);
         // Check token have in DB
         if (!tokenUserInDB || tokenUserInDB !== token) {
            res.status(unAuthorized.status).json(unAuthorized.message);
            return;
         }
         next();
      } catch (error) {
         next(error);
      }
   }
}

export default Auth;
