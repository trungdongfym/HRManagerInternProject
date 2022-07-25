import { RequestHandler, Request, Response, NextFunction } from 'express';
import { User } from '../apis/users/users.model';
import { OptionsRoutes } from '../commons/interfaces/optionsRoutes';
import { getToken, verifyToken } from '../libs/authentication/token.lib';
import CodeError from '../libs/error/codeErrors';
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
         const { scheme, token } = getToken(req);
         if (!/^Bearer/.test(scheme)) {
            const tokenErr = HttpErrors.InvalidToken('Token Scheme Invalid!');
            res.status(tokenErr.status).json(tokenErr.message);
            return;
         }
         try {
            const payloadToken = verifyToken(tokenEnum.ACCESS_TOKEN, token);
            (req as any).user = payloadToken;
            const forbiddenErr = HttpErrors.Forbiden('Forbiden!');

            // if the token of admin, let's pass
            if (payloadToken.roles === RolesEnum.Admin) {
               next();
               return;
            }
            // Check prevent roles
            if (preventRoles && preventRoles.includes(payloadToken.roles)) {
               res.status(forbiddenErr.status).json(forbiddenErr.message);
               return;
            }
            if (roles && !roles.includes(payloadToken.roles)) {
               forbiddenErr.setMessage = 'Not permission!';
               res.status(forbiddenErr.status).json(forbiddenErr.message);
               return;
            }
            next();
         } catch (error) {
            const err = new HttpErrors({
               code: CodeError.JWT_EXPIRE,
               type: TypeErrors.TOKEN_ERROR,
               message: error.message,
            });
            if (error?.name === 'TokenExpiredError') {
               err.setMessage = 'Token is Exprired!';
            }
            if (error?.name === 'JsonWebTokenError') {
               err.setMessage = error.message;
               err.setCode = CodeError.JWT_INVALID;
            }
            err.setCode = CodeError.BasicError[500];
            err.setType = TypeErrors.HTTP_ERROR;
            res.status(err.status).json(err.message);
         }
      };
   }

   public static verifyPersonalPrivacy(prsonalPrivacyID: string): RequestHandler {
      return async (req: Request, res: Response, next: NextFunction) => {
         const { user } = req as any;
         try {
            if (!user) {
               const err = HttpErrors.Unauthorized('User Not Found In Request!');
               next(err);
               return;
            }
            const { userID } = user as User;
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
}

export default Auth;
