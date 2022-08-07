import AppConfig from '../../configs/app.config';
import { tokenEnum } from '../../models/token.model';
import * as jwt from 'jsonwebtoken';
import { pickField } from '../../utils/object.utils';
import { Request } from 'express';
import { ITokenPayload } from '../../commons/interfaces';
import HttpErrors from '../error/httpErrors';
import CodeError from '../error/codeErrors';
import TypeErrors from '../error/typeError';

class TokenLib {
   static signToken(type: tokenEnum, data: object) {
      const jwtConfig = AppConfig.ENV.SECURITY.JWT;
      let token: string;
      const payload = pickField(data, jwtConfig.FIELD_PAYLOAD);
      try {
         switch (type) {
            case tokenEnum.ACCESS_TOKEN:
               token = jwt.sign(payload, jwtConfig.ACCESS_TOKEN_SECRET, {
                  expiresIn: jwtConfig.ACCESS_TOKEN_EXPIRE,
               });
               break;
            case tokenEnum.REFRESH_TOKEN:
               token = jwt.sign(payload, jwtConfig.REFRESH_TOKEN_SECRET, {
                  expiresIn: jwtConfig.REFRESH_TOKEN_EXPIRE,
               });
               break;
            default:
               throw HttpErrors.ServerError('Token type invalid!');
         }
         return token;
      } catch (error) {
         throw error;
      }
   }

   static verifyToken(type: tokenEnum, token: string): ITokenPayload {
      const jwtConfig = AppConfig.ENV.SECURITY.JWT;
      let payload: jwt.JwtPayload | string;
      try {
         switch (type) {
            case tokenEnum.ACCESS_TOKEN:
               payload = jwt.verify(token, jwtConfig.ACCESS_TOKEN_SECRET);
               break;
            case tokenEnum.REFRESH_TOKEN:
               payload = jwt.verify(token, jwtConfig.REFRESH_TOKEN_SECRET);
               break;
            default:
               throw HttpErrors.ServerError('Token type invalid!');
         }
      } catch (error) {
         const err = new HttpErrors({
            code: CodeError.JWT_EXPIRE,
            type: TypeErrors.TOKEN_ERROR,
            message: error.message,
         });
         if (error instanceof jwt.TokenExpiredError) {
            err.setMessage = 'Token is Exprired!';
            throw err;
         }
         if (error instanceof jwt.JsonWebTokenError) {
            err.setMessage = error.message;
            err.setCode = CodeError.JWT_INVALID;
            throw err;
         }
         err.setCode = CodeError.BasicError[500];
         err.setType = TypeErrors.HTTP_ERROR;
         err.message = error?.message || 'Unknow error!';
         throw err;
      }
      return payload as ITokenPayload;
   }

   static getToken(req: Request): { scheme: string; token: string } {
      const splitToken = req.get('authorization')?.split(' ');
      if (!splitToken) {
         return null;
      }
      return {
         scheme: splitToken[0],
         token: splitToken[1],
      };
   }

   static decodeToken(token: string, options?: jwt.DecodeOptions): ITokenPayload {
      try {
         const decoded = jwt.decode(token, options);
         return decoded as ITokenPayload;
      } catch (error) {
         throw error;
      }
   }
}

export default TokenLib;
