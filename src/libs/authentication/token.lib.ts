import AppConfig from '../../configs/app.config';
import { tokenEnum } from '../../models/token.model';
import * as jwt from 'jsonwebtoken';
import { pickField } from '../../utils/object.utils';
import { Request } from 'express';
import { ITokenPayload } from '../../commons/interfaces';

function signToken(type: tokenEnum, data: object) {
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
            break;
      }
   } catch (error) {
      throw error;
   }
}

function verifyToken(type: tokenEnum, token: string): ITokenPayload {
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
            break;
      }
   } catch (error) {
      throw error;
   }
   return payload as ITokenPayload;
}

function getToken(req: Request): { scheme: string | null; token: string | null } {
   const splitToken = req.get('authorization')?.split(' ');
   if (!splitToken) {
      return {
         scheme: null,
         token: null,
      };
   }
   return {
      scheme: splitToken[0],
      token: splitToken[1],
   };
}

export { signToken, verifyToken, getToken };
